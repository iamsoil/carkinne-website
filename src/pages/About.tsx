"use client";

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const IconCar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v7a2 2 0 01-2 2h-1"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    <path d="M13 5h-2v4h4.5"/>
  </svg>
)

const IconCalc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="8" y2="10" strokeLinecap="round"/>
    <line x1="12" y1="10" x2="12" y2="10" strokeLinecap="round"/>
    <line x1="16" y1="10" x2="16" y2="10" strokeLinecap="round"/>
    <line x1="8" y1="14" x2="8" y2="14" strokeLinecap="round"/>
    <line x1="12" y1="14" x2="12" y2="14" strokeLinecap="round"/>
    <line x1="16" y1="14" x2="16" y2="14" strokeLinecap="round"/>
    <line x1="8" y1="18" x2="16" y2="18" strokeLinecap="round"/>
  </svg>
)

const IconMap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
)

const IconCompare = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
  </svg>
)

const IconBlog = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
)

const IconBolt = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const IconMegaphone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 11l19-9-9 19-2-8-8-2z"/>
  </svg>
)

const IconClipboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>
)

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8531a" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconCode = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
)

const IconChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)

const IconFlag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
    <line x1="4" y1="22" x2="4" y2="15"/>
  </svg>
)

const About = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
    }}>

      {/* HERO */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: isMobile ? '48px 16px' : '80px 24px 60px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '32px' : '60px',
        alignItems: 'center',
      }}>
        {/* Left - text */}
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
            About CarKinne
          </div>

          <h1 style={{
            fontSize: isMobile ? '38px' : '52px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 20px',
            lineHeight: 1.1,
            letterSpacing: '-2px',
          }}>
            Nepal's Smartest
            <span style={{ color: '#e8531a' }}> Car</span>
            <br />Buying Guide
          </h1>

          <p style={{
            fontSize: '17px',
            color: '#6e6e73',
            lineHeight: 1.7,
            margin: '0 0 36px',
          }}>
            We're making car buying in Nepal 
            transparent, simple and stress-free 
            for every Nepali.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '10px',
          }}>
            <Link to="/cars"
              style={{
                background: '#e8531a',
                color: 'white',
                padding: '13px 28px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '14px',
                textDecoration: 'none',
                width: isMobile ? '100%' : undefined,
                textAlign: isMobile ? 'center' : undefined,
                display: isMobile ? 'block' : 'inline-block',
                transition: 'all 0.2s',
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
              Browse Cars
            </Link>

            <Link to="/advertise"
              style={{
                background: 'white',
                color: '#1d1d1f',
                padding: '13px 28px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none',
                border: '1px solid #d2d2d7',
                width: isMobile ? '100%' : undefined,
                textAlign: isMobile ? 'center' : undefined,
                display: isMobile ? 'block' : 'inline-block',
                transition: 'all 0.2s',
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
              Partner With Us
            </Link>
          </div>
        </div>

        {/* Right - 2x2 stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}>
          {[
            { value: '50+', label: 'Cars Listed' },
            { value: '9+', label: 'Top Brands' },
            { value: '8+', label: 'Cities Covered' },
            { value: '19+', label: 'Showrooms' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: '#fff8f5',
                border: '1.5px solid #e8531a',
                borderRadius: '16px',
                padding: isMobile ? '20px 14px' : '28px 20px',
                textAlign: 'left',
                cursor: 'default',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = '#e8531a'
                el.style.transform = 'translateY(-3px)'
                el.style.boxShadow = '0 8px 24px rgba(232,83,26,0.25)'
                el.querySelectorAll('[data-stat-value]').forEach((n: any) => n.style.color = 'white')
                el.querySelectorAll('[data-stat-label]').forEach((n: any) => n.style.color = 'rgba(255,255,255,0.8)')
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = '#fff8f5'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
                el.querySelectorAll('[data-stat-value]').forEach((n: any) => n.style.color = '#e8531a')
                el.querySelectorAll('[data-stat-label]').forEach((n: any) => n.style.color = '#6e6e73')
              }}
            >
              <div
                data-stat-value
                style={{
                  fontSize: isMobile ? '32px' : '42px',
                  fontWeight: '800',
                  color: '#e8531a',
                  letterSpacing: '-2px',
                  lineHeight: 1,
                  marginBottom: '8px',
                  transition: 'color 0.2s',
                }}
              >
                {stat.value}
              </div>
              <div
                data-stat-label
                style={{
                  fontSize: '13px',
                  color: '#6e6e73',
                  fontWeight: '500',
                  transition: 'color 0.2s',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MISSION */}
      <div style={{ background: '#f5f5f7' }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: isMobile ? '48px 16px' : '80px 24px',
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
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: '700',
              color: '#e8531a',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '20px',
            }}>
              Our Mission
            </div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#1d1d1f',
              margin: '0 0 20px',
              lineHeight: 1.2,
              letterSpacing: '-1px',
            }}>
              Solving Nepal's Car Buying Problem
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6e6e73',
              lineHeight: 1.8,
              margin: '0 0 16px',
            }}>
              Buying a car in Nepal is confusing. Prices are
              scattered, information is outdated, and there's
              no single trusted source to compare options.
            </p>
            <p style={{
              fontSize: '16px',
              color: '#6e6e73',
              lineHeight: 1.8,
              margin: 0,
            }}>
              We built CarKinne to change that — real prices,
              honest comparisons, EMI calculators, showroom
              locations and expert guides all in one place.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { Icon: IconCar, title: 'Real Nepal Prices', desc: 'Ex-showroom & on-road prices updated regularly' },
              { Icon: IconBolt, title: 'EV Coverage', desc: 'Complete electric vehicle listings for Nepal' },
              { Icon: IconMap, title: 'Find Showrooms', desc: 'Interactive map of all authorized dealers' },
              { Icon: IconCalc, title: 'EMI Calculator', desc: 'Calculate monthly payments with Nepal bank rates' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                background: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '14px 18px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: '40px', height: '40px',
                  background: '#fff8f5',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e8531a',
                  flexShrink: 0,
                }}>
                  <item.Icon />
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#1d1d1f',
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6e6e73',
                    marginTop: '2px',
                  }}>
                    {item.desc}
                  </div>
                </div>
                <div style={{
                  marginLeft: 'auto',
                  width: '8px', height: '8px',
                  background: '#e8531a',
                  borderRadius: '50%',
                  flexShrink: 0,
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES - small cards left aligned */}
      <div style={{ background: 'white', padding: isMobile ? '48px 16px' : '80px 24px' }}>
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
            Features
          </div>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 8px',
            letterSpacing: '-1px',
          }}>
            Everything You Need
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#6e6e73',
            margin: '0 0 40px',
          }}>
            Built for the Nepal car market, completely free.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            {[
              { Icon: IconCar, title: 'Real Prices', desc: 'Ex-showroom & on-road prices', link: '/cars' },
              { Icon: IconCalc, title: 'EMI Calculator', desc: 'Nepal bank rate calculations', link: '/emi-calculator' },
              { Icon: IconMap, title: 'Showroom Finder', desc: 'Find dealers near you', link: '/showrooms' },
              { Icon: IconCompare, title: 'Car Comparison', desc: 'Compare specs side by side', link: '/cars' },
              { Icon: IconBlog, title: 'Expert Guides', desc: 'Nepal car buying guides', link: '/blog' },
              { Icon: IconBolt, title: 'EV Charging', desc: 'Find charging stations', link: '/ev-charging' },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.link}
                style={{
                  display: 'block',
                  background: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '14px',
                  padding: isMobile ? '14px' : '20px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#e8531a'
                  el.style.boxShadow = '0 4px 16px rgba(232,83,26,0.12)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#e5e5e5'
                  el.style.boxShadow = 'none'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  width: isMobile ? '34px' : '40px',
                  height: isMobile ? '34px' : '40px',
                  background: '#fff8f5',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e8531a',
                  marginBottom: '14px',
                }}>
                  <item.Icon />
                </div>
                <div style={{
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: '700',
                  color: '#1d1d1f',
                  marginBottom: '4px',
                }}>
                  {item.title}
                </div>
                <div style={{
                  fontSize: isMobile ? '11px' : '12px',
                  color: '#6e6e73',
                  lineHeight: 1.5,
                  marginBottom: '12px',
                }}>
                  {item.desc}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#e8531a',
                  fontWeight: '700',
                }}>
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* TEAM - simple */}
      <div style={{ background: '#f5f5f7' }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: isMobile ? '48px 16px' : '80px 24px',
        }}>
          <div style={{
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
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#e8531a',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '20px',
              }}>
                Our Team
              </div>
              <h2 style={{
                fontSize: '36px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: '0 0 20px',
                lineHeight: 1.2,
                letterSpacing: '-1px',
              }}>
                Built in Nepal for Nepal
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#6e6e73',
                lineHeight: 1.8,
                margin: '0 0 16px',
              }}>
                We are car enthusiasts and tech builders based
                in Kathmandu who got tired of the confusion in
                Nepal's car market.
              </p>
              <p style={{
                fontSize: '16px',
                color: '#6e6e73',
                lineHeight: 1.8,
                margin: 0,
              }}>
                So we built the resource we always wished
                existed — transparent, accurate and free.
              </p>
            </div>

            <div style={{
              background: '#f5f5f7',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #e5e5e5',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: '1px solid #e5e5e5',
              }}>
                <div style={{
                  width: '52px', height: '52px',
                  background: '#e8531a',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '800',
                  color: 'white',
                  flexShrink: 0,
                }}>
                  CK
                </div>
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1d1d1f',
                  }}>
                    CarKinne Team
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#e8531a',
                    fontWeight: '600',
                    marginTop: '2px',
                  }}>
                    Kathmandu, Nepal
                  </div>
                </div>
              </div>

              {[
                { Icon: IconCar, label: 'Car data researchers' },
                { Icon: IconCode, label: 'Tech builders' },
                { Icon: IconChart, label: 'Market analysts' },
                { Icon: IconFlag, label: 'Nepal focused' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 0',
                  borderBottom: i < 3 ? '1px solid #e5e5e5' : 'none',
                  fontSize: '14px',
                  color: '#1d1d1f',
                  fontWeight: '500',
                }}>
                  <div style={{ color: '#e8531a' }}>
                    <item.Icon />
                  </div>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div style={{ background: 'white', padding: isMobile ? '48px 16px' : '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '32px' : '60px',
            alignItems: 'flex-start',
          }}>
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
                Contact
              </div>
              <h2 style={{
                fontSize: '36px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: '0 0 16px',
                letterSpacing: '-1px',
              }}>
                Get In Touch
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#6e6e73',
                lineHeight: 1.8,
                margin: '0 0 32px',
              }}>
                Questions, feedback or partnership
                enquiries? We'd love to hear from you.
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                {[
                  { Icon: IconMail, label: 'General Enquiries', email: 'hello@carkinne.com' },
                  { Icon: IconMegaphone, label: 'Advertising', email: 'ads@carkinne.com' },
                  { Icon: IconClipboard, label: 'Data & Listings', email: 'data@carkinne.com' },
                ].map((item, i) => (
                  <a key={i} href={`mailto:${item.email}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#e8531a'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
                  >
                    <div style={{
                      width: '38px', height: '38px',
                      background: '#fff8f5',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#e8531a',
                      flexShrink: 0,
                    }}>
                      <item.Icon />
                    </div>
                    <div>
                      <div style={{
                        fontSize: '11px',
                        color: '#6e6e73',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#e8531a',
                        fontWeight: '600',
                        marginTop: '2px',
                      }}>
                        {item.email}
                      </div>
                    </div>
                    <span style={{
                      marginLeft: 'auto',
                      color: '#e8531a',
                      fontSize: '16px',
                      fontWeight: '700',
                    }}>→</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Advertise - orange tinted */}
            <div style={{
              background: '#fff8f5',
              border: '1.5px solid #e8531a',
              borderRadius: '20px',
              padding: '36px',
            }}>
              <div style={{
                width: '44px', height: '44px',
                background: '#e8531a',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                marginBottom: '20px',
              }}>
                <IconMegaphone />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: '0 0 12px',
                letterSpacing: '-0.5px',
              }}>
                Advertise With Us
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6e6e73',
                lineHeight: 1.7,
                margin: '0 0 24px',
              }}>
                Reach thousands of active car buyers in Nepal.
                List your showroom, promote your brand or
                feature your models.
              </p>

              {[
                'Showroom listings',
                'Brand promotions',
                'Featured car placements',
                'Banner advertising',
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  color: '#1d1d1f',
                  fontWeight: '500',
                  marginBottom: '10px',
                }}>
                  <IconCheck />
                  {item}
                </div>
              ))}

              <Link to="/advertise" style={{
                display: 'inline-block',
                background: '#e8531a',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '14px',
                textDecoration: 'none',
                marginTop: '20px',
                width: isMobile ? '100%' : undefined,
                textAlign: isMobile ? 'center' : undefined,
              }}>
                View Advertising Options →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;