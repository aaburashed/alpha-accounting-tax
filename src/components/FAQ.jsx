import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { FaInstagram, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Outfit', sans-serif";

const faqs = [
  { q: "How much does tax preparation cost?", a: "Our pricing depends on the complexity of your return. Individual returns start at $150, and business returns vary based on entity type and complexity. We provide a firm quote before any work begins, so there are no surprises." },
  { q: "What documents do I need to bring?", a: "Common documents include W-2s, 1099s, last year's tax return, Social Security numbers for all family members, mortgage interest statements, and any records of deductible expenses. We provide a personalized checklist after your consultation." },
  { q: "Do you handle IRS audits and notices?", a: "Yes. Our IRS Enrolled Agents are federally licensed to represent you before the IRS in any capacity, including audits, appeals, collections, and more. We handle all communication on your behalf." },
  { q: "Can you file returns for prior years?", a: "Absolutely. We regularly help clients catch up on multiple years of unfiled returns. Acting quickly reduces penalties and interest, and we can often negotiate relief with the IRS." },
  { q: "Do you offer year-round services or just during tax season?", a: "We are a full-service firm open year-round. Bookkeeping, payroll, tax planning, and business advisory services are available every month. Many clients work with us on an ongoing basis." },
  { q: "How do I get started?", a: "Simply fill out the contact form on this page or call us at +1 (949) 444-2271. We will schedule a free, no-obligation consultation via phone, Zoom, or Vidello to discuss your needs and answer any questions." },
  { q: "Is my financial information secure?", a: "Security is paramount. We use encrypted file transfer portals, secure document storage, and strict confidentiality policies. Your information is never shared without your explicit consent." },
  { q: "Do you work with businesses as well as individuals?", a: "Yes. We serve sole proprietors, LLCs, S-Corps, C-Corps, and partnerships of all sizes, from startups to established multi-location businesses. We tailor our services to your specific structure and goals." },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/alphaaccountingandtax/', icon: FaInstagram, hoverColor: '#E1306C' },
  { label: 'Facebook', href: 'https://www.facebook.com/people/Alpha-Accounting-and-Tax/100090563133568/', icon: FaFacebook, hoverColor: '#1877F2' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/alpha-accounting-and-tax', icon: FaLinkedin, hoverColor: '#0A66C2' },
  { label: 'WhatsApp', href: 'https://api.whatsapp.com/message/VIRSQ4KEQDZFK1?autoload=1&app_absent=0', icon: FaWhatsapp, hoverColor: '#25D366' },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-xl overflow-hidden border transition-colors duration-200" style={{ borderColor: open ? 'rgba(178,34,34,0.3)' : 'rgba(178,34,34,0.12)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-red-50 transition-colors duration-200">
        <span className="text-gray-900 font-semibold text-sm" style={{ fontFamily: SANS }}>{faq.q}</span>
        <span className="flex-shrink-0" style={{ color: '#B22222' }}>{open ? <FiMinus size={18} /> : <FiPlus size={18} />}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-6 pb-5 pt-1 bg-gray-50 border-t" style={{ borderColor: 'rgba(178,34,34,0.1)' }}>
              <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: SANS }}>{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="bg-white py-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: 'rgba(178,34,34,0.08)', color: '#B22222', fontFamily: SANS, letterSpacing: '0.12em' }}>FAQ</span>
          <h2 className="font-bold text-gray-900 mb-4" style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 600, letterSpacing: '0.01em', lineHeight: 1.15 }}>
            Common Questions
          </h2>
          <p className="text-gray-500 text-lg mb-5" style={{ fontFamily: SANS }}>
            Have more questions? Call us at{' '}
            <a href="tel:+16572066251" className="font-semibold hover:underline" style={{ color: '#B22222' }}>+1 (657) 206-6251</a>
            {' '}and we would be happy to help.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-gray-400 text-sm" style={{ fontFamily: SANS }}>Or reach us via</span>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ label, href, icon: Icon, hoverColor }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 border border-gray-200 transition-all duration-200"
                  onMouseEnter={e => { e.currentTarget.style.color = hoverColor; e.currentTarget.style.borderColor = hoverColor; e.currentTarget.style.backgroundColor = `${hoverColor}15`; }}
                  onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.backgroundColor = ''; }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => <FAQItem key={faq.q} faq={faq} index={i} />)}
        </div>
      </div>
    </section>
  );
}
