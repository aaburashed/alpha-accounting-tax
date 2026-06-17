function NavLogo({ onNavigate }) {
  return (
    <div className="flex items-center gap-2 leading-none cursor-pointer" onClick={() => onNavigate('home')}>
      <svg viewBox="0 0 200 200" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
        <polygon points="100,12 188,188 12,188" fill="#C8102E" opacity="0.12" />
        <text x="100" y="172" textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight="700" fontSize="155" fill="#C8102E">A</text>
      </svg>
      <div className="flex flex-col leading-none">
        <span style={{ color: '#C8102E', fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: '700', lineHeight: '1' }}>ALPHA</span>
        <span style={{ color: '#C8102E', fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: '400', lineHeight: '1.4', letterSpacing: '0.16em' }}>ACCOUNTING &amp; TAX</span>
      </div>
    </div>
  );
}

export default function PrivacyPolicy({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <NavLogo onNavigate={onNavigate} />
        <button onClick={() => onNavigate('home')} className="text-sm text-gray-500 hover:text-gray-800 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          &larr; Back to Home
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>Last updated: January 1, 2025</p>

        {[
          {
            title: '1. Information We Collect',
            body: `We collect information you provide directly to us when you use our services, create an account, or contact us. This includes:

- Personal identification information (name, email address, phone number, mailing address)
- Financial information necessary to provide tax and accounting services (Social Security Numbers, Employer Identification Numbers, income and expense records, bank account details)
- Business information (business name, structure, formation documents)
- Documents you upload to our client portal

We may also collect information automatically when you use our website, including IP address, browser type, pages visited, and time spent on pages.`
          },
          {
            title: '2. How We Use Your Information',
            body: `Alpha Accounting & Tax uses the information we collect to:

- Provide, maintain, and improve our tax preparation, bookkeeping, payroll, and business formation services
- Process and complete transactions
- Prepare and file tax returns and financial documents on your behalf
- Communicate with you about your account, services, and important updates
- Comply with legal obligations including IRS requirements and applicable state laws
- Protect against fraud and unauthorized access to your account`
          },
          {
            title: '3. Information Sharing and Disclosure',
            body: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

- With your explicit consent
- With government agencies (such as the IRS or state tax authorities) as required to provide our services or comply with legal obligations
- With trusted service providers who assist us in operating our business, subject to strict confidentiality agreements
- In response to a valid legal process such as a court order or subpoena
- To protect the rights, property, or safety of Alpha Accounting & Tax, our clients, or others`
          },
          {
            title: '4. Data Security',
            body: `We take the security of your information seriously. We implement industry-standard security measures including:

- Encrypted storage and transmission of sensitive data (SSL/TLS)
- Secure client portal with email verification and password protection
- Limited access to personal information on a need-to-know basis
- Regular security reviews and updates

While we strive to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure. We encourage you to use strong, unique passwords and to contact us immediately if you suspect unauthorized access to your account.`
          },
          {
            title: '5. Data Retention',
            body: `We retain your personal and financial information for as long as necessary to provide our services and comply with legal obligations. Tax records and related financial documents are typically retained for a minimum of seven (7) years in accordance with IRS guidelines and California state requirements. You may request deletion of your account and associated data by contacting us, subject to our legal retention obligations.`
          },
          {
            title: '6. Your Rights',
            body: `You have the right to:

- Access the personal information we hold about you
- Request correction of inaccurate or incomplete information
- Request deletion of your personal information, subject to legal retention requirements
- Opt out of marketing communications at any time
- Request a copy of documents we have prepared on your behalf

To exercise any of these rights, please contact us at info@alphaaccountingandtax.com.`
          },
          {
            title: '7. Cookies and Tracking',
            body: `Our website uses cookies and similar tracking technologies to improve your experience, analyze site traffic, and understand where visitors are coming from. You can control cookie settings through your browser preferences. Disabling cookies may affect some functionality of our website.`
          },
          {
            title: '8. Children\'s Privacy',
            body: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a minor, please contact us immediately and we will take steps to delete that information.`
          },
          {
            title: '9. Changes to This Policy',
            body: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of any material changes by posting the new policy on this page with an updated effective date. Your continued use of our services after any changes constitutes your acceptance of the updated policy.`
          },
          {
            title: '10. Contact Us',
            body: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

Alpha Accounting & Tax
Phone: +1 (657) 206-6251
Email: info@alphaaccountingandtax.com
Location: California (Remote Services Available)`
          },
        ].map(({ title, body }) => (
          <div key={title} className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line" style={{ fontFamily: "'DM Sans', sans-serif" }}>{body}</p>
          </div>
        ))}
      </div>

      <footer className="border-t border-gray-100 py-6 text-center">
        <p className="text-gray-400 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          &copy; {new Date().getFullYear()} Alpha Accounting &amp; Tax. All rights reserved. &nbsp;|&nbsp;
          <button onClick={() => onNavigate('terms')} className="hover:text-gray-600 transition-colors">Terms of Service</button>
        </p>
      </footer>
    </div>
  );
}
