import { useState, useEffect, useRef } from 'react';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, deleteDoc } from 'firebase/firestore';

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

export default function ClientDashboard({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { if (!u) { onNavigate('login'); return; } setUser(u); });
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
      () => { setError('Upload failed. Please try again.'); setUploading(false); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        await addDoc(collection(db, 'files'), { uid: user.uid, userName: user.displayName || user.email, userEmail: user.email, name: file.name, size: file.size, type: file.type, fileType: getFileType(file.type), url, storagePath: storageRef.fullPath, createdAt: serverTimestamp() });
        setSuccess('File uploaded successfully!'); setUploading(false); setUploadProgress(0);
        setTimeout(() => setSuccess(''), 3000);
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

  const handleSignOut = async () => { await signOut(auth); onNavigate('login'); };

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Documents</h1>
          <p className="text-gray-500 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Upload and manage your tax and accounting documents securely.</p>
        </div>
        {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center justify-between" style={{ fontFamily: "'Outfit', sans-serif" }}><span>{error}</span><button onClick={() => setError('')} className="ml-4 text-red-400 hover:text-red-600">&#x2715;</button></div>}
        {success && <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>{success}</div>}
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
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Uploaded Files <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">{files.length}</span>
            </h2>
          </div>
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
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors" style={{ backgroundColor: '#C8102E', fontFamily: "'Outfit', sans-serif" }}
                      onMouseEnter={e => e.target.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.target.style.backgroundColor = '#C8102E'}>View</a>
                    <button onClick={() => setDeleteConfirm(file)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Delete File?</h3>
            <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors" style={{ backgroundColor: '#C8102E', fontFamily: "'Outfit', sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C8102E'}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
