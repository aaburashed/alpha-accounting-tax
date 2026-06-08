import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiExternalLink, FiUser } from 'react-icons/fi';

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Outfit', sans-serif";

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

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

export default function Navbar({ onNavigate }) {
  const [open, setOpen] = useState(false);

  const handleNav = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookkeeping = (e) => {
    e.preventDefault();
    setOpen(false);
    if (onNavigate) onNavigate('bookkeeping-packages');
  };

  const handleContact = (e) => {
    e.preventDefault();
    setOpen(false);
    handleNav('#contact');
  };

  const handleClientPortal = (e) => {
    e.preventDefault();
    setOpen(false);
    if (onNavigate) onNavigate('login');
  };

  return (
    <nav style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="#home" onClick={(e) => { e.preventDefault(); handleNav('#home'); }} className="flex items-center gap-3 leading-none" style={{ textDecoration: 'none' }}>
          <NavLogo />
        </a>
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.label}>
              <button onClick={() => handleNav(link.href)}
                className="px-3 py-2 rounded text-sm transition-colors duration-200"
                style={{ color: '#333333', fontFamily: SANS, fontSize: '14px', fontWeight: 500, letterSpacing: '0.03em' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C8102E'}
                onMouseLeave={e => e.currentTarget.style.color = '#333333'}>
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <button onClick={handleBookkeeping}
              className="flex items-center gap-1 px-3 py-2 rounded text-sm transition-colors duration-200"
              style={{ color: '#333333', fontFamily: SANS, fontSize: '14px', fontWeight: 500, letterSpacing: '0.03em' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C8102E'}
              onMouseLeave={e => e.currentTarget.style.color = '#333333'}>
              Bookkeeping <FiExternalLink size={11} />
            </button>
          </li>
        </ul>
        <div className="hidden lg:flex items-center gap-2">
          <button onClick={handleClientPortal}
            className="inline-flex items-center gap-1.5 rounded-md transition-all duration-200"
            style={{ backgroundColor: '#FFFFFF', color: '#C8102E', fontFamily: SANS, fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em', padding: '8px 16px', borderRadius: '6px', border: '2px solid #C8102E' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C8102E'; e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#C8102E'; }}>
            <FiUser size={13} /> Client Portal
          </button>
          <a href="#contact" onClick={handleContact}
            className="inline-flex items-center rounded-md transition-all duration-200"
            style={{ backgroundColor: '#C8102E', color: '#FFFFFF', border: '2px solid #C8102E', fontFamily: SANS, fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em', padding: '8px 22px', borderRadius: '6px' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#a50d25'; e.currentTarget.style.borderColor = '#a50d25'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C8102E'; e.currentTarget.style.borderColor = '#C8102E'; }}>
            Get Free Quote
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2" style={{ color: '#C8102E' }}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #EEEEEE' }} className="lg:hidden overflow-hidden">
            <ul className="flex flex-col py-3 px-6 gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={() => handleNav(link.href)} className="w-full text-left py-2.5 text-sm border-b transition-colors"
                    style={{ color: '#333333', borderColor: '#EEEEEE', fontFamily: SANS, fontWeight: 500, letterSpacing: '0.04em' }}>
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={handleBookkeeping} className="flex items-center gap-1.5 py-2.5 text-sm border-b w-full text-left transition-colors"
                  style={{ color: '#333333', borderColor: '#EEEEEE', fontFamily: SANS, fontWeight: 500 }}>
                  Bookkeeping Packages <FiExternalLink size={12} />
                </button>
              </li>
              <li>
                <button onClick={handleClientPortal} className="flex items-center gap-2 py-2.5 text-sm border-b w-full text-left transition-colors"
                  style={{ color: '#333333', borderColor: '#EEEEEE', fontFamily: SANS, fontWeight: 500 }}>
                  <FiUser size={14} /> Client Portal
                </button>
              </li>
              <li className="pt-3">
                <a href="#contact" onClick={handleContact} className="block text-center px-5 py-3 rounded-md transition-colors"
                  style={{ backgroundColor: '#C8102E', color: '#FFFFFF', fontFamily: SANS, fontWeight: 600, letterSpacing: '0.05em', fontSize: '13px' }}>
                  Get Free Quote
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
