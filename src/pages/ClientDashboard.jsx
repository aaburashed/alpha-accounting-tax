import { useState, useEffect, useRef } from 'react';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const ALLOWED_TYPES = ['application/pdf','image/jpeg','image/png','image/gif','image/webp','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const FILE_ICONS = { pdf: '📄', image: '🖼️', excel: '📊', word: '📝', other: '📎' };

function getFileType(mimeType) {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'excel';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'word';
  return 'other';
}

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

function NavLogo() {
  return (
    <div className="flex items-center gap-2 leading-none">
      <svg viewBox="0 0 200 200" width="36" height="36" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <polygon points="100,12 188,188 12,188" fill="#C8102E" opacity="0.12" />
        <text x="100" y="172" textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight="700" fontSize="155" fill="#C8102E">A</text>
      </svg>
      <div className="flex flex-col leading-none">
        <span style={{ color: '#C8102E', fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: '700', lineHeight: '1', letterSpacing: '0.02em' }}>ALPHA</span>
        <span style={{ color: '#C8102E', fontFamily: "'Outfit', sans-serif", fontSize: '9px', fontWeight: '400', lineHeight: '1.4', letterSpacing: '0.16em' }}>ACCOUNTING &amp; TAX</span>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'documents', label: 'My Documents' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'taxreturns', label: 'Tax Returns' },
  { id: 'profile', label: 'My Profile' },
];

export default function ClientDashboard({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('documents');

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef();

  const [invoices, setInvoices] = useState([]);
  const [taxReturns, setTaxReturns] = useState([]);

  const [profile, setProfile] = useState({ name: '', phone: '', dob: '', ssn: '', address: '', city: '', state: '', zip: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { onNavigate('login'); return; }
      setUser(u);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'files'), where('uid', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setFiles(docs);
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'invoices'), where('uid', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setInvoices(docs);
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'taxReturns'), where('uid', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.year || 0) - (a.year || 0));
      setTaxReturns(docs);
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        setProfile({
          name: d.name || user.displayName || '',
          phone: d.phone || '',
          dob: d.dob || '',
          ssn: d.ssn || '',
          address: d.address || '',
          city: d.city || '',
          state: d.state || '',
          zip: d.zip || '',
        });
      }
    });
  }, [user]);

  const handleFiles = (fileList) => {
    const file = fileList[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) { setError('File type not allowed. Please upload PDF, image, Excel, or Word files.'); return; }
    if (file.size > 20 * 1024 * 1024) { setError('File too large. Maximum size is 20MB.'); return; }
    uploadFile(file);
  };

  const uploadFile = (file) => {
    setError(''); setSuccess(''); setUploading(true); setUploadProgress(0);
    const storageRef = ref(storage, `files/${user.uid}/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed',
      (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => { console.error('Upload error:', err.code, err.message); setError('Upload failed. Please try again.'); setUploading(false); },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          await addDoc(collection(db, 'files'), { uid: user.uid, userName: user.displayName || user.email, userEmail: user.email, name: file.name, size: file.size, type: file.type, fileType: getFileType(file.type), url, storagePath: storageRef.fullPath, createdAt: serverTimestamp() });
          setSuccess('File uploaded successfully!');
          setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
          console.error('Firestore error:', err);
          setError('Upload failed to save. Please try again.');
        } finally {
          setUploading(false); setUploadProgress(0);
        }
      }
    );
  };

  const handleDelete = async (file) => {
    try {
      if (file.storagePath) { await deleteObject(ref(storage, file.storagePath)).catch(() => {}); }
      await deleteDoc(doc(db, 'files', file.id));
      setDeleteConfirm(null);
    } catch (err) { setError('Failed to delete file.'); }
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true); setError('');
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid, email: user.email, role: 'client',
        ...profile, updatedAt: serverTimestamp()
      }, { merge: true });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) { setError('Failed to save profile. Please try again.'); }
    finally { setProfileSaving(false); }
  };

  const handleSignOut = async () => { await signOut(auth); onNavigate('login'); };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition-all";
  const onFocus = e => e.target.style.borderColor = '#C8102E';
  const onBlur = e => e.target.style.borderColor = '#e5e7eb';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <NavLogo />
          <span className="text-xs text-gray-300 select-none">|</span>
          <p className="text-xs text-gray-400" style={{ fontFamily: "'Outfit', sans-serif" }}>Client Portal</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800" style={{ fontFamily: "'Outfit', sans-serif" }}>{user?.displayName || user?.email}</p>
            <p className="text-xs text-gray-400" style={{ fontFamily: "'Outfit', sans-serif" }}>Client</p>
          </div>
          <button onClick={handleSignOut} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>Sign Out</button>
        </div>
      </header>

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setError(''); setSuccess(''); }}
              className="px-5 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors"
              style={{ fontFamily: "'Outfit', sans-serif", borderBottomColor: activeTab === tab.id ? '#C8102E' : 'transparent', color: activeTab === tab.id ? '#C8102E' : '#6b7280' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center justify-between" style={{ fontFamily: "'Outfit', sans-serif" }}><span>{error}</span><button onClick={() => setError('')} className="ml-4 text-red-400 hover:text-red-600">&#x2715;</button></div>}
        {success && <div className="mb-5 px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>{success}</div>}

        {activeTab === 'documents' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Documents</h1>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Upload and manage your tax and accounting documents securely.</p>
            </div>
            <div className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-8 ${dragOver ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50'}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => !uploading && fileInputRef.current.click()}>
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.xls,.xlsx,.doc,.docx" onChange={e => handleFiles(e.target.files)} />
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-gray-100 flex items-center justify-center" style={{ borderTopColor: '#C8102E', animation: 'spin 1s linear infinite' }} />
                  <p className="text-sm font-medium text-gray-700" style={{ fontFamily: "'Outfit', sans-serif" }}>Uploading... {uploadProgress}%</p>
                  <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%`, backgroundColor: '#C8102E' }} /></div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1" style={{ backgroundColor: '#fff0f3' }}>
                    <svg className="w-7 h-7" style={{ color: '#C8102E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  </div>
                  <p className="text-base font-medium text-gray-700" style={{ fontFamily: "'Outfit', sans-serif" }}>Drop your file here, or <span style={{ color: '#C8102E' }}>browse</span></p>
                  <p className="text-xs text-gray-400" style={{ fontFamily: "'Outfit', sans-serif" }}>PDF, Images, Excel, Word — up to 20MB</p>
                </div>
              )}
            </div>
            <h2 className="text-base font-semibold text-gray-800 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Uploaded Files <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">{files.length}</span></h2>
            {files.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><p className="text-4xl mb-3">📁</p><p className="text-gray-500 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>No documents uploaded yet.</p></div>
            ) : (
              <div className="flex flex-col gap-3">
                {files.map(file => (
                  <div key={file.id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                    <span className="text-2xl">{FILE_ICONS[file.fileType] || FILE_ICONS.other}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>{file.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>{formatBytes(file.size)} &middot; {formatDate(file.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors" style={{ backgroundColor: '#C8102E', fontFamily: "'Outfit', sans-serif" }} onMouseEnter={e => e.target.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.target.style.backgroundColor = '#C8102E'}>View</a>
                      <button onClick={() => setDeleteConfirm(file)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Invoices</h1>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>View and download invoices from Alpha Accounting &amp; Tax.</p>
            </div>
            {invoices.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><p className="text-4xl mb-3">🧾</p><p className="text-gray-500 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>No invoices on file yet.</p></div>
            ) : (
              <div className="flex flex-col gap-3">
                {invoices.map(inv => (
                  <div key={inv.id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                    <span className="text-2xl">🧾</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>{inv.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>{formatDate(inv.createdAt)}{inv.amount ? ` · $${inv.amount}` : ''}</p>
                    </div>
                    <a href={inv.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-medium text-white shrink-0 transition-colors" style={{ backgroundColor: '#C8102E', fontFamily: "'Outfit', sans-serif" }} onMouseEnter={e => e.target.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.target.style.backgroundColor = '#C8102E'}>Download</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'taxreturns' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Tax Returns</h1>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Access and download your prior year tax returns.</p>
            </div>
            {taxReturns.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><p className="text-4xl mb-3">📋</p><p className="text-gray-500 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>No tax returns on file yet.</p></div>
            ) : (
              <div className="flex flex-col gap-3">
                {taxReturns.map(ret => (
                  <div key={ret.id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#fff0f3' }}>
                      <span className="text-xs font-bold" style={{ color: '#C8102E', fontFamily: "'Outfit', sans-serif" }}>{ret.year}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800" style={{ fontFamily: "'Outfit', sans-serif" }}>{ret.year} Tax Return</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>{ret.name} &middot; {formatDate(ret.createdAt)}</p>
                    </div>
                    <a href={ret.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-medium text-white shrink-0 transition-colors" style={{ backgroundColor: '#C8102E', fontFamily: "'Outfit', sans-serif" }} onMouseEnter={e => e.target.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.target.style.backgroundColor = '#C8102E'}>Download</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Profile</h1>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Keep your personal information up to date.</p>
            </div>
            {profileSuccess && <div className="mb-5 px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Profile saved successfully!</div>}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>Full Name</label>
                  <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="John Smith" className={inputClass} style={{ fontFamily: "'Outfit', sans-serif" }} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>Phone Number</label>
                  <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="(555) 000-0000" className={inputClass} style={{ fontFamily: "'Outfit', sans-serif" }} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>Date of Birth</label>
                  <input type="text" value={profile.dob} onChange={e => setProfile(p => ({ ...p, dob: e.target.value }))} placeholder="MM/DD/YYYY" className={inputClass} style={{ fontFamily: "'Outfit', sans-serif" }} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>SSN (last 4 digits)</label>
                  <input type="text" maxLength={4} value={profile.ssn} onChange={e => setProfile(p => ({ ...p, ssn: e.target.value }))} placeholder="XXXX" className={inputClass} style={{ fontFamily: "'Outfit', sans-serif" }} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>Street Address</label>
                  <input type="text" value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} placeholder="123 Main St" className={inputClass} style={{ fontFamily: "'Outfit', sans-serif" }} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>City</label>
                  <input type="text" value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} placeholder="New York" className={inputClass} style={{ fontFamily: "'Outfit', sans-serif" }} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>State</label>
                  <input type="text" value={profile.state} onChange={e => setProfile(p => ({ ...p, state: e.target.value }))} placeholder="NY" className={inputClass} style={{ fontFamily: "'Outfit', sans-serif" }} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>ZIP Code</label>
                  <input type="text" value={profile.zip} onChange={e => setProfile(p => ({ ...p, zip: e.target.value }))} placeholder="10001" className={inputClass} style={{ fontFamily: "'Outfit', sans-serif" }} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end">
                <button onClick={handleSaveProfile} disabled={profileSaving} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60" style={{ backgroundColor: '#C8102E', fontFamily: "'Outfit', sans-serif" }} onMouseEnter={e => { if (!profileSaving) e.currentTarget.style.backgroundColor = '#a50d25'; }} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C8102E'}>
                  {profileSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Delete File?</h3>
            <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors" style={{ backgroundColor: '#C8102E', fontFamily: "'Outfit', sans-serif" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C8102E'}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}