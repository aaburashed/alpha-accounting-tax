import { useState } from 'react';
import { auth, db } from '../firebase';
import { getGoogleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, sendEmailVerification } from 'firebase/auth';
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

function getFirebaseErrorMessage(err) {
  const code = err?.code || '';
  switch (code) {
    case 'auth/email-already-in-use': return 'An account with this email already exists. Please sign in instead.';
    case 'auth/invalid-email': return 'Please enter a valid email address.';
    case 'auth/weak-password': return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/network-request-failed': return 'Network error. Please check your internet connection and try again.';
    case 'auth/too-many-requests': return 'Too many attempts. Please wait a moment and try again.';
    default: if (code) return `Error (${code}): ${err?.message || 'Please try again.'}`; return err?.message || 'Something went wrong. Please try again.';
  }
}

function VerifyEmailScreen({ email, password, onNavigate }) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState('');

  const handleResend = async () => {
    setResending(true); setResendError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user, { url: 'https://alphaaccountingandtax.com/?verified=true', handleCodeInApp: false });
      await signOut(auth);
      setResent(true); setTimeout(() => setResent(false), 4000);
    } catch (err) { setResendError(err.code === 'auth/too-many-requests' ? 'Too many requests. Please wait a few minutes.' : 'Could not resend email. Please try again.');
    } finally { setResending(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <AuthLogo />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Check your email</h2>
          <p className="text-gray-500 text-sm mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>We sent a verification link to</p>
          <p className="font-semibold text-gray-800 text-sm mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{email}</p>
          <p className="text-gray-400 text-xs mb-6 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>Click the link in that email, then come back and sign in below.</p>
          {resendError && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs text-left" style={{ fontFamily: "'DM Sans', sans-serif" }}>{resendError}</div>}
          {resent && <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Verification email resent successfully!</div>}
          <button onClick={() => onNavigate('login')} className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 mb-3"
            style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#a50d25'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C8102E'; }}>
            I have verified — Sign In
          </button>
          <button onClick={handleResend} disabled={resending} className="w-full py-3 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {resending ? 'Resending...' : 'Resend verification email'}
          </button>
          <p className="text-center text-xs text-gray-400 mt-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Wrong email?{' '}<button onClick={() => onNavigate('register')} className="font-semibold" style={{ color: '#C8102E' }}>Go back</button>
          </p>
        </div>
        <button onClick={() => onNavigate('home')} className="w-full text-center text-xs text-gray-400 mt-4 hover:text-gray-600 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>&larr; Back to main website</button>
      </div>
    </div>
  );
}

export default function Register({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [verifyScreen, setVerifyScreen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredPassword, setRegisteredPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      let cred;
      try { cred = await createUserWithEmailAndPassword(auth, email, password); }
      catch (authErr) { console.error('[Register] createUser failed:', authErr.code); setError(getFirebaseErrorMessage(authErr)); setLoading(false); return; }
      try { await updateProfile(cred.user, { displayName: name }); } catch (e) { console.warn('[Register] updateProfile failed:', e.code); }
      try { await sendEmailVerification(cred.user, { url: 'https://alphaaccountingandtax.com/?verified=true', handleCodeInApp: false }); } catch (e) { console.warn('[Register] sendEmailVerification failed:', e.code); }
      try { await setDoc(doc(db, 'users', cred.user.uid), { uid: cred.user.uid, name, email, role: 'client', createdAt: serverTimestamp() }); } catch (e) { console.warn('[Register] Firestore write blocked:', e.code); }
      try { await signOut(auth); } catch (e) { console.warn('[Register] signOut failed:', e.code); }
      setRegisteredEmail(email); setRegisteredPassword(password); setVerifyScreen(true);
    } catch (unexpectedErr) { console.error('[Register] Unexpected:', unexpectedErr); setError(getFirebaseErrorMessage(unexpectedErr)); }
    finally { setLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    setError(''); setGoogleLoading(true);
    try {
      const cred = await signInWithPopup(auth, getGoogleProvider());
      try {
        const userRef = doc(db, 'users', cred.user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) { await setDoc(userRef, { uid: cred.user.uid, name: cred.user.displayName || '', email: cred.user.email, role: 'client', createdAt: serverTimestamp() }); }
      } catch (dbErr) { console.warn('[Register Google] Firestore blocked:', dbErr.code); }
      onNavigate('client-dashboard');
    } catch (err) {
      console.error('[Google Register] Error:', err.code, err.message);
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') { setError(getFirebaseErrorMessage(err)); }
    } finally { setGoogleLoading(false); }
  };

  if (verifyScreen) return <VerifyEmailScreen email={registeredEmail} password={registeredPassword} onNavigate={onNavigate} />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <AuthLogo />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Create Account</h2>
          <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Register to access the client portal</p>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-start justify-between gap-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <span>{error}</span><button onClick={() => setError('')} className="shrink-0 text-red-400 hover:text-red-600 mt-0.5">&#x2715;</button>
            </div>
          )}
          <button type="button" onClick={handleGoogleSignIn} disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium bg-white hover:bg-gray-50 transition-colors duration-200 mb-5 disabled:opacity-60"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <GoogleIcon />{googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>or register with email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[['text', 'Full Name', name, setName, 'John Smith'], ['email', 'Email Address', email, setEmail, 'you@example.com'], ['password', 'Password', password, setPassword, 'Min. 6 characters'], ['password', 'Confirm Password', confirm, setConfirm, 'Repeat password']].map(([type, label, val, setter, placeholder]) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
                <input type={type} required value={val} onChange={e => setter(e.target.value)} placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }}
                  onFocus={e => e.target.style.borderColor = '#C8102E'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
            ))}
            <button type="submit" disabled={loading || googleLoading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 mt-2 disabled:opacity-60"
              style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#a50d25'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C8102E'; }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Already have an account?{' '}<button onClick={() => onNavigate('login')} className="font-semibold transition-colors" style={{ color: '#C8102E' }}>Sign in</button>
          </p>
        </div>
        <button onClick={() => onNavigate('home')} className="w-full text-center text-xs text-gray-400 mt-4 hover:text-gray-600 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>&larr; Back to main website</button>
      </div>
    </div>
  );
}
