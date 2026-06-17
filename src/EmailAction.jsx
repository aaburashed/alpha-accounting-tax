import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { applyActionCode } from 'firebase/auth';

export default function EmailAction({ onNavigate }) {
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const oobCode = params.get('oobCode');

    if (mode === 'verifyEmail' && oobCode) {
      applyActionCode(auth, oobCode)
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 leading-none mb-8">
          <svg viewBox="0 0 200 200" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
            <polygon points="100,12 188,188 12,188" fill="#C8102E" opacity="0.12" />
            <text x="100" y="172" textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight="700" fontSize="155" fill="#C8102E">A</text>
          </svg>
          <div className="flex flex-col leading-none">
            <span style={{ color: '#C8102E', fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '700', lineHeight: '1' }}>ALPHA</span>
            <span style={{ color: '#C8102E', fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: '400', lineHeight: '1.4', letterSpacing: '0.16em' }}>ACCOUNTING &amp; TAX</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {status === 'verifying' && (
            <>
              <div className="w-12 h-12 rounded-full border-4 border-gray-100 mx-auto mb-4" style={{ borderTopColor: '#C8102E', animation: 'spin 1s linear infinite' }} />
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Verifying your email...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0fdf4' }}>
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Email Verified!</h2>
              <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Your email has been verified. You can now sign in.</p>
              <button onClick={() => onNavigate('login')}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200"
                style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#a50d25'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C8102E'}>
                Sign In to Your Portal
              </button>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#fff0f3' }}>
                <svg className="w-8 h-8" style={{ color: '#C8102E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Link Expired</h2>
              <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>This link has expired or already been used. Please sign in and request a new one.</p>
              <button onClick={() => onNavigate('login')}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200"
                style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#a50d25'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C8102E'}>
                Go to Sign In
              </button>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
