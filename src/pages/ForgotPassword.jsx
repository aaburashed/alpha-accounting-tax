import { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import AuthLogo from '../components/AuthLogo';

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await sendPasswordResetEmail(auth, email); setSent(true); }
    catch (err) { setError('Could not send reset email. Please check the address and try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <AuthLogo />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-6">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Check your inbox</h2>
              <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>We sent a password reset link to <strong>{email}</strong>.</p>
              <button onClick={() => onNavigate('login')} className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all"
                style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#a50d25'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C8102E'; }}>
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Reset Password</h2>
              <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Enter your email and we will send you a reset link.</p>
              {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Email Address</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm outline-none transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }}
                    onFocus={e => e.target.style.borderColor = '#C8102E'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 mt-2 disabled:opacity-60"
                  style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#a50d25'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C8102E'; }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
        <button onClick={() => onNavigate('login')} className="w-full text-center text-xs text-gray-400 mt-4 hover:text-gray-600 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>&larr; Back to sign in</button>
      </div>
    </div>
  );
}
