import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Process from './components/Process';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import BookkeepingPackages from './pages/BookkeepingPackages';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmailAction from './EmailAction';
import { FaInstagram, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import EmailVerified from './EmailVerified';

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Outfit', sans-serif";
const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/alphaaccountingandtax/', icon: FaInstagram, hoverColor: '#E1306C' },
  { label: 'Facebook', href: 'https://www.facebook.com/people/Alpha-Accounting-and-Tax/100090563133568/', icon: FaFacebook, hoverColor: '#1877F2' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/alpha-accounting-and-tax', icon: FaLinkedin, hoverColor: '#0A66C2' },
  { label: 'WhatsApp', href: 'https://api.whatsapp.com/message/VIRSQ4KEQDZFK1?autoload=1&app_absent=0', icon: FaWhatsapp, hoverColor: '#25D366' },
];

function SocialIcons({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map(({ label, href, icon: Icon, hoverColor }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 border border-gray-700 transition-all duration-200"
          onMouseEnter={e => { e.currentTarget.style.color = hoverColor; e.currentTarget.style.borderColor = hoverColor; e.currentTarget.style.backgroundColor = `${hoverColor}18`; }}
          onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.backgroundColor = ''; }}>
          <Icon size={15} />
        </a>
      ))}
    </div>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#B22222' }}>
                <span className="text-white font-bold text-sm" style={{ fontFamily: SERIF }}>A</span>
              </div>
              <span className="text-white font-bold text-lg" style={{ fontFamily: SERIF }}>Alpha Accounting &amp; Tax</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-5" style={{ fontFamily: SANS }}>
              Professional tax preparation, bookkeeping, payroll, and business formation services. Serving individuals and businesses since 2020.
            </p>
            <SocialIcons />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: SERIF, fontSize: '16px' }}>Services</h4>
            <ul className="flex flex-col gap-2">
              {["Tax Preparation", "Bookkeeping", "Payroll Services", "Business Formation", "IRS Representation", "Tax Planning"].map((s) => (
                <li key={s}><a href="#services" className="text-gray-400 text-sm transition-colors hover:text-white" style={{ fontFamily: SANS }}>{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: SERIF, fontSize: '16px' }}>Contact</h4>
            <ul className="flex flex-col gap-2 text-gray-400 text-sm" style={{ fontFamily: SANS }}>
              <li><a href="tel:+16572066251" className="hover:text-white transition-colors">+1 (657) 206-6251</a></li>
              <li><a href="mailto:info@alphaaccountingandtax.com" className="hover:text-white transition-colors">info@alphaaccountingandtax.com</a></li>
              <li>Office Location: California</li>
              <li>Remote Services Available</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs" style={{ fontFamily: SANS }}>&copy; {new Date().getFullYear()} Alpha Accounting &amp; Tax. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((link) => (
              <a key={link} href="#" className="text-gray-500 text-xs hover:text-gray-300 transition-colors" style={{ fontFamily: SANS }}>{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={onNavigate} />
      <Hero onNavigate={onNavigate} />
      <Services onNavigate={onNavigate} />
      <About />
      <Process />
      <FAQ />
      <Contact />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function getInitialPage() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('mode') === 'verifyEmail' && params.get('oobCode')) return 'email-action';
  if (params.get('verified') === 'true') return 'email-verified';
  return 'home';
}

export default function App() {
  const [page, setPage] = useState(getInitialPage);

  const navigate = (to) => {
    setPage(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (page === 'email-action') return <EmailAction onNavigate={navigate} />;
  if (page === 'email-verified') return <EmailVerified onNavigate={navigate} />;
  if (page === 'bookkeeping-packages') return <BookkeepingPackages onNavigate={navigate} />;
  if (page === 'login') return <Login onNavigate={navigate} />;
  if (page === 'register') return <Register onNavigate={navigate} />;
  if (page === 'forgot-password') return <ForgotPassword onNavigate={navigate} />;
  if (page === 'client-dashboard') return <ClientDashboard onNavigate={navigate} />;
  if (page === 'admin-dashboard') return <AdminDashboard onNavigate={navigate} />;
  return <HomePage onNavigate={navigate} />;
}

