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

const cities = ['All Cities', 'Kathmandu', 'Lalitpur',
  'Pokhara', 'Biratnagar', 'Butwal', 'Chitwan']

const stations = [
  { id: 1, name: 'NEA Charging Station - Kathmandu',
    address: 'Durbar Marg, Kathmandu', city: 'Kathmandu',
    connectors: ['CCS2', 'CHAdeMO'], operator: 'NEA',
    power: '60 kW', status: 'Available',
    lat: 27.7041, lng: 85.3145 },
  { id: 2, name: 'Labim Mall Charging Station',
    address: 'Pulchowk, Lalitpur', city: 'Lalitpur',
    connectors: ['CCS2'], operator: 'ElectriVa',
    power: '50 kW', status: 'Available',
    lat: 27.6762, lng: 85.3175 },
  { id: 3, name: 'NEA Charging Station - Butwal',
    address: 'Butwal, Rupandehi', city: 'Butwal',
    connectors: ['CCS2', 'GBT'], operator: 'NEA',
    power: '60 kW', status: 'Available',
    lat: 27.7006, lng: 83.4532 },
  { id: 4, name: 'Sathi Auto Parts',
    address: 'Sitalpati, Kathmandu', city: 'Kathmandu',
    connectors: ['CCS2'], operator: 'Sathi',
    power: '30 kW', status: 'Available',
    lat: 27.7089, lng: 85.3142 },
  { id: 5, name: 'MG Charging Hub',
    address: 'Naxal, Kathmandu', city: 'Kathmandu',
    connectors: ['CCS2', 'AC'], operator: 'MG',
    power: '50 kW', status: 'Available',
    lat: 27.7172, lng: 85.3240 },
  { id: 6, name: 'TATA Charging Station',
    address: 'New Baneshwor, Kathmandu', city: 'Kathmandu',
    connectors: ['CCS2'], operator: 'TATA',
    power: '50 kW', status: 'Available',
    lat: 27.6939, lng: 85.3453 },
  { id: 7, name: 'NEA Charging - Pokhara',
    address: 'Lakeside, Pokhara', city: 'Pokhara',
    connectors: ['CCS2', 'GBT'], operator: 'NEA',
    power: '60 kW', status: 'Available',
    lat: 28.2096, lng: 83.9856 },
  { id: 8, name: 'BYD Charging Station',
    address: 'Biratnagar, Morang', city: 'Biratnagar',
    connectors: ['CCS2'], operator: 'BYD',
    power: '50 kW', status: 'Available',
    lat: 26.4525, lng: 87.2718 },
]

const IconBolt = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
  </svg>
)

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const IconPin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
)

const IconZap = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)

const EvCharging = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [selectedStation, setSelectedStation] = useState<any>(null)
  const [hoveredStation, setHoveredStation] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: number]: L.Marker }>({})
  const [showContributeForm, setShowContributeForm] = useState(false)
  const [formData, setFormData] = useState({
    station_name: '',
    phone: '',
    google_maps_url: '',
    vendor: '',
    city: '',
    additional_details: '',
    amenities: [] as string[],
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filteredStations = stations.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.operator.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCity =
      selectedCity === 'All Cities' || s.city === selectedCity
    return matchesSearch && matchesCity
  })

  const createMarkerIcon = (isActive: boolean) => L.divIcon({
    className: '',
    html: `<div style="
      position:relative;
      width:32px;height:32px;
    ">
      <div style="
        width:32px;height:32px;
        background:${isActive ? '#c94415' : '#e8531a'};
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:2px solid white;
        box-shadow:0 2px 8px rgba(232,83,26,0.4);
      "></div>
      <svg style="
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-60%);
        pointer-events:none;
      " width="13" height="13" viewBox="0 0 24 24" fill="white">
        <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
  })

  const handleStationClick = (station: any) => {
    setSelectedStation(station)
    if (mapRef.current && station.lat && station.lng) {
      const map = mapRef.current
      const targetLatLng = L.latLng(station.lat, station.lng)
      const targetPoint = map.project(targetLatLng, 15)
      const offsetPoint = targetPoint.subtract([0, -120])
      const offsetLatLng = map.unproject(offsetPoint, 15)
      map.flyTo(offsetLatLng, 15, { animate: true, duration: 1 })
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
        { icon: createMarkerIcon(false) }
      ).addTo(map)
        .bindPopup(`
          <div style="
            min-width:210px;
            font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif;
            padding:4px;
          ">
            <div style="
              display:flex;align-items:center;gap:8px;
              margin-bottom:8px;
            ">
              <div style="
                width:32px;height:32px;
                background:#e8531a;
                border-radius:8px;
                display:flex;align-items;
                justify-content:center;
                flex-shrink:0;
              ">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                </svg>
              </div>
              <div>
                <div style="
                  font-size:13px;font-weight:700;
                  color:#1d1d1f;line-height:1.3;
                ">
                  ${station.name}
                </div>
                <div style="
                  font-size:11px;color:#e8531a;
                  font-weight:600;
                ">
                  ${station.operator} · ${station.power}
                </div>
              </div>
            </div>

            <div style="
              font-size:11px;color:#6e6e73;
              margin-bottom:8px;
              display:flex;align-items:center;gap:4px;
            ">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="#6e6e73" stroke-width="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              ${station.address}
            </div>

            <div style="margin-bottom:10px;display:flex;gap:4px;flex-wrap:wrap;">
              ${station.connectors.map((c: string) =>
                `<span style="
                  background:#fff8f5;
                  border:1px solid #fde8da;
                  padding:2px 8px;
                  border-radius:4px;
                  font-size:10px;
                  color:#e8531a;
                  font-weight:600;
                ">${c}</span>`
              ).join('')}
            </div>

            <a href="https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}"
              target="_blank"
              style="
                display:block;text-align:center;
                background:#e8531a;color:white;
                padding:7px 12px;border-radius:8px;
                font-size:12px;text-decoration:none;
                font-weight:700;
                transition:background 0.2s;
              ">
              Get Directions →
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      background: 'white',
    }}>

      {/* MAP */}
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
        <div id="ev-map" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* LEFT PANEL */}
      <div style={{
        width: isMobile ? '100%' : '360px',
        minWidth: isMobile ? 'unset' : '360px',
        height: isMobile ? 'calc(100vh - 64px - 224px)' : '100%',
        overflowY: 'auto',
        borderRight: isMobile ? 'none' : '1px solid #e5e5e5',
        borderTop: isMobile ? '1px solid #e5e5e5' : 'none',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        order: isMobile ? 2 : 1,
      }}>

        {/* Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 10,
          padding: '16px 16px 12px',
          borderBottom: '1px solid #f0f0f0',
        }}>
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
            EV Charging
          </div>
          
          {isMobile ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <h1 style={{
                fontSize: '17px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: 0,
                letterSpacing: '-0.5px',
              }}>
                Charging Stations in Nepal
              </h1>
              <button
                onClick={() => setShowContributeForm(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#e8531a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#c94415'}
                onMouseLeave={e => e.currentTarget.style.background = '#e8531a'}
              >
                + Add
              </button>
            </div>
          ) : (
            <>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: '0 0 2px',
                letterSpacing: '-0.5px',
              }}>
                Charging Stations in Nepal
              </h1>
              <button
                onClick={() => setShowContributeForm(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#e8531a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  marginTop: '10px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#c94415'}
                onMouseLeave={e => e.currentTarget.style.background = '#e8531a'}
              >
                + Add Station
              </button>
            </>
          )}
          
          <p style={{
            fontSize: '12px',
            color: '#6e6e73',
            margin: '0 0 12px',
          }}>
            {filteredStations.length} stations found
          </p>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '8px', marginTop: '16px' }}>
            <div style={{
              position: 'absolute', left: '10px', top: '50%',
              transform: 'translateY(-50%)',
              color: '#999', pointerEvents: 'none',
            }}>
              <IconSearch />
            </div>
            <input
              type="text"
              placeholder="Search stations or operator..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                border: '1px solid #d2d2d7',
                borderRadius: '8px',
                padding: '8px 12px 8px 30px',
                fontSize: '13px',
                boxSizing: 'border-box' as const,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#e8531a'}
              onBlur={e => e.target.style.borderColor = '#d2d2d7'}
            />
          </div>

          {/* City filter */}
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            style={{
              width: '100%',
              border: '1px solid #d2d2d7',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '13px',
              boxSizing: 'border-box' as const,
              background: 'white',
              outline: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Station list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredStations.length === 0 ? (
            <div style={{
              padding: '40px 16px',
              textAlign: 'center',
              color: '#6e6e73',
              fontSize: '14px',
            }}>
              No stations found.<br />Try a different search.
            </div>
          ) : filteredStations.map((station) => {
            const isActive = selectedStation?.id === station.id
            const isHovered = hoveredStation === station.id

            return (
              <div
                key={station.id}
                onClick={() => handleStationClick(station)}
                onMouseEnter={() => setHoveredStation(station.id)}
                onMouseLeave={() => setHoveredStation(null)}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #f5f5f5',
                  cursor: 'pointer',
                  background: isActive ? '#fff8f5'
                    : isHovered ? '#fafafa' : 'white',
                  borderLeft: `3px solid ${isActive ? '#e8531a' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}>
                  {/* Icon */}
                  <div style={{
                    width: '36px', height: '36px',
                    borderRadius: '10px',
                    background: isActive ? '#e8531a'
                      : isHovered ? '#fff0ea' : '#f5f5f7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? 'white'
                      : isHovered ? '#e8531a' : '#999',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                  }}>
                    <IconBolt />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1d1d1f',
                      marginBottom: '2px',
                      lineHeight: 1.3,
                    }}>
                      {station.name}
                    </div>

                    <div style={{
                      fontSize: '11px',
                      color: '#e8531a',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}>
                      {station.operator} · {station.power}
                    </div>

                    <div style={{
                      fontSize: '12px',
                      color: '#6e6e73',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <IconPin />
                      {station.address}
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}>
                      {station.connectors.map((c: string) => (
                        <span key={c} style={{
                          background: isActive ? '#fde8da' : '#f5f5f7',
                          border: `1px solid ${isActive ? '#e8531a' : '#e5e5e5'}`,
                          borderRadius: '4px',
                          padding: '2px 7px',
                          fontSize: '10px',
                          color: isActive ? '#e8531a' : '#555',
                          fontWeight: '600',
                          transition: 'all 0.15s',
                        }}>
                          {c}
                        </span>
                      ))}

                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '10px',
                        color: '#22c55e',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}>
                        <IconZap />
                        {station.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded directions button when active */}
                {isActive && (
                  <div style={{ marginTop: '12px', marginLeft: '48px' }}>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        display: 'inline-block',
                        background: '#e8531a',
                        color: 'white',
                        padding: '7px 16px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        textDecoration: 'none',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#c94415'}
                      onMouseLeave={e => e.currentTarget.style.background = '#e8531a'}
                    >
                      Get Directions →
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {showContributeForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
        onClick={() => setShowContributeForm(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '28px 24px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1d1d1f', margin: 0 }}>
                  Contribute Charging Station
                </h2>
                <p style={{ fontSize: '12px', color: '#6e6e73', margin: '4px 0 0' }}>
                  Help the EV community by adding a missing charging station.
                </p>
              </div>
              <button
                onClick={() => setShowContributeForm(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#6e6e73', padding: '0 0 0 12px' }}
              >
                ×
              </button>
            </div>

            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: '#fff8f5', border: '2px solid #e8531a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontSize: '24px',
                }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1d1d1f', margin: '0 0 8px' }}>
                  Thank you for contributing!
                </h3>
                <p style={{ fontSize: '13px', color: '#6e6e73', margin: '0 0 20px' }}>
                  We'll review your submission and add it to the map soon.
                </p>
                <button
                  onClick={() => { setShowContributeForm(false); setFormSubmitted(false) }}
                  style={{
                    background: '#e8531a', color: 'white', border: 'none',
                    borderRadius: '10px', padding: '10px 24px',
                    fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Station Name + Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                      Station Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NEA Charging Station"
                      value={formData.station_name}
                      onChange={e => setFormData(p => ({ ...p, station_name: e.target.value }))}
                      style={{ width: '100%', border: '1px solid #d2d2d7', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#e8531a'}
                      onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      placeholder="98XXXXXXXX"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      style={{ width: '100%', border: '1px solid #d2d2d7', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#e8531a'}
                      onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                    />
                  </div>
                </div>

                {/* Google Maps URL */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                    Google Map Link *
                  </label>
                  <input
                    type="text"
                    placeholder="https://maps.app.goo.gl/..."
                    value={formData.google_maps_url}
                    onChange={e => setFormData(p => ({ ...p, google_maps_url: e.target.value }))}
                    style={{ width: '100%', border: '1px solid #d2d2d7', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#e8531a'}
                    onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                  />
                  <p style={{ fontSize: '11px', color: '#6e6e73', margin: '4px 0 0' }}>Please share the location link from Google Maps.</p>
                </div>

                {/* Vendor + City */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                      Vendor / Network
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NEA, Theego, BYD"
                      value={formData.vendor}
                      onChange={e => setFormData(p => ({ ...p, vendor: e.target.value }))}
                      style={{ width: '100%', border: '1px solid #d2d2d7', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#e8531a'}
                      onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                      City (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kathmandu"
                      value={formData.city}
                      onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                      style={{ width: '100%', border: '1px solid #d2d2d7', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#e8531a'}
                      onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                    Amenities Available
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Wifi', 'Cafe', 'Restaurant', 'Shopping', 'Parking', 'Hotel', 'Park', 'Gym', 'Restroom'].map(a => {
                      const selected = formData.amenities.includes(a)
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setFormData(p => ({
                            ...p,
                            amenities: selected ? p.amenities.filter(x => x !== a) : [...p.amenities, a]
                          }))}
                          style={{
                            padding: '6px 12px', borderRadius: '20px', fontSize: '12px',
                            fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
                            border: '1px solid', transition: 'all 0.15s',
                            borderColor: selected ? '#e8531a' : '#d2d2d7',
                            background: selected ? '#fff8f5' : 'white',
                            color: selected ? '#e8531a' : '#1d1d1f',
                          }}
                        >
                          {a}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                    Additional Details
                  </label>
                  <textarea
                    placeholder="Opening hours, specific directions, or other info..."
                    value={formData.additional_details}
                    onChange={e => setFormData(p => ({ ...p, additional_details: e.target.value }))}
                    rows={3}
                    style={{ width: '100%', border: '1px solid #d2d2d7', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#e8531a'}
                    onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                  />
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setShowContributeForm(false)}
                    style={{
                      flex: 1,
                      background: 'white',
                      color: '#1d1d1f',
                      border: '1.5px solid #e5e5e5',
                      borderRadius: '12px',
                      padding: '13px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#e8531a'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!formData.station_name || !formData.phone || !formData.google_maps_url) {
                        alert('Please fill in Station Name, Phone Number and Google Maps Link.')
                        return
                      }
                      setSubmitting(true)
                      try {
                        // Note: This would require creating a table in Supabase
                        // await supabase.from('charging_station_contributions').insert([{
                        //   station_name: formData.station_name,
                        //   phone: formData.phone,
                        //   google_maps_url: formData.google_maps_url,
                        //   vendor: formData.vendor,
                        //   city: formData.city,
                        //   amenities: formData.amenities,
                        //   additional_details: formData.additional_details,
                        //   status: 'pending',
                        //   submitted_at: new Date().toISOString(),
                        // }])
                        setFormSubmitted(true)
                      } catch (err) {
                        alert('Something went wrong. Please try again.')
                      } finally {
                        setSubmitting(false)
                      }
                    }}
                    style={{
                      flex: 2,
                      background: submitting ? '#ccc' : '#e8531a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '13px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Station'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EvCharging