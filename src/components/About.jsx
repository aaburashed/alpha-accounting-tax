import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiShield, FiCheckCircle } from 'react-icons/fi';

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Outfit', sans-serif";

const values = [
  { icon: FiAward, title: "Certified Experts", desc: "Our team of CPAs and experienced finance professionals hold the highest credentials in the industry." },
  { icon: FiUsers, title: "Client-First Approach", desc: "We build lasting relationships, not just transactions. Your financial success is our mission." },
  { icon: FiShield, title: "Confidentiality", desc: "Your financial information is protected with enterprise-grade security and strict confidentiality." },
];

const credentials = ["Certified Public Accountants (CPA)", "Experienced Finance Professionals", "QuickBooks ProAdvisors"];

const ABOUT_IMGS = [
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80&fit=crop",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80&fit=crop",
];

export default function About() {
  return (
    <section id="about" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="inline-block text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: 'rgba(178,34,34,0.08)', color: '#B22222', fontFamily: SANS, letterSpacing: '0.12em' }}>
              About Us
            </span>
            <h2 className="font-bold text-gray-900 mb-6 leading-tight"
              style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 600, letterSpacing: '0.01em', lineHeight: 1.15 }}>
              Over a Decade of<br /><span style={{ color: '#B22222' }}>Financial Expertise</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-6" style={{ fontFamily: SANS, fontWeight: 400 }}>
              Alpha Accounting &amp; Tax has been helping individuals and businesses achieve financial clarity since 2020. With 10+ years of combined experience, we have grown into one of the region's most trusted financial services firms.
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-8" style={{ fontFamily: SANS, fontWeight: 400 }}>
              Our team of credentialed professionals brings deep expertise across tax law, accounting standards, and business strategy, backed by a genuine commitment to your financial wellbeing.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-8">
              {credentials.map((c) => (
                <div key={c} className="flex items-center gap-2 text-gray-600 text-sm" style={{ fontFamily: SANS }}>
                  <FiCheckCircle className="flex-shrink-0" size={14} style={{ color: '#B22222' }} />{c}
                </div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-2 gap-3">
              {ABOUT_IMGS.map((src, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden shadow-md" style={{ height: '160px' }}>
                  <img src={src} alt="Professional team" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(178,34,34,0.12) 0%, transparent 60%)' }} />
                </div>
              ))}
            </motion.div>
          </motion.div>
          <div className="flex flex-col gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex gap-5 p-6 bg-gray-50 rounded-2xl border transition-colors duration-300" style={{ borderColor: 'rgba(178,34,34,0.1)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(178,34,34,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(178,34,34,0.1)'}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(178,34,34,0.08)' }}>
                    <Icon size={22} style={{ color: '#B22222' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 600 }}>{v.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: SANS, fontWeight: 400 }}>{v.desc}</p>
                  </div>
                </motion.div>
              );
            })}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #B22222 0%, #6b1111 100%)' }}>
              <div className="relative" style={{ height: '120px' }}>
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&fit=crop" alt="Modern office" className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold tracking-widest uppercase" style={{ fontFamily: SANS, letterSpacing: '0.12em' }}>Serving California &amp; Beyond</span>
                </div>
              </div>
              <div className="p-8 grid grid-cols-2 gap-6 text-center">
                {[{ value: "500+", label: "Clients Serviced" }, { value: "10+", label: "Years in Business" }].map((s) => (
                  <div key={s.label}>
                    <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: SERIF, fontWeight: 600 }}>{s.value}</div>
                    <div className="text-red-200 text-sm" style={{ fontFamily: SANS }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
