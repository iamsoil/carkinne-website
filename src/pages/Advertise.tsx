"use client";

import { useState, useEffect } from 'react';

const IconTarget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)

const IconMap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
)

const IconLayout = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>
)

const IconTag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)

const IconCar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v7a2 2 0 01-2 2h-1"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
  </svg>
)

const IconBank = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2L2 7h20L12 2z"/>
  </svg>
)

const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e8531a" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconCheckWhite = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const Advertise = () => {
  const [formData, setFormData] = useState({
    fullName: '', company: '', email: '',
    phone: '', package: 'Basic', message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            width: '72px', height: '72px',
            background: '#fff8f5',
            border: '2px solid #e8531a',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e8531a" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 style={{
            fontSize: '28px', fontWeight: '800',
            color: '#1d1d1f', margin: '0 0 12px',
            letterSpacing: '-1px',
          }}>
            Thank You!
          </h2>
          <p style={{ fontSize: '16px', color: '#6e6e73', lineHeight: 1.7 }}>
            We'll contact you within 24 hours to discuss your advertising options.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    }}>

      {/* HERO - left aligned clean */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: isMobile ? '48px 16px 40px' : '80px 24px 60px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '32px' : '60px',
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            display: 'inline-block',
            background: '#fff8f5',
            border: '1px solid #e8531a',
            borderRadius: '6px',
            padding: '4px 14px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#e8531a',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '24px',
          }}>
            Advertise
          </div>
          <h1 style={{
            fontSize: isMobile ? '38px' : '52px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 20px',
            lineHeight: 1.1,
            letterSpacing: '-2px',
          }}>
            Reach Nepal's
            <span style={{ color: '#e8531a' }}> Active</span>
            <br />Car Buyers
          </h1>
          <p style={{
            fontSize: '17px',
            color: '#6e6e73',
            lineHeight: 1.7,
            margin: '0 0 36px',
          }}>
            Connect with thousands of Nepalis 
            actively searching for their next car 
            — right when they're ready to buy.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '10px',
          }}>
            <a
              href="#packages"
              style={{
                background: '#e8531a',
                color: 'white',
                padding: '13px 28px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '14px',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'all 0.2s',
                display: 'block',
                boxSizing: 'border-box',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#c94415'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(232,83,26,0.35)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#e8531a'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              View Packages
            </a>
            
            <a
              href="#contact"
              style={{
                background: 'white',
                color: '#1d1d1f',
                padding: '13px 28px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none',
                border: '1px solid #d2d2d7',
                textAlign: 'center',
                transition: 'all 0.2s',
                display: 'block',
                boxSizing: 'border-box',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#e8531a'
                e.currentTarget.style.color = '#e8531a'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#d2d2d7'
                e.currentTarget.style.color = '#1d1d1f'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Stats 2x2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '12px',
        }}>
          {[
            { value: '50K+', label: 'Monthly Visitors' },
            { value: '8+', label: 'Cities Reached' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: '#fff8f5',
                border: '1.5px solid #e8531a',
                borderRadius: '16px',
                padding: isMobile ? '20px 14px' : '28px 20px',
                cursor: 'default',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = '#e8531a'
                el.style.transform = 'translateY(-3px)'
                el.style.boxShadow = '0 8px 24px rgba(232,83,26,0.25)'
                el.querySelectorAll('[data-val]').forEach((n: any) => n.style.color = 'white')
                el.querySelectorAll('[data-label]').forEach((n: any) => n.style.color = 'rgba(255,255,255,0.8)')
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = '#fff8f5'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
                el.querySelectorAll('[data-val]').forEach((n: any) => n.style.color = '#e8531a')
                el.querySelectorAll('[data-label]').forEach((n: any) => n.style.color = '#6e6e73')
              }}
            >
              <div data-val style={{
                fontSize: isMobile ? '32px' : '42px',
                fontWeight: '800',
                color: '#e8531a',
                letterSpacing: '-2px',
                lineHeight: 1,
                marginBottom: '8px',
                transition: 'color 0.2s',
              }}>
                {stat.value}
              </div>
              <div data-label style={{
                fontSize: '13px',
                color: '#6e6e73',
                fontWeight: '500',
                transition: 'color 0.2s',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY ADVERTISE */}
      <div style={{ background: '#f5f5f7', padding: isMobile ? '48px 16px' : '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '32px' : '60px',
            alignItems: 'center',
          }}>
            {/* Left - feature cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}>
              {[
                { Icon: IconTarget, title: 'Targeted Audience', desc: 'People actively looking to buy — not casual browsers.' },
                { Icon: IconMap, title: 'Nepal Focused', desc: '100% Nepal traffic across Kathmandu, Pokhara and beyond.' },
                { Icon: IconLayout, title: 'Multiple Formats', desc: 'Banners, featured listings, sponsored content and newsletters.' },
                { Icon: IconTag, title: 'Affordable Rates', desc: 'Flexible packages for dealerships, banks and auto brands.' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '14px',
                    padding: '18px',
                    transition: 'all 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#e8531a'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,83,26,0.12)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{
                    width: '36px', height: '36px',
                    background: '#fff8f5',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#e8531a',
                    marginBottom: '12px',
                  }}>
                    <item.Icon />
                  </div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1d1d1f',
                    marginBottom: '4px',
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#6e6e73',
                    lineHeight: 1.6,
                  }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Right - text */}
            <div>
              <div style={{
                display: 'inline-block',
                background: '#fff8f5',
                border: '1px solid #e8531a',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#e8531a',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '20px',
              }}>
                Why CarKinne
              </div>
              <h2 style={{
                fontSize: isMobile ? '28px' : '36px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: '0 0 20px',
                letterSpacing: '-1px',
                lineHeight: 1.2,
              }}>
                Why Advertise on CarKinne?
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#6e6e73',
                lineHeight: 1.8,
                margin: '0 0 16px',
              }}>
                People on CarKinne are actively 
                researching their next car purchase — 
                comparing prices, calculating EMI and 
                finding showrooms.
              </p>
              <p style={{
                fontSize: '16px',
                color: '#6e6e73',
                lineHeight: 1.8,
                margin: 0,
              }}>
                That means your ad reaches buyers 
                at exactly the right moment — when 
                they're ready to make a decision.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WHO IS IT FOR */}
      <div style={{ padding: isMobile ? '48px 16px' : '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: '#fff8f5',
            border: '1px solid #e8531a',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#e8531a',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px',
          }}>
            Who Is It For
          </div>
          <h2 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 8px',
            letterSpacing: '-1px',
          }}>
            Who Should Advertise?
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#6e6e73',
            margin: '0 0 40px',
          }}>
            Perfect for businesses targeting Nepal car buyers.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            {[
              { Icon: IconCar, title: 'Car Dealerships', desc: 'Promote your showroom, feature your inventory and drive footfall from active buyers.' },
              { Icon: IconBank, title: 'Banks & Finance', desc: 'Reach people calculating EMIs and comparing car loan rates — your ideal customers.' },
              { Icon: IconShield, title: 'Insurance Companies', desc: 'Connect with new car buyers at the exact moment they need vehicle insurance.' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '16px',
                  padding: '28px 24px',
                  transition: 'all 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#e8531a'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,83,26,0.12)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e5e5'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  width: '48px', height: '48px',
                  background: '#fff8f5',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e8531a',
                  marginBottom: '16px',
                }}>
                  <item.Icon />
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1d1d1f',
                  marginBottom: '8px',
                }}>
                  {item.title}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#6e6e73',
                  lineHeight: 1.7,
                }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PACKAGES */}
      <div id="packages" style={{
        background: '#f5f5f7',
        padding: isMobile ? '48px 16px' : '80px 24px',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: '#fff8f5',
            border: '1px solid #e8531a',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#e8531a',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px',
          }}>
            Packages
          </div>
          <h2 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 8px',
            letterSpacing: '-1px',
          }}>
            Advertising Packages
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#6e6e73',
            margin: '0 0 40px',
          }}>
            Simple, transparent pricing for every budget.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '16px',
            alignItems: 'start',
          }}>
            {[
              {
                name: 'Basic',
                price: 'Rs. 15,000',
                popular: false,
                features: [
                  'Homepage banner (300x250)',
                  '30 days placement',
                  '10,000+ impressions',
                ],
              },
              {
                name: 'Featured',
                price: 'Rs. 35,000',
                popular: true,
                features: [
                  'Homepage hero banner',
                  'Featured car listing (top)',
                  'Newsletter mention',
                  '25,000+ impressions',
                ],
              },
              {
                name: 'Premium',
                price: 'Rs. 75,000',
                popular: false,
                features: [
                  'All Featured benefits',
                  'Sponsored blog post',
                  'Social media mention',
                  'Dedicated landing page',
                  '60,000+ impressions',
                ],
              },
            ].map((pkg, i) => (
              <div
                key={i}
                style={{
                  background: pkg.popular ? '#fff8f5' : 'white',
                  border: pkg.popular
                    ? '2px solid #e8531a'
                    : '1px solid #e5e5e5',
                  borderRadius: '20px',
                  padding: '32px 28px',
                  position: 'relative',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = pkg.popular
                    ? '0 12px 32px rgba(232,83,26,0.3)'
                    : '0 12px 32px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {pkg.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-13px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#e8531a',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.5px',
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#1d1d1f',
                  marginBottom: '8px',
                  letterSpacing: '-0.5px',
                }}>
                  {pkg.name}
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <span style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#e8531a',
                    letterSpacing: '-1px',
                  }}>
                    {pkg.price}
                  </span>
                  <span style={{
                    fontSize: '13px',
                    color: '#6e6e73',
                    marginLeft: '4px',
                  }}>
                    /month
                  </span>
                </div>

                <div style={{
                  borderTop: '1px solid #fde8da',
                  paddingTop: '20px',
                  marginBottom: '24px',
                }}>
                  {pkg.features.map((f, j) => (
                    <div key={j} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '12px',
                      fontSize: '14px',
                      color: '#6e6e73',
                    }}>
                      <IconCheck />
                      {f}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, package: pkg.name }))
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  style={{
                    width: '100%',
                    background: pkg.popular ? '#e8531a' : 'white',
                    color: pkg.popular ? 'white' : '#1d1d1f',
                    border: pkg.popular ? 'none' : '1.5px solid #1d1d1f',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    if (pkg.popular) {
                      e.currentTarget.style.background = '#c94415'
                    } else {
                      e.currentTarget.style.background = '#1d1d1f'
                      e.currentTarget.style.color = 'white'
                    }
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    if (pkg.popular) {
                      e.currentTarget.style.background = '#e8531a'
                    } else {
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.color = '#1d1d1f'
                    }
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT FORM */}
      <div id="contact" style={{
        padding: isMobile ? '48px 16px' : '80px 24px',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: '#fff8f5',
            border: '1px solid #e8531a',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#e8531a',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px',
          }}>
            Get In Touch
          </div>
          <h2 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 8px',
            letterSpacing: '-1px',
          }}>
            Start Advertising Today
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#6e6e73',
            margin: '0 0 40px',
          }}>
            Fill out the form and we'll get back to you within 24 hours.
          </p>

          <div style={{
            background: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '20px',
            padding: isMobile ? '24px 16px' : '40px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '16px',
                marginBottom: '16px',
              }}>
                {[
                  { label: 'Full Name *', name: 'fullName', type: 'text', required: true },
                  { label: 'Company / Showroom *', name: 'company', type: 'text', required: true },
                  { label: 'Email *', name: 'email', type: 'email', required: true },
                  { label: 'Phone', name: 'phone', type: 'text', required: false },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1d1d1f',
                      marginBottom: '8px',
                    }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      required={field.required}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        border: '1px solid #d2d2d7',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                        fontFamily: 'inherit',
                      }}
                      onFocus={e => e.target.style.borderColor = '#e8531a'}
                      onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#1d1d1f',
                  marginBottom: '8px',
                }}>
                  Package Interest
                </label>
                <select
                  name="package"
                  value={formData.package}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: '1px solid #d2d2d7',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'white',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#e8531a'}
                  onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                >
                  <option value="Basic">Basic — Rs. 15,000/month</option>
                  <option value="Featured">Featured — Rs. 35,000/month</option>
                  <option value="Premium">Premium — Rs. 75,000/month</option>
                  <option value="Custom">Custom Package</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#1d1d1f',
                  marginBottom: '8px',
                }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your business and advertising goals..."
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: '1px solid #d2d2d7',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#e8531a'}
                  onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#e8531a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#c94415'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(232,83,26,0.35)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#e8531a'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Send Enquiry →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Advertise