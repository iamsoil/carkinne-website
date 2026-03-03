"use client";

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { formatNPR } from '@/utils/format';

function calcEMI(principal: number, rate: number, months: number): number {
  if (!principal || !rate || !months) return 0;
  const r = rate / 12 / 100;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function InlineEmiCalculator({ price, carName }: { price: number, carName: string }) {
  const [downPct, setDownPct] = useState(10);
  const [tenure, setTenure] = useState(5);
  const [rate, setRate] = useState(10.5);

  const downPayment = Math.round((price * downPct) / 100);
  const loanAmount = price - downPayment;
  const months = tenure * 12;
  const emi = calcEMI(loanAmount, rate, months);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
      }}>
        {/* Left - inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Down Payment */}
          <div>
            <div style={{
              fontSize: '11px', fontWeight: '700',
              color: '#6e6e73', textTransform: 'uppercase',
              letterSpacing: '1px', marginBottom: '10px',
            }}>
              Down Payment — {downPct}%
            </div>
            <input
              type="range" min={10} max={50} value={downPct}
              onChange={e => setDownPct(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#e8531a' }}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '11px', color: '#6e6e73', marginTop: '4px',
            }}>
              <span>10%</span><span>50%</span>
            </div>
            <div style={{
              marginTop: '8px',
              fontSize: '13px',
              color: '#1d1d1f',
              fontWeight: '600',
            }}>
              Down: {formatNPR(downPayment)} → Loan: {formatNPR(loanAmount)}
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div style={{
              fontSize: '11px', fontWeight: '700',
              color: '#6e6e73', textTransform: 'uppercase',
              letterSpacing: '1px', marginBottom: '10px',
            }}>
              Loan Tenure
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5, 6, 7].map(yr => (
                <button
                  key={yr}
                  onClick={() => setTenure(yr)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '100px',
                    fontSize: '13px',
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

          {/* Interest Rate */}
          <div>
            <div style={{
              fontSize: '11px', fontWeight: '700',
              color: '#6e6e73', textTransform: 'uppercase',
              letterSpacing: '1px', marginBottom: '10px',
            }}>
              Interest Rate
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setRate(r => Math.max(8, Math.round((r - 0.25) * 100) / 100))}
                style={{
                  width: '36px', height: '40px',
                  border: '1px solid #d2d2d7',
                  borderRadius: '8px 0 0 8px',
                  background: '#fff', fontSize: '16px',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >−</button>
              <div style={{
                padding: '8px 20px',
                border: '1px solid #d2d2d7',
                borderLeft: 'none', borderRight: 'none',
                fontSize: '15px', fontWeight: '600',
                minWidth: '70px', textAlign: 'center',
              }}>
                {rate}%
              </div>
              <button
                onClick={() => setRate(r => Math.min(18, Math.round((r + 0.25) * 100) / 100))}
                style={{
                  width: '36px', height: '40px',
                  border: '1px solid #d2d2d7',
                  borderRadius: '0 8px 8px 0',
                  background: '#fff', fontSize: '16px',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >+</button>
            </div>
            <div style={{
              fontSize: '11px', color: '#6e6e73', marginTop: '6px',
            }}>
              Nepal bank average: 10–11%
            </div>
          </div>
        </div>

        {/* Right - results */}
        <div style={{
          background: '#fff8f5',
          border: '1.5px solid #e8531a',
          borderRadius: '16px',
          padding: '24px',
        }}>
          <div style={{
            fontSize: '11px', fontWeight: '700',
            color: '#6e6e73', textTransform: 'uppercase',
            letterSpacing: '1px', marginBottom: '8px',
          }}>
            Monthly EMI
          </div>
          <div style={{
            fontSize: '36px', fontWeight: '800',
            color: '#e8531a', letterSpacing: '-1px',
            marginBottom: '4px',
          }}>
            {formatNPR(Math.round(emi))}
          </div>
          <div style={{
            fontSize: '13px', color: '#6e6e73',
            marginBottom: '20px',
          }}>
            per month for {tenure} years
          </div>

          <div style={{
            height: '1px', background: '#fde8da',
            marginBottom: '16px',
          }} />

          {[
            ['Car Price', formatNPR(price)],
            ['Down Payment', formatNPR(downPayment)],
            ['Loan Amount', formatNPR(loanAmount)],
            ['Interest Rate', `${rate}%`],
            ['Total Interest', formatNPR(Math.round(totalInterest))],
            ['Total Payment', formatNPR(Math.round(totalPayment))],
          ].map(([label, value], i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '5px 0',
              fontSize: '13px',
              borderBottom: i < 5 ? '1px solid #fde8da' : 'none',
            }}>
              <span style={{ color: '#6e6e73' }}>{label}</span>
              <span style={{
                color: label === 'Total Payment' ? '#e8531a' : '#1d1d1f',
                fontWeight: label === 'Total Payment' ? '700' : '500',
              }}>
                {value}
              </span>
            </div>
          ))}

          <div style={{
            marginTop: '16px',
            padding: '10px 12px',
            background: 'white',
            border: '1px solid #fde8da',
            borderRadius: '8px',
            fontSize: '11px',
            color: '#6e6e73',
            lineHeight: 1.6,
          }}>
            <span style={{ fontWeight: '700', color: '#e8531a' }}>Disclaimer: </span>
            Indicative estimates only. Actual rates may vary per bank policy and NRB regulations.
          </div>
        </div>
      </div>
    </div>
  )
}

function ShowroomsMap({ showrooms }: { showrooms: any[] }) {
  const mapRef = useRef<any>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<Record<string, any>>({})

  useMapEffect(() => {
    if (typeof window === 'undefined') return
    if (mapInstanceRef.current) return

    const L = (window as any).L
    if (!L) {
      // Load Leaflet if not present
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => initMap()
      document.head.appendChild(script)
    } else {
      initMap()
    }

    function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return
      const L = (window as any).L

      const map = L.map(mapRef.current, {
        center: [27.7172, 85.3240],
        zoom: 12,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      mapInstanceRef.current = map

      if (showrooms.length > 0) {
        addMarkers(map, L)
      }
    }

    function addMarkers(map: any, L: any) {
      const validShowrooms = showrooms.filter(s => s.lat && s.lng)
      if (validShowrooms.length === 0) return

      validShowrooms.forEach(showroom => {
        const markerHtml = `
          <div style="
            width:32px; height:32px;
            background:#e8531a;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:2px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            display:flex; align-items:center; justify-content:center;
          ">
            <div style="transform:rotate(45deg); color:white; font-size:12px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                <path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2L2 7h20L12 2z"/>
              </svg>
            </div>
          </div>
        `

        const icon = L.divIcon({
          html: markerHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -36],
          className: '',
        })

        const marker = L.marker([showroom.lat, showroom.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:-apple-system,sans-serif;min-width:180px;">
              <div style="font-weight:700;font-size:14px;color:#1d1d1f;margin-bottom:4px;">
                ${showroom.name}
              </div>
              <div style="font-size:12px;color:#6e6e73;margin-bottom:6px;">
                ${showroom.address || ''}
              </div>
              ${showroom.phone ? `
                <div style="font-size:12px;color:#e8531a;font-weight:600;">
                  ${showroom.phone}
                </div>
              ` : ''}
              ${showroom.working_hours ? `
                <div style="font-size:11px;color:#6e6e73;margin-top:4px;">
                  ${showroom.working_hours}
                </div>
              ` : ''}
              <a href="https://www.google.com/maps/dir/?api=1&destination=${showroom.lat},${showroom.lng}"
                target="_blank"
                style="
                  display:inline-block;margin-top:8px;
                  background:#e8531a;color:white;
                  padding:4px 12px;border-radius:6px;
                  font-size:11px;font-weight:700;
                  text-decoration:none;
                ">
                Directions
              </a>
            </div>
          `)

        markersRef.current[showroom.id] = marker
      })

      // Fit map to all markers
      if (validShowrooms.length === 1) {
        map.setView([validShowrooms[0].lat, validShowrooms[0].lng], 14)
      } else {
        const group = L.featureGroup(
          validShowrooms.map(s => L.marker([s.lat, s.lng]))
        )
        map.fitBounds(group.getBounds().pad(0.2))
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [showrooms])

  return (
    <div
      ref={mapRef}
      style={{ height: '320px', width: '100%', borderRadius: '0 0 16px 16px' }}
    />
  )
}

const IconHeart = ({ filled }: { filled?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#e8531a' : 'none'} stroke={filled ? '#e8531a' : 'currentColor'} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)

const IconShare = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)

const IconChevron = ({ up }: { up?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: up ? 'rotate(180deg)' : 'none' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e8531a" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconMap = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
)

const IconPhone = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
  </svg>
)

const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

const IconGauge = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 12l4-4"/>
  </svg>
)

const IconFuel = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 22V8l7-6 7 6v14M3 22h14M10 22V12h4v10"/>
  </svg>
)

const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
)

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
)

const IconWhatsApp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const CarDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showEmiModal, setShowEmiModal] = useState(false);
  const [similarCars, setSimilarCars] = useState<any[]>([]);
  const [showrooms, setShowrooms] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [expandedOnRoad, setExpandedOnRoad] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (slug) {
      fetchCar();
    }
  }, [slug]);

  useEffect(() => {
    if (car) {
      fetchSimilarCars();
      fetchShowrooms();
      fetchOffers();
    }
  }, [car]);

  const fetchCar = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      
      setCar(data);
      console.log('Car details fetched:', data);
    } catch (err) {
      console.error('Error fetching car:', err);
      setError('Unable to load car details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarCars = async () => {
    if (!car) return;
    
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('category', car.category)
        .neq('id', car.id)
        .limit(4);

      if (!error) {
        setSimilarCars(data || []);
      }
    } catch (err) {
      console.error('Error fetching similar cars:', err);
    }
  };

  const fetchShowrooms = async () => {
    try {
      const { data, error } = await supabase
        .from('showrooms')
        .select('*')
        .eq('brand', car?.brand)
        .limit(4);

      if (!error) {
        setShowrooms(data || []);
      }
    } catch (err) {
      console.error('Error fetching showrooms:', err);
    }
  };

  const fetchOffers = async () => {
    if (!car) return;
    
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('car_id', car.id)
        .limit(3);

      if (!error) {
        setOffers(data || []);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    }
  };

  // Calculate on-road price breakdown
  const calculateOnRoadPrice = () => {
    if (!car) return null;
    
    const exShowroom = car.ex_showroom_price;
    const registration = Math.round(exShowroom * 0.1); // 10% registration
    const insurance = Math.round(exShowroom * 0.02); // 2% insurance
    const roadTax = Math.round(exShowroom * 0.01); // 1% road tax
    
    return {
      exShowroom,
      registration,
      insurance,
      roadTax,
      total: exShowroom + registration + insurance + roadTax
    };
  };

  const onRoadBreakdown = calculateOnRoadPrice();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        background: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '36px',
            height: '36px',
            border: '3px solid #f0f0f0',
            borderTop: '3px solid #e8531a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ fontSize: '13px', color: '#6e6e73', marginTop: '12px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        background: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px 24px',
          textAlign: 'center',
          border: '1px solid #e5e5e5',
          maxWidth: '400px',
          width: '100%'
        }}>
          <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </p>
          <button
            onClick={fetchCar}
            style={{
              background: '#e8531a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#c94415';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#e8531a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        background: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px 24px',
          textAlign: 'center',
          border: '1px solid #e5e5e5',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 8px'
          }}>
            Car Not Found
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6e6e73',
            margin: '0 0 24px'
          }}>
            The car you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/cars')}
            style={{
              background: '#e8531a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#c94415';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#e8531a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Browse Cars
          </button>
        </div>
      </div>
    );
  }

  // Calculate EMI (10% down payment, 5 year loan, 10% interest)
  const calculateEMI = () => {
    const loanAmount = car.ex_showroom_price * 0.9; // 10% down payment
    const interestRate = 10; // 10% annual interest
    const loanTerm = 5; // 5 years
    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;
    
    const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    return Math.round(emi);
  };

  const emi = calculateEMI();

  // SEO Meta tags
  const metaTitle = `${car.name} Price in Nepal 2025 — ${formatNPR(car.ex_showroom_price)} | CarKinne`;
  const metaDescription = `${car.name} price in Nepal starts at ${formatNPR(car.ex_showroom_price)}. Check full specs, EMI, colors, variants and find nearest showroom. Updated ${formatDate(car.updated_at || new Date().toISOString())}.`;

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      background: 'white',
      minHeight: '100vh'
    }}>
      {/* SEO Meta */}
      <div className="hidden">
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </div>

      {/* BREADCRUMB */}
      <div style={{
        padding: isMobile ? '12px 16px 0' : '16px 24px 0',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '12px' }}>
          <a 
            href="/" 
            style={{ 
              color: '#6e6e73', 
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#e8531a'}
            onMouseLeave={e => e.currentTarget.style.color = '#6e6e73'}
          >
            Home
          </a>
          <span style={{ color: '#d2d2d7', margin: '0 6px' }}>/</span>
          <a 
            href="/cars" 
            style={{ 
              color: '#6e6e73', 
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#e8531a'}
            onMouseLeave={e => e.currentTarget.style.color = '#6e6e73'}
          >
            Cars
          </a>
          <span style={{ color: '#d2d2d7', margin: '0 6px' }}>/</span>
          <a 
            href={`/cars?brand=${car.brand}`} 
            style={{ 
              color: '#6e6e73', 
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#e8531a'}
            onMouseLeave={e => e.currentTarget.style.color = '#6e6e73'}
          >
            {car.brand}
          </a>
          <span style={{ color: '#d2d2d7', margin: '0 6px' }}>/</span>
          <span style={{ color: '#1d1d1f', fontWeight: '600' }}>
            {car.name}
          </span>
        </div>
        <div style={{
          fontSize: '11px',
          color: '#6e6e73',
          marginTop: '6px'
        }}>
          Price updated: {formatDate(car.updated_at || new Date().toISOString())}
        </div>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: isMobile ? '16px' : '24px'
      }}>
        {/* TOP SECTION - Image + Price Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
          gap: '24px'
        }}>
          {/* IMAGE GALLERY */}
          <div>
            {/* Main image */}
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #e5e5e5',
              background: '#f5f5f7',
              position: 'relative',
              marginBottom: '10px'
            }}>
              <img 
                src={car.images[activeImageIndex] || 'https://placehold.co/800x600/cccccc/ffffff?text=Car+Image'} 
                alt={`${car.brand} ${car.name}`} 
                style={{
                  width: '100%',
                  height: isMobile ? '260px' : '380px',
                  objectFit: 'contain'
                }}
              />
              
              {/* Top-right buttons */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  style={{
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#e8531a'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
                >
                  <IconHeart filled={isSaved} />
                </button>
                <button
                  style={{
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#e8531a'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
                >
                  <IconShare />
                </button>
              </div>
            </div>
            
            {/* Thumbnail strip */}
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              {car.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  style={{
                    width: isMobile ? '64px' : '80px',
                    height: isMobile ? '48px' : '60px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid',
                    borderColor: activeImageIndex === index ? '#e8531a' : '#e5e5e5',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <img 
                    src={image} 
                    alt={`${car.brand} ${car.name} ${index + 1}`} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* PRICE CARD */}
          <div style={{
            border: '1px solid #e5e5e5',
            borderRadius: '16px',
            padding: isMobile ? '20px' : '24px',
            background: 'white',
            position: isMobile ? 'static' : 'sticky',
            top: '88px'
          }}>
            <h1 style={{
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: '800',
              color: '#1d1d1f',
              letterSpacing: '-0.5px',
              margin: '0 0 4px'
            }}>
              {car.name} {car.variant}
            </h1>
            <p style={{
              fontSize: '13px',
              color: '#6e6e73',
              margin: '0 0 16px'
            }}>
              {car.brand} • {car.year}
            </p>
            
            {/* Ex-showroom price */}
            <div style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#6e6e73',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '4px'
            }}>
              Ex-showroom Price
            </div>
            <p style={{
              fontSize: isMobile ? '28px' : '34px',
              fontWeight: '800',
              color: '#e8531a',
              letterSpacing: '-1px',
              margin: '0 0 16px'
            }}>
              {formatNPR(car.ex_showroom_price)}
            </p>
            
            {/* Estimated On-Road Price */}
            <div
              onClick={() => setExpandedOnRoad(!expandedOnRoad)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #e5e5e5',
                borderRadius: '10px',
                padding: '12px 14px',
                cursor: 'pointer',
                background: 'white',
                fontFamily: 'inherit',
                width: '100%'
              }}
            >
              <span style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#1d1d1f'
              }}>
                Estimated On-Road Price
              </span>
              <IconChevron up={expandedOnRoad} />
            </div>
            
            {expandedOnRoad && onRoadBreakdown && (
              <div style={{
                padding: '12px 14px',
                borderTop: '1px solid #f0f0f0',
                background: '#fafafa',
                borderRadius: '0 0 10px 10px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  padding: '4px 0',
                  borderBottom: '1px solid #f5f5f5'
                }}>
                  <span>Ex-showroom</span>
                  <span>{formatNPR(onRoadBreakdown.exShowroom)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  padding: '4px 0',
                  borderBottom: '1px solid #f5f5f5'
                }}>
                  <span>Registration</span>
                  <span>~{formatNPR(onRoadBreakdown.registration)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  padding: '4px 0',
                  borderBottom: '1px solid #f5f5f5'
                }}>
                  <span>Insurance (1yr)</span>
                  <span>~{formatNPR(onRoadBreakdown.insurance)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  padding: '4px 0',
                  borderBottom: '1px solid #f5f5f5'
                }}>
                  <span>Road tax</span>
                  <span>~{formatNPR(onRoadBreakdown.roadTax)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#e8531a',
                  borderTop: '1px solid #e5e5e5',
                  paddingTop: '8px',
                  marginTop: '4px'
                }}>
                  <span>Total On-Road</span>
                  <span>{formatNPR(onRoadBreakdown.total)}</span>
                </div>
                <p style={{
                  fontSize: '11px',
                  color: '#6e6e73',
                  marginTop: '8px'
                }}>
                  Note: On-road price is estimated and may vary
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div style={{
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '10px'
            }}>
              <button 
                onClick={() => setShowEmiModal(true)}
                style={{
                  background: '#e8531a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: '700',
                  width: '100%',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#c94415';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#e8531a';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Calculate EMI
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/97798XXXXXXXX?text=I'm interested in ${car.name} ${car.variant}`, '_blank')}
                style={{
                  background: 'white',
                  color: '#1d1d1f',
                  border: '1.5px solid #e5e5e5',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  width: '100%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#e8531a';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e5e5';
                }}
              >
                <IconWhatsApp />
                Enquire on WhatsApp
              </button>
              <button 
                onClick={() => document.getElementById('showrooms-section')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: '#f5f5f7',
                  color: '#1d1d1f',
                  border: '1px solid #e5e5e5',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  width: '100%',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#e8531a';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#f5f5f7';
                  e.currentTarget.style.color = '#1d1d1f';
                }}
              >
                Find Showroom
              </button>
            </div>
          </div>
        </div>

        {/* KEY SPECS STRIP */}
        <div style={{
          margin: '24px 0',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
          gap: isMobile ? '8px' : '12px'
        }}>
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: isMobile ? '12px 8px' : '16px 12px',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#e8531a'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
          >
            <IconGauge style={{ color: '#e8531a', margin: '0 auto 8px', display: 'block' }} />
            <div style={{
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: '700',
              color: '#1d1d1f'
            }}>
              {car.engine_cc} cc
            </div>
            <div style={{
              fontSize: isMobile ? '10px' : '11px',
              color: '#6e6e73',
              marginTop: '2px'
            }}>
              Engine
            </div>
          </div>
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: isMobile ? '12px 8px' : '16px 12px',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#e8531a'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
          >
            <IconFuel style={{ color: '#e8531a', margin: '0 auto 8px', display: 'block' }} />
            <div style={{
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: '700',
              color: '#1d1d1f'
            }}>
              {car.mileage_kmpl ? `${car.mileage_kmpl} kmpl` : 'N/A'}
            </div>
            <div style={{
              fontSize: isMobile ? '10px' : '11px',
              color: '#6e6e73',
              marginTop: '2px'
            }}>
              Mileage
            </div>
          </div>
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: isMobile ? '12px 8px' : '16px 12px',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#e8531a'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
          >
            <IconFuel style={{ color: '#e8531a', margin: '0 auto 8px', display: 'block' }} />
            <div style={{
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: '700',
              color: '#1d1d1f'
            }}>
              {car.fuel_type}
            </div>
            <div style={{
              fontSize: isMobile ? '10px' : '11px',
              color: '#6e6e73',
              marginTop: '2px'
            }}>
              Fuel
            </div>
          </div>
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: isMobile ? '12px 8px' : '16px 12px',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#e8531a'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
          >
            <IconSettings style={{ color: '#e8531a', margin: '0 auto 8px', display: 'block' }} />
            <div style={{
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: '700',
              color: '#1d1d1f'
            }}>
              {car.transmission}
            </div>
            <div style={{
              fontSize: isMobile ? '10px' : '11px',
              color: '#6e6e73',
              marginTop: '2px'
            }}>
              Transmission
            </div>
          </div>
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: isMobile ? '12px 8px' : '16px 12px',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#e8531a'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
          >
            <IconUsers style={{ color: '#e8531a', margin: '0 auto 8px', display: 'block' }} />
            <div style={{
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: '700',
              color: '#1d1d1f'
            }}>
              {car.seating} Seats
            </div>
            <div style={{
              fontSize: isMobile ? '10px' : '11px',
              color: '#6e6e73',
              marginTop: '2px'
            }}>
              Seating
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
        <div style={{ marginTop: '24px' }}>
          {/* Tab bar */}
          <div style={{
            display: 'flex',
            borderBottom: '2px solid #f0f0f0',
            gap: '0',
            overflowX: 'auto',
            marginBottom: '24px'
          }}>
            {[
              { id: 'specs', label: 'Specifications' },
              { id: 'features', label: 'Features' },
              { id: 'colors', label: 'Colors' },
              { id: 'variants', label: 'Variants' },
              { id: 'emi', label: 'EMI Calculator' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: isMobile ? '10px 14px' : '12px 20px',
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: '600',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                  color: activeTab === tab.id ? '#e8531a' : '#6e6e73',
                  borderBottom: '2px solid',
                  borderColor: activeTab === tab.id ? '#e8531a' : 'transparent',
                  marginBottom: activeTab === tab.id ? '-2px' : '0'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Specifications */}
          {activeTab === 'specs' && (
            <div style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  margin: '0'
                }}>
                  Full Specifications
                </h3>
              </div>
              <div style={{
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '24px'
              }}>
                <div>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#6e6e73',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '12px'
                  }}>
                    Engine & Performance
                  </h4>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Engine Type</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>Turbocharged</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Engine Size</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>{car.engine_cc} cc</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Max Power</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>150 bhp</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Max Torque</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>250 Nm</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Fuel System</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>Direct Injection</span>
                  </div>
                  
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#6e6e73',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '12px',
                    marginTop: '24px'
                  }}>
                    Dimensions & Weight
                  </h4>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Length</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>4795 mm</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Width</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>1855 mm</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Height</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>1835 mm</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Wheelbase</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>2745 mm</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Kerb Weight</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>2180 kg</span>
                  </div>
                </div>
                
                <div>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#6e6e73',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '12px'
                  }}>
                    Suspension & Brakes
                  </h4>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Front Suspension</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>MacPherson Strut</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Rear Suspension</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>Multi-link</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Front Brakes</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>Ventilated Disc</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Rear Brakes</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>Disc</span>
                  </div>
                  
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#6e6e73',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '12px',
                    marginTop: '24px'
                  }}>
                    Fuel & Tyres
                  </h4>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Fuel Tank Capacity</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>80 L</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Tyre Size</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>265/60 R18</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#6e6e73' }}>Spare Wheel</span>
                    <span style={{ color: '#1d1d1f', fontWeight: '600', textAlign: 'right' }}>Full Size</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Features */}
          {activeTab === 'features' && (
            <div style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  margin: '0'
                }}>
                  Key Features
                </h3>
              </div>
              <div style={{
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '10px'
              }}>
                {[
                  'ABS', 'Airbags (6)', 'Sunroof', 'LED Headlights',
                  'Automatic Climate Control', 'Touchscreen Infotainment',
                  'Bluetooth Connectivity', 'Cruise Control',
                  'Parking Sensors', 'Keyless Entry',
                  'Push Button Start', 'Electric Folding Mirrors'
                ].map((feature, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      color: '#1d1d1f'
                    }}
                  >
                    <IconCheck />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Colors */}
          {activeTab === 'colors' && (
            <div style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  margin: '0'
                }}>
                  Available Colors
                </h3>
              </div>
              <div style={{
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '12px'
              }}>
                {['White Pearl', 'Silver', 'Black', 'Red', 'Blue', 'Bronze'].map((color, index) => (
                  <div 
                    key={index}
                    onClick={() => setActiveImageIndex(index % car.images.length)}
                    style={{
                      border: '1px solid #e5e5e5',
                      borderRadius: '12px',
                      padding: '16px 12px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#e8531a'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
                  >
                    <div 
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        margin: '0 auto 8px',
                        border: '1px solid #e5e5e5',
                        background: getColorCode(color)
                      }}
                    ></div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#1d1d1f'
                    }}>
                      {color}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Variants */}
          {activeTab === 'variants' && (
            <div style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  margin: '0'
                }}>
                  {car.name} Variants
                </h3>
              </div>
              {isMobile ? (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    padding: '16px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    background: '#fff8f5'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1d1d1f' }}>
                          {car.name} {car.variant}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6e6e73' }}>
                          Automatic
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#e8531a' }}>
                        {formatNPR(car.ex_showroom_price)}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6e6e73', marginBottom: '12px' }}>
                      +Cruise control, Premium sound
                    </div>
                    <button style={{
                      width: '100%',
                      background: '#e8531a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}>
                      Selected
                    </button>
                  </div>
                  <div style={{
                    padding: '16px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1d1d1f' }}>
                          {car.name} Base
                        </div>
                        <div style={{ fontSize: '12px', color: '#6e6e73' }}>
                          Manual
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#1d1d1f' }}>
                        {formatNPR(4500000)}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6e6e73', marginBottom: '12px' }}>
                      Basic features
                    </div>
                    <button style={{
                      width: '100%',
                      background: 'white',
                      color: '#1d1d1f',
                      border: '1px solid #d2d2d7',
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}>
                      Enquire
                    </button>
                  </div>
                  <div style={{
                    padding: '16px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1d1d1f' }}>
                          {car.name} Mid
                        </div>
                        <div style={{ fontSize: '12px', color: '#6e6e73' }}>
                          Manual
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#1d1d1f' }}>
                        {formatNPR(4850000)}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6e6e73', marginBottom: '12px' }}>
                      +Sunroof, Leather seats
                    </div>
                    <button style={{
                      width: '100%',
                      background: 'white',
                      color: '#1d1d1f',
                      border: '1px solid #d2d2d7',
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}>
                      Enquire
                    </button>
                  </div>
                  <div style={{
                    padding: '16px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1d1d1f' }}>
                          {car.name} Top
                        </div>
                        <div style={{ fontSize: '12px', color: '#6e6e73' }}>
                          Automatic
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#1d1d1f' }}>
                        {formatNPR(5500000)}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6e6e73', marginBottom: '12px' }}>
                      +360 camera, Massage seats
                    </div>
                    <button style={{
                      width: '100%',
                      background: 'white',
                      color: '#1d1d1f',
                      border: '1px solid #d2d2d7',
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}>
                      Enquire
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#f5f5f7' }}>
                        <th style={{ fontSize: '11px', fontWeight: '700', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '1px', padding: '10px 14px', textAlign: 'left' }}>Variant</th>
                        <th style={{ fontSize: '11px', fontWeight: '700', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '1px', padding: '10px 14px', textAlign: 'left' }}>Price</th>
                        <th style={{ fontSize: '11px', fontWeight: '700', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '1px', padding: '10px 14px', textAlign: 'left' }}>Key Difference</th>
                        <th style={{ fontSize: '11px', fontWeight: '700', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '1px', padding: '10px 14px', textAlign: 'left' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div>
                            <div style={{ fontWeight: '600' }}>{car.name} Base</div>
                            <div style={{ fontSize: '12px', color: '#6e6e73' }}>Manual</div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: '600' }}>{formatNPR(4500000)}</td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: '#6e6e73' }}>Basic features</td>
                        <td style={{ padding: '12px 14px' }}>
                          <button style={{
                            border: '1px solid #d2d2d7',
                            borderRadius: '8px',
                            padding: '6px 14px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: 'white',
                            cursor: 'pointer',
                            fontFamily: 'inherit'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#e8531a';
                            e.currentTarget.style.color = '#e8531a';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#d2d2d7';
                            e.currentTarget.style.color = '#1d1d1f';
                          }}>
                            Enquire
                          </button>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div>
                            <div style={{ fontWeight: '600' }}>{car.name} Mid</div>
                            <div style={{ fontSize: '12px', color: '#6e6e73' }}>Manual</div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: '600' }}>{formatNPR(4850000)}</td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: '#6e6e73' }}>+Sunroof, Leather seats</td>
                        <td style={{ padding: '12px 14px' }}>
                          <button style={{
                            border: '1px solid #d2d2d7',
                            borderRadius: '8px',
                            padding: '6px 14px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: 'white',
                            cursor: 'pointer',
                            fontFamily: 'inherit'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#e8531a';
                            e.currentTarget.style.color = '#e8531a';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#d2d2d7';
                            e.currentTarget.style.color = '#1d1d1f';
                          }}>
                            Enquire
                          </button>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fff8f5' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div>
                            <div style={{ fontWeight: '600' }}>{car.name} {car.variant}</div>
                            <div style={{ fontSize: '12px', color: '#6e6e73' }}>Automatic</div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: '700', color: '#e8531a' }}>
                          {formatNPR(car.ex_showroom_price)}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: '#6e6e73' }}>+Cruise control, Premium sound</td>
                        <td style={{ padding: '12px 14px' }}>
                          <button style={{
                            background: '#e8531a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 14px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontFamily: 'inherit'
                          }}>
                            Selected
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '12px 14px' }}>
                          <div>
                            <div style={{ fontWeight: '600' }}>{car.name} Top</div>
                            <div style={{ fontSize: '12px', color: '#6e6e73' }}>Automatic</div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: '600' }}>{formatNPR(5500000)}</td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: '#6e6e73' }}>+360 camera, Massage seats</td>
                        <td style={{ padding: '12px 14px' }}>
                          <button style={{
                            border: '1px solid #d2d2d7',
                            borderRadius: '8px',
                            padding: '6px 14px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: 'white',
                            cursor: 'pointer',
                            fontFamily: 'inherit'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#e8531a';
                            e.currentTarget.style.color = '#e8531a';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#d2d2d7';
                            e.currentTarget.style.color = '#1d1d1f';
                          }}>
                            Enquire
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab: EMI Calculator */}
          {activeTab === 'emi' && (
            <div style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '16px',
              padding: '20px'
            }}>
              {isMobile ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '24px'
                }}>
                  <InlineEmiCalculator price={car.ex_showroom_price} carName={car.name} />
                </div>
              ) : (
                <InlineEmiCalculator price={car.ex_showroom_price} carName={car.name} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* EMI MODAL */}
      {showEmiModal && (
        <div 
          style={{
            position: 'fixed',
            inset: '0',
            background: 'rgba(0,0,0,0.5)',
            zIndex: '100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowEmiModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: isMobile ? '20px' : '32px',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '800',
                color: '#1d1d1f'
              }}>
                EMI Calculator for {car.name}
              </div>
              <button
                onClick={() => setShowEmiModal(false)}
                style={{
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#6e6e73',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#e8531a'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '4px 0' }}>
              <InlineEmiCalculator price={car.ex_showroom_price} carName={car.name} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get color codes
const getColorCode = (color: string) => {
  const colors: Record<string, string> = {
    'White Pearl': '#f8f9fa',
    'Silver': '#c0c0c0',
    'Black': '#000000',
    'Red': '#dc2626',
    'Blue': '#2563eb',
    'Bronze': '#d97706'
  };
  return colors[color] || '#cccccc';
};

export default CarDetail;