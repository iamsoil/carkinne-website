"use client";

import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'sans-serif' }}>

      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 50%, #1a1a1a 100%)',
        padding: '100px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px',
          background: 'rgba(232,83,26,0.15)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '200px', height: '200px',
          background: 'rgba(232,83,26,0.1)',
          borderRadius: '50%',
        }} />

        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
          {/* Logo badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(232,83,26,0.2)',
            border: '1px solid rgba(232,83,26,0.4)',
            borderRadius: '50px',
            padding: '8px 20px',
            marginBottom: '28px',
          }}>
            <div style={{
              width: '28px', height: '28px',
              background: '#e8531a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '800',
              color: 'white',
            }}>CK</div>
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.8)',
            }}>
              CarKinne — Built in Nepal
            </span>
          </div>

          <h1 style={{
            fontSize: '52px',
            fontWeight: '800',
            color: 'white',
            margin: '0 0 20px',
            lineHeight: 1.15,
          }}>
            Nepal's Smartest<br />
            <span style={{ color: '#e8531a' }}>Car Buying Guide</span>
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
            margin: 0,
          }}>
            We're making car buying in Nepal transparent, simple,
            and stress-free for every Nepali.
          </p>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{
        background: '#e8531a',
        padding: '32px 24px',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          textAlign: 'center',
        }}>
          {[
            { value: '50+', label: 'Cars Listed' },
            { value: '9+', label: 'Top Brands' },
            { value: '8+', label: 'Cities Covered' },
            { value: '19+', label: 'Showrooms' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{
                fontSize: '32px',
                fontWeight: '800',
                color: 'white',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.8)',
                marginTop: '4px',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MISSION */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '80px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
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
          }}>
            Solving Nepal's Car Buying Problem
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6e6e73',
            lineHeight: 1.8,
            margin: '0 0 16px',
          }}>
            Buying a car in Nepal is confusing. Prices are scattered,
            information is outdated, and there's no single trusted
            source to compare options.
          </p>
          <p style={{
            fontSize: '16px',
            color: '#6e6e73',
            lineHeight: 1.8,
            margin: 0,
          }}>
            We built CarKinne to change that — real prices, honest
            comparisons, EMI calculators, showroom locations and
            expert guides all in one place.
          </p>

          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '32px',
            flexWrap: 'wrap',
          }}>
            <Link to="/cars" style={{
              background: '#e8531a',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none',
            }}>
              Browse Cars →
            </Link>
            <Link to="/advertise" style={{
              background: 'white',
              color: '#1d1d1f',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none',
              border: '1px solid #d2d2d7',
            }}>
              Partner With Us
            </Link>
          </div>
        </div>

        {/* Visual card stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { icon: '🚗', title: 'Real Nepal Prices', desc: 'Ex-showroom & on-road prices updated regularly' },
            { icon: '⚡', title: 'EV Coverage', desc: 'Complete electric vehicle listings for Nepal' },
            { icon: '🗺️', title: 'Find Showrooms', desc: 'Interactive map of all authorized dealers' },
            { icon: '📊', title: 'EMI Calculator', desc: 'Calculate monthly payments with Nepal bank rates' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '14px',
              padding: '16px 20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: '#fff8f5',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
              }}>
                {item.icon}
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
                width: '8px',
                height: '8px',
                background: '#e8531a',
                borderRadius: '50%',
                flexShrink: 0,
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* WHAT WE OFFER */}
      <div style={{
        background: '#f5f5f7',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
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
              marginBottom: '16px',
            }}>
              Features
            </div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#1d1d1f',
              margin: 0,
            }}>
              Everything You Need
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}>
            {[
              { icon: '💰', title: 'Real Prices', desc: 'Up-to-date ex-showroom and on-road prices for Nepal market', link: '/cars' },
              { icon: '🧮', title: 'EMI Calculator', desc: 'Calculate monthly payments with real Nepal bank rates', link: '/emi-calculator' },
              { icon: '📖', title: 'Expert Guides', desc: 'In-depth buying guides written for the Nepal market', link: '/blog' },
              { icon: '📍', title: 'Showroom Finder', desc: 'Interactive map to find authorized dealers near you', link: '/showrooms' },
              { icon: '⚡', title: 'EV Coverage', desc: 'Complete electric vehicle coverage for Nepal', link: '/ev-cars' },
              { icon: '⚖️', title: 'Car Comparison', desc: 'Compare specs and prices side by side', link: '/cars' },
            ].map((item, i) => (
              <Link key={i} to={item.link} style={{
                background: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '16px',
                padding: '24px',
                textDecoration: 'none',
                display: 'block',
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#fff8f5',
                  border: '1px solid #fde8da',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  marginBottom: '16px',
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#1d1d1f',
                  marginBottom: '6px',
                }}>
                  {item.title}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#6e6e73',
                  lineHeight: 1.6,
                }}>
                  {item.desc}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#e8531a',
                  fontWeight: '600',
                  marginTop: '12px',
                }}>
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* TEAM */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
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
          marginBottom: '16px',
        }}>
          Our Team
        </div>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '800',
          color: '#1d1d1f',
          margin: '0 0 16px',
        }}>
          Built in Nepal, for Nepal 🇳🇵
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#6e6e73',
          lineHeight: 1.7,
          maxWidth: '500px',
          margin: '0 auto 48px',
        }}>
          A team of car enthusiasts and tech builders based
          in Kathmandu, dedicated to making Nepal's car
          market more transparent.
        </p>

        <div style={{
          background: 'linear-gradient(135deg, #1d1d1f, #2d2d2f)',
          borderRadius: '24px',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '150px', height: '150px',
            background: 'rgba(232,83,26,0.2)',
            borderRadius: '50%',
          }} />
          <div style={{
            width: '80px',
            height: '80px',
            background: '#e8531a',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '28px',
            fontWeight: '800',
            color: 'white',
            position: 'relative',
          }}>
            CK
          </div>
          <h3 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 8px',
          }}>
            CarKinne Team
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#e8531a',
            fontWeight: '600',
            margin: '0 0 16px',
          }}>
            Kathmandu, Nepal 🇳🇵
          </p>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
            maxWidth: '400px',
            margin: '0 auto',
          }}>
            We are car enthusiasts and builders who got tired of
            the confusion in Nepal's car market. So we built
            the resource we always wished existed.
          </p>
        </div>
      </div>

      {/* CONTACT */}
      <div style={{
        background: '#f5f5f7',
        padding: '80px 24px',
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
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
            marginBottom: '16px',
          }}>
            Contact
          </div>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 16px',
          }}>
            Get In Touch
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6e6e73',
            margin: '0 auto 48px',
            maxWidth: '500px',
            lineHeight: 1.7,
          }}>
            Questions, feedback or partnership enquiries?
            We'd love to hear from you.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '40px',
          }}>
            {[
              { icon: '✉️', label: 'General', email: 'hello@carkinne.com' },
              { icon: '📢', label: 'Advertising', email: 'ads@carkinne.com' },
              { icon: '📋', label: 'Data & Listings', email: 'data@carkinne.com' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '16px',
                padding: '24px',
              }}>
                <div style={{
                  fontSize: '28px',
                  marginBottom: '12px',
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6e6e73',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                }}>
                  {item.label}
                </div>
                <a href={`mailto:${item.email}`} style={{
                  fontSize: '13px',
                  color: '#e8531a',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}>
                  {item.email}
                </a>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <a href="mailto:hello@carkinne.com" style={{
              background: 'white',
              border: '1px solid #d2d2d7',
              color: '#1d1d1f',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none',
            }}>
              ✉️ Send Email
            </a>
            <Link to="/advertise" style={{
              background: '#e8531a',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none',
            }}>
              📢 Advertise With Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;