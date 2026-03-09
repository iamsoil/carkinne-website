import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Privacy = () => {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const sections = [
    { title: '1. What We Collect', body: 'We collect enquiry form submissions (name, phone, email, message), EV charging station contributions (location data, station details), and basic usage data via standard web analytics.' },
    { title: '2. How We Use It', body: 'Enquiries are forwarded to the relevant showroom or dealer. Charging station contributions are reviewed and added to our map. Usage data helps us improve the site.' },
    { title: '3. Data Storage', body: 'All data is stored securely via Supabase. We do not store payment information.' },
    { title: '4. We Never Sell Your Data', body: 'CarKinne does not sell, rent, or share your personal data with third parties for marketing purposes.' },
    { title: '5. Cookies', body: 'CarKinne uses minimal cookies for site functionality. No advertising tracking cookies are used.' },
    { title: '6. Third Party Links', body: 'CarKinne links to external showroom and dealer websites. We are not responsible for their privacy practices.' },
    { title: '7. Your Rights', body: 'You may request deletion of any personal data you have submitted by contacting us via the Advertise page.' },
    { title: '8. Changes', body: 'We may update this policy. The latest version will always be available at carkinne.com/privacy.' },
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
        }}>Privacy Policy</h1>
        <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '40px' }}>
          Effective date: March 2026
        </p>

        <div style={{
          background: '#fff8f5', border: '1px solid #ffd0bc',
          borderRadius: '12px', padding: '16px 20px',
          fontSize: '14px', color: '#6e6e73',
          lineHeight: 1.7, marginBottom: '40px',
        }}>
          CarKinne takes your privacy seriously. This policy explains what data we collect, how we use it, and your rights.
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
            <span onClick={() => navigate('/terms')}
              style={{ color: '#e8531a', fontWeight: '700', cursor: 'pointer' }}>
              Terms & Conditions
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

export default Privacy