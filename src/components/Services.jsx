import { motion } from 'framer-motion';
import { FiFileText, FiBookOpen, FiDollarSign, FiBriefcase, FiShield, FiTrendingUp, FiBarChart2, FiArrowRight } from 'react-icons/fi';

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Outfit', sans-serif";

const services = [
  { icon: FiFileText, title: "Tax Preparation", description: "Accurate, on-time federal and state tax returns for individuals, self-employed, and businesses of all sizes. We maximize every deduction you deserve.", features: ["Individual & Joint Returns", "Self-Employed & 1099", "Multi-State Filing", "Prior Year Returns"] },
  { icon: FiBookOpen, title: "Bookkeeping", description: "Monthly bookkeeping that keeps your finances organized, your records clean, and your business ready for tax season — year-round.", features: ["Monthly Reconciliation", "Accounts Payable/Receivable", "Financial Reports", "QuickBooks Setup"], link: 'bookkeeping-packages', linkLabel: 'View Packages' },
  { icon: FiDollarSign, title: "Payroll Services", description: "Full-service payroll processing so your employees are paid on time, every time — with all filings handled automatically.", features: ["Direct Deposit", "Quarterly Tax Filings", "W-2 & 1099 Preparation", "Workers Comp Audits"] },
  { icon: FiBriefcase, title: "Business Formation", description: "Start your business the right way. We guide you through entity selection, registration, and setup to minimize taxes from day one.", features: ["LLC & Corp Formation", "EIN Registration", "Operating Agreements", "Business Licenses"] },
  { icon: FiShield, title: "IRS Representation", description: "Facing an audit or IRS notice? Our enrolled agents represent you directly before the IRS and negotiate the best possible resolution.", features: ["Audit Defense", "Offer in Compromise", "Installment Agreements", "Penalty Abatement"] },
  { icon: FiTrendingUp, title: "Tax Planning", description: "Proactive strategies to reduce your tax burden year-round. We look ahead so you keep more of what you earn.", features: ["Year-Round Strategy", "Retirement Planning", "Entity Restructuring", "Investment Tax Planning"], featured: true },
  { icon: FiBarChart2, title: "Virtual CFO", description: "Get the strategic financial leadership of a Chief Financial Officer without the full-time cost. We partner with growing businesses to drive smarter decisions and sustainable profitability.", features: ["Cash Flow Management", "Financial Forecasting", "KPI Dashboards", "Growth Strategy"], featured: true },
];

export default function Services({ onNavigate }) {
  return (
    <section id="services" className="py-24" style={{ backgroundColor: '#fafafa' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: 'rgba(178,34,34,0.08)', color: '#B22222', fontFamily: SANS, letterSpacing: '0.12em' }}>
            What We Offer
          </span>
          <h2 className="font-bold text-gray-900 mb-4" style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 600, letterSpacing: '0.01em', lineHeight: 1.15 }}>
            Comprehensive Financial Services
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto" style={{ fontFamily: SANS, fontWeight: 400 }}>
            From simple tax returns to complex business accounting, we provide expert solutions tailored to your unique financial situation.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div key={svc.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border p-7 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden flex flex-col"
                style={{ borderColor: svc.featured ? 'rgba(178,34,34,0.5)' : 'rgba(178,34,34,0.12)', background: svc.featured ? 'linear-gradient(135deg, #1a0508 0%, #2d0910 100%)' : '#ffffff' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = svc.featured ? 'rgba(178,34,34,0.8)' : 'rgba(178,34,34,0.35)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = svc.featured ? 'rgba(178,34,34,0.5)' : 'rgba(178,34,34,0.12)'}>
                {svc.featured && <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #B22222 0%, transparent 70%)' }} />}
                {svc.featured && <span className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4" style={{ backgroundColor: 'rgba(178,34,34,0.25)', color: '#f87171', fontFamily: SANS, letterSpacing: '0.12em' }}>Premium Service</span>}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: svc.featured ? 'rgba(178,34,34,0.2)' : 'rgba(178,34,34,0.08)' }}>
                  <Icon size={22} style={{ color: '#B22222' }} />
                </div>
                <h3 className="font-bold mb-3" style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 600, letterSpacing: '0.01em', color: svc.featured ? '#ffffff' : '#111827' }}>{svc.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ fontFamily: SANS, fontWeight: 400, color: svc.featured ? 'rgba(255,200,200,0.7)' : '#6b7280' }}>{svc.description}</p>
                <ul className="flex flex-wrap gap-2 mb-5">
                  {svc.features.map((f) => (
                    <li key={f} className="text-xs font-medium px-2.5 py-1 rounded-md"
                      style={{ backgroundColor: svc.featured ? 'rgba(178,34,34,0.2)' : 'rgba(178,34,34,0.07)', color: svc.featured ? '#fca5a5' : '#B22222', fontFamily: SANS, letterSpacing: '0.04em' }}>
                      {f}
                    </li>
                  ))}
                </ul>
                {svc.link && onNavigate && (
                  <div className="mt-auto">
                    <button onClick={() => onNavigate(svc.link)} className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200" style={{ color: '#B22222', fontFamily: SANS }}
                      onMouseEnter={e => e.currentTarget.style.color = '#8B1A1A'} onMouseLeave={e => e.currentTarget.style.color = '#B22222'}>
                      {svc.linkLabel} <FiArrowRight size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center mt-14">
          <p className="text-gray-500 mb-4" style={{ fontFamily: SANS }}>Not sure which service you need? Let us help.</p>
          <button onClick={() => { const el = document.querySelector('#contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200"
            style={{ backgroundColor: '#B22222', fontFamily: SANS, fontWeight: 600, letterSpacing: '0.04em' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#8B1A1A'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#B22222'}>
            Schedule a Free Consultation
          </button>
        </motion.div>
      </div>
    </section>
  );
}
