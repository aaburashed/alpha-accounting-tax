import { motion } from 'framer-motion';

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Outfit', sans-serif";

const steps = [
  { number: "01", title: "Free Consultation", description: "Schedule a no-obligation call, Zoom, or Vidello meeting. We review your situation, answer your questions, and outline the best path forward." },
  { number: "02", title: "Document Collection", description: "We provide a clear checklist of everything needed. Upload documents securely online or drop them off — your choice." },
  { number: "03", title: "Expert Preparation", description: "Our credentialed team prepares your returns or financials with meticulous attention to detail, maximizing every legal deduction." },
  { number: "04", title: "Review & Approval", description: "We walk you through the completed work, answer any questions, and get your sign-off before filing or delivering." },
  { number: "05", title: "Filing & Ongoing Support", description: "We file electronically for fastest processing and remain available year-round for questions, amendments, or IRS notices." },
];

export default function Process() {
  return (
    <section id="process" className="py-24 relative overflow-hidden" style={{ backgroundColor: '#1a0508' }}>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(rgba(178,34,34,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(178,34,34,0.4) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full border mb-4"
            style={{ backgroundColor: 'rgba(178,34,34,0.15)', color: '#f87171', borderColor: 'rgba(178,34,34,0.3)', fontFamily: SANS, letterSpacing: '0.12em' }}>
            How It Works
          </span>
          <h2 className="font-bold text-white mb-4" style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 600, letterSpacing: '0.01em', lineHeight: 1.15 }}>
            Simple, Transparent Process
          </h2>
          <p className="text-red-200 text-lg max-w-2xl mx-auto opacity-70" style={{ fontFamily: SANS, fontWeight: 400 }}>
            We have streamlined every step so working with us is as easy as possible — no jargon, no surprises.
          </p>
        </motion.div>
        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(178,34,34,0.4), transparent)' }} />
          <div className="grid lg:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.number} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center">
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center mb-5 border-2" style={{ backgroundColor: 'rgba(178,34,34,0.12)', borderColor: 'rgba(178,34,34,0.4)' }}>
                  <span className="font-bold text-sm" style={{ color: '#f87171', fontFamily: SERIF, fontWeight: 600 }}>{step.number}</span>
                </div>
                <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 600 }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,200,200,0.65)', fontFamily: SANS, fontWeight: 400 }}>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} className="text-center mt-16">
          <button onClick={() => { const el = document.querySelector('#contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200"
            style={{ backgroundColor: '#B22222', boxShadow: '0 8px 24px rgba(178,34,34,0.3)', fontFamily: SANS, fontWeight: 600, letterSpacing: '0.04em' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#8B1A1A'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#B22222'}>
            Start Your Free Consultation
          </button>
        </motion.div>
      </div>
    </section>
  );
}
