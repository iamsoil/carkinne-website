"use client";

import { useState } from 'react';

const EvCharging = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedStation, setSelectedStation] = useState<any>(null);

  const cities = [
    'All Cities', 'Kathmandu', 'Lalitpur', 'Pokhara', 
    'Biratnagar', 'Butwal', 'Chitwan'
  ];

  const stations = [
    { 
      id: 1, 
      name: 'NEA Charging Station - Kathmandu', 
      address: 'Durbar Marg, Kathmandu',
      city: 'Kathmandu', 
      connectors: ['CCS2', 'CHAdeMO'],
      operator: 'NEA', 
      lat: 27.7041, 
      lng: 85.3145 
    },
    { 
      id: 2, 
      name: 'Labim Mall Charging Station',
      address: 'Pulchowk, Lalitpur', 
      city: 'Lalitpur',
      connectors: ['CCS2'], 
      operator: 'ElectriVa',
      lat: 27.6762, 
      lng: 85.3175 
    },
    { 
      id: 3, 
      name: 'NEA Charging Station - Butwal',
      address: 'Butwal, Rupandehi',
      city: 'Butwal', 
      connectors: ['CCS2', 'GBT'],
      operator: 'NEA', 
      lat: 27.7006, 
      lng: 83.4532 
    },
    { 
      id: 4, 
      name: 'Sathi Auto Parts',
      address: 'Sitalpati, Kathmandu',
      city: 'Kathmandu',
      connectors: ['CCS2'],
      operator: 'Sathi', 
      lat: 27.7089, 
      lng: 85.3142 
    },
    { 
      id: 5, 
      name: 'MG Charging Hub',
      address: 'Naxal, Kathmandu',
      city: 'Kathmandu',
      connectors: ['CCS2', 'AC'],
      operator: 'MG', 
      lat: 27.7172, 
      lng: 85.3240 
    },
    { 
      id: 6, 
      name: 'TATA Charging Station',
      address: 'New Baneshwor, Kathmandu',
      city: 'Kathmandu',
      connectors: ['CCS2'],
      operator: 'TATA', 
      lat: 27.6939, 
      lng: 85.3453 
    },
    { 
      id: 7, 
      name: 'NEA Charging - Pokhara',
      address: 'Lakeside, Pokhara',
      city: 'Pokhara',
      connectors: ['CCS2', 'GBT'],
      operator: 'NEA', 
      lat: 28.2096, 
      lng: 83.9856 
    },
    { 
      id: 8, 
      name: 'BYD Charging Station',
      address: 'Biratnagar, Morang',
      city: 'Biratnagar',
      connectors: ['CCS2'],
      operator: 'BYD', 
      lat: 26.4525, 
      lng: 87.2718 
    },
  ];

  // Filter stations based on search and city
  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          station.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'All Cities' || station.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)',
      overflow: 'hidden'
    }}>
      {/* LEFT PANEL - 380px fixed */}
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
        {/* HEADER inside left panel (sticky top) */}
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
            margin: 0
          }}>
            EV Stations in Nepal
          </h1>
          <p style={{ 
            fontSize: '13px', 
            color: '#6e6e73', 
            marginTop: '2px',
            margin: 0
          }}>
            Find charging points across Nepal
          </p>
          
          <input
            type="text"
            placeholder="Search..."
            style={{
              width: '100%',
              border: '1px solid #d2d2d7',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '14px',
              marginTop: '12px',
              boxSizing: 'border-box'
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              background: 'white'
            }}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          
          <p style={{ 
            fontSize: '12px', 
            color: '#6e6e73', 
            padding: '8px 0 0 0',
            margin: 0
          }}>
            {filteredStations.length} stations found
          </p>
        </div>
        
        {/* STATION LIST (scrollable) */}
        <div>
          {filteredStations.map((station) => (
            <div 
              key={station.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '12px 16px',
                borderBottom: '1px solid #f5f5f5',
                cursor: 'pointer',
                background: selectedStation?.id === station.id 
                  ? '#fff8f5' : 'white',
                borderLeft: selectedStation?.id === station.id
                  ? '3px solid #e8531a' : '3px solid transparent',
              }}
              onClick={() => setSelectedStation(station)}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fff8f5'}
              onMouseLeave={(e) => e.currentTarget.style.background = selectedStation?.id === station.id ? '#fff8f5' : 'white'}
            >
              {/* Pin icon */}
              <div style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: selectedStation?.id === station.id 
                  ? '#e8531a' : '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>

              {/* Station info */}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: 14, fontWeight: 600, color: '#1d1d1f'
                }}>
                  {station.name}
                </div>
                <div style={{ 
                  fontSize: 12, color: '#6e6e73', marginTop: 2
                }}>
                  {station.address}
                </div>
                <div style={{ marginTop: 6 }}>
                  {station.connectors.map((c: string) => (
                    <span style={{
                      background: '#f0f0f0',
                      borderRadius: 4,
                      padding: '2px 6px',
                      fontSize: 11,
                      marginRight: 4,
                      color: '#555',
                    }} key={c}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* RIGHT PANEL (flex: 1, full height map) */}
      <div style={{
        flex: 1,
        height: '100%',
        position: 'relative',
      }}>
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=80.0%2C26.0%2C88.5%2C30.5&layer=mapnik&marker=28.3949%2C84.1240"
          width="100%"
          height="100%"
          style={{ border: 'none', display: 'block' }}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default EvCharging;