"use client";

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { formatNPR } from '@/utils/format';
import CarCard from '@/components/CarCard';

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconMap = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
  </svg>
)
const IconPhone = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconZap = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)

const popularBrands = [
  { name: 'Suzuki', link: '/cars?brand=Suzuki', logo: 'https://www.carlogos.org/car-logos/suzuki-logo.png' },
  { name: 'Toyota', link: '/cars?brand=Toyota', logo: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
  { name: 'Hyundai', link: '/cars?brand=Hyundai', logo: 'https://www.carlogos.org/car-logos/hyundai-logo.png' },
  { name: 'Kia', link: '/cars?brand=Kia', logo: 'https://www.carlogos.org/car-logos/kia-logo.png' },
  { name: 'Honda', link: '/cars?brand=Honda', logo: 'https://www.carlogos.org/car-logos/honda-logo.png' },
  { name: 'MG', link: '/cars?brand=MG', logo: 'https://www.carlogos.org/car-logos/mg-logo.png' },
  { name: 'Tata', link: '/cars?brand=Tata', logo: 'https://www.carlogos.org/car-logos/tata-logo.png' },
  { name: 'BYD', link: '/cars?brand=BYD', logo: 'https://www.carlogos.org/car-logos/byd-logo.png' },
]

const quickFilters = [
  { label: 'Under 20L', path: '/cars?maxPrice=2000000' },
  { label: '20–40L', path: '/cars?minPrice=2000000&maxPrice=4000000' },
  { label: '40–60L', path: '/cars?minPrice=4000000&maxPrice=6000000' },
  { label: 'Electric', path: '/cars?fuel=Electric' },
  { label: 'SUV', path: '/cars?category=SUV' },
  { label: 'Sedan', path: '/cars?category=Sedan' },
]

function calcEMI(price: number, downPct: number, tenure: number, rate: number) {
  const loan = price * (1 - downPct / 100)
  const r = rate / 12 / 100
  const n = tenure * 12
  if (!r) return loan / n
  return (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

const Index = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredCars, setFeaturedCars] = useState<any[]>([])
  const [topShowrooms, setTopShowrooms] = useState<any[]>([])
  const [latestBlogPosts, setLatestBlogPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // EMI widget state
  const [carPrice, setCarPrice] = useState(3000000)
  const [downPct, setDownPct] = useState(10)
  const [tenure, setTenure] = useState(5)
  const [rate, setRate] = useState(10.5)
  const emi = calcEMI(carPrice, downPct, tenure, rate)

  // Hardcoded offers data
  const offers = [
    {
      id: '1',
      title: 'Free Showroom Listing — Full Year',
      description: 'List your showroom on CarKinne completely free for 12 months. Get your brand in front of thousands of Nepal car buyers.',
      valid_until: '2025-12-31',
      tag: 'Showrooms',
      image_url: '/og-cover.png',
    },
    {
      id: '2',
      title: '70% Off Banner Advertising',
      description: 'Promote your dealership with a featured banner on CarKinne at 70% off. High-visibility placements across the site.',
      valid_until: '2025-11-30',
      tag: 'Advertising',
      image_url: '/og-cover.png',
    },
    {
      id: '3',
      title: 'Launch Special — Free Featured Car Ads',
      description: 'Get your car listings featured at the top of CarKinne search results for free during our launch period.',
      valid_until: '2025-10-31',
      tag: 'Featured Ads',
      image_url: '/og-cover.png',
    },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetchFeaturedCars()
    fetchTopShowrooms()
    fetchLatestBlogPosts()
  }, [])

  const fetchFeaturedCars = async () => {
    try {
      setLoading(true)
      const { data } = await supabase.from('cars').select('*').eq('is_featured', true).limit(6)
      setFeaturedCars(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTopShowrooms = async () => {
    try {
      const { data } = await supabase.from('showrooms').select('*').eq('is_featured', true).limit(4)
      setTopShowrooms(data || [])
    } catch (err) { console.error(err) }
  }

  const fetchLatestBlogPosts = async () => {
    try {
      const { data } = await supabase.from('blog_posts').select('*')
        .eq('is_published', true).order('published_at', { ascending: false }).limit(3)
      setLatestBlogPosts(data || [])
    } catch (err) { console.error(err) }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/cars?search=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      minHeight: '100vh',
      background: 'white',
    }}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .brand-logo {
          filter: grayscale(100%) opacity(45%");
          transition: filter 0.3s ease;
          cursor: pointer;
        }
        .brand-logo:hover {
          filter: grayscale(0%) opacity(100%");
        }
      `}</style>

      {/* ━━━━━━━━━━ HERO ━━━━━━━━━━ */}
      <section style={{
        position: 'relative',
        height: isMobile ? '80vh' : '75vh',
        backgroundImage: 'url(https://pbktycczurhclouptznf.supabase.co/storage/v1/object/public/web-images/carkinne-hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'local',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'relative', zIndex: 10,
          padding: isMobile ? '0 20px' : '0 80px',
          maxWidth: '640px',
        }}>
          {/* Label */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '12px', marginBottom: '16px',
          }}>
            <div style={{ width: '32px', height: '2px', background: 'white' }} />
            <span style={{
              color: 'white',
              fontSize: '11px', fontWeight: '600',
              textTransform: 'uppercase', letterSpacing: '2px',
            }}>
              Nepal's Smartest Car Buying Guide
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            color: 'white',
            fontSize: isMobile ? '48px' : '72px',
            fontWeight: '800',
            letterSpacing: '-2px',
            lineHeight: 1,
            margin: '16px 0 8px',
            textShadow: '0 2px 12px rgba(0,0,0,0.2)',
          }}>
            Find Your Perfect Car in Nepal
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: isMobile ? '14px' : '17px',
            margin: '0 0 24px',
          }}>
            Compare prices, calculate EMI, find showrooms
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '6px',
            display: 'flex',
            maxWidth: '540px',
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <div style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', color: '#999',
                pointerEvents: 'none',
              }}>
                <IconSearch />
              </div>
              <input
                type="text"
                placeholder="Search by brand, model..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', border: 'none', outline: 'none',
                  padding: '10px 10px 10px 36px',
                  fontSize: '14px',
                  background: 'transparent',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box' as const,
                }}
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute', right: '10px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', color: '#999', cursor: 'pointer',
                  }}>
                  <IconX />
                </button>
              )}
            </div>
            <button type="submit" style={{
              background: '#e8531a', color: 'white',
              border: 'none', borderRadius: '8px',
              padding: '10px 20px', fontSize: '13px',
              fontWeight: '700', cursor: 'pointer',
              transition: 'background 0.2s',
              fontFamily: 'inherit',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#c94415'}
              onMouseLeave={e => e.currentTarget.style.background = '#e8531a'}
            >
              Search
            </button>
          </form>

          {/* Stats */}
          <div style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '12px',
            margin: '12px 0 14px',
          }}>
            150+ Cars · 50+ Showrooms · Updated Monthly
          </div>

          {/* Quick filter pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {quickFilters.map((f, i) => (
              <button key={i} onClick={() => navigate(f.path)}
                style={{
                  padding: '6px 14px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '20px',
                  fontSize: '11px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = '#1d1d1f'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.color = 'white'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ BRAND CAROUSEL ━━━━━━━━━━ */}
      <section style={{
        background: 'white',
        padding: '20px 0 24px',
      }}>
        <div style={{ padding: '0 24px', marginBottom: '16px' }}>
          <h2 style={{
            fontSize: '13px', fontWeight: '700',
            color: '#6e6e73', textTransform: 'uppercase',
            letterSpacing: '1px', margin: 0,
          }}>
            Popular Brands
          </h2>
        </div>
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <div style={{
            display: 'flex',
            width: 'max-content',
            animation: 'marquee 30s linear infinite',
          }}>
            {[...popularBrands, ...popularBrands, ...popularBrands, ...popularBrands].map((brand, i) => (
              <Link to={brand.link} key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '120px',
                height: '56px',
                flexShrink: 0,
                padding: '8px 16px',
                textDecoration: 'none',
              }}>
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="brand-logo"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                  onError={e => {
                    const t = e.target as HTMLImageElement
                    t.style.display = 'none'
                    const d = document.createElement('div')
                    d.style.cssText = 'font-weight:700;color:#1d1d1f;font-size:12px'
                    d.textContent = brand.name
                    t.parentElement?.appendChild(d)
                  }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ FEATURED CARS ━━━━━━━━━━ */}
      <section style={{
        background: '#f5f5f7',
        padding: isMobile ? '32px 16px' : '56px 24px',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: '24px',
            flexWrap: 'wrap', gap: '12px',
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                background: '#fff8f5', border: '1px solid #e8531a',
                borderRadius: '6px', padding: '4px 12px',
                fontSize: '12px', fontWeight: '700',
                color: '#e8531a', textTransform: 'uppercase',
                letterSpacing: '1px', marginBottom: '8px',
              }}>
                FEATURED
              </div>
              <h2 style={{
                fontSize: isMobile ? '22px' : '30px',
                fontWeight: '800', color: '#1d1d1f',
                margin: 0, letterSpacing: '-0.5px',
              }}>
                Featured Cars
              </h2>
            </div>
            <button onClick={() => navigate('/cars')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'none', border: 'none',
                fontSize: '13px', fontWeight: '700',
                color: '#e8531a', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
              View All <IconArrow />
            </button>
          </div>

          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: '16px',
                  overflow: 'hidden', border: '1px solid #e5e5e5',
                }}>
                  <div style={{ height: '180px', background: '#f0f0f0' }} />
                  <div style={{ padding: '14px' }}>
                    <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', width: '70%' }} />
                    <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '4px', width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {featuredCars.map(car => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━━━━━━ BUDGET FINDER CTA ━━━━━━━━━━ */}
      <section style={{
        background: 'white',
        padding: isMobile ? '32px 16px' : '56px 24px',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '24px' : '40px',
            alignItems: 'center',
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                background: '#fff8f5', border: '1px solid #e8531a',
                borderRadius: '6px', padding: '4px 12px',
                fontSize: '12px', fontWeight: '700',
                color: '#e8531a', textTransform: 'uppercase',
                letterSpacing: '1px', marginBottom: '12px',
              }}>
                BUDGET FINDER
              </div>
              <h2 style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: '800', color: '#1d1d1f',
                margin: '0 0 12px',
              }}>
                Not sure what to buy?
              </h2>
              <p style={{
                color: '#6e6e73', fontSize: '14px',
                lineHeight: 1.7, margin: '0 0 24px',
              }}>
                Answer 4 quick questions and we'll match you with the best cars within your budget.
              </p>
              <button
                onClick={() => navigate('/budget-finder')}
                style={{
                  background: '#1d1d1f', color: 'white',
                  border: 'none', borderRadius: '10px',
                  padding: '12px 28px', fontSize: '14px',
                  fontWeight: '700', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#e8531a'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#1d1d1f'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Find My Car
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}>
              {[
                "Tell us your budget",
                "Share how you'll use it",
                "Pick your preferences",
                "Get matched instantly"
              ].map((text, i) => (
                <div
                  key={i}
                  style={{
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    transition: 'all 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#e8531a';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(232,83,26,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '7px',
                    height: '7px',
                    background: '#e8531a',
                    borderRadius: '50%',
                    marginBottom: '8px',
                  }} />
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1d1d1f',
                  }}>
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ EMI CALCULATOR ━━━━━━━━━━ */}
      <section style={{
        background: '#f5f5f7',
        padding: isMobile ? '32px 16px' : '56px 24px',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            border: '1px solid #e5e5e5',
            padding: isMobile ? '24px 20px' : '36px 40px',
          }}>
            <div style={{
              display: 'inline-block',
              background: '#fff8f5', border: '1px solid #e8531a',
              borderRadius: '6px', padding: '4px 12px',
              fontSize: '12px', fontWeight: '700',
              color: '#e8531a', textTransform: 'uppercase',
              letterSpacing: '1px', marginBottom: '12px',
            }}>
              EMI CALCULATOR
            </div>
            <h2 style={{
              fontSize: isMobile ? '22px' : '30px',
              fontWeight: '800', color: '#1d1d1f',
              margin: '8px 0 28px',
            }}>
              Calculate Your Monthly EMI
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '16px',
            }}>
              {[
                { label: 'Car Price (Rs.)', value: carPrice, setter: setCarPrice, min: 500000, max: 15000000, step: 100000 },
                { label: `Down Payment — ${downPct}%`, value: downPct, setter: setDownPct, min: 10, max: 50, step: 5 },
                { label: `Loan Tenure — ${tenure} years`, value: tenure, setter: setTenure, min: 1, max: 7, step: 1 },
                { label: `Interest Rate — ${rate}%`, value: rate, setter: setRate, min: 8, max: 18, step: 0.25 },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{
                    fontSize: '11px', fontWeight: '700',
                    color: '#6e6e73', textTransform: 'uppercase',
                    letterSpacing: '1px', marginBottom: '6px',
                  }}>
                    {item.label}
                  </div>
                  <input
                    type="range"
                    min={item.min} max={item.max}
                    step={item.step} value={item.value}
                    onChange={e => item.setter(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#e8531a' }}
                  />
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '24px',
              background: '#fff8f5',
              border: '1px solid #fde8da',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center' as const,
            }}>
              <div style={{
                fontSize: '12px', fontWeight: '700',
                color: '#6e6e73', textTransform: 'uppercase',
                letterSpacing: '1px', marginBottom: '8px',
              }}>
                Monthly EMI
              </div>
              <div style={{
                fontSize: isMobile ? '28px' : '36px',
                fontWeight: '800', color: '#e8531a',
                margin: '0 0 8px',
              }}>
                {formatNPR(Math.round(emi))}
              </div>
              <div style={{ fontSize: '14px', color: '#6e6e73', marginBottom: '16px' }}>
                /month
              </div>
              <button
                onClick={() => navigate('/emi-calculator')}
                style={{
                  color: '#e8531a', fontSize: '13px',
                  fontWeight: '700', background: 'none',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Open Full Calculator →
              </button>
              <div style={{
                background: '#f5f5f7',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '10px 14px',
                marginTop: '14px',
                fontSize: '11px',
                color: '#6e6e73',
                textAlign: 'center',
                lineHeight: 1.6,
              }}>
                EMI figures are estimates only. Actual rates and terms may vary by bank. Consult your lender for accurate calculations.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ LATEST OFFERS ━━━━━━━━━━ */}
      <section style={{
        background: 'white',
        padding: isMobile ? '32px 16px' : '56px 24px',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: '24px',
            flexWrap: 'wrap', gap: '12px',
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                background: '#fff8f5', border: '1px solid #e8531a',
                borderRadius: '6px', padding: '4px 12px',
                fontSize: '12px', fontWeight: '700',
                color: '#e8531a', textTransform: 'uppercase',
                letterSpacing: '1px', marginBottom: '8px',
              }}>
                OFFERS
              </div>
              <h2 style={{
                fontSize: isMobile ? '22px' : '30px',
                fontWeight: '800', color: '#1d1d1f',
                margin: 0, letterSpacing: '-0.5px',
              }}>
                Latest Offers
              </h2>
            </div>
            <button onClick={() => navigate('/offers')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'none', border: 'none',
                fontSize: '13px', fontWeight: '700',
                color: '#e8531a', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
              View All <IconArrow />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '16px',
          }}>
            {offers.map(offer => (
              <div
                key={offer.id}
                style={{
                  background: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#e8531a'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,83,26,0.12)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e5e5'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onClick={() => navigate('/offers')}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute', top: '12px', left: '12px',
                    background: '#e8531a', color: 'white',
                    fontSize: '10px', fontWeight: '700',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    padding: '4px 10px', borderRadius: '100px',
                  }}>
                    {offer.tag}
                  </span>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{
                    fontSize: '15px', fontWeight: '700',
                    color: '#1d1d1f', marginBottom: '4px',
                  }}>
                    {offer.title}
                  </div>
                  <div style={{
                    fontSize: '13px', color: '#6e6e73',
                    marginBottom: '8px',
                  }}>
                    {offer.description}
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontSize: '11px', color: '#6e6e73',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      <IconCalendar />
                      Valid until {new Date(offer.valid_until).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span style={{
                      fontSize: '12px', fontWeight: '600',
                      color: '#e8531a', display: 'flex',
                      alignItems: 'center', gap: '4px',
                    }}>
                      View Offer <IconArrow />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ TOP SHOWROOMS ━━━━━━━━━━ */}
      <section style={{
        background: '#f5f5f7',
        padding: isMobile ? '32px 16px' : '56px 24px',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: '24px',
            flexWrap: 'wrap', gap: '12px',
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                background: '#fff8f5', border: '1px solid #e8531a',
                borderRadius: '6px', padding: '4px 12px',
                fontSize: '12px', fontWeight: '700',
                color: '#e8531a', textTransform: 'uppercase',
                letterSpacing: '1px', marginBottom: '8px',
              }}>
                SHOWROOMS
              </div>
              <h2 style={{
                fontSize: isMobile ? '22px' : '30px',
                fontWeight: '800', color: '#1d1d1f',
                margin: 0, letterSpacing: '-0.5px',
              }}>
                Top Showrooms
              </h2>
            </div>
            <button onClick={() => navigate('/showrooms')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'none', border: 'none',
                fontSize: '13px', fontWeight: '700',
                color: '#e8531a', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
              View All <IconArrow />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '16px',
          }}>
            {topShowrooms.map(showroom => (
              <div
                key={showroom.id}
                style={{
                  background: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '16px',
                  padding: '20px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
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
                  display: 'flex', alignItems: 'center',
                  gap: '12px', marginBottom: '14px',
                }}>
                  <div style={{
                    width: '42px', height: '42px',
                    borderRadius: '12px',
                    background: '#fff8f5',
                    border: '1px solid #fde8da',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px', fontWeight: '800',
                    color: '#e8531a', flexShrink: 0,
                  }}>
                    {showroom.brand?.charAt(0)}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '14px', fontWeight: '700',
                      color: '#1d1d1f', lineHeight: 1.3,
                    }}>
                      {showroom.name}
                    </div>
                    <div style={{
                      fontSize: '12px', color: '#e8531a',
                      fontWeight: '600',
                    }}>
                      {showroom.brand}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex', flexDirection: 'column' as const,
                  gap: '6px', marginBottom: '16px',
                }}>
                  <div style={{
                    fontSize: '12px', color: '#6e6e73',
                    display: 'flex', alignItems: 'flex-start', gap: '6px',
                  }}>
                    <span style={{ color: '#e8531a', marginTop: '1px', flexShrink: 0 }}>
                      <IconMap />
                    </span>
                    {showroom.address}, {showroom.city}
                  </div>
                  <div style={{
                    fontSize: '12px', color: '#6e6e73',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <span style={{ color: '#e8531a', flexShrink: 0 }}>
                      <IconPhone />
                    </span>
                    {showroom.phone}
                  </div>
                </div>

                <a
                  href={showroom.google_maps_url || `https://maps.google.com/?q=${showroom.name}+${showroom.city}+Nepal`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: '6px', fontSize: '12px',
                    fontWeight: '700', color: '#e8531a',
                    textDecoration: 'none',
                    transition: 'gap 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                  onMouseLeave={e => e.currentTarget.style.gap = '6px'}
                >
                  Get Directions <IconArrow />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ LATEST BLOG ━━━━━━━━━━ */}
      <section style={{
        background: 'white',
        padding: isMobile ? '32px 16px' : '56px 24px',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: '24px',
            flexWrap: 'wrap', gap: '12px',
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                background: '#fff8f5', border: '1px solid #e8531a',
                borderRadius: '6px', padding: '4px 12px',
                fontSize: '12px', fontWeight: '700',
                color: '#e8531a', textTransform: 'uppercase',
                letterSpacing: '1px', marginBottom: '8px',
              }}>
                BLOG
              </div>
              <h2 style={{
                fontSize: isMobile ? '22px' : '30px',
                fontWeight: '800', color: '#1d1d1f',
                margin: 0, letterSpacing: '-0.5px',
              }}>
                Latest from Blog
              </h2>
            </div>
            <button onClick={() => navigate('/blog')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'none', border: 'none',
                fontSize: '13px', fontWeight: '700',
                color: '#e8531a', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
              View All <IconArrow />
            </button>
          </div>

          {latestBlogPosts.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '16px',
            }}>
              {latestBlogPosts.map(post => (
                <div
                  key={post.id}
                  style={{
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#e8531a'
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,83,26,0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  <img
                    src={post.cover_image || 'https://placehold.co/400x220/f5f5f7/6e6e73?text=Blog'}
                    alt={post.title}
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '18px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: '700',
                      color: '#e8531a', textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {post.category || 'General'}
                    </span>
                    <h3 style={{
                      fontSize: '15px', fontWeight: '700',
                      color: '#1d1d1f', margin: '6px 0 6px',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}>
                      {post.title}
                    </h3>
                    <p style={{
                      fontSize: '13px', color: '#6e6e73',
                      margin: '0 0 14px', lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}>
                      {post.excerpt}
                    </p>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{
                        fontSize: '11px', color: '#6e6e73',
                        display: 'flex', alignItems: 'center', gap: '4px',
                      }}>
                        <IconCalendar />
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                      <span style={{
                        fontSize: '12px', fontWeight: '700',
                        color: '#e8531a', display: 'flex',
                        alignItems: 'center', gap: '4px',
                      }}>
                        Read More <IconArrow />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'white', borderRadius: '16px',
              padding: '48px', textAlign: 'center',
              border: '1px solid #e5e5e5',
            }}>
              <p style={{ color: '#6e6e73', fontSize: '14px', margin: 0 }}>
                Blog posts coming soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━━━━━━ BOTTOM CTA ━━━━━━━━━━ */}
      <section style={{
        background: '#fff8f5',
        padding: isMobile ? '32px 20px' : '56px 24px',
        textAlign: 'center' as const,
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(232,83,26,0.15)',
            border: '1px solid rgba(232,83,26,0.3)',
            borderRadius: '6px', padding: '4px 14px',
            fontSize: '12px', fontWeight: '700',
            color: '#e8531a', textTransform: 'uppercase',
            letterSpacing: '1px', marginBottom: '20px',
          }}>
            <IconZap /> Electric Nepal
          </div>
          <h2 style={{
            fontSize: isMobile ? '24px' : '36px',
            fontWeight: '800', color: '#1d1d1f',
            margin: '0 0 12px',
          }}>
            Going Electric?
          </h2>
          <p style={{
            fontSize: '14px', color: '#6e6e73',
            margin: '0 0 28px', lineHeight: 1.6,
          }}>
            Explore Nepal's best electric vehicles and find
            charging stations near you.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/electric-cars')}
              style={{
                background: '#e8531a', color: 'white',
                border: 'none', borderRadius: '12px',
                padding: '14px 28px', fontSize: '14px',
                fontWeight: '700', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#c94415'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#e8531a'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Browse EVs <IconArrow />
            </button>
            <button
              onClick={() => navigate('/ev-charging')}
              style={{
                background: '#e8531a', color: 'white',
                border: '1px solid #e8531a',
                borderRadius: '12px', padding: '14px 28px',
                fontSize: '14px', fontWeight: '700',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#c94415'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#e8531a'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Charging Map <IconArrow />
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Index