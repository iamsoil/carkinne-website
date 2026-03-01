"use client";

import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'white', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
    }}>

      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 50%, #1a1a1a 100%)',
        padding: '100px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
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
            letterSpacing: '-1px',
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
            We're making car buying in Nepal transparent, 
            simple, and stress-free for every Nepali.
          </p>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ background: '#e8531a', padding: '32px 24px' }}>
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
                letterSpacing: '-1px',
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

      {/* MISSION - keep as is */}
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
            letterSpacing: '-0.5px',
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
            }}>
              <div style={{
                width: '44px', height: '44px',
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
                width: '8px', height: '8px',
                background: '#e8531a',
                borderRadius: '50%',
                flexShrink: 0,
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES - same layout as mission */}
      <div style={{ background: '#f5f5f7', padding: '80px 24px' }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center',
        }}>
          {/* Features list on left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '💰', title: 'Real Prices', desc: 'Up-to-date ex-showroom & on-road prices', link: '/cars' },
              { icon: '🧮', title: 'EMI Calculator', desc: 'Monthly payments with real Nepal bank rates', link: '/emi-calculator' },
              { icon: '📍', title: 'Showroom Finder', desc: 'Interactive map to find dealers near you', link: '/showrooms' },
              { icon: '⚖️', title: 'Car Comparison', desc: 'Compare specs and prices side by side', link: '/cars' },
              { icon: '📖', title: 'Expert Guides', desc: 'Buying guides written for Nepal market', link: '/blog' },
              { icon: '⚡', title: 'EV Charging', desc: 'Find EV charging stations near you', link: '/ev-charging' },
            ].map((item, i) => (
              <Link key={i} to={item.link} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '14px',
                padding: '14px 18px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: '40px', height: '40px',
                  background: '#fff8f5',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
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
                <span style={{
                  fontSize: '13px',
                  color: '#e8531a',
                  fontWeight: '600',
                  flexShrink: 0,
                }}>→</span>
              </Link>
            ))}
          </div>

          {/* Text on right */}
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
              Features
            </div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#1d1d1f',
              margin: '0 0 20px',
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
            }}>
              Everything You Need to Buy Smart
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6e6e73',
              lineHeight: 1.8,
              margin: '0 0 16px',
            }}>
              From browsing prices to finding showrooms and 
              calculating EMI — CarKinne has every tool a 
              Nepali car buyer needs.
            </p>
            <p style={{
              fontSize: '16px',
              color: '#6e6e73',
              lineHeight: 1.8,
              margin: 0,
            }}>
              All features are free, updated regularly and 
              built specifically for the Nepal market.
            </p>
          </div>
        </div>
      </div>

      {/* TEAM - simple left aligned */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '80px 24px',
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
          marginBottom: '20px',
        }}>
          Our Team
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#1d1d1f',
              margin: '0 0 20px',
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
            }}>
              Built in Nepal 🇳🇵<br />for Nepal
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6e6e73',
              lineHeight: 1.8,
              margin: '0 0 16px',
            }}>
              We are car enthusiasts and tech builders 
              based in Kathmandu who got tired of the 
              confusion in Nepal's car market.
            </p>
            <p style={{
              fontSize: '16px',
              color: '#6e6e73',
              lineHeight: 1.8,
              margin: 0,
            }}>
              So we built the resource we always 
              wished existed — transparent, accurate 
              and always free.
            </p>
          </div>

          <div style={{
            background: '#f5f5f7',
            borderRadius: '20px',
            padding: '36px',
            border: '1px solid #e5e5e5',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
            }}>
              <div style={{
                width: '60px', height: '60px',
                background: '#e8531a',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '800',
                color: 'white',
                flexShrink: 0,
              }}>
                CK
              </div>
              <div>
                <div style={{
                  fontSize: '18px',
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
              '🚗 Car data researchers',
              '💻 Tech builders',
              '📊 Market analysts',
              '🇳🇵 Nepal focused',
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 0',
                borderBottom: i < 3 ? '1px solid #e5e5e5' : 'none',
                fontSize: '14px',
                color: '#1d1d1f',
                fontWeight: '500',
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT - simple left aligned */}
      <div style={{ background: '#f5f5f7', padding: '80px 24px' }}>
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
            marginBottom: '20px',
          }}>
            Contact
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            alignItems: 'flex-start',
          }}>
            <div>
              <h2 style={{
                fontSize: '36px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: '0 0 20px',
                lineHeight: 1.2,
                letterSpacing: '-0.5px',
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
                gap: '16px',
              }}>
                {[
                  { icon: '✉️', label: 'General Enquiries', email: 'hello@carkinne.com' },
                  { icon: '📢', label: 'Advertising', email: 'ads@carkinne.com' },
                  { icon: '📋', label: 'Data & Listings', email: 'data@carkinne.com' },
                ].map((item, i) => (
                  <a key={i} href={`mailto:${item.email}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    textDecoration: 'none',
                  }}>
                    <span style={{ fontSize: '24px' }}>{item.icon}</span>
                    <div>
                      <div style={{
                        fontSize: '12px',
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
                    }}>→</span>
                  </a>
                ))}
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #1d1d1f, #2d2d2f)',
              borderRadius: '20px',
              padding: '40px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: '-40px', right: '-40px',
                width: '150px', height: '150px',
                background: 'rgba(232,83,26,0.2)',
                borderRadius: '50%',
              }} />
              <h3 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: 'white',
                margin: '0 0 12px',
                position: 'relative',
                letterSpacing: '-0.5px',
              }}>
                Advertise With Us
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.7,
                margin: '0 0 28px',
                position: 'relative',
              }}>
                Reach thousands of active car buyers 
                in Nepal. List your showroom, promote 
                your brand or feature your models.
              </p>
              {[
                '✅ Showroom listings',
                '✅ Brand promotions',
                '✅ Featured car placements',
                '✅ Banner advertising',
              ].map((item, i) => (
                <div key={i} style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: '8px',
                  position: 'relative',
                }}>
                  {item}
                </div>
              ))}
              <Link to="/advertise" style={{
                display: 'inline-block',
                background: '#e8531a',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none',
                marginTop: '24px',
                position: 'relative',
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