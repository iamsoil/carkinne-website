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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

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

  const brands = ['All', ...Array.from(new Set(electricCars.map(c => c.brand))).filter(Boolean).sort()]

  const filteredCars = electricCars
    .filter(car => {
      const matchSearch =
        car.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.variant?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchBrand = selectedBrand === 'All' || car.brand === selectedBrand
      return matchSearch && matchBrand
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.ex_showroom_price || 0) - (b.ex_showroom_price || 0)
        case 'price-high':
          return (b.ex_showroom_price || 0) - (a.ex_showroom_price || 0)
        case 'range':
          return (b.battery_range_km || 0) - (a.battery_range_km || 0)
        case 'featured':
        default:
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
      }
    })

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      background: 'white',
      minHeight: '100vh',
      overflow: 'hidden',
    }}>
      <style>{`
        .ev-sidebar::-webkit-scrollbar { display: none; }
      `}</style>

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

      {/* NEW TWO-COLUMN LAYOUT */}
      <div style={{ background: 'white', padding: isMobile ? '24px 16px' : '40px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '240px 1fr',
            gap: '24px',
            alignItems: 'start',
          }}>

            {/* LEFT SIDEBAR */}
            <div className="ev-sidebar" style={{
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '16px',
              position: isMobile ? 'relative' : 'sticky',
              top: isMobile ? 'auto' : '24px',
              maxHeight: isMobile ? 'none' : 'calc(100vh - 48px)',
              overflowY: isMobile ? 'visible' : 'auto',
              scrollbarWidth: 'none' as const,
            }}>

              {/* Filter Panel */}
              <div style={{
                background: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '16px',
                overflow: 'hidden',
              }}>
                {/* Filter header */}
                <div style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{
                    fontSize: '13px', fontWeight: '700',
                    color: '#1d1d1f',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="6" x2="20" y2="6"/>
                      <line x1="8" y1="12" x2="16" y2="12"/>
                      <line x1="11" y1="18" x2="13" y2="18"/>
                    </svg>
                    Filters
                  </div>
                  {(searchQuery || selectedBrand !== 'All') && (
                    <button
                      onClick={() => { setSearchQuery(''); setSelectedBrand('All'); setSortBy('featured') }}
                      style={{
                        background: 'none', border: 'none',
                        fontSize: '12px', color: '#e8531a',
                        fontWeight: '600', cursor: 'pointer',
                        padding: 0, fontFamily: 'inherit',
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Search */}
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{
                    fontSize: '11px', fontWeight: '700',
                    color: '#6e6e73', textTransform: 'uppercase',
                    letterSpacing: '1px', marginBottom: '8px',
                  }}>
                    Search
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: '8px', top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#999', pointerEvents: 'none',
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search EVs..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 8px 7px 26px',
                        border: '1px solid #d2d2d7',
                        borderRadius: '8px',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box' as const,
                        fontFamily: 'inherit',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#e8531a'}
                      onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                    />
                  </div>
                </div>

                {/* Brand */}
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{
                    fontSize: '11px', fontWeight: '700',
                    color: '#6e6e73', textTransform: 'uppercase',
                    letterSpacing: '1px', marginBottom: '8px',
                  }}>
                    Brand
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                    {brands.map(brand => (
                      <label
                        key={brand}
                        style={{
                          display: 'flex', alignItems: 'center',
                          gap: '8px', cursor: 'pointer',
                          fontSize: '12px',
                          color: selectedBrand === brand ? '#e8531a' : '#1d1d1f',
                          fontWeight: selectedBrand === brand ? '700' : '400',
                        }}
                      >
                        <input
                          type="radio"
                          name="brand"
                          checked={selectedBrand === brand}
                          onChange={() => setSelectedBrand(brand)}
                          style={{ accentColor: '#e8531a' }}
                        />
                        {brand === 'All' ? 'All Brands' : brand}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div style={{ padding: '12px 14px' }}>
                  <div style={{
                    fontSize: '11px', fontWeight: '700',
                    color: '#6e6e73', textTransform: 'uppercase',
                    letterSpacing: '1px', marginBottom: '8px',
                  }}>
                    Sort By
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                    {[
                      { value: 'featured', label: 'Featured' },
                      { value: 'price-low', label: 'Price: Low to High' },
                      { value: 'price-high', label: 'Price: High to Low' },
                      { value: 'range', label: 'Best Range' },
                    ].map(opt => (
                      <label
                        key={opt.value}
                        style={{
                          display: 'flex', alignItems: 'center',
                          gap: '8px', cursor: 'pointer',
                          fontSize: '12px',
                          color: sortBy === opt.value ? '#e8531a' : '#1d1d1f',
                          fontWeight: sortBy === opt.value ? '700' : '400',
                        }}
                      >
                        <input
                          type="radio"
                          name="sort"
                          checked={sortBy === opt.value}
                          onChange={() => setSortBy(opt.value)}
                          style={{ accentColor: '#e8531a' }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Charging Guide - compact */}
              <div style={{
                background: '#f5f5f7',
                border: '1px solid #e5e5e5',
                borderRadius: '16px',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #e5e5e5',
                }}>
                  <div style={{
                    fontSize: '13px', fontWeight: '700',
                    color: '#1d1d1f',
                  }}>
                    Charging Guide
                  </div>
                </div>
                {[
                  { Icon: IconHome, title: 'Home Charging', desc: 'Full charge in 8–12 hrs overnight' },
                  { Icon: IconMap, title: 'Public Stations', desc: 'Available in major Nepal cities' },
                  { Icon: IconClock, title: 'Fast DC Charging', desc: '30–60 mins at public stations' },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '10px 14px',
                    borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                  }}>
                    <div style={{
                      width: '28px', height: '28px',
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
                        fontSize: '11px', color: '#6e6e73', lineHeight: 1.4,
                      }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Find Charging Stations CTA */}
              <div style={{
                background: '#fff8f5',
                border: '1.5px solid #e8531a',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center' as const,
                position: isMobile ? 'relative' : 'sticky',
                bottom: isMobile ? 'auto' : '0',
                marginTop: 'auto',
              }}>
                <div style={{
                  width: '40px', height: '40px',
                  background: '#e8531a',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  margin: '0 auto 10px',
                }}>
                  <IconMap />
                </div>
                <div style={{
                  fontSize: '13px', fontWeight: '700',
                  color: '#1d1d1f', marginBottom: '4px',
                }}>
                  Find Charging Stations
                </div>
                <div style={{
                  fontSize: '11px', color: '#6e6e73',
                  marginBottom: '12px', lineHeight: 1.5,
                }}>
                  Interactive map of all EV charging points across Nepal
                </div>
                <button
                  onClick={() => navigate('/ev-charging')}
                  style={{
                    width: '100%',
                    background: '#e8531a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#c94415'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#e8531a'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  View Charging Map →
                </button>
              </div>

            </div>

            {/* RIGHT - CAR GRID */}
            <div>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
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
                    marginBottom: '6px',
                  }}>
                    Browse
                  </div>
                  <h2 style={{
                    fontSize: isMobile ? '22px' : '26px',
                    fontWeight: '800',
                    color: '#1d1d1f',
                    margin: 0,
                    letterSpacing: '-0.5px',
                  }}>
                    Electric Cars
                  </h2>
                </div>
                <div style={{
                  fontSize: '13px', color: '#6e6e73', fontWeight: '500',
                }}>
                  {loading ? 'Loading...' : `${filteredCars.length} of ${electricCars.length} cars`}
                </div>
              </div>

              {/* Cars */}
              {loading ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '16px',
                }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} style={{
                      background: 'white', borderRadius: '16px',
                      overflow: 'hidden', border: '1px solid #e5e5e5',
                    }}>
                      <div style={{ height: '160px', background: '#f0f0f0' }} />
                      <div style={{ padding: '14px' }}>
                        <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', width: '70%' }} />
                        <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '4px', width: '40%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredCars.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '16px',
                }}>
                  {filteredCars.map(car => (
                    <CarCard key={car.id} {...car} />
                  ))}
                </div>
              ) : (searchQuery || selectedBrand !== 'All') ? (
                <div style={{
                  background: '#f5f5f7', borderRadius: '16px',
                  padding: '48px 24px', textAlign: 'center',
                  border: '1px solid #e5e5e5',
                }}>
                  <h3 style={{
                    fontSize: '16px', fontWeight: '700',
                    color: '#1d1d1f', margin: '0 0 8px',
                  }}>
                    No cars match your search
                  </h3>
                  <p style={{
                    fontSize: '13px', color: '#6e6e73',
                    margin: '0 0 16px',
                  }}>
                    Try a different brand or search term
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedBrand('All') }}
                    style={{
                      background: '#e8531a', color: 'white',
                      border: 'none', borderRadius: '8px',
                      padding: '10px 20px', fontSize: '13px',
                      fontWeight: '600', cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div style={{
                  background: '#f5f5f7', borderRadius: '16px',
                  padding: '48px 24px', textAlign: 'center',
                  border: '1px solid #e5e5e5',
                }}>
                  <h3 style={{
                    fontSize: '16px', fontWeight: '700',
                    color: '#1d1d1f', margin: '0 0 8px',
                  }}>
                    No electric cars yet
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6e6e73', margin: 0 }}>
                    Electric car listings coming soon.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default ElectricCars