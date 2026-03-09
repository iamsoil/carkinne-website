import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Terms = () => {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const sections = [
    { title: '1. Use of CarKinne', body: 'CarKinne.com provides car listings, pricing guides, showroom directories, EV information, and related content to help Nepali consumers make informed car buying decisions. By using this site you agree to these terms.' },
    { title: '2. Accuracy Disclaimer', body: 'Car prices, specifications, availability, and offers listed on CarKinne are approximate and subject to change without notice. Always verify final pricing and details directly with the showroom or dealer. CarKinne is not responsible for any discrepancy between listed and actual prices.' },
    { title: '3. Not a Dealer', body: 'CarKinne does not sell, broker, or finance vehicles. We are a directory and guide service only. Any transaction you make is solely between you and the dealer or showroom.' },
    { title: '4. User Submissions', body: 'Users may submit EV charging station information and enquiries. By submitting, you confirm the information is accurate to the best of your knowledge. CarKinne reserves the right to remove or edit any submission.' },
    { title: '5. Advertiser Responsibilities', body: 'Advertisers and listed showrooms are responsible for the accuracy of their own listings and promotional content. CarKinne is not liable for advertiser claims.' },
    { title: '6. Intellectual Property', body: 'All content, logos, and designs on CarKinne.com are owned by CarKinne. You may not reproduce or redistribute content without permission.' },
    { title: '7. Limitation of Liability', body: 'CarKinne is not liable for any loss or damage arising from use of this website or reliance on its content.' },
    { title: '8. Changes to Terms', body: 'We may update these terms at any time. Continued use of the site constitutes acceptance of the updated terms.' },
    { title: 'Contact', body: 'For any queries, reach us via the Advertise page.' },
  ]

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
      background: 'white', minHeight: '100vh',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '32px 16px 64px' : '56px 24px 80px' }}>
        <div style={{
          display: 'inline-block', background: '#fff8f5',
          border: '1px solid #e8531a', borderRadius: '6px',
          padding: '4px 12px', fontSize: '11px', fontWeight: '700',
          color: '#e8531a', textTransform: 'uppercase',
          letterSpacing: '1px', marginBottom: '16px',
        }}>Legal</div>

        <h1 style={{
          fontSize: isMobile ? '28px' : '38px', fontWeight: '800',
          color: '#1d1d1f', letterSpacing: '-1px', margin: '0 0 8px',
        }}>Terms & Conditions</h1>
        <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '40px' }}>
          Effective date: March 2026
        </p>

        <div style={{
          background: '#fff8f5', border: '1px solid #ffd0bc',
          borderRadius: '12px', padding: '16px 20px',
          fontSize: '14px', color: '#6e6e73',
          lineHeight: 1.7, marginBottom: '40px',
        }}>
          CarKinne is an independent car buying guide for Nepal. We are not a car dealer, broker, or financial institution. All information is provided for guidance only.
        </div>

        {sections.map((section, i) => (
          <div key={i} style={{
            marginBottom: '32px', paddingBottom: '32px',
            borderBottom: i < sections.length - 1 ? '1px solid #f0f0f0' : 'none',
          }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#1d1d1f', margin: '0 0 10px' }}>
              {section.title}
            </h2>
            <p style={{ fontSize: '15px', color: '#6e6e73', lineHeight: 1.75, margin: 0 }}>
              {section.body}
            </p>
          </div>
        ))}

        <div style={{
          marginTop: '48px', paddingTop: '32px',
          borderTop: '1px solid #e5e5e5',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
        }}>
          <span style={{ fontSize: '14px', color: '#6e6e73' }}>
            Also read our{' '}
            <span onClick={() => navigate('/privacy')}
              style={{ color: '#e8531a', fontWeight: '700', cursor: 'pointer' }}>
              Privacy Policy
            </span>
          </span>
          <button onClick={() => navigate('/')} style={{
            background: 'none', border: 'none', color: '#e8531a',
            fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            fontFamily: 'inherit',
          }}>Back to Home</button>
        </div>
      </div>
    </div>
  )
}

export default Terms