import { useState } from 'react';
import { auth, db } from '../firebase';
import { getGoogleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import AuthLogo from '../components/AuthLogo';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
        <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </g>
    </svg>
  );
}

function UnverifiedBanner({ userEmail, onDismiss }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');

  const handleResend = async () => {
    setSending(true);
    setSendError('');
    try {
      const user = auth.currentUser;
      if (user) { await user.sendEmailVerification(); setSent(true); setTimeout(() => setSent(false), 4000); }
    } catch (err) {
      setSendError(err.code === 'auth/too-many-requests' ? 'Too many requests. Please wait a few minutes.' : 'Could not resend. Please try again.');
    } finally { setSending(false); }
  };

  return (
    <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <p className="text-amber-800 text-sm font-semibold mb-1">Email not verified</p>
      <p className="text-amber-700 text-xs mb-3 leading-relaxed">A verification link was sent to <strong>{userEmail}</strong>. Please click it before signing in.</p>
      {sent && <p className="text-green-700 text-xs mb-2">Verification email resent!</p>}
      {sendError && <p className="text-red-600 text-xs mb-2">{sendError}</p>}
      <div className="flex gap-2">
        <button onClick={handleResend} disabled={sending} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors disabled:opacity-60">{sending ? 'Sending...' : 'Resend email'}</button>
        <button onClick={onDismiss} className="text-xs text-amber-600 hover:text-amber-800 transition-colors px-2">Dismiss</button>
      </div>
    </div>
  );
}

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setUnverifiedEmail(''); setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) { setUnverifiedEmail(cred.user.email); setLoading(false); return; }
      let role = 'client';
      try { const userDoc = await getDoc(doc(db, 'users', cred.user.uid)); if (userDoc.exists()) role = userDoc.data().role || 'client'; } catch (dbErr) { console.warn('[Login] Firestore read blocked:', dbErr.code); }
      onNavigate(role === 'admin' ? 'admin-dashboard' : 'client-dashboard');
    } catch (err) {
      console.error('[Login] Error:', err.code, err.message);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') { setError('Invalid email or password. Please try again.'); }
      else if (err.code === 'auth/too-many-requests') { setError('Too many failed attempts. Please wait a moment and try again.'); }
      else if (err.code === 'auth/network-request-failed') { setError('Network error. Please check your connection and try again.'); }
      else if (err.code === 'auth/invalid-email') { setError('Please enter a valid email address.'); }
      else { setError(`Sign-in failed (${err.code || 'unknown'}). Please try again.`); }
    } finally { setLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    setError(''); setUnverifiedEmail(''); setGoogleLoading(true);
    try {
      const cred = await signInWithPopup(auth, getGoogleProvider());
      try {
        const userRef = doc(db, 'users', cred.user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) { await setDoc(userRef, { uid: cred.user.uid, name: cred.user.displayName || '', email: cred.user.email, role: 'client', createdAt: serverTimestamp() }); }
        const freshDoc = userDoc.exists() ? userDoc : await getDoc(userRef);
        const role = freshDoc.exists() ? (freshDoc.data().role || 'client') : 'client';
        onNavigate(role === 'admin' ? 'admin-dashboard' : 'client-dashboard');
      } catch (dbErr) { console.warn('[Login Google] Firestore blocked:', dbErr.code); onNavigate('client-dashboard'); }
    } catch (err) {
      console.error('[Google Login] Error:', err.code, err.message);
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') { setError('Google sign-in failed. Please try again.'); }
    } finally { setGoogleLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <AuthLogo />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Welcome back</h2>
          <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sign in to access your documents</p>
          {unverifiedEmail && <UnverifiedBanner userEmail={unverifiedEmail} onDismiss={() => setUnverifiedEmail('')} />}
          {error && !unverifiedEmail && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-start justify-between gap-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <span>{error}</span>
              <button onClick={() => setError('')} className="shrink-0 text-red-400 hover:text-red-600 mt-0.5">&#x2715;</button>
            </div>
          )}
          <button type="button" onClick={handleGoogleSignIn} disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium bg-white hover:bg-gray-50 transition-colors duration-200 mb-5 disabled:opacity-60"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <GoogleIcon />{googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>or sign in with email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }}
                onFocus={e => e.target.style.borderColor = '#C8102E'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>Password</label>
                <button type="button" onClick={() => onNavigate('forgot-password')} className="text-xs transition-colors" style={{ color: '#C8102E', fontFamily: "'DM Sans', sans-serif" }}>Forgot password?</button>
              </div>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }}
                onFocus={e => e.target.style.borderColor = '#C8102E'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
            <button type="submit" disabled={loading || googleLoading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 mt-2 disabled:opacity-60"
              style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#a50d25'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C8102E'; }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {"Don't have an account? "}
            <button onClick={() => onNavigate('register')} className="font-semibold transition-colors" style={{ color: '#C8102E' }}>Register here</button>
          </p>
        </div>
        <button onClick={() => onNavigate('home')} className="w-full text-center text-xs text-gray-400 mt-4 hover:text-gray-600 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          &larr; Back to main website
        </button>
      </div>
    </div>
  );
}
