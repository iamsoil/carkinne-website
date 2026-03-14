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
  const [heroLoaded, setHeroLoaded] = useState(false)

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
      valid_until: '2026-12-31',
      tag: 'Showrooms',
      image_url: 'https://pbktycczurhclouptznf.supabase.co/storage/v1/object/public/offer-image/freelist-offer.png',
    },
    {
      id: '2',
      title: '70% Off Banner Advertising',
      description: 'Promote your dealership with a featured banner on CarKinne at 70% off. High-visibility placements across the site.',
      valid_until: '2026-11-30',
      tag: 'Advertising',
      image_url: 'https://pbktycczurhclouptznf.supabase.co/storage/v1/object/public/offer-image/placement-sale.png',
    },
    {
      id: '3',
      title: 'Launch Special — Free Featured Car Ads',
      description: 'Get your car listings featured at the top of CarKinne search results for free during our launch period.',
      valid_until: '2026-10-31',
      tag: 'Featured Ads',
      image_url: 'https://pbktycczurhclouptznf.supabase.co/storage/v1/object/public/offer-image/featured-offer.png',
    },
  ];

  const HERO_PLACEHOLDER = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAUAC4DASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAQFBgMC/8QAJhAAAgIBBAIBBQAAAAAAAAAAAQIDBAUSITFBURMiMlJhgf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDd1mozW7kqxSqVoyuW25Pl+jn9Gs1inFjMlHUlkdGkb4pGbfbb7NTpXDPGvJb2kl5JZXMkjSSSNzMxJJJP5k30Suw4+vJNzMFj55XMkjl+WJJJJJ/JoA//2Q=='

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
          filter: grayscale(100%) opacity(45%);
          transition: filter 0.3s ease;
          cursor: pointer;
        }
        .brand-logo:hover {
          filter: grayscale(0%) opacity(100%);
        }
      `}</style>

      {/* ━━━━━━━━━━ HERO ━━━━━━━━━━ */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: isMobile ? '100vh' : '100vh',
        overflow: 'hidden',
      }}>
        {/* Blurred placeholder — always visible */}
        <img
          src={HERO_PLACEHOLDER}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'blur(20px)',
            transform: 'scale(1.1)', // prevents blur edges showing
            opacity: heroLoaded ? 0 : 1,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Real hero image */}
        <img
          src="https://pbktycczurhclouptznf.supabase.co/storage/v1/object/public/web-images/carkinne-hero.png"
          alt="CarKinne Hero"
          onLoad={() => setHeroLoaded(true)}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: heroLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Hero content — always on top and visible immediately */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          padding: isMobile ? '0 20px' : '0 80px',
          maxWidth: '640px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center',
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
              background: '#e8531a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '0 20px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ━━━━━━━━━━ QUICK FILTERS ━━━━━━━━━━ */}
      <section style={{ padding: isMobile ? '24px 16px' : '40px 24px', background: '#f5f5f7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '12px', marginBottom: '16px',
          }}>
            <div style={{ width: '24px', height: '2px', background: '#e8531a' }} />
            <span style={{
              color: '#e8531a',
              fontSize: '11px', fontWeight: '600',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              Quick Filters
            </span>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            {quickFilters.map((filter, i) => (
              <Link
                key={i}
                to={filter.path}
                style={{
                  background: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '20px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#1d1d1f',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#e8531a'
                  e.currentTarget.style.color = '#e8531a'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e5e5'
                  e.currentTarget.style.color = '#1d1d1f'
                }}
              >
                {filter.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ FEATURED CARS ━━━━━━━━━━ */}
      <section style={{ padding: isMobile ? '32px 16px' : '60px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: isMobile ? '24px' : '32px',
          }}>
            <div>
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: '12px', marginBottom: '8px',
              }}>
                <div style={{ width: '24px', height: '2px', background: '#e8531a' }} />
                <span style={{
                  color: '#e8531a',
                  fontSize: '11px', fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  Featured Cars
                </span>
              </div>
              <h2 style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: 0,
                letterSpacing: '-1px',
              }}>
                Popular in Nepal
              </h2>
            </div>
            <Link to="/cars" style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#e8531a',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              View All <IconArrow />
            </Link>
          </div>

          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '20px',
            }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                  background: 'white',
                  borderRadius: '16px',
                  border: '1px solid #e5e5e5',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '180px',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }} />
                  <div style={{ padding: '16px' }}>
                    <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', width: '70%' }} />
                    <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '16px', width: '40%' }} />
                    <div style={{ height: '24px', background: '#f0f0f0', borderRadius: '4px', width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '20px',
            }}>
              {featuredCars.map(car => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━━━━━━ EMI CALCULATOR ━━━━━━━━━━ */}
      <section style={{
        background: '#fff8f5',
        padding: isMobile ? '32px 16px' : '60px 24px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '12px', marginBottom: '16px',
          }}>
            <div style={{ width: '24px', height: '2px', background: '#e8531a' }} />
            <span style={{
              color: '#e8531a',
              fontSize: '11px', fontWeight: '600',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              EMI Calculator
            </span>
          </div>

          <h2 style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 8px',
            letterSpacing: '-1px',
          }}>
            Calculate Your Monthly Payment
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#6e6e73',
            margin: '0 0 32px',
          }}>
            See how much your monthly car payment would be with real Nepal bank rates
          </p>

          <div style={{
            background: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '20px',
            padding: isMobile ? '20px' : '32px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '32px',
          }}>
            {/* Inputs */}
            <div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6e6e73',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                }}>
                  Car Price
                </label>
                <input
                  type="number"
                  value={carPrice}
                  onChange={e => setCarPrice(Number(e.target.value))}
                  style={{
                    width: '100%',
                    border: '1px solid #d2d2d7',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box' as const,
                  }}
                  onFocus={e => e.target.style.borderColor = '#e8531a'}
                  onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                />
                <p style={{ fontSize: '13px', color: '#6e6e73', marginTop: '6px' }}>
                  {carPrice > 0 ? formatNPR(carPrice) : 'Enter amount above'}
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6e6e73',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                }}>
                  Down Payment
                </label>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                  <input
                    type="number"
                    value={Math.round(carPrice * downPct / 100)}
                    onChange={e => {
                      const amount = Number(e.target.value)
                      if (carPrice > 0) setDownPct(Math.round((amount / carPrice) * 100))
                    }}
                    style={{
                      flex: 1,
                      border: '1px solid #d2d2d7',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box' as const,
                    }}
                    onFocus={e => e.target.style.borderColor = '#e8531a'}
                    onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                  />
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min={10} max={50}
                      value={downPct}
                      onChange={e => setDownPct(Number(e.target.value))}
                      style={{
                        width: '80px',
                        border: '1px solid #d2d2d7',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '16px',
                        outline: 'none',
                        boxSizing: 'border-box' as const,
                      }}
                      onFocus={e => e.target.style.borderColor = '#e8531a'}
                      onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                    />
                    <span style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)', color: '#6e6e73',
                    }}>
                      %
                    </span>
                  </div>
                </div>
                <input
                  type="range" min={10} max={50} value={downPct}
                  onChange={e => setDownPct(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#e8531a' }}
                />
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '12px', color: '#6e6e73', marginTop: '4px',
                }}>
                  <span>10%</span><span>50%</span>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6e6e73',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                }}>
                  Loan Tenure
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4, 5, 6, 7].map(yr => (
                    <button
                      key={yr}
                      onClick={() => setTenure(yr)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '100px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: tenure === yr ? '#e8531a' : '#d2d2d7',
                        background: tenure === yr ? '#e8531a' : '#fff',
                        color: tenure === yr ? '#fff' : '#1d1d1f',
                        transition: 'all 0.2s',
                        fontFamily: 'inherit',
                      }}
                    >
                      {yr}yr
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6e6e73',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                }}>
                  Interest Rate
                </label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => setRate(r => Math.max(8, Math.round((r - 0.25) * 100) / 100))}
                    style={{
                      width: '40px', height: '44px',
                      border: '1px solid #d2d2d7',
                      borderRadius: '8px 0 0 8px',
                      background: '#fff',
                      fontSize: '18px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >−</button>
                  <div style={{
                    padding: '10px 24px',
                    border: '1px solid #d2d2d7',
                    borderLeft: 'none', borderRight: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    minWidth: '90px',
                    textAlign: 'center',
                  }}>
                    {rate}%
                  </div>
                  <button
                    onClick={() => setRate(r => Math.min(18, Math.round((r + 0.25) * 100) / 100))}
                    style={{
                      width: '40px', height: '44px',
                      border: '1px solid #d2d2d7',
                      borderRadius: '0 8px 8px 0',
                      background: '#fff',
                      fontSize: '18px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >+</button>
                </div>
                <p style={{ fontSize: '13px', color: '#6e6e73', marginTop: '6px' }}>
                  Average Nepal bank car loan rate: 10–11%
                </p>
              </div>
            </div>

            {/* Results */}
            <div style={{
              background: '#fff8f5',
              border: '1.5px solid #e8531a',
              borderRadius: '16px',
              padding: '28px',
            }}>
              <p style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#6e6e73',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
              }}>
                Monthly Payment
              </p>
              <div style={{
                fontSize: isMobile ? '32px' : '42px',
                fontWeight: '800',
                color: '#e8531a',
                letterSpacing: '-1px',
                margin: '0 0 16px',
              }}>
                {formatNPR(Math.round(emi))}
              </div>
              <p style={{ fontSize: '14px', color: '#6e6e73', marginBottom: '24px' }}>
                per month for {tenure} years
              </p>

              <div style={{ height: '1px', background: '#fde8da', margin: '16px 0' }} />

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6e6e73', marginBottom: '4px' }}>
                    Car Price
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: '#1d1d1f', margin: 0 }}>
                    {formatNPR(carPrice)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6e6e73', marginBottom: '4px' }}>
                    Down Payment
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: '#1d1d1f', margin: 0 }}>
                    {formatNPR(Math.round(carPrice * downPct / 100))}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6e6e73', marginBottom: '4px' }}>
                    Loan Amount
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: '#1d1d1f', margin: 0 }}>
                    {formatNPR(Math.round(carPrice * (1 - downPct / 100)))}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6e6e73', marginBottom: '4px' }}>
                    Interest Rate
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: '#1d1d1f', margin: 0 }}>
                    {rate}%
                  </p>
                </div>
              </div>

              <div style={{ height: '1px', background: '#fde8da', margin: '16px 0' }} />

              <Link to="/emi-calculator"
                style={{
                  display: 'inline-block',
                  background: 'white',
                  color: '#e8531a',
                  border: '1px solid #e8531a',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#e8531a'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = '#e8531a'
                }}
              >
                Advanced Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ POPULAR BRANDS ━━━━━━━━━━ */}
      <section style={{ padding: isMobile ? '32px 16px' : '60px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '12px', marginBottom: '16px',
          }}>
            <div style={{ width: '24px', height: '2px', background: '#e8531a' }} />
            <span style={{
              color: '#e8531a',
              fontSize: '11px', fontWeight: '600',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              Popular Brands
            </span>
          </div>

          <h2 style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 32px',
            letterSpacing: '-1px',
          }}>
            Browse by Brand
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(8, 1fr)',
            gap: '20px',
          }}>
            {popularBrands.map((brand, i) => (
              <Link
                key={i}
                to={brand.link}
                style={{
                  display: 'flex',
                  flexDirection: 'column' as const,
                  alignItems: 'center',
                  textDecoration: 'none',
                }}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  style={{
                    width: isMobile ? '50px' : '70px',
                    height: isMobile ? '50px' : '70px',
                    objectFit: 'contain',
                    marginBottom: '8px',
                  }}
                />
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#1d1d1f',
                }}>
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ TOP SHOWROOMS ━━━━━━━━━━ */}
      <section style={{
        background: '#f5f5f7',
        padding: isMobile ? '32px 16px' : '60px 24px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: isMobile ? '24px' : '32px',
          }}>
            <div>
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: '12px', marginBottom: '8px',
              }}>
                <div style={{ width: '24px', height: '2px', background: '#e8531a' }} />
                <span style={{
                  color: '#e8531a',
                  fontSize: '11px', fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  Showrooms
                </span>
              </div>
              <h2 style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: 0,
                letterSpacing: '-1px',
              }}>
                Top Dealers in Nepal
              </h2>
            </div>
            <Link to="/showrooms" style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#e8531a',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              View All <IconArrow />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '20px',
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
              >
                <div style={{
                  display: 'flex', alignItems: 'center',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    width: '40px', height: '40px',
                    background: '#e8531a',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '20px', fontWeight: '700',
                    marginRight: '12px',
                  }}>
                    {showroom.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1d1d1f',
                    }}>
                      {showroom.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#e8531a',
                      fontWeight: '600',
                    }}>
                      {showroom.brand}
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize: '12px',
                  color: '#6e6e73',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <IconMap />
                  {showroom.city}
                </div>

                {showroom.phone && (
                  <div style={{
                    fontSize: '12px',
                    color: '#6e6e73',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <IconPhone />
                    {showroom.phone}
                  </div>
                )}

                {showroom.working_hours && (
                  <div style={{
                    fontSize: '12px',
                    color: '#6e6e73',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <IconCalendar />
                    {showroom.working_hours}
                  </div>
                )}

                <div style={{ marginTop: '16px' }}>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${showroom.lat},${showroom.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      background: '#e8531a',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#c94415'}
                    onMouseLeave={e => e.currentTarget.style.background = '#e8531a'}
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ LATEST OFFERS ━━━━━━━━━━ */}
      <section style={{ padding: isMobile ? '32px 16px' : '60px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: isMobile ? '24px' : '32px',
          }}>
            <div>
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: '12px', marginBottom: '8px',
              }}>
                <div style={{ width: '24px', height: '2px', background: '#e8531a' }} />
                <span style={{
                  color: '#e8531a',
                  fontSize: '11px', fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  Special Offers
                </span>
              </div>
              <h2 style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: 0,
                letterSpacing: '-1px',
              }}>
                Latest Deals
              </h2>
            </div>
            <Link to="/offers" style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#e8531a',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              View All <IconArrow />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '24px',
          }}>
            {offers.map(offer => (
              <div
                key={offer.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e5e5e5',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#e8531a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,83,26,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img 
                    src={offer.image_url} 
                    alt={offer.title} 
                    style={{
                      width: '100%',
                      height: isMobile ? '160px' : '200px',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: '#22c55e',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Active
                  </div>
                </div>
                
                <div style={{ padding: '20px' }}>
                  <div style={{
                    display: 'inline-block',
                    background: '#fff8f5',
                    border: '1px solid #e8531a',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#e8531a',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '10px',
                  }}>
                    {offer.tag}
                  </div>
                  
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1d1d1f',
                    margin: '0 0 10px',
                    lineHeight: 1.4,
                  }}>
                    {offer.title}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#6e6e73',
                    margin: '0 0 16px',
                    lineHeight: 1.6,
                  }}>
                    {offer.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                  }}>
                    <div style={{ color: '#e8531a' }}>
                      <IconZap />
                    </div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#e8531a',
                      margin: 0,
                    }}>
                      Worth Rs.15,000
                    </p>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    fontSize: '12px',
                    color: '#6e6e73',
                  }}>
                    <IconCalendar />
                    <span>Valid until: {new Date(offer.valid_until).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '16px',
                  }}>
                    <Link to="/advertise"
                      style={{
                        flex: 1,
                        background: '#e8531a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: '700',
                        textDecoration: 'none',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#c94415';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(232,83,26,0.35)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#e8531a';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Claim Offer
                    </Link>
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/offers/${offer.id}`;
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(url);
                          alert('Link copied to clipboard!');
                        } else {
                          const textArea = document.createElement("textarea");
                          textArea.value = url;
                          document.body.appendChild(textArea);
                          textArea.select();
                          document.execCommand('copy');
                          document.body.removeChild(textArea);
                          alert('Link copied to clipboard!');
                        }
                      }}
                      style={{
                        background: 'white',
                        color: '#1d1d1f',
                        border: '1.5px solid #d2d2d7',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#e8531a';
                        e.currentTarget.style.color = '#e8531a';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#d2d2d7';
                        e.currentTarget.style.color = '#1d1d1f';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ LATEST BLOG ━━━━━━━━━━ */}
      <section style={{
        background: '#f5f5f7',
        padding: isMobile ? '32px 16px' : '60px 24px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: isMobile ? '24px' : '32px',
          }}>
            <div>
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: '12px', marginBottom: '8px',
              }}>
                <div style={{ width: '24px', height: '2px', background: '#e8531a' }} />
                <span style={{
                  color: '#e8531a',
                  fontSize: '11px', fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  Blog
                </span>
              </div>
              <h2 style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: 0,
                letterSpacing: '-1px',
              }}>
                Latest Articles
              </h2>
            </div>
            <Link to="/blog" style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#e8531a',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              View All <IconArrow />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '24px',
          }}>
            {latestBlogPosts.map(post => (
              <div
                key={post.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e5e5e5',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#e8531a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,83,26,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {post.cover_image && (
                  <img 
                    src={post.cover_image} 
                    alt={post.title} 
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                    }}
                  />
                )}
                
                <div style={{ padding: '20px' }}>
                  {post.category && (
                    <span style={{
                      display: 'inline-block',
                      background: '#fff8f5',
                      border: '1px solid #fde8da',
                      color: '#e8531a',
                      fontSize: '10px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      marginBottom: '10px',
                    }}>
                      {post.category}
                    </span>
                  )}
                  
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1d1d1f',
                    margin: '0 0 10px',
                    lineHeight: 1.4,
                  }}>
                    {post.title}
                  </h3>
                  
                  <p style={{
                    fontSize: '13px',
                    color: '#6e6e73',
                    lineHeight: 1.6,
                    margin: '0 0 16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {post.excerpt}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div style={{
                      fontSize: '11px',
                      color: '#6e6e73',
                    }}>
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#e8531a',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ CTA ━━━━━━━━━━ */}
      <section style={{
        background: 'white',
        padding: isMobile ? '40px 16px' : '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 16px',
            letterSpacing: '-1px',
          }}>
            Ready to Find Your Perfect Car?
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6e6e73',
            margin: '0 0 32px',
            lineHeight: 1.7,
          }}>
            Compare prices, calculate EMI, find showrooms — all in one place
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <Link to="/cars"
              style={{
                background: '#e8531a',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '15px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box' as const,
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
            
            <Link to="/budget-finder"
              style={{
                background: 'white',
                color: '#1d1d1f',
                padding: '14px 32px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '15px',
                textDecoration: 'none',
                border: '1px solid #d2d2d7',
                transition: 'all 0.2s',
                boxSizing: 'border-box' as const,
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
              Budget Finder
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;