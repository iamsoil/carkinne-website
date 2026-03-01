import { useState, useEffect, useRef } from 'react'
import { MapPin, Phone, Clock, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const Showrooms = () => {
  const [selectedCity, setSelectedCity] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showrooms, setShowrooms] = useState<any[]>([])
  const [selectedShowroom, setSelectedShowroom] = useState<any>(null)
  const [hoveredShowroom, setHoveredShowroom] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<{[key: string]: any}>({})

  const cities = ['All', 'Kathmandu', 'Lalitpur', 'Bhaktapur', 
    'Pokhara', 'Biratnagar', 'Butwal', 'Chitwan', 'Dharan']
  const brands = ['All', 'Toyota', 'Hyundai', 'Kia', 'Suzuki', 
    'Honda', 'MG', 'Tata', 'BYD', 'Mahindra', 'Nissan']

  useEffect(() => {
    fetchShowrooms()
  }, [])

  useEffect(() => {
    if (showrooms.length > 0) initMap()
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
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

  const initMap = () => {
    if (mapRef.current) return
    const L = (window as any).L
    if (!L) {
      setTimeout(initMap, 500)
      return
    }

    const map = L.map('showrooms-map', {
      center: [27.7172, 85.3240],
      zoom: 12,
    })

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap contributors' }
    ).addTo(map)

    mapRef.current = map
    addMarkers(map, showrooms)
  }

  const addMarkers = (map: any, data: any[]) => {
    const L = (window as any).L
    if (!L) return

    data.forEach(showroom => {
      if (!showroom.lat || !showroom.lng) return

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: 30px; height: 30px;
          background: #e8531a;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            color: white;
            font-size: 12px;
            line-height: 1;
            margin-top: -2px;
          ">🏢</span>
        </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -32],
      })

      const marker = L.marker([showroom.lat, showroom.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width:200px;font-family:sans-serif">
            <div style="font-size:13px;font-weight:700;color:#1d1d1f">
              ${showroom.name}
            </div>
            <div style="font-size:11px;color:#e8531a;
              font-weight:600;margin:4px 0">
              ${showroom.brand}
            </div>
            <div style="font-size:11px;color:#6e6e73;margin-bottom:4px">
              📍 ${showroom.address}
            </div>
            <div style="font-size:11px;color:#6e6e73;margin-bottom:4px">
              📞 ${showroom.phone || 'N/A'}
            </div>
            <div style="font-size:11px;color:#6e6e73;margin-bottom:8px">
              🕐 ${showroom.working_hours || 'N/A'}
            </div>
            <a href="${showroom.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(showroom.name + ' Nepal')}`}"
              target="_blank"
              style="display:inline-block;background:#e8531a;color:white;
                padding:5px 12px;border-radius:6px;font-size:11px;
                text-decoration:none;font-weight:600">
              📍 Get Directions
            </a>
          </div>
        `)

      markersRef.current[showroom.id] = marker
    })
  }

  const handleShowroomClick = (showroom: any) => {
    setSelectedShowroom(showroom)
    if (mapRef.current && showroom.lat && showroom.lng) {
      mapRef.current.flyTo([showroom.lat, showroom.lng], 16, {
        animate: true,
        duration: 1,
      })
      if (markersRef.current[showroom.id]) {
        markersRef.current[showroom.id].openPopup()
      }
    }
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
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" />

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
            margin: 0,
          }}>
            Car Showrooms in Nepal
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#6e6e73',
            marginTop: '2px',
            marginBottom: '12px',
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
            }} />
            <input
              type="text"
              placeholder="Search showrooms..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 30px',
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
            }}
          >
            {brands.map(b => (
              <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>
            ))}
          </select>

          {/* City pills */}
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}>
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: selectedCity === city ? '#e8531a' : '#d2d2d7',
                  background: selectedCity === city ? '#fff8f5' : 'white',
                  color: selectedCity === city ? '#e8531a' : '#6e6e73',
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

          {/* Count */}
          <p style={{
            fontSize: '12px',
            color: '#6e6e73',
            margin: '8px 0 0',
          }}>
            {filteredShowrooms.length} showrooms found
          </p>
        </div>

        {/* Showroom list */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              Loading showrooms...
            </div>
          ) : filteredShowrooms.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
              No showrooms found.<br />Try different filters.
            </div>
          ) : (
            filteredShowrooms.map(showroom => {
              const isSelected = selectedShowroom?.id === showroom.id
              const isHovered = hoveredShowroom?.id === showroom.id
              return (
                <div
                  key={showroom.id}
                  onClick={() => handleShowroomClick(showroom)}
                  onMouseEnter={() => setHoveredShowroom(showroom)}
                  onMouseLeave={() => setHoveredShowroom(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '14px 16px',
                    borderBottom: '1px solid #f5f5f5',
                    cursor: 'pointer',
                    background: isSelected || isHovered ? '#fff8f5' : 'white',
                    borderLeft: isSelected || isHovered
                      ? '3px solid #e8531a' : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isSelected ? '#e8531a' : '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    flexShrink: 0,
                    fontSize: '14px',
                    fontWeight: '700',
                    color: isSelected ? 'white' : '#666',
                  }}>
                    {showroom.brand?.charAt(0)}
                  </div>

                  {/* Info */}
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
                      marginBottom: '4px',
                    }}>
                      {showroom.brand}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6e6e73',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginBottom: '2px',
                    }}>
                      <MapPin size={11} /> {showroom.address}
                    </div>
                    {showroom.phone && (
                      <div style={{
                        fontSize: '12px',
                        color: '#6e6e73',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '2px',
                      }}>
                        <Phone size={11} />
                        <a
                          href={`tel:${showroom.phone}`}
                          onClick={e => e.stopPropagation()}
                          style={{ color: '#6e6e73', textDecoration: 'none' }}
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
                      }}>
                        <Clock size={11} /> {showroom.working_hours}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* RIGHT - MAP */}
      <div style={{ flex: 1, height: '100%', position: 'relative' }}>
        <div id="showrooms-map" style={{
          width: '100%',
          height: '100%',
        }} />
      </div>
    </div>
  )
}

export default Showrooms