"use client";

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '',
  iconUrl: '',
  shadowUrl: '',
})

const Showrooms = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [selectedBrand, setSelectedBrand] = useState('All Brands')
  const [selectedShowroom, setSelectedShowroom] = useState<any>(null)
  const [hoveredShowroom, setHoveredShowroom] = useState<string|null>(null)
  const [showrooms, setShowrooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{[key: string]: L.Marker}>({})

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
      <span style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
        color: white;
        font-size: 12px;
        font-weight: bold;
        pointer-events: none;
      ">🏢</span>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  })

  const handleShowroomClick = (showroom: any) => {
    setSelectedShowroom(showroom)
    if (mapRef.current && showroom.lat && showroom.lng) {
      mapRef.current.flyTo(
        [showroom.lat, showroom.lng],
        16,
        { animate: true, duration: 1 }
      )
      markersRef.current[showroom.id]?.openPopup()
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
              📍 ${showroom.address}
            </div>
            ${showroom.phone ? `
            <div style="font-size:11px;color:#6e6e73;margin-bottom:2px">
              📞 ${showroom.phone}
            </div>` : ''}
            ${showroom.working_hours ? `
            <div style="font-size:11px;color:#6e6e73;margin-bottom:8px">
              🕐 ${showroom.working_hours}
            </div>` : ''}
            <div style="display:flex;gap:6px;margin-top:8px">
              <a href="${mapsLink}" target="_blank"
                style="flex:1;display:block;text-align:center;
                  background:#e8531a;color:white;padding:5px 8px;
                  border-radius:6px;font-size:11px;
                  text-decoration:none;font-weight:600">
                📍 Directions
              </a>
              ${waLink ? `
              <a href="${waLink}" target="_blank"
                style="flex:1;display:block;text-align:center;
                  background:#25D366;color:white;padding:5px 8px;
                  border-radius:6px;font-size:11px;
                  text-decoration:none;font-weight:600">
                💬 WhatsApp
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
      height: 'calc(100vh - 64px)',
      overflow: 'hidden'
    }}>
      {/* LEFT PANEL */}
      <div style={{
        width: '380px',
        minWidth: '380px',
        height: '100%',
        overflowY: 'auto',
        borderRight: '1px solid #e5e5e5',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
      }}>
        {/* Sticky header */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 10,
          padding: '20px 16px 12px',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#1d1d1f',
            margin: 0,
          }}>
            Car Showrooms in Nepal
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#6e6e73',
            marginTop: '2px',
            marginBottom: 0,
          }}>
            Find authorized dealers near you
          </p>

          <input
            type="text"
            placeholder="Search showrooms..."
            style={{
              width: '100%',
              border: '1px solid #d2d2d7',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '14px',
              marginTop: '12px',
              boxSizing: 'border-box',
              outline: 'none',
            }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          <select
            style={{
              width: '100%',
              border: '1px solid #d2d2d7',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '14px',
              marginTop: '8px',
              boxSizing: 'border-box',
              background: 'white',
              outline: 'none',
            }}
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
          >
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            style={{
              width: '100%',
              border: '1px solid #d2d2d7',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '14px',
              marginTop: '8px',
              boxSizing: 'border-box',
              background: 'white',
              outline: 'none',
            }}
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <p style={{
            fontSize: '12px',
            color: '#6e6e73',
            padding: '8px 0 0',
            margin: 0,
          }}>
            {loading ? 'Loading...' : 
              `${filteredShowrooms.length} showrooms found`}
          </p>
        </div>

        {/* List */}
        <div>
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
                      fontSize: 12, color: '#6e6e73', marginTop: 4
                    }}>
                      📍 {showroom.address}
                    </div>
                    {showroom.phone && (
                      <div style={{
                        fontSize: 12, color: '#6e6e73', marginTop: 2
                      }}>
                        📞 {showroom.phone}
                      </div>
                    )}
                    {showroom.working_hours && (
                      <div style={{
                        fontSize: 12, color: '#6e6e73', marginTop: 2
                      }}>
                        🕐 {showroom.working_hours}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* MAP */}
      <div style={{ flex: 1, height: '100%', position: 'relative' }}>
        <div id="showrooms-map" 
          style={{ width: '100%', height: '100%' }} 
        />
      </div>
    </div>
  )
}

export default Showrooms