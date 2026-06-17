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

export default function TermsOfService({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <NavLogo onNavigate={onNavigate} />
        <button onClick={() => onNavigate('home')} className="text-sm text-gray-500 hover:text-gray-800 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          &larr; Back to Home
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>Last updated: January 1, 2025</p>

        {[
          {
            title: '1. Acceptance of Terms',
            body: `By accessing our website, using our client portal, or engaging Alpha Accounting & Tax for professional services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all visitors, clients, and users of our website and portal.`
          },
          {
            title: '2. Services Provided',
            body: `Alpha Accounting & Tax provides professional accounting, tax preparation, bookkeeping, payroll processing, and business formation services. Our services are provided based on information you supply to us. The accuracy and completeness of our work depends on the accuracy and completeness of the information you provide.

Services are rendered based on individual engagement agreements. Commencement of services constitutes acceptance of our fees and terms for that engagement.`
          },
          {
            title: '3. Client Responsibilities',
            body: `As a client, you agree to:

- Provide complete, accurate, and timely information necessary for us to perform services
- Review all documents, returns, and reports prepared on your behalf before signing or filing
- Notify us promptly of any changes to your financial situation, business structure, or personal circumstances that may affect our services
- Maintain copies of all documents submitted to us and all documents we prepare for you
- Pay fees as agreed upon in your service engagement

You are responsible for the accuracy of all information provided. Alpha Accounting & Tax is not liable for errors resulting from inaccurate or incomplete information provided by you.`
          },
          {
            title: '4. Fees and Payment',
            body: `Our fees are based on the complexity and nature of services requested. Fee schedules are provided prior to engagement commencement. Payment is due upon completion of services unless otherwise agreed in writing.

We reserve the right to require a deposit for new clients or large engagements. Unpaid balances may be subject to interest charges. We reserve the right to withhold delivery of completed work until payment is received.`
          },
          {
            title: '5. Confidentiality',
            body: `Alpha Accounting & Tax treats all client information as strictly confidential. We will not disclose your personal or financial information to third parties except as required by law, with your explicit consent, or as necessary to provide our services (such as filing returns with the IRS or state agencies).

Our staff and contractors are bound by confidentiality obligations. We maintain secure systems to protect your data as described in our Privacy Policy.`
          },
          {
            title: '6. Limitation of Liability',
            body: `Alpha Accounting & Tax's liability for any claim arising from our services is limited to the fees paid for the specific service giving rise to the claim. We are not liable for:

- Penalties, interest, or additional taxes resulting from inaccurate information provided by you
- Losses resulting from IRS or state agency actions beyond our control
- Indirect, incidental, consequential, or punitive damages of any kind
- Delays caused by circumstances beyond our reasonable control

Our services constitute professional advice based on information available at the time. Changes in tax law or regulations after the completion of our services may affect the outcome of prior advice.`
          },
          {
            title: '7. IRS Representation',
            body: `When we represent you before the IRS or state tax authorities, our representation is limited to the specific matter and tax years covered in the engagement agreement. Additional fees may apply for audit representation, appeals, or collections matters not included in the original engagement.`
          },
          {
            title: '8. Client Portal',
            body: `Access to our secure client portal is provided for your convenience. You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately of any unauthorized access to your account.

We reserve the right to suspend or terminate portal access for violation of these terms, non-payment of fees, or for any other reason at our discretion. Documents stored in the portal are subject to our data retention policies.`
          },
          {
            title: '9. Termination of Services',
            body: `Either party may terminate the professional relationship with reasonable written notice. Upon termination, you are responsible for fees for services rendered through the termination date. We will return original documents provided by you upon receipt of payment for outstanding fees.

We reserve the right to withdraw from an engagement if you provide false information, fail to cooperate, or if continuing the engagement would violate professional standards or applicable law.`
          },
          {
            title: '10. Governing Law',
            body: `These Terms of Service are governed by the laws of the State of California. Any disputes arising from these terms or our services shall be resolved through binding arbitration in California, except that either party may seek injunctive relief in a court of competent jurisdiction.`
          },
          {
            title: '11. Changes to Terms',
            body: `We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated effective date. Continued use of our services after changes are posted constitutes acceptance of the revised terms.`
          },
          {
            title: '12. Contact Us',
            body: `For questions about these Terms of Service, please contact us:

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
          <button onClick={() => onNavigate('privacy')} className="hover:text-gray-600 transition-colors">Privacy Policy</button>
        </p>
      </footer>
    </div>
  );
}
