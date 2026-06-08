import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { FiAward, FiUsers, FiThumbsUp, FiHeadphones } from 'react-icons/fi';

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Outfit', sans-serif";
const HERO_IMG = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&fit=crop";

const stats = [
  { value: "10+", label: "Years", icon: FiAward },
  { value: "500+", label: "Clients", icon: FiUsers },
  { value: "100%", label: "Satisfaction", icon: FiThumbsUp },
  { value: "24/7", label: "Support", icon: FiHeadphones },
];

export default function Hero({ onNavigate }) {
  const handleNav = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F8F8 100%)', minHeight: '600px' }} className="relative overflow-hidden flex items-center">
      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="font-bold leading-tight mb-5"
            style={{ fontFamily: SERIF, fontSize: 'clamp(38px, 5vw, 62px)', fontWeight: 600, color: '#000000', letterSpacing: '0.01em', lineHeight: 1.1 }}>
            Expert Tax &amp;{' '}
            <span style={{ color: '#B22222' }}>Accounting</span>{' '}
            Services
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="leading-relaxed mb-8 max-w-lg"
            style={{ fontFamily: SANS, fontSize: '17px', fontWeight: 400, color: '#666666', letterSpacing: '0.01em' }}>
            We help individuals and businesses navigate tax season with confidence. From bookkeeping to IRS representation, we handle it all so you can focus on what matters.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="flex flex-wrap gap-4">
            <button onClick={() => handleNav('#contact')}
              className="flex items-center gap-2 rounded-md transition-all duration-200"
              style={{ backgroundColor: '#B22222', color: '#FFFFFF', fontFamily: SANS, fontSize: '15px', fontWeight: 600, letterSpacing: '0.04em', padding: '14px 28px', borderRadius: '6px', width: '210px', justifyContent: 'center' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#8B1A1A'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#B22222'}>
              Get Free Consultation <FiArrowRight />
            </button>
            <button onClick={() => handleNav('#services')}
              className="flex items-center gap-2 rounded-md transition-all duration-200"
              style={{ backgroundColor: '#FFFFFF', color: '#B22222', border: '2px solid #B22222', fontFamily: SANS, fontSize: '15px', fontWeight: 600, letterSpacing: '0.04em', padding: '14px 28px', borderRadius: '6px', width: '160px', justifyContent: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#B22222'; e.currentTarget.style.color = '#FFFFFF'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#B22222'; }}>
              View Services
            </button>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:block">
          <div className="relative rounded-xl overflow-hidden shadow-2xl" style={{ height: '300px' }}>
            <img src={HERO_IMG} alt="Documents and calculator on desk" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(178,34,34,0.15) 0%, transparent 60%)' }} />
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 hidden lg:block" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #EEEEEE' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-4 gap-4">
          {stats.map(({ value, label, icon: Icon }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }} className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(178,34,34,0.1)' }}>
                <Icon size={18} style={{ color: '#B22222' }} />
              </div>
              <div>
                <div className="font-bold leading-none" style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 600, color: '#B22222' }}>{value}</div>
                <div className="text-xs mt-0.5" style={{ fontFamily: SANS, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#000000' }}>{label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
