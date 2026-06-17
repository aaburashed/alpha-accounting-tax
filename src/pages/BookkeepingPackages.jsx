import { motion } from 'framer-motion';
import { FiCheck, FiArrowLeft, FiPhone, FiMail } from 'react-icons/fi';

const packages = [
  { name: "Starter", subtitle: "For freelancers & solo operators", price: "$499", period: "/month", highlight: false, badge: null, description: "Clean, organized books every month so you can focus on growing your business.", features: ["Up to 75 transactions/month","Monthly bank reconciliation","Profit & Loss statement","Balance sheet","Email support","Annual financial summary"], notIncluded: ["Payroll processing","Sales tax filing","Dedicated account manager"], cta: "Get Started" },
  { name: "Growth", subtitle: "For growing small businesses", price: "$799", period: "/month", highlight: true, badge: "Most Popular", description: "Everything in Starter plus payroll, sales tax, and a dedicated account manager.", features: ["Up to 200 transactions/month","Monthly bank reconciliation","Profit & Loss + Balance Sheet","Accounts payable & receivable","Quarterly financial review","Payroll processing (up to 5 employees)","Sales tax filing","Dedicated account manager","Priority email & phone support"], notIncluded: ["CFO advisory calls"], cta: "Get Started" },
  { name: "Pro", subtitle: "For established businesses", price: "$1,499+", period: "/month", highlight: false, badge: "Best Value", description: "Full-service bookkeeping, payroll, tax planning, and monthly CFO strategy sessions.", features: ["Unlimited transactions","Full monthly bookkeeping","Payroll processing (unlimited employees)","Sales tax filing","Quarterly tax estimates","Tax planning & strategy","Monthly CFO advisory call","KPI dashboard setup","Dedicated senior accountant","Annual tax return preparation","24-hour response guarantee"], notIncluded: [], cta: "Get Started" },
];

const faqs = [
  { q: "What software do you use for bookkeeping?", a: "We primarily use QuickBooks Online, but we can work with Xero, Wave, or your existing software. Setup and migration are included." },
  { q: "Do I need to send you anything each month?", a: "We connect directly to your bank and credit card accounts. You'll just need to respond to any clarifying questions — usually just a few minutes each month." },
  { q: "Can I switch plans as my business grows?", a: "Absolutely. You can upgrade or downgrade at any time. Changes take effect on your next billing cycle." },
  { q: "Is there a setup fee?", a: "No setup fees. We handle onboarding, account setup, and historical cleanup as part of your first month." },
];

function BookkeepingLogo() {
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

export default function BookkeepingPackages({ onNavigate }) {
  const goHome = () => { if (onNavigate) onNavigate('home'); };
  const handleContact = () => { goHome(); setTimeout(() => { const el = document.querySelector('#contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 150); };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-red-700 text-white text-sm py-2 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FiPhone className="text-red-200" size={13} />
          <span style={{ fontFamily: "'DM Sans', sans-serif" }}>Free Consultation: <a href="tel:+16572066251" className="font-semibold hover:underline">+1 (657) 206-6251</a> &nbsp;|&nbsp; Mon–Fri 8am–6pm</span>
        </div>
        <a href="mailto:info@alphaaccountingandtax.com" className="hidden sm:flex items-center gap-1.5 text-red-200 hover:text-white transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}><FiMail size={13} />info@alphaaccountingandtax.com</a>
      </div>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <button onClick={goHome} className="flex items-center gap-2 text-gray-500 hover:text-red-700 transition-colors text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}><FiArrowLeft size={16} />Back to Home</button>
          <BookkeepingLogo />
          <a href="tel:+16572066251" className="hidden sm:inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200" style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C8102E'}><FiPhone size={14} />Call Now</a>
        </div>
      </nav>
      <section className="bg-white flex flex-col items-center justify-center" style={{ minHeight: '480px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center w-full" style={{ maxWidth: 600 }}>
          <div className="flex flex-col items-center mb-8">
            <svg viewBox="0 0 200 200" width="120" height="120" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
              <polygon points="100,12 188,188 12,188" fill="#C8102E" opacity="0.12" />
              <text x="100" y="172" textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight="700" fontSize="155" fill="#C8102E">A</text>
            </svg>
            <p style={{ color: '#C8102E', fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: '700', lineHeight: '1', margin: '0', letterSpacing: '0.02em' }}>ALPHA</p>
            <p style={{ color: '#C8102E', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '400', lineHeight: '1.4', margin: '4px 0 0 0', letterSpacing: '0.18em' }}>ACCOUNTING &amp; TAX</p>
          </div>
          <div className="text-center px-6 w-full">
            <span className="inline-block text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: 'rgba(200,16,46,0.08)', color: '#C8102E' }}>Bookkeeping Packages</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Simple, Transparent Pricing</h1>
            <p className="text-gray-500 text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>No hidden fees. No surprises. Choose the plan that fits your business.</p>
          </div>
        </motion.div>
      </section>
      <section className="pb-24 px-6" style={{ backgroundColor: '#fafafa' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <motion.div key={pkg.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-2xl border overflow-hidden flex flex-col"
                style={{ borderColor: pkg.highlight ? '#C8102E' : 'rgba(200,16,46,0.15)', background: pkg.highlight ? 'linear-gradient(160deg, #1a0508 0%, #2d0910 60%, #1a0508 100%)' : '#ffffff', boxShadow: pkg.highlight ? '0 20px 60px rgba(200,16,46,0.25)' : '0 2px 16px rgba(0,0,0,0.06)' }}>
                {pkg.badge && <div className="absolute top-0 right-0 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-bl-xl" style={{ backgroundColor: pkg.highlight ? '#C8102E' : 'rgba(200,16,46,0.1)', color: pkg.highlight ? '#ffffff' : '#C8102E' }}>{pkg.badge}</div>}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: pkg.highlight ? '#ffffff' : '#111827' }}>{pkg.name}</h3>
                  <p className="text-sm mb-5" style={{ fontFamily: "'DM Sans', sans-serif", color: pkg.highlight ? 'rgba(255,200,200,0.6)' : '#9ca3af' }}>{pkg.subtitle}</p>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: pkg.highlight ? '#ffffff' : '#111827' }}>{pkg.price}</span>
                    <span className="text-sm pb-2" style={{ fontFamily: "'DM Sans', sans-serif", color: pkg.highlight ? 'rgba(255,200,200,0.6)' : '#9ca3af' }}>{pkg.period}</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: "'DM Sans', sans-serif", color: pkg.highlight ? 'rgba(255,200,200,0.75)' : '#6b7280' }}>{pkg.description}</p>
                  <div className="h-px mb-6" style={{ backgroundColor: pkg.highlight ? 'rgba(200,16,46,0.3)' : 'rgba(200,16,46,0.1)' }} />
                  <ul className="flex flex-col gap-3 flex-1 mb-8">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: pkg.highlight ? 'rgba(200,16,46,0.3)' : 'rgba(200,16,46,0.1)' }}><FiCheck size={11} style={{ color: pkg.highlight ? '#fca5a5' : '#C8102E' }} strokeWidth={3} /></span>
                        <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: pkg.highlight ? 'rgba(255,220,220,0.85)' : '#374151' }}>{f}</span>
                      </li>
                    ))}
                    {pkg.notIncluded.map((f) => (
                      <li key={f} className="flex items-start gap-3 opacity-40">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: pkg.highlight ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}><span className="text-xs" style={{ color: pkg.highlight ? '#aaa' : '#9ca3af' }}>–</span></span>
                        <span className="text-sm line-through" style={{ fontFamily: "'DM Sans', sans-serif", color: pkg.highlight ? 'rgba(255,200,200,0.35)' : '#9ca3af' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={handleContact} className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                    style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: pkg.highlight ? '#C8102E' : 'transparent', color: pkg.highlight ? '#ffffff' : '#C8102E', border: pkg.highlight ? 'none' : '2px solid rgba(200,16,46,0.4)' }}
                    onMouseEnter={e => { if (pkg.highlight) { e.currentTarget.style.backgroundColor = '#a50d25'; } else { e.currentTarget.style.backgroundColor = 'rgba(200,16,46,0.06)'; e.currentTarget.style.borderColor = '#C8102E'; } }}
                    onMouseLeave={e => { if (pkg.highlight) { e.currentTarget.style.backgroundColor = '#C8102E'; } else { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(200,16,46,0.4)'; } }}>
                    {pkg.cta}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 rounded-2xl border p-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderColor: 'rgba(200,16,46,0.15)', backgroundColor: '#ffffff' }}>
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Need a custom package?</h4>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>High-volume businesses, multi-entity setups, or complex needs — we build tailored solutions.</p>
            </div>
            <button onClick={handleContact} className="flex-shrink-0 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors duration-200 text-sm" style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C8102E'}>Request Custom Quote</button>
          </motion.div>
        </div>
      </section>
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: 'rgba(200,16,46,0.08)', color: '#C8102E' }}>Every Package Includes</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>The Alpha Standard</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[{ title: "QuickBooks Setup", desc: "We set up and manage your QuickBooks account — no technical knowledge required on your end.", icon: "📊" }, { title: "Secure Document Portal", desc: "Share documents safely through our encrypted client portal. No email attachments needed.", icon: "🔒" }, { title: "Year-End Tax Ready", desc: "Your books will be clean and organized so tax season is stress-free — every single year.", icon: "📋" }, { title: "No Long-Term Contracts", desc: "Month-to-month service. Cancel anytime with 30 days notice. No penalties, no lock-in.", icon: "✅" }, { title: "U.S.-Based Team", desc: "Your account is handled by our California-based team — real people, real expertise.", icon: "🇺🇸" }, { title: "Free Onboarding", desc: "We handle the migration from your previous bookkeeper or software at no extra charge.", icon: "🚀" }].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }} className="rounded-xl border p-6" style={{ borderColor: 'rgba(200,16,46,0.1)', backgroundColor: '#fafafa' }}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-6" style={{ backgroundColor: '#fafafa' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: 'rgba(200,16,46,0.08)', color: '#C8102E' }}>FAQ</span>
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Common Questions</h2>
          </motion.div>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="rounded-xl border p-6" style={{ borderColor: 'rgba(200,16,46,0.12)', backgroundColor: '#ffffff' }}>
                <h4 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{faq.q}</h4>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #1a0508 0%, #2d0910 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Ready to Get Your Books in Order?</h2>
            <p className="text-red-200 mb-8 text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>Schedule a free 30-minute consultation and get a personalized recommendation.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleContact} className="text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 text-sm" style={{ backgroundColor: '#C8102E', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#a50d25'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C8102E'}>Schedule Free Consultation</button>
              <a href="tel:+16572066251" className="font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-sm border" style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,200,200,0.9)', borderColor: 'rgba(200,16,46,0.4)', backgroundColor: 'transparent' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(200,16,46,0.15)'; e.currentTarget.style.borderColor = '#C8102E'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(200,16,46,0.4)'; }}>Call +1 (657) 206-6251</a>
            </div>
          </motion.div>
        </div>
      </section>
      <footer className="bg-gray-950 border-t border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>&copy; {new Date().getFullYear()} Alpha Accounting &amp; Tax. All rights reserved.</p>
          <button onClick={goHome} className="text-gray-400 hover:text-white text-xs transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>&larr; Back to Main Site</button>
        </div>
      </footer>
    </div>
  );
}
