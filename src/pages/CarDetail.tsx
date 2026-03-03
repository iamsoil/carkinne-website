"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Heart, Share2, Calendar, Fuel, Settings, Users, Gauge, 
  ChevronDown, MapPin, Phone, Clock, Check, Palette,
  CalendarIcon, IndianRupee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { formatNPR } from '@/utils/format';
import { useEffect as useMapEffect, useRef } from 'react'

function calcEMI(principal: number, rate: number, months: number): number {
  if (!principal || !rate || !months) return 0
  const r = rate / 12 / 100
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

function InlineEmiCalculator({ price, carName }: { price: number, carName: string }) {
  const [downPct, setDownPct] = useState(10)
  const [tenure, setTenure] = useState(5)
  const [rate, setRate] = useState(10.5)

  const downPayment = Math.round((price * downPct) / 100)
  const loanAmount = price - downPayment
  const months = tenure * 12
  const emi = calcEMI(loanAmount, rate, months)
  const totalPayment = emi * months
  const totalInterest = totalPayment - loanAmount

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

const CarDetail = () => {
  const { slug } = useParams();
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
      <div className="container mx-auto px-4 py-20">
        <div className="text-center py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-gray-200 h-96 rounded-2xl mb-4"></div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 w-24 h-24 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="bg-gray-200 h-96 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchCar}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Car Not Found</h2>
          <p className="text-muted-foreground">The car you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-4 bg-foreground text-white hover:bg-accent" onClick={() => window.location.href = '/cars'}>
            Browse All Cars
          </Button>
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
    <div className="container mx-auto px-4 py-8">
      {/* SEO Meta */}
      <div className="hidden">
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </div>

      {/* TOP SECTION */}
      <div className="mb-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-2">
          <a href="/" className="hover:text-accent">Home</a> / 
          <a href="/cars" className="hover:text-accent"> Cars</a> / 
          <a href={`/cars?brand=${car.brand}`} className="hover:text-accent"> {car.brand}</a> / 
          <span className="text-foreground"> {car.name}</span>
        </div>
        
        {/* Last updated badge */}
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>Price updated: {formatDate(car.updated_at || new Date().toISOString())}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* IMAGE GALLERY */}
        <div className="lg:w-2/3">
          {/* Large main image */}
          <div className="relative rounded-2xl overflow-hidden mb-4 bg-gray-100 border border-border">
            <img 
              src={car.images[activeImageIndex] || 'https://placehold.co/800x600/cccccc/ffffff?text=Car+Image'} 
              alt={`${car.brand} ${car.name}`} 
              className="w-full h-96 object-contain cursor-pointer"
              onClick={() => console.log('Open fullscreen lightbox')}
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 rounded-full bg-white hover:bg-accent hover:text-white border border-border"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
          
          {/* Thumbnail strip */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {car.images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 ${activeImageIndex === index ? 'border-accent' : 'border-border'}`}
              >
                <img 
                  src={image} 
                  alt={`${car.brand} ${car.name} ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* PRICE CARD */}
        <div className="lg:w-1/3">
          <Card className="sticky top-24 border border-border rounded-2xl">
            <CardContent className="p-6">
              <div className="mb-4">
                <h1 className="text-2xl font-semibold">{car.name} {car.variant}</h1>
                <p className="text-muted-foreground">{car.brand} • {car.year}</p>
              </div>
              
              {/* Ex-showroom price */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Ex-showroom Price</p>
                <p className="text-3xl font-semibold text-accent">
                  {formatNPR(car.ex_showroom_price)}
                </p>
              </div>
              
              {/* Estimated On-Road Price */}
              <div className="mb-4 border border-border rounded-xl p-4">
                <button 
                  className="flex justify-between items-center w-full"
                  onClick={() => setExpandedOnRoad(!expandedOnRoad)}
                >
                  <span className="font-medium">Estimated On-Road Price</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedOnRoad ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedOnRoad && onRoadBreakdown && (
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Ex-showroom</span>
                      <span>{formatNPR(onRoadBreakdown.exShowroom)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Registration</span>
                      <span>~{formatNPR(onRoadBreakdown.registration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance (1yr)</span>
                      <span>~{formatNPR(onRoadBreakdown.insurance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Road tax</span>
                      <span>~{formatNPR(onRoadBreakdown.roadTax)}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-semibold">
                      <span>Total On-Road</span>
                      <span className="text-accent">{formatNPR(onRoadBreakdown.total)}</span>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-2">
                  Note: On-road price is estimated and may vary
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-white rounded-lg"
                  onClick={() => setShowEmiModal(true)}
                >
                  Calculate EMI
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg"
                  onClick={() => window.open(`https://wa.me/97798XXXXXXXX?text=I'm interested in ${car.name} ${car.variant}`, '_blank')}
                >
                  Enquire on WhatsApp
                </Button>
              </div>
              
              <Button 
                className="w-full bg-foreground text-white hover:bg-accent rounded-lg"
                onClick={() => document.getElementById('showrooms-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Find Showroom
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KEY SPECS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 my-12">
        <div className="bg-white border border-border rounded-xl p-4 text-center">
          <Gauge className="h-6 w-6 mx-auto text-accent mb-2" />
          <p className="text-sm font-medium">{car.engine_cc} cc</p>
          <p className="text-xs text-muted-foreground">Engine</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 text-center">
          <Fuel className="h-6 w-6 mx-auto text-accent mb-2" />
          <p className="text-sm font-medium">
            {car.mileage_kmpl ? `${car.mileage_kmpl} kmpl` : 'N/A'}
          </p>
          <p className="text-xs text-muted-foreground">Mileage</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 text-center">
          <Fuel className="h-6 w-6 mx-auto text-accent mb-2" />
          <p className="text-sm font-medium">{car.fuel_type}</p>
          <p className="text-xs text-muted-foreground">Fuel</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 text-center">
          <Settings className="h-6 w-6 mx-auto text-accent mb-2" />
          <p className="text-sm font-medium">{car.transmission}</p>
          <p className="text-xs text-muted-foreground">Transmission</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 text-center">
          <Users className="h-6 w-6 mx-auto text-accent mb-2" />
          <p className="text-sm font-medium">{car.seating} Seats</p>
          <p className="text-xs text-muted-foreground">Seating</p>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="specifications" className="w-full mb-16">
        <TabsList className="grid w-full grid-cols-5 bg-transparent border-b border-border rounded-none p-0 h-auto">
          <TabsTrigger 
            value="specifications" 
            className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none pb-3 px-0"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger 
            value="features" 
            className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none pb-3 px-0"
          >
            Features
          </TabsTrigger>
          <TabsTrigger 
            value="colors" 
            className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none pb-3 px-0"
          >
            Colors
          </TabsTrigger>
          <TabsTrigger 
            value="variants" 
            className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none pb-3 px-0"
          >
            Variants
          </TabsTrigger>
          <TabsTrigger 
            value="emi" 
            className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none pb-3 px-0"
          >
            EMI Calculator
          </TabsTrigger>
        </TabsList>
        
        {/* Specifications Tab */}
        <TabsContent value="specifications" className="mt-6">
          <Card className="border border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Full Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg">Engine & Performance</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Engine Type</span>
                      <span className="font-medium">Turbocharged</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Engine Size</span>
                      <span className="font-medium">{car.engine_cc} cc</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Max Power</span>
                      <span className="font-medium">150 bhp</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Max Torque</span>
                      <span className="font-medium">250 Nm</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Fuel System</span>
                      <span className="font-medium">Direct Injection</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mt-6">Dimensions & Weight</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Length</span>
                      <span className="font-medium">4795 mm</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Width</span>
                      <span className="font-medium">1855 mm</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Height</span>
                      <span className="font-medium">1835 mm</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Wheelbase</span>
                      <span className="font-medium">2745 mm</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Kerb Weight</span>
                      <span className="font-medium">2180 kg</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg">Suspension & Brakes</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Front Suspension</span>
                      <span className="font-medium">MacPherson Strut</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Rear Suspension</span>
                      <span className="font-medium">Multi-link</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Front Brakes</span>
                      <span className="font-medium">Ventilated Disc</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Rear Brakes</span>
                      <span className="font-medium">Disc</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mt-6">Fuel & Tyres</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Fuel Tank Capacity</span>
                      <span className="font-medium">80 L</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Tyre Size</span>
                      <span className="font-medium">265/60 R18</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Spare Wheel</span>
                      <span className="font-medium">Full Size</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Features Tab */}
        <TabsContent value="features" className="mt-6">
          <Card className="border border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-accent mr-2" />
                  <span>ABS</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-accent mr-2" />
                  <span>Airbags (6)</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-accent mr-2" />
                  <span>Sunroof</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-accent mr-2" />
                  <span>LED Headlights</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-accent mr-2" />
                  <span>Automatic Climate Control</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-accent mr-2" />
                  <span>Touchscreen Infotainment</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-accent mr-2" />
                  <span>Bluetooth Connectivity</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-accent mr-2" />
                  <span>Cruise Control</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-accent mr-2" />
                  <span>Parking Sensors</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-accent mr-2" />
                  <span>Keyless Entry</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-accent mr-2" />
                  <span>Push Button Start</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-accent mr-2" />
                  <span>Electric Folding Mirrors</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Colors Tab */}
        <TabsContent value="colors" className="mt-6">
          <Card className="border border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Available Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {['White Pearl', 'Silver', 'Black', 'Red', 'Blue', 'Bronze'].map((color, index) => (
                  <div 
                    key={index} 
                    className="border border-border rounded-xl p-4 text-center cursor-pointer hover:border-foreground transition-colors"
                    onClick={() => setActiveImageIndex(index % car.images.length)}
                  >
                    <div className="w-12 h-12 rounded-full mx-auto mb-2 border" 
                         style={{ backgroundColor: getColorCode(color) }}></div>
                    <p className="font-medium">{color}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Variants Tab */}
        <TabsContent value="variants" className="mt-6">
          <Card className="border border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">{car.name} Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-muted-foreground font-medium">Variant</th>
                      <th className="text-left py-3 text-muted-foreground font-medium">Price</th>
                      <th className="text-left py-3 text-muted-foreground font-medium">Key Difference</th>
                      <th className="text-left py-3 text-muted-foreground font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{car.name} Base</p>
                          <p className="text-sm text-muted-foreground">Manual</p>
                        </div>
                      </td>
                      <td className="py-3 font-medium">{formatNPR(4500000)}</td>
                      <td className="py-3 text-sm text-muted-foreground">Basic features</td>
                      <td className="py-3">
                        <Button size="sm" variant="outline" className="border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg">
                          Enquire
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{car.name} Mid</p>
                          <p className="text-sm text-muted-foreground">Manual</p>
                        </div>
                      </td>
                      <td className="py-3 font-medium">{formatNPR(4850000)}</td>
                      <td className="py-3 text-sm text-muted-foreground">+Sunroof, Leather seats</td>
                      <td className="py-3">
                        <Button size="sm" variant="outline" className="border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg">
                          Enquire
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b border-border bg-accent/10">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{car.name} {car.variant}</p>
                          <p className="text-sm text-muted-foreground">Automatic</p>
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-accent">
                        {formatNPR(car.ex_showroom_price)}
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">+Cruise control, Premium sound</td>
                      <td className="py-3">
                        <Button size="sm" className="bg-foreground text-white hover:bg-accent rounded-lg">
                          Selected
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{car.name} Top</p>
                          <p className="text-sm text-muted-foreground">Automatic</p>
                        </div>
                      </td>
                      <td className="py-3 font-medium">{formatNPR(5500000)}</td>
                      <td className="py-3 text-sm text-muted-foreground">+360 camera, Massage seats</td>
                      <td className="py-3">
                        <Button size="sm" variant="outline" className="border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg">
                          Enquire
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* EMI Calculator Tab */}
        <TabsContent value="emi" className="mt-6">
          <InlineEmiCalculator price={car.ex_showroom_price} carName={car.name} />
        </TabsContent>
      </Tabs>

      {/* Current offers on this car */}
      {offers.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Current Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden border border-border rounded-2xl">
                <img 
                  src={offer.image_url || 'https://placehold.co/400x200/f59e0b/ffffff?text=Special+Offer'} 
                  alt={offer.title} 
                  className="w-full h-32 object-cover"
                />
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-2">{offer.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>
                  <Button size="sm" className="w-full bg-accent hover:bg-accent/90 text-white rounded-lg">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Showrooms selling this car */}
      <section id="showrooms-section" className="mb-16">
        <h2 className="text-3xl font-semibold mb-8">Showrooms Selling {car.name}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border border-border rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Map</CardTitle>
              </CardHeader>
              <CardContent className="p-0 rounded-b-2xl overflow-hidden">
                <ShowroomsMap showrooms={showrooms} />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="border border-border rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Showrooms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-80 overflow-y-auto">
                {showrooms.map((showroom) => (
                  <div key={showroom.id} className="border border-border rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold">{showroom.name}</h3>
                      {showroom.is_authorized && (
                        <Badge className="bg-accent text-white">Authorized</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{showroom.address}</p>
                    <div className="flex items-center text-sm mb-1">
                      <MapPin className="h-3 w-3 mr-1 text-accent" />
                      <span>{showroom.city}</span>
                    </div>
                    <div className="flex items-center text-sm mb-1">
                      <Phone className="h-3 w-3 mr-1 text-accent" />
                      <span>{showroom.phone}</span>
                    </div>
                    <div className="flex items-center text-sm mb-4">
                      <Clock className="h-3 w-3 mr-1 text-accent" />
                      <span>{showroom.working_hours}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg">
                        Directions
                      </Button>
                      <Button size="sm" className="flex-1 bg-foreground text-white hover:bg-accent rounded-lg">
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* You might also like */}
      {similarCars.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarCars.slice(0, 4).map((similarCar) => (
              <Card key={similarCar.id} className="overflow-hidden border border-border rounded-2xl">
                <img 
                  src={similarCar.images[0]} 
                  alt={`${similarCar.brand} ${similarCar.name}`} 
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold">{similarCar.name} {similarCar.variant}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{similarCar.brand}</p>
                  <p className="text-accent font-semibold">
                    {formatNPR(similarCar.ex_showroom_price)}
                  </p>
                  <Button size="sm" className="w-full mt-4 bg-foreground text-white hover:bg-accent rounded-lg">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Compare with similar cars */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8">Compare with Similar Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarCars.slice(0, 3).map((similarCar) => (
            <Card key={similarCar.id} className="overflow-hidden border border-border rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center mb-4">
                  <img 
                    src={similarCar.images[0]} 
                    alt={`${similarCar.brand} ${similarCar.name}`} 
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{similarCar.name}</h3>
                    <p className="text-sm text-muted-foreground">{similarCar.brand}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span className="font-medium">{formatNPR(similarCar.ex_showroom_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engine</span>
                    <span className="font-medium">{similarCar.engine_cc} cc</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel</span>
                    <span className="font-medium">{similarCar.fuel_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transmission</span>
                    <span className="font-medium">{similarCar.transmission}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-4 border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg">
                  Compare
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* EMI Calculator Modal */}
      <Dialog open={showEmiModal} onOpenChange={setShowEmiModal}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">EMI Calculator for {car.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <InlineEmiCalculator price={car.ex_showroom_price} carName={car.name} />
          </div>
        </DialogContent>
      </Dialog>
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