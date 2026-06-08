export default function AuthLogo() {
  return (
    <div style={{ width: '100%', background: '#FFFFFF', paddingTop: '56px', paddingBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 240 220" width="160" height="148" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', marginBottom: '16px' }}>
        <polygon points="120,10 230,210 10,210" fill="#C8102E" opacity="0.08" />
        <text x="120" y="198" textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight="700" fontSize="180" fill="#C8102E">A</text>
      </svg>
      <p style={{ color: '#C8102E', fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: '700', lineHeight: '1', letterSpacing: '0.06em', margin: '0' }}>ALPHA</p>
      <p style={{ color: '#C8102E', fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: '400', lineHeight: '1.4', letterSpacing: '0.18em', margin: '8px 0 0 0' }}>ACCOUNTING &amp; TAX</p>
    </div>
  );
}
