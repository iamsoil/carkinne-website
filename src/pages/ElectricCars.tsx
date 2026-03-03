"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import CarCard from '@/components/CarCard';

const IconLeaf = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 8C8 10 5.9 16.17 3.82 19.34a1 1 0 00.96 1.49 1 1 0 00.87-.5C6.49 18.31 8.5 16 12 16c4 0 8-2 8-8 0 0-1 0-3 0z"/>
    <path d="M3 22c0-4 2-8 8-10"/>
  </svg>
)

const IconZap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)

const IconBattery = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="6" width="18" height="12" rx="2"/>
    <line x1="23" y1="13" x2="23" y2="11"/>
    <line x1="5" y1="10" x2="5" y2="14"/>
    <line x1="9" y1="10" x2="9" y2="14"/>
  </svg>
)

const IconTag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const IconTruck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 4v4h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

const IconMap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
)

const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

const ElectricCars = () => {
  const navigate = useNavigate()
  const [electricCars, setElectricCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetchElectricCars()
  }, [])

  const fetchElectricCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('fuel_type', 'Electric')
        .order('created_at', { ascending: false })
      if (error) throw error
      setElectricCars(data || [])
    } catch (err) {
      console.error('Error fetching electric cars:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      background: 'white',
      minHeight: '100vh',
    }}>

      {/* HERO */}
      <div style={{
        background: 'white',
        padding: isMobile ? '32px 16px 24px' : '48px 24px 32px',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fff8f5',
            border: '1px solid #e8531a',
            borderRadius: '6px',
            padding: '4px 14px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#e8531a',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '16px',
          }}>
            <IconZap />
            Electric Vehicles
          </div>

          <h1 style={{
            fontSize: isMobile ? '26px' : '38px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 20px',
            lineHeight: 1.1,
            letterSpacing: '-1px',
          }}>
            Electric Cars
            <span style={{ color: '#e8531a' }}> in Nepal</span>
          </h1>

          <p style={{
            fontSize: isMobile ? '13px' : '15px',
            color: '#6e6e73',
            lineHeight: 1.7,
            margin: '0 0 0px',
            maxWidth: '520px',
          }}>
            Discover the future of driving with zero emissions,
            lower running costs and cutting-edge technology —
            built for Nepal's roads.
          </p>
        </div>
      </div>

      {/* COMBINED WHY EV + INCENTIVES */}
      <div style={{ background: '#f5f5f7', padding: isMobile ? '20px 16px' : '24px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '24px',
            alignItems: 'start',
          }}>

            {/* Left - Why Electric */}
            <div>
              <div style={{
                display: 'inline-block',
                background: '#fff8f5',
                border: '1px solid #e8531a',
                borderRadius: '6px',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#e8531a',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
              }}>
                Why Electric
              </div>
              <h2 style={{
                fontSize: '15px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: '0 0 12px',
                letterSpacing: '-0.3px',
              }}>
                Why Choose an Electric Car?
              </h2>
              <div style={{
                display: 'flex',
                flexDirection: 'column' as const,
                gap: '8px',
              }}>
                {[
                  { Icon: IconLeaf, title: 'Zero Emissions', desc: 'No harmful emissions, cleaner air across Nepal.' },
                  { Icon: IconZap, title: 'Lower Running Costs', desc: 'Electricity is far cheaper than petrol in Nepal.' },
                  { Icon: IconBattery, title: 'Advanced Technology', desc: 'Instant torque, smart features, superior driving.' },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'white',
                      border: '1px solid #e5e5e5',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#e8531a'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(232,83,26,0.1)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e5e5e5'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{
                      width: '30px', height: '30px',
                      background: '#fff8f5',
                      borderRadius: '8px',
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
                        fontSize: '12px', fontWeight: '700',
                        color: '#1d1d1f', marginBottom: '2px',
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        fontSize: '11px', color: '#6e6e73', lineHeight: 1.5,
                      }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Government Incentives */}
            <div>
              <div style={{
                display: 'inline-block',
                background: '#fff8f5',
                border: '1px solid #e8531a',
                borderRadius: '6px',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#e8531a',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
              }}>
                Government Policy
              </div>
              <h2 style={{
                fontSize: '15px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: '0 0 12px',
                letterSpacing: '-0.3px',
              }}>
                Government Incentives for EVs
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}>
                {[
                  { Icon: IconTag, title: 'Tax Benefits', desc: 'Reduced customs duty and VAT on EVs' },
                  { Icon: IconShield, title: 'Subsidies', desc: 'Government subsidies for EV purchases' },
                  { Icon: IconMap, title: 'Charging Infrastructure', desc: 'Expanding public charging stations' },
                  { Icon: IconTruck, title: 'Import Facilitation', desc: 'Streamlined import procedures for EVs' },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'white',
                      border: '1px solid #e5e5e5',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      transition: 'all 0.2s',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#e8531a'
                      e.currentTarget.style.background = '#fff8f5'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e5e5e5'
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={{
                      width: '28px', height: '28px',
                      background: '#fff8f5',
                      borderRadius: '7px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#e8531a',
                      marginBottom: '8px',
                    }}>
                      <item.Icon />
                    </div>
                    <div style={{
                      fontSize: '11px', fontWeight: '700',
                      color: '#1d1d1f', marginBottom: '2px',
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontSize: '10px', color: '#6e6e73', lineHeight: 1.5,
                    }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* AVAILABLE ELECTRIC CARS */}
      <div style={{ background: 'white', padding: isMobile ? '48px 16px' : '64px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '12px',
            marginBottom: '32px',
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
                marginBottom: '8px',
              }}>
                Browse
              </div>
              <h2 style={{
                fontSize: isMobile ? '26px' : '32px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: 0,
                letterSpacing: '-1px',
              }}>
                Available Electric Cars
              </h2>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6e6e73',
              fontWeight: '500',
            }}>
              {loading ? 'Loading...' : `${electricCars.length} models available`}
            </div>
          </div>

          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '16px',
            }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e5e5e5',
                }}>
                  <div style={{ height: '180px', background: '#f0f0f0' }} />
                  <div style={{ padding: '16px' }}>
                    <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', width: '70%' }} />
                    <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '4px', width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : electricCars.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : 'repeat(3, 1fr)',
              gap: '16px',
            }}>
              {electricCars.map(car => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>
          ) : (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '60px 24px',
              textAlign: 'center',
              border: '1px solid #e5e5e5',
            }}>
              <div style={{
                width: '56px', height: '56px',
                background: '#fff8f5',
                border: '1px solid #fde8da',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e8531a',
                margin: '0 auto 16px',
              }}>
                <IconZap />
              </div>
              <h3 style={{
                fontSize: '16px', fontWeight: '700',
                color: '#1d1d1f', margin: '0 0 8px',
              }}>
                No electric cars yet
              </h3>
              <p style={{ fontSize: '14px', color: '#6e6e73', margin: 0 }}>
                Electric car listings coming soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CHARGING YOUR EV */}
      <div style={{ padding: isMobile ? '48px 16px' : '64px 24px' }}>
        <div style={{ background: '#f5f5f7', padding: isMobile ? '48px 16px' : '64px 24px' }}>
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
              Charging Guide
            </div>
            <h2 style={{
              fontSize: isMobile ? '26px' : '32px',
              fontWeight: '800',
              color: '#1d1d1f',
              margin: '0 0 32px',
              letterSpacing: '-1px',
            }}>
              Charging Your EV in Nepal
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '40px',
            }}>
              {[
                {
                  Icon: IconHome,
                  title: 'Home Charging',
                  points: [
                    'Use standard 16A power outlet',
                    'Full charge in 8–12 hours',
                    'Ideal for overnight charging',
                    'Lowest cost per km',
                  ],
                },
                {
                  Icon: IconMap,
                  title: 'Public Charging',
                  points: [
                    'Available in major cities',
                    'NEA, MG, BYD, Tata stations',
                    'CCS2 and CHAdeMO connectors',
                    'Growing network across Nepal',
                  ],
                },
                {
                  Icon: IconClock,
                  title: 'Charging Time',
                  points: [
                    'Fast DC: 30–60 minutes',
                    'AC public: 3–5 hours',
                    'Home AC: 8–12 hours',
                    'Depends on battery size',
                  ],
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '16px',
                    padding: '24px',
                    transition: 'all 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#e8531a'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(232,83,26,0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px',
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
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#1d1d1f',
                    margin: '0 0 14px',
                  }}>
                    {item.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column' as const,
                    gap: '8px',
                  }}>
                    {item.points.map((point, j) => (
                      <div key={j} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        color: '#6e6e73',
                      }}>
                        <div style={{
                          width: '5px', height: '5px',
                          background: '#e8531a',
                          borderRadius: '50%',
                          flexShrink: 0,
                        }} />
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{
              background: '#fff8f5',
              border: '1.5px solid #e8531a',
              borderRadius: '16px',
              padding: isMobile ? '24px' : '32px 40px',
              display: 'flex',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '20px',
            }}>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#1d1d1f',
                  margin: '0 0 6px',
                  letterSpacing: '-0.5px',
                }}>
                  Find Charging Stations Near You
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6e6e73',
                  margin: 0,
                }}>
                  Interactive map of all EV charging points across Nepal
                </p>
              </div>
              <button
                onClick={() => navigate('/ev-charging')}
                style={{
                  background: '#e8531a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px 28px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  flexShrink: 0,
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
                View Charging Map
                <IconArrow />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ElectricCars