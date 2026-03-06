"use client";

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '',
  iconUrl: '',
  shadowUrl: '',
})

const IconPin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
)

const IconPhone = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
  </svg>
)

const IconClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

const IconSearch = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const Showrooms = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [selectedBrand, setSelectedBrand] = useState('All Brands')
  const [selectedShowroom, setSelectedShowroom] = useState<any>(null)
  const [hoveredShowroom, setHoveredShowroom] = useState<string|null>(null)
  const [showrooms, setShowrooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{[key: string]: L.Marker}>({})

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const cities = ['All Cities', 'Kathmandu', 'Lalitpur', 
    'Bhaktapur', 'Pokhara', 'Biratnagar', 'Butwal', 
    'Chitwan', 'Dharan']
  const brands = ['All Brands', 'Toyota', 'Hyundai', 'Kia', 
    'Suzuki', 'Honda', 'MG', 'Tata', 'BYD', 'Mahindra', 'Nissan']

  useEffect(() => {
    fetchShowrooms()
  }, [])

  const fetchShowrooms = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('showrooms')
        .select('*')
        .order('city')
      if (error) throw error
      setShowrooms(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredShowrooms = showrooms.filter(s => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCity =
      selectedCity === 'All Cities' || s.city === selectedCity
    const matchesBrand =
      selectedBrand === 'All Brands' || s.brand === selectedBrand
    return matchesSearch && matchesCity && matchesBrand
  })

  const createOrangeIcon = () => L.divIcon({
    className: 'custom-showroom-marker',
    html: `<div style="
      position: relative;
      width: 28px;
      height: 28px;
    ">
      <div style="
        width: 28px;
        height: 28px;
        background: #e8531a;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(232,83,26,0.4);
      "></div>
      <svg style="
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  pointer-events: none;
" width="13" height="13" viewBox="0 0 24 24" 
  fill="white" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 2H7C5.9 2 5 2.9 5 4v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 2c.83 0 1.5.67 1.5 1.5S12.83 7 12 7s-1.5-.67-1.5-1.5S11.17 4 12 4zm5 16H7V4h2v1c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V4h2v16z"/>
  <rect x="9" y="10" width="2" height="2" fill="white"/>
  <rect x="13" y="10" width="2" height="2" fill="white"/>
  <rect x="9" y="14" width="2" height="2" fill="white"/>
  <rect x="13" y="14" width="2" height="2" fill="white"/>
</svg>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  })

  const handleShowroomClick = (showroom: any) => {
    setSelectedShowroom(showroom)
    if (mapRef.current && showroom.lat && showroom.lng) {
      
      // Offset the center point upward so popup 
      // appears in the middle of the visible map
      const map = mapRef.current
      const targetLatLng = L.latLng(showroom.lat, showroom.lng)
      
      // Calculate offset in pixels to move center down
      // so marker sits lower and popup shows in middle
      const targetPoint = map.project(targetLatLng, 16)
      const offsetPoint = targetPoint.subtract([0, -120])
      const offsetLatLng = map.unproject(offsetPoint, 16)

      map.flyTo(offsetLatLng, 16, {
        animate: true,
        duration: 1,
      })

      setTimeout(() => {
        markersRef.current[showroom.id]?.openPopup()
      }, 1100)
    }
  }

  useEffect(() => {
    if (mapRef.current) return
    if (showrooms.length === 0) return

    const map = L.map('showrooms-map', {
      center: [27.7172, 85.3240],
      zoom: 12,
    })

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap contributors', maxZoom: 19 }
    ).addTo(map)

    mapRef.current = map

    showrooms.forEach(showroom => {
      if (!showroom.lat || !showroom.lng) return

      const waLink = showroom.whatsapp
        ? `https://wa.me/${showroom.whatsapp.replace(/[^0-9]/g, '')}`
        : null

      const mapsLink = showroom.google_maps_url ||
        `https://maps.google.com/?q=${encodeURIComponent(showroom.name + ' Nepal')}`

      const marker = L.marker(
        [showroom.lat, showroom.lng],
        { icon: createOrangeIcon() }
      ).addTo(map)
        .bindPopup(`
          <div style="min-width:200px;font-family:sans-serif">
            <div style="font-size:13px;font-weight:700;color:#1d1d1f">
              ${showroom.name}
            </div>
            <div style="font-size:11px;color:#e8531a;font-weight:700;
              margin-top:2px;margin-bottom:6px;text-transform:uppercase">
              ${showroom.brand}
            </div>
            <div style="font-size:11px;color:#6e6e73;margin-bottom:2px">
              <span style="color:#e8531a;font-weight:700">Address:</span> ${showroom.address}
            </div>
            ${showroom.phone ? `
            <div style="font-size:11px;color:#6e6e73;margin-bottom:2px">
              <span style="color:#e8531a;font-weight:700">Phone:</span> ${showroom.phone}
            </div>` : ''}
            ${showroom.working_hours ? `
            <div style="font-size:11px;color:#6e6e73;margin-bottom:8px">
              <span style="color:#e8531a;font-weight:700">Hours:</span> ${showroom.working_hours}
            </div>` : ''}
            <div style="display:flex;gap:6px;margin-top:8px">
              <a href="${mapsLink}" target="_blank"
                style="flex:1;display:block;text-align:center;
                  background:#e8531a;color:white;padding:5px 8px;
                  border-radius:6px;font-size:11px;
                  text-decoration:none;font-weight:600">
                Directions
              </a>
              ${waLink ? `
              <a href="${waLink}" target="_blank"
                style="flex:1;display:block;text-align:center;
                  background:#25D366;color:white;padding:5px 8px;
                  border-radius:6px;font-size:11px;
                  text-decoration:none;font-weight:600">
                WhatsApp
              </a>` : ''}
            </div>
          </div>
        `)

      markersRef.current[showroom.id] = marker
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [showrooms])

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
    }}>

      {/* MAP - top on mobile, right on desktop */}
      <div style={{
        position: isMobile ? 'sticky' : 'relative',
        top: isMobile ? 0 : undefined,
        zIndex: isMobile ? 10 : undefined,
        flex: isMobile ? 'unset' : 1,
        height: isMobile ? '224px' : '100%',
        width: isMobile ? '100%' : undefined,
        flexShrink: 0,
        order: isMobile ? 1 : 2,
      }}>
        <div id="showrooms-map"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* LEFT PANEL - bottom on mobile, left on desktop */}
      <div style={{
        width: isMobile ? '100%' : '380px',
        minWidth: isMobile ? 'unset' : '380px',
        flex: isMobile ? 1 : undefined,
        height: isMobile ? 'calc(100vh - 64px - 224px)' : '100%',
        overflowY: 'auto',
        borderRight: isMobile ? 'none' : '1px solid #e5e5e5',
        borderTop: isMobile ? '1px solid #e5e5e5' : 'none',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        order: isMobile ? 2 : 1,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}>

        {/* Sticky filters header */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 10,
          padding: '14px 16px 10px',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
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
            Showrooms
          </div>
          
          {isMobile ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <h1 style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#111',
                margin: 0,
              }}>
                Showrooms in Nepal
              </h1>
              <button
                onClick={() => navigate('/advertise')}
                style={{
                  background: 'white',
                  color: '#e8531a',
                  border: '1.5px solid #e8531a',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                + List Showroom
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: 0 }}>
                Showrooms in Nepal
              </h1>
              <button
                onClick={() => navigate('/advertise')}
                style={{
                  background: 'white',
                  color: '#e8531a',
                  border: '1.5px solid #e8531a',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                + List Showroom
              </button>
            </div>
          )}
          
          <p style={{
            fontSize: '13px',
            color: '#888',
            margin: '6px 0 16px 0',
          }}>
            Browse verified car showrooms across Nepal
          </p>

          <div style={{ position: 'relative', marginTop: '10px' }}>
            <div style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#999',
              pointerEvents: 'none',
            }}>
              <IconSearch />
            </div>
            <input
              type="text"
              placeholder="Search showrooms..."
              style={{
                width: '100%',
                border: '1px solid #d2d2d7',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                boxSizing: 'border-box',
                outline: 'none',
                paddingLeft: '32px',
              }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#e8531a'}
              onBlur={e => e.target.style.borderColor = '#d2d2d7'}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '8px',
          }}>
            <select
              style={{
                flex: 1,
                border: '1px solid #d2d2d7',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '13px',
                boxSizing: 'border-box',
                background: 'white',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#e8531a'}
              onBlur={e => e.target.style.borderColor = '#d2d2d7'}
            >
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select
              style={{
                flex: 1,
                border: '1px solid #d2d2d7',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '13px',
                boxSizing: 'border-box',
                background: 'white',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#e8531a'}
              onBlur={e => e.target.style.borderColor = '#d2d2d7'}
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div style={{
            display: 'inline-block',
            background: '#fff8f5',
            border: '1px solid #fde8da',
            borderRadius: '6px',
            padding: '2px 10px',
            fontSize: '11px',
            fontWeight: '700',
            color: '#e8531a',
            marginTop: '8px',
          }}>
            {loading ? 'Loading...' : `${filteredShowrooms.length} showrooms found`}
          </div>
        </div>

        {/* Scrollable list only */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#999',
              fontSize: '14px',
            }}>
              Loading showrooms...
            </div>
          ) : filteredShowrooms.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#999',
              fontSize: '14px',
            }}>
              No showrooms found.<br />Try different filters.
            </div>
          ) : (
            filteredShowrooms.map(showroom => {
              const isActive = selectedShowroom?.id === showroom.id
              const isHovered = hoveredShowroom === showroom.id
              return (
                <div
                  key={showroom.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '12px 16px',
                    borderBottom: '1px solid #f5f5f5',
                    cursor: 'pointer',
                    background: isActive || isHovered
                      ? '#fff8f5' : 'white',
                    borderLeft: (isActive || isHovered)
                      ? '3px solid #e8531a'
                      : '3px solid transparent',
                  }}
                  onClick={() => handleShowroomClick(showroom)}
                  onMouseEnter={() => setHoveredShowroom(showroom.id)}
                  onMouseLeave={() => setHoveredShowroom(null)}
                >
                  <div style={{
                    width: 32, height: 32,
                    borderRadius: '50%',
                    background: isActive ? '#e8531a'
                      : isHovered ? '#fff0ea' : '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    flexShrink: 0,
                    color: isActive ? 'white'
                      : isHovered ? '#e8531a' : '#999',
                  }}>
                    <svg width="16" height="16"
                      viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 600, color: '#1d1d1f'
                    }}>
                      {showroom.name}
                    </div>
                    <div style={{
                      fontSize: 11, color: '#e8531a',
                      fontWeight: 600, marginTop: 2,
                      textTransform: 'uppercase',
                    }}>
                      {showroom.brand}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '12px',
                      color: '#6e6e73',
                      marginTop: '3px',
                    }}>
                      <span style={{ 
                        color: '#6e6e73', 
                        display: 'inline-flex', 
                        verticalAlign: 'middle', 
                        marginRight: '4px' 
                      }}>
                        <IconPin />
                      </span>
                      {showroom.address}
                    </div>
                    {showroom.phone && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        color: '#6e6e73',
                        marginTop: '3px',
                      }}>
                        <span style={{ 
                          color: '#6e6e73', 
                          display: 'inline-flex', 
                          verticalAlign: 'middle', 
                          marginRight: '4px' 
                        }}>
                          <IconPhone />
                        </span>
                        {showroom.phone}
                      </div>
                    )}
                    {showroom.working_hours && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        color: '#6e6e73',
                        marginTop: '3px',
                      }}>
                        <span style={{ 
                          color: '#6e6e73', 
                          display: 'inline-flex', 
                          verticalAlign: 'middle', 
                          marginRight: '4px' 
                        }}>
                          <IconClock />
                        </span>
                        {showroom.working_hours}
                      </div>
                    )}
                    {isActive && (
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#e8531a',
                        marginTop: '8px',
                        display: 'inline-block',
                      }}>
                        View on Map →
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Showrooms