import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Outfit', sans-serif";
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mrevbepo';

const contactInfo = [
  { icon: FiPhone, label: "Phone", value: "+1 (657) 206-6251", sub: "Mon to Fri, 8am to 6pm PST", href: "tel:+16572066251" },
  { icon: FiMail, label: "Email", value: "info@alphaaccountingandtax.com", sub: "We reply within 1 business day", href: "mailto:info@alphaaccountingandtax.com" },
  { icon: FiMapPin, label: "Office Location", value: "California", sub: "Remote Services Available Nationwide", href: null },
  { icon: FiClock, label: "Hours", value: "Mon to Fri: 8am to 6pm", sub: "Sat: 9am to 2pm (Tax Season)", href: null },
];

const services = ["Tax Preparation", "Bookkeeping", "Payroll", "Business Formation", "IRS Representation", "Tax Planning", "Other"];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setSubmitted(true); } else { const data = await res.json(); setError(data?.errors?.[0]?.message || 'Something went wrong. Please try again.'); }
    } catch (err) { setError('Network error. Please check your connection and try again.'); } finally { setLoading(false); }
  };

  return (
    <section id="contact" className="py-24" style={{ backgroundColor: '#fafafa' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: 'rgba(178,34,34,0.08)', color: '#B22222', fontFamily: SANS, letterSpacing: '0.12em' }}>Get In Touch</span>
          <h2 className="font-bold text-gray-900 mb-4" style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 600, letterSpacing: '0.01em', lineHeight: 1.15 }}>
            Start Your Free Consultation
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto" style={{ fontFamily: SANS, fontWeight: 400 }}>
            Ready to take control of your finances? Reach out today with no obligation, no pressure, just expert advice.
          </p>
        </motion.div>
        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-2 flex flex-col gap-5">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              const inner = (
                <div className="flex gap-4 items-start p-5 bg-white rounded-2xl border shadow-sm transition-colors duration-300" style={{ borderColor: 'rgba(178,34,34,0.1)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(178,34,34,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(178,34,34,0.1)'}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(178,34,34,0.08)' }}>
                    <Icon size={20} style={{ color: '#B22222' }} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5" style={{ fontFamily: SANS }}>{item.label}</div>
                    <div className="text-gray-900 font-semibold text-sm" style={{ fontFamily: SANS }}>{item.value}</div>
                    <div className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: SANS }}>{item.sub}</div>
                  </div>
                </div>
              );
              return item.href ? <a key={item.label} href={item.href}>{inner}</a> : <div key={item.label}>{inner}</div>;
            })}
            <div className="rounded-2xl p-6 text-center mt-2" style={{ background: 'linear-gradient(135deg, #B22222 0%, #6b1111 100%)' }}>
              <div className="text-white font-bold text-xl mb-1" style={{ fontFamily: SERIF, fontWeight: 600 }}>100% Confidential</div>
              <div className="text-red-200 text-sm" style={{ fontFamily: SANS }}>Your information is protected and never shared without consent.</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="lg:col-span-3 bg-white rounded-2xl border shadow-sm p-8" style={{ borderColor: 'rgba(178,34,34,0.1)' }}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-80 text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(178,34,34,0.08)' }}>
                  <FiCheckCircle size={32} style={{ color: '#B22222' }} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: SERIF, fontWeight: 600 }}>Message Received!</h3>
                <p className="text-gray-500 max-w-sm" style={{ fontFamily: SANS }}>Thank you for reaching out. A member of our team will contact you within 1 business day to schedule your free consultation.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }); }} className="text-sm font-semibold hover:underline mt-2" style={{ color: '#B22222', fontFamily: SANS }}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1.5" style={{ fontFamily: SANS }}>Full Name *</label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Jane Smith"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors" style={{ fontFamily: SANS }}
                      onFocus={e => e.currentTarget.style.borderColor = '#B22222'} onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'} />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1.5" style={{ fontFamily: SANS }}>Email Address *</label>
                    <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="jane@example.com"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors" style={{ fontFamily: SANS }}
                      onFocus={e => e.currentTarget.style.borderColor = '#B22222'} onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1.5" style={{ fontFamily: SANS }}>Phone Number</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="(657) 206-6251"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors" style={{ fontFamily: SANS }}
                      onFocus={e => e.currentTarget.style.borderColor = '#B22222'} onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'} />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1.5" style={{ fontFamily: SANS }}>Service Needed</label>
                    <select name="service" value={form.service} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none transition-colors bg-white" style={{ fontFamily: SANS }}
                      onFocus={e => e.currentTarget.style.borderColor = '#B22222'} onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                      <option value="">Select a service...</option>
                      {services.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1.5" style={{ fontFamily: SANS }}>Message *</label>
                  <textarea name="message" required rows={4} value={form.message} onChange={handleChange} placeholder="Tell us about your situation and how we can help..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors resize-none" style={{ fontFamily: SANS }}
                    onFocus={e => e.currentTarget.style.borderColor = '#B22222'} onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'} />
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3" style={{ fontFamily: SANS }}>{error}</p>}
                <button type="submit" disabled={loading}
                  className="flex items-center justify-center gap-2 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200 disabled:opacity-60"
                  style={{ backgroundColor: '#B22222', boxShadow: '0 8px 24px rgba(178,34,34,0.25)', fontFamily: SANS, fontWeight: 600, letterSpacing: '0.04em' }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#8B1A1A')}
                  onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#B22222')}>
                  {loading ? (<span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Sending...</span>) : (<><FiSend size={16} />Send Message for a Free Consultation</>)}
                </button>
                <p className="text-gray-400 text-xs text-center" style={{ fontFamily: SANS }}>By submitting, you agree to our privacy policy. We never share your information.</p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
