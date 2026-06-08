import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';

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

export default function AdminDashboard({ onNavigate }) {
  const [admin, setAdmin] = useState(null);
  const [files, setFiles] = useState([]);
  const [clients, setClients] = useState({});
  const [selectedClient, setSelectedClient] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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
      setClients(clientMap);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSignOut = async () => { await signOut(auth); onNavigate('login'); };
  const clientList = Object.values(clients);
  const filteredFiles = files.filter(f => {
    const matchClient = selectedClient === 'all' || f.uid === selectedClient;
    const matchSearch = !search || f.name?.toLowerCase().includes(search.toLowerCase()) || f.userEmail?.toLowerCase().includes(search.toLowerCase()) || f.userName?.toLowerCase().includes(search.toLowerCase());
    return matchClient && matchSearch;
  });
  const totalSize = filteredFiles.reduce((acc, f) => acc + (f.size || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AdminLogo />
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Client Documents</h1>
          <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>View and manage all client-uploaded files across the portal.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[{ label: 'Total Clients', value: clientList.length }, { label: 'Total Files', value: files.length }, { label: 'Total Storage', value: formatBytes(files.reduce((a, f) => a + (f.size || 0), 0)) }].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input type="text" placeholder="Search by file name or client..." value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }}
            onFocus={e => e.target.style.borderColor = '#C8102E'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none bg-white transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }}
            onFocus={e => e.target.style.borderColor = '#C8102E'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
            <option value="all">All Clients</option>
            {clientList.map(c => <option key={c.uid} value={c.uid}>{c.name || c.email}</option>)}
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
                <thead>
                  <tr className="border-b border-gray-100">
                    {['File', 'Client', 'Size', 'Date', ''].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>{h}</th>)}
                  </tr>
                </thead>
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
