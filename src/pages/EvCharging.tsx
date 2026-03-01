"use client";

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect, useRef } from 'react'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '',
  iconUrl: '',
  shadowUrl: '',
})

const EvCharging = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [selectedStation, setSelectedStation] = useState<any>(null)
  const [hoveredStation, setHoveredStation] = useState<number|null>(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{[key: number]: L.Marker}>({})

  const cities = ['All Cities', 'Kathmandu', 'Lalitpur', 
    'Pokhara', 'Biratnagar', 'Butwal', 'Chitwan']

  const stations = [
    { id: 1, name: 'NEA Charging Station - Kathmandu',
      address: 'Durbar Marg, Kathmandu', city: 'Kathmandu',
      connectors: ['CCS2', 'CHAdeMO'], operator: 'NEA',
      lat: 27.7041, lng: 85.3145 },
    { id: 2, name: 'Labim Mall Charging Station',
      address: 'Pulchowk, Lalitpur', city: 'Lalitpur',
      connectors: ['CCS2'], operator: 'ElectriVa',
      lat: 27.6762, lng: 85.3175 },
    { id: 3, name: 'NEA Charging Station - Butwal',
      address: 'Butwal, Rupandehi', city: 'Butwal',
      connectors: ['CCS2', 'GBT'], operator: 'NEA',
      lat: 27.7006, lng: 83.4532 },
    { id: 4, name: 'Sathi Auto Parts',
      address: 'Sitalpati, Kathmandu', city: 'Kathmandu',
      connectors: ['CCS2'], operator: 'Sathi',
      lat: 27.7089, lng: 85.3142 },
    { id: 5, name: 'MG Charging Hub',
      address: 'Naxal, Kathmandu', city: 'Kathmandu',
      connectors: ['CCS2', 'AC'], operator: 'MG',
      lat: 27.7172, lng: 85.3240 },
    { id: 6, name: 'TATA Charging Station',
      address: 'New Baneshwor, Kathmandu', city: 'Kathmandu',
      connectors: ['CCS2'], operator: 'TATA',
      lat: 27.6939, lng: 85.3453 },
    { id: 7, name: 'NEA Charging - Pokhara',
      address: 'Lakeside, Pokhara', city: 'Pokhara',
      connectors: ['CCS2', 'GBT'], operator: 'NEA',
      lat: 28.2096, lng: 83.9856 },
    { id: 8, name: 'BYD Charging Station',
      address: 'Biratnagar, Morang', city: 'Biratnagar',
      connectors: ['CCS2'], operator: 'BYD',
      lat: 26.4525, lng: 87.2718 },
  ]

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filteredStations = stations.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCity =
      selectedCity === 'All Cities' || s.city === selectedCity
    return matchesSearch && matchesCity
  })

  const createOrangeIcon = () => L.divIcon({
    className: 'custom-ev-marker',
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
        <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
      </svg>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  })

  const handleStationClick = (station: any) => {
    setSelectedStation(station)
    if (mapRef.current && station.lat && station.lng) {
      const map = mapRef.current
      const targetLatLng = L.latLng(station.lat, station.lng)
      const targetPoint = map.project(targetLatLng, 15)
      const offsetPoint = targetPoint.subtract([0, -120])
      const offsetLatLng = map.unproject(offsetPoint, 15)

      map.flyTo(offsetLatLng, 15, {
        animate: true,
        duration: 1,
      })

      setTimeout(() => {
        markersRef.current[station.id]?.openPopup()
      }, 1100)
    }
  }

  useEffect(() => {
    if (mapRef.current) return

    const map = L.map('ev-map', {
      center: [28.1, 84.5],
      zoom: 7,
    })

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap contributors', maxZoom: 19 }
    ).addTo(map)

    mapRef.current = map

    stations.forEach(station => {
      const marker = L.marker(
        [station.lat, station.lng],
        { icon: createOrangeIcon() }
      ).addTo(map)
        .bindPopup(`
          <div style="min-width:200px;font-family:sans-serif">
            <div style="font-size:13px;font-weight:700;color:#1d1d1f">
              ${station.name}
            </div>
            <div style="font-size:11px;color:#e8531a;font-weight:700;
              margin-top:2px;margin-bottom:6px">
              ${station.operator}
            </div>
            <div style="font-size:11px;color:#6e6e73;margin-bottom:6px">
              📍 ${station.address}
            </div>
            <div style="margin-bottom:10px">
              ${station.connectors.map((c: string) =>
                `<span style="background:#f0f0f0;padding:2px 7px;
                  border-radius:4px;font-size:10px;margin-right:4px;
                  color:#555">${c}</span>`
              ).join('')}
            </div>
            <a href="https://maps.google.com/?q=${encodeURIComponent(station.name + ' Nepal')}"
              target="_blank"
              style="display:block;text-align:center;background:#e8531a;
                color:white;padding:6px 12px;border-radius:6px;
                font-size:11px;text-decoration:none;font-weight:600">
              📍 Get Directions
            </a>
          </div>
        `)

      markersRef.current[station.id] = marker
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

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
        height: isMobile ? '280px' : '100%',
        width: isMobile ? '100%' : undefined,
        flexShrink: 0,
        order: isMobile ? 1 : 2,
      }}>
        <div id="ev-map"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* LEFT PANEL */}
      <div style={{
        width: isMobile ? '100%' : '380px',
        minWidth: isMobile ? 'unset' : '380px',
        height: isMobile ? 'calc(100vh - 64px - 280px)' : '100%',
        overflowY: 'auto',
        borderRight: isMobile ? 'none' : '1px solid #e5e5e5',
        borderTop: isMobile ? '1px solid #e5e5e5' : 'none',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        order: isMobile ? 2 : 1,
      }}>

        {/* Sticky filters */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 10,
          padding: '14px 16px 10px',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <h1 style={{
            fontSize: isMobile ? '16px' : '20px',
            fontWeight: 700,
            color: '#1d1d1f',
            margin: 0,
          }}>
            EV Stations in Nepal
          </h1>
          <p style={{
            fontSize: '12px',
            color: '#6e6e73',
            marginTop: '2px',
            marginBottom: 0,
          }}>
            Find charging points across Nepal
          </p>

          <input
            type="text"
            placeholder="Search stations..."
            style={{
              width: '100%',
              border: '1px solid #d2d2d7',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '13px',
              marginTop: '10px',
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
              fontSize: '13px',
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
            padding: '6px 0 0',
            margin: 0,
          }}>
            {filteredStations.length} stations found
          </p>
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredStations.map(station => {
            const isActive = selectedStation?.id === station.id
            const isHovered = hoveredStation === station.id
            return (
              <div
                key={station.id}
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
                onClick={() => handleStationClick(station)}
                onMouseEnter={() => setHoveredStation(station.id)}
                onMouseLeave={() => setHoveredStation(null)}
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
                    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                  </svg>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 600, color: '#1d1d1f'
                  }}>
                    {station.name}
                  </div>
                  <div style={{
                    fontSize: 11, color: '#e8531a',
                    fontWeight: 600, marginTop: 2,
                  }}>
                    {station.operator}
                  </div>
                  <div style={{
                    fontSize: 12, color: '#6e6e73', marginTop: 4
                  }}>
                    📍 {station.address}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    {station.connectors.map((c: string) => (
                      <span key={c} style={{
                        background: '#f0f0f0',
                        borderRadius: 4,
                        padding: '2px 6px',
                        fontSize: 11,
                        marginRight: 4,
                        color: '#555',
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default EvCharging