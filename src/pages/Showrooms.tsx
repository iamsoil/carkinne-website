import { useState, useEffect, useRef } from 'react'
import { MapPin, Phone, Clock, Search, MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: '', shadowUrl: '' })

const Showrooms = () => {
  const [selectedCity, setSelectedCity] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showrooms, setShowrooms] = useState<any[]>([])
  const [selectedShowroom, setSelectedShowroom] = useState<any>(null)
  const [hoveredShowroom, setHoveredShowroom] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{[key: string]: L.Marker}>({})

  const cities = ['All', 'Kathmandu', 'Lalitpur', 'Bhaktapur',
    'Pokhara', 'Biratnagar', 'Butwal', 'Chitwan', 'Dharan']
  const brands = ['All', 'Toyota', 'Hyundai', 'Kia', 'Suzuki',
    'Honda', 'MG', 'Tata', 'BYD', 'Mahindra', 'Nissan']

  useEffect(() => {
    fetchShowrooms()
  }, [])

  useEffect(() => {
    if (showrooms.length === 0) return
    if (mapRef.current) return

    const map = L.map('showrooms-map', {
      center: [27.7172, 85.3240],
      zoom: 12,
    })

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap contributors', maxZoom: 19 }
    ).addTo(map)

    // Add markers for all showrooms
    showrooms.forEach(showroom => {
      if (!showroom.lat || !showroom.lng) return

      const icon = L.divIcon({
        className: '',
        html: `<div style="
  width: 28px;
  height: 36px;
  position: relative;
">
  <svg 
    viewBox="0 0 24 32" 
    width="28" 
    height="36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 0C7.6 0 4 3.6 4 8c0 6 8 16 8 16s8-10 8-16c0-4.4-3.6-8-8-8z" 
      fill="#e8531a" 
      stroke="white" 
      stroke-width="1.5"
    />
    <circle cx="12" cy="8" r="3" fill="white"/>
  </svg>
</div>`,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -38],
      })

      const waLink = showroom.whatsapp
        ? `https://wa.me/${showroom.whatsapp.replace(/[^0-9]/g, '')}`
        : null

      const mapsLink = showroom.google_maps_url ||
        `https://maps.google.com/?q=${encodeURIComponent(showroom.name + ' ' + showroom.city + ' Nepal')}`

      const marker = L.marker([showroom.lat, showroom.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width:210px;font-family:sans-serif;padding:4px">
            <div style="font-size:14px;font-weight:700;color:#1d1d1f;
              margin-bottom:4px">
              ${showroom.name}
            </div>
            <div style="font-size:11px;color:#e8531a;font-weight:700;
              margin-bottom:6px;text-transform:uppercase">
              ${showroom.brand}
            </div>
            <div style="font-size:12px;color:#6e6e73;margin-bottom:3px">
              📍 ${showroom.address}
            </div>
            ${showroom.phone ? `
            <div style="font-size:12px;color:#6e6e73;margin-bottom:3px">
              📞 ${showroom.phone}
            </div>` : ''}
            ${showroom.working_hours ? `
            <div style="font-size:12px;color:#6e6e73;margin-bottom:10px">
              🕐 ${showroom.working_hours}
            </div>` : ''}
            <div style="display:flex;gap:6px;margin-top:8px">
              <a href="${mapsLink}" target="_blank"
                style="flex:1;display:block;background:#e8531a;color:white;
                  padding:6px 8px;border-radius:6px;font-size:11px;
                  text-decoration:none;font-weight:600;text-align:center">
                📍 Directions
              </a>
              ${waLink ? `
              <a href="${waLink}" target="_blank"
                style="flex:1;display:block;background:#25D366;color:white;
                  padding:6px 8px;border-radius:6px;font-size:11px;
                  text-decoration:none;font-weight:600;text-align:center">
                💬 WhatsApp
              </a>` : ''}
            </div>
          </div>
        `, { maxWidth: 240 })

      markersRef.current[showroom.id] = marker
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [showrooms])

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

  const handleShowroomClick = (showroom: any) => {
    setSelectedShowroom(showroom)
    
    if (!showroom.lat || !showroom.lng) return
    
    if (!mapRef.current) return

    mapRef.current.flyTo(
      [showroom.lat, showroom.lng], 
      17,
      { animate: true, duration: 1 }
    )

    setTimeout(() => {
      const marker = markersRef.current[showroom.id]
      if (marker) marker.openPopup()
    }, 1100)
  }

  const filteredShowrooms = showrooms.filter(s => {
    const cityMatch = selectedCity === 'All' || s.city === selectedCity
    const brandMatch = selectedBrand === 'All' || s.brand === selectedBrand
    const searchMatch = !searchQuery ||
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address?.toLowerCase().includes(searchQuery.toLowerCase())
    return cityMatch && brandMatch && searchMatch
  })

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
    }}>

      {/* LEFT PANEL */}
      <div style={{
        width: '380px',
        minWidth: '380px',
        height: '100%',
        overflowY: 'auto',
        borderRight: '1px solid #e5e5e5',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
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
            fontWeight: '700',
            color: '#1d1d1f',
            margin: '0 0 2px',
          }}>
            Car Showrooms in Nepal
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#6e6e73',
            margin: '0 0 12px',
          }}>
            Find authorized dealers near you
          </p>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <Search size={14} style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#999',
              pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search showrooms..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                border: '1px solid #d2d2d7',
                borderRadius: '8px',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Brand filter */}
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d2d2d7',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
              background: 'white',
              marginBottom: '8px',
              boxSizing: 'border-box',
            }}
          >
            {brands.map(b => (
              <option key={b} value={b}>
                {b === 'All' ? 'All Brands' : b}
              </option>
            ))}
          </select>

          {/* City pills */}
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '6px',
          }}>
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: selectedCity === city
                    ? '#e8531a' : '#d2d2d7',
                  background: selectedCity === city
                    ? '#fff8f5' : 'white',
                  color: selectedCity === city
                    ? '#e8531a' : '#6e6e73',
                  fontSize: '12px',
                  fontWeight: selectedCity === city ? '600' : '400',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {city}
              </button>
            ))}
          </div>

          <p style={{
            fontSize: '12px',
            color: '#6e6e73',
            margin: '8px 0 0',
          }}>
            {filteredShowrooms.length} showrooms found
          </p>
        </div>

        {/* List */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#999',
            }}>
              Loading showrooms...
            </div>
          ) : filteredShowrooms.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#999',
            }}>
              No showrooms found.<br />Try different filters.
            </div>
          ) : (
            filteredShowrooms.map(showroom => {
              const isSelected = selectedShowroom?.id === showroom.id
              const isHovered = hoveredShowroom?.id === showroom.id
              const waLink = showroom.whatsapp
                ? `https://wa.me/${showroom.whatsapp.replace(/[^0-9]/g, '')}`
                : null

              return (
                <div
                  key={showroom.id}
                  onClick={() => handleShowroomClick(showroom)}
                  onMouseEnter={() => setHoveredShowroom(showroom)}
                  onMouseLeave={() => setHoveredShowroom(null)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid #f5f5f5',
                    cursor: 'pointer',
                    background: isSelected || isHovered
                      ? '#fff8f5' : 'white',
                    borderLeft: isSelected || isHovered
                      ? '3px solid #e8531a'
                      : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}>
                    {/* Brand initial circle */}
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isSelected ? '#e8531a' : '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '14px',
                      fontWeight: '700',
                      color: isSelected ? 'white' : '#666',
                    }}>
                      {showroom.brand?.charAt(0)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1d1d1f',
                        marginBottom: '2px',
                      }}>
                        {showroom.name}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#e8531a',
                        fontWeight: '600',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                      }}>
                        {showroom.brand}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6e6e73',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '4px',
                        marginBottom: '3px',
                      }}>
                        <MapPin size={11} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{showroom.address}</span>
                      </div>
                      {showroom.phone && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6e6e73',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginBottom: '3px',
                        }}>
                          <Phone size={11} />
                          <a
                            href={`tel:${showroom.phone}`}
                            onClick={e => e.stopPropagation()}
                            style={{
                              color: '#6e6e73',
                              textDecoration: 'none',
                            }}
                          >
                            {showroom.phone}
                          </a>
                        </div>
                      )}
                      {showroom.working_hours && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6e6e73',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginBottom: '8px',
                        }}>
                          <Clock size={11} />
                          <span>{showroom.working_hours}</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{
                        display: 'flex',
                        gap: '6px',
                        marginTop: '4px',
                      }}>
                        <a
                          href={showroom.google_maps_url ||
                            `https://maps.google.com/?q=${encodeURIComponent(showroom.name + ' Nepal')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{
                            flex: 1,
                            display: 'block',
                            textAlign: 'center',
                            background: '#fff8f5',
                            border: '1px solid #e8531a',
                            color: '#e8531a',
                            borderRadius: '6px',
                            padding: '5px 8px',
                            fontSize: '11px',
                            fontWeight: '600',
                            textDecoration: 'none',
                          }}
                        >
                          📍 Directions
                        </a>
                        {waLink && (
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{
                              flex: 1,
                              display: 'block',
                              textAlign: 'center',
                              background: '#f0fdf4',
                              border: '1px solid #25D366',
                              color: '#25D366',
                              borderRadius: '6px',
                              padding: '5px 8px',
                              fontSize: '11px',
                              fontWeight: '600',
                              textDecoration: 'none',
                            }}
                          >
                            💬 WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* MAP */}
      <div style={{ flex: 1, height: '100%' }}>
        <div
          id="showrooms-map"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  )
}

export default Showrooms