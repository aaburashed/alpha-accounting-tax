import { useState, useEffect, useRef } from 'react';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, getDoc, query, where, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const FILE_ICONS = { pdf: '📄', image: '🖼️', excel: '📊', word: '📝', other: '📎' };

function formatBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function AdminLogo() {
  return (
    <div className="flex items-center gap-2 leading-none">
      <svg viewBox="0 0 200 200" width="36" height="36" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <polygon points="100,12 188,188 12,188" fill="#C8102E" opacity="0.12" />
        <text x="100" y="172" textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight="700" fontSize="155" fill="#C8102E">A</text>
      </svg>
      <div className="flex flex-col leading-none">
        <span style={{ color: '#C8102E', fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: '700', lineHeight: '1', letterSpacing: '0.02em' }}>ALPHA</span>
        <span style={{ color: '#C8102E', fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: '400', lineHeight: '1.4', letterSpacing: '0.16em' }}>ACCOUNTING &amp; TAX</span>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'documents', label: 'Client Documents' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'taxreturns', label: 'Tax Returns' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 1 - i);

export default function AdminDashboard({ onNavigate }) {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('documents');

  const [files, setFiles] = useState([]);
  const [clientsFromFiles, setClientsFromFiles] = useState({});
  const [selectedClient, setSelectedClient] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [clientList, setClientList] = useState([]);

  const [invoices, setInvoices] = useState([]);
  const [invoiceClient, setInvoiceClient] = useState('');
  const [invoiceUploading, setInvoiceUploading] = useState(false);
  const [invoiceProgress, setInvoiceProgress] = useState(0);
  const [invoiceFilter, setInvoiceFilter] = useState('all');
  const invoiceFileRef = useRef();

  const [taxReturns, setTaxReturns] = useState([]);
  const [returnClient, setReturnClient] = useState('');
  const [returnYear, setReturnYear] = useState(CURRENT_YEAR - 1);
  const [returnUploading, setReturnUploading] = useState(false);
  const [returnProgress, setReturnProgress] = useState(0);
  const [returnFilter, setReturnFilter] = useState('all');
  const returnFileRef = useRef();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { onNavigate('login'); return; }
      const userDoc = await getDoc(doc(db, 'users', u.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'admin') { onNavigate('client-dashboard'); return; }
      setAdmin(u);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'files'), (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setFiles(docs);
      const clientMap = {};
      docs.forEach(f => { if (f.uid && !clientMap[f.uid]) clientMap[f.uid] = { uid: f.uid, name: f.userName || f.userEmail, email: f.userEmail }; });
      setClientsFromFiles(clientMap);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'client'));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      list.sort((a, b) => (a.name || a.email || '').localeCompare(b.name || b.email || ''));
      setClientList(list);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'invoices'), (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setInvoices(docs);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'taxReturns'), (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.year || 0) - (a.year || 0));
      setTaxReturns(docs);
    });
    return unsub;
  }, []);

  const handleUploadInvoice = (file) => {
    if (!invoiceClient) { setError('Please select a client first.'); return; }
    if (!file) return;
    const client = clientList.find(c => c.uid === invoiceClient);
    setError(''); setSuccess(''); setInvoiceUploading(true); setInvoiceProgress(0);
    const storageRef = ref(storage, `invoices/${invoiceClient}/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed',
      (snap) => setInvoiceProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => { console.error('Invoice upload error:', err); setError('Upload failed.'); setInvoiceUploading(false); },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          await addDoc(collection(db, 'invoices'), { uid: invoiceClient, clientName: client?.name || client?.email || '', clientEmail: client?.email || '', name: file.name, size: file.size, url, storagePath: storageRef.fullPath, uploadedBy: admin.uid, createdAt: serverTimestamp() });
          setSuccess('Invoice uploaded successfully!'); setInvoiceClient('');
          setTimeout(() => setSuccess(''), 3000);
        } catch (err) { setError('Failed to save invoice.'); }
        finally { setInvoiceUploading(false); setInvoiceProgress(0); }
      }
    );
  };

  const handleUploadReturn = (file) => {
    if (!returnClient) { setError('Please select a client first.'); return; }
    if (!file) return;
    const client = clientList.find(c => c.uid === returnClient);
    setError(''); setSuccess(''); setReturnUploading(true); setReturnProgress(0);
    const storageRef = ref(storage, `taxReturns/${returnClient}/${returnYear}_${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed',
      (snap) => setReturnProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => { console.error('Return upload error:', err); setError('Upload failed.'); setReturnUploading(false); },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          await addDoc(collection(db, 'taxReturns'), { uid: returnClient, clientName: client?.name || client?.email || '', clientEmail: client?.email || '', name: file.name, year: Number(returnYear), size: file.size, url, storagePath: storageRef.fullPath, uploadedBy: admin.uid, createdAt: serverTimestamp() });
          setSuccess('Tax return uploaded successfully!'); setReturnClient('');
          setTimeout(() => setSuccess(''), 3000);
        } catch (err) { setError('Failed to save tax return.'); }
        finally { setReturnUploading(false); setReturnProgress(0); }
      }
    );
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const { type, item } = deleteConfirm;
    try {
      if (item.storagePath) await deleteObject(ref(storage, item.storagePath)).catch(() => {});
      await deleteDoc(doc(db, type, item.id));
      setDeleteConfirm(null);
    } catch (err) { setError('Failed to delete.'); setDeleteConfirm(null); }
  };

  const handleSignOut = async () => { await signOut(auth); onNavigate('login'); };

  const clientListFromFilesArr = Object.values(clientsFromFiles);
  const filteredFiles = files.filter(f => {
    const matchClient = selectedClient === 'all' || f.uid === selectedClient;
    const matchSearch = !search || f.name?.toLowerCase().includes(search.toLowerCase()) || f.userEmail?.toLowerCase().includes(search.toLowerCase()) || f.userName?.toLowerCase().includes(search.toLowerCase());
    return matchClient && matchSearch;
  });
  const totalSize = filteredFiles.reduce((acc, f) => acc + (f.size || 0), 0);
  const filteredInvoices = invoiceFilter === 'all' ? invoices : invoices.filter(i => i.uid === invoiceFilter);
  const filteredReturns = returnFilter === 'all' ? taxReturns : taxReturns.filter(r => r.uid === returnFilter);
  const selectClass = "px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none bg-white transition-all";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AdminLogo />
          <span className="text-xs text-gray-300 select-none">|</span>
          <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Admin Portal</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>{admin?.displayName || admin?.email}</p>
            <p className="text-xs font-medium" style={{ color: '#C8102E', fontFamily: "'DM Sans', sans-serif" }}>Administrator</p>
          </div>
          <button onClick={handleSignOut} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sign Out</button>
        </div>
      </header>

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setError(''); setSuccess(''); }}
              className="px-5 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", borderBottomColor: activeTab === tab.id ? '#C8102E' : 'transparent', color: activeTab === tab.id ? '#C8102E' : '#6b7280' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center justify-between" style={{ fontFamily: "'DM Sans', sans-serif" }}><span>{error}</span><button onClick={() => setError('')} className="ml-4 text-red-400 hover:text-red-600">&#x2715;</button></div>}
        {success && <div className="mb-5 px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{success}</div>}

        {activeTab === 'documents' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Client Documents</h1>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>View and manage all client-uploaded files.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {[{ label: 'Total Clients', value: clientListFromFilesArr.length }, { label: 'Total Files', value: files.length }, { label: 'Total Storage', value: formatBytes(files.reduce((a, f) => a + (f.size || 0), 0)) }].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                  <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input type="text" placeholder="Search by file name or client..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }} onFocus={e => e.target.style.borderColor = '#C8102E'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} className={selectClass} style={{ fontFamily: "'DM Sans', sans-serif" }} onFocus={e => e.target.style.borderColor = '#C8102E'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                <option value="all">All Clients</option>
                {clientListFromFilesArr.map(c => <option key={c.uid} value={c.uid}>{c.name || c.email}</option>)}
              </select>
            </div>
            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                <div className="w-10 h-10 rounded-full border-4 border-gray-100 mx-auto mb-4" style={{ borderTopColor: '#C8102E', animation: 'spin 1s linear infinite' }} />
                <p className="text-gray-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Loading files...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center"><p className="text-4xl mb-3">📂</p><p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>No files found.</p></div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-gray-100">{['File', 'Client', 'Size', 'Date', ''].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>{h}</th>)}</tr></thead>
                    <tbody>
                      {filteredFiles.map((file, i) => (
                        <tr key={file.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filteredFiles.length - 1 ? 'border-b-0' : ''}`}>
                          <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="text-xl">{FILE_ICONS[file.fileType] || FILE_ICONS.other}</span><span className="text-sm font-medium text-gray-800 truncate max-w-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{file.name}</span></div></td>
                          <td className="px-5 py-4"><p className="text-sm text-gray-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>{file.userName || '—'}</p><p className="text-xs text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{file.userEmail}</p></td>
                          <td className="px-5 py-4"><span className="text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{formatBytes(file.size)}</span></td>
                          <td className="px-5 py-4"><span className="text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{formatDate(file.createdAt)}</span></td>
                          <td className="px-5 py-4 text-right"><a href={file.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-medium text-white inline-block transition-colors" style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => e.target.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.target.style.backgroundColor = '#C8102E'}>View</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden flex flex-col divide-y divide-gray-50">
                  {filteredFiles.map(file => (
                    <div key={file.id} className="px-4 py-4 flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{FILE_ICONS[file.fileType] || FILE_ICONS.other}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{file.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{file.userName || file.userEmail}</p>
                        <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{formatBytes(file.size)} &middot; {formatDate(file.createdAt)}</p>
                      </div>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-medium text-white shrink-0 transition-colors" style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => e.target.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.target.style.backgroundColor = '#C8102E'}>View</a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {filteredFiles.length > 0 && <p className="text-xs text-gray-400 mt-4 text-right" style={{ fontFamily: "'DM Sans', sans-serif" }}>{filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} &middot; {formatBytes(totalSize)} total</p>}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Invoices</h1>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Upload invoices for clients and manage existing ones.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
              <h2 className="text-base font-semibold text-gray-800 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Upload New Invoice</h2>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>Select Client</label>
                <select value={invoiceClient} onChange={e => setInvoiceClient(e.target.value)} className={`${selectClass} w-full sm:w-72`} style={{ fontFamily: "'DM Sans', sans-serif" }} onFocus={e => e.target.style.borderColor = '#C8102E'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                  <option value="">Choose a client...</option>
                  {clientList.map(c => <option key={c.uid} value={c.uid}>{c.name || c.email}{c.name ? ` (${c.email})` : ''}</option>)}
                </select>
              </div>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${invoiceUploading ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50 cursor-pointer'}`} onClick={() => !invoiceUploading && invoiceFileRef.current?.click()}>
                <input ref={invoiceFileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => handleUploadInvoice(e.target.files[0])} />
                {invoiceUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-4 border-gray-100" style={{ borderTopColor: '#C8102E', animation: 'spin 1s linear infinite' }} />
                    <p className="text-sm text-gray-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>Uploading... {invoiceProgress}%</p>
                    <div className="w-40 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${invoiceProgress}%`, backgroundColor: '#C8102E' }} /></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Click to select invoice file</p>
                    <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>PDF, Word, or image — up to 20MB</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-semibold text-gray-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>All Invoices <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">{filteredInvoices.length}</span></h2>
              <select value={invoiceFilter} onChange={e => setInvoiceFilter(e.target.value)} className={selectClass} style={{ fontFamily: "'DM Sans', sans-serif" }} onFocus={e => e.target.style.borderColor = '#C8102E'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                <option value="all">All Clients</option>
                {clientList.map(c => <option key={c.uid} value={c.uid}>{c.name || c.email}</option>)}
              </select>
            </div>
            {filteredInvoices.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><p className="text-4xl mb-3">🧾</p><p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>No invoices uploaded yet.</p></div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredInvoices.map(inv => (
                  <div key={inv.id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                    <span className="text-2xl">🧾</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{inv.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{inv.clientName || inv.clientEmail} &middot; {formatDate(inv.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a href={inv.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors" style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => e.target.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.target.style.backgroundColor = '#C8102E'}>View</a>
                      <button onClick={() => setDeleteConfirm({ type: 'invoices', item: inv })} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'taxreturns' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Tax Returns</h1>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Upload prior year tax returns for clients.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
              <h2 className="text-base font-semibold text-gray-800 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Upload Tax Return</h2>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>Select Client</label>
                  <select value={returnClient} onChange={e => setReturnClient(e.target.value)} className={`${selectClass} w-full`} style={{ fontFamily: "'DM Sans', sans-serif" }} onFocus={e => e.target.style.borderColor = '#C8102E'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                    <option value="">Choose a client...</option>
                    {clientList.map(c => <option key={c.uid} value={c.uid}>{c.name || c.email}{c.name ? ` (${c.email})` : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>Tax Year</label>
                  <select value={returnYear} onChange={e => setReturnYear(e.target.value)} className={selectClass} style={{ fontFamily: "'DM Sans', sans-serif" }} onFocus={e => e.target.style.borderColor = '#C8102E'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${returnUploading ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50 cursor-pointer'}`} onClick={() => !returnUploading && returnFileRef.current?.click()}>
                <input ref={returnFileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => handleUploadReturn(e.target.files[0])} />
                {returnUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-4 border-gray-100" style={{ borderTopColor: '#C8102E', animation: 'spin 1s linear infinite' }} />
                    <p className="text-sm text-gray-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>Uploading... {returnProgress}%</p>
                    <div className="w-40 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${returnProgress}%`, backgroundColor: '#C8102E' }} /></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Click to select tax return file</p>
                    <p className="text-xs text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>PDF, Word, or image — up to 20MB</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-semibold text-gray-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>All Tax Returns <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">{filteredReturns.length}</span></h2>
              <select value={returnFilter} onChange={e => setReturnFilter(e.target.value)} className={selectClass} style={{ fontFamily: "'DM Sans', sans-serif" }} onFocus={e => e.target.style.borderColor = '#C8102E'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                <option value="all">All Clients</option>
                {clientList.map(c => <option key={c.uid} value={c.uid}>{c.name || c.email}</option>)}
              </select>
            </div>
            {filteredReturns.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><p className="text-4xl mb-3">📋</p><p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>No tax returns uploaded yet.</p></div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredReturns.map(ret => (
                  <div key={ret.id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#fff0f3' }}>
                      <span className="text-xs font-bold" style={{ color: '#C8102E', fontFamily: "'DM Sans', sans-serif" }}>{ret.year}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>{ret.year} — {ret.clientName || ret.clientEmail}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{ret.name} &middot; {formatDate(ret.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a href={ret.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors" style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => e.target.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.target.style.backgroundColor = '#C8102E'}>View</a>
                      <button onClick={() => setDeleteConfirm({ type: 'taxReturns', item: ret })} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Delete File?</h3>
            <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Are you sure you want to delete <strong>{deleteConfirm.item.name}</strong>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors" style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C8102E'}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}