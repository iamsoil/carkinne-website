import { useCompare } from '@/contexts/CompareContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X, ArrowLeft } from 'lucide-react'

const Compare = () => {
  const { compareList, clearCompare, removeFromCompare } = useCompare()
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState<any[]>([])
  const { addToCompare } = useCompare()

  useEffect(() => {
    if (compareList.length === 0) {
      navigate('/cars')
      return
    }
    fetchSuggestions()
  }, [compareList])

  const fetchSuggestions = async () => {
    const ids = compareList.map(c => c.id)
    const { data } = await supabase
      .from('cars')
      .select('*')
      .not('id', 'in', `(${ids.join(',')})`)
      .limit(6)
    setSuggestions(data || [])
  }

  const specs = [
    { label: 'Ex-Showroom Price', key: 'ex_showroom_price',
      format: (v: number) => v ? `Rs. ${v.toLocaleString()}` : 'N/A',
      highlight: true },
    { label: 'On-Road Price', key: 'on_road_price',
      format: (v: number) => v ? `Rs. ${v.toLocaleString()}` : 'N/A' },
    { label: 'Fuel Type', key: 'fuel_type',
      format: (v: string) => v || 'N/A' },
    { label: 'Transmission', key: 'transmission',
      format: (v: string) => v || 'N/A' },
    { label: 'Engine', key: 'engine_cc',
      format: (v: number) => v ? `${v} cc` : 'Electric Motor' },
    { label: 'Seating Capacity', key: 'seating',
      format: (v: number) => v ? `${v} Seats` : 'N/A' },
    { label: 'Mileage', key: 'mileage_kmpl',
      format: (v: number) => v ? `${v} kmpl` : 'N/A' },
    { label: 'Battery Range', key: 'battery_range_km',
      format: (v: number) => v ? `${v} km` : 'N/A' },
    { label: 'Category', key: 'category',
      format: (v: string) => v || 'N/A' },
  ]

  const cols = compareList.length

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f7',
      paddingBottom: '40px',
    }}>

      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e5e5',
        padding: '16px',
        position: 'sticky',
        top: 64,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}>
            <button
              onClick={() => navigate('/cars')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#6e6e73',
              }}
            >
              <ArrowLeft size={15} /> Back
            </button>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1d1d1f',
              margin: 0,
            }}>
              Compare Cars
            </h1>
          </div>
          <button
            onClick={() => { clearCompare(); navigate('/cars') }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#fff0eb',
              border: '1px solid #e8531a',
              color: '#e8531a',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <X size={13} /> Clear All
          </button>
        </div>
      </div>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '24px 16px',
      }}>

        {/* Car images side by side at top */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${compareList.length}, 1fr)`,
          gap: '16px',
          marginBottom: '24px',
        }}>
          {compareList.map(car => (
            <div key={car.id} style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #e5e5e5',
              padding: '20px',
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              {/* Remove button */}
              <button
                onClick={() => {
                  removeFromCompare(car.id)
                  if (compareList.length <= 2) navigate('/cars')
                }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#f5f5f7',
                  border: 'none',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#999',
                }}
              >
                <X size={13} />
              </button>

              {/* Image */}
              <img
                src={car.images?.[0] || 
                  'https://placehold.co/300x180/f5f5f7/999?text=Car'}
                alt={car.name}
                style={{
                  width: '100%',
                  height: '160px',
                  objectFit: 'contain',
                  background: '#f5f5f7',
                  borderRadius: '12px',
                  marginBottom: '14px',
                }}
              />

              {/* Name */}
              <div style={{
                fontSize: '15px',
                fontWeight: '700',
                color: '#1d1d1f',
                marginBottom: '6px',
                lineHeight: '1.3',
              }}>
                {car.name}
              </div>

              {/* Brand badge */}
              <div style={{
                display: 'inline-block',
                background: '#f5f5f7',
                borderRadius: '20px',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#6e6e73',
                marginBottom: '10px',
              }}>
                {car.brand}
              </div>

              {/* Price */}
              <div style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#e8531a',
              }}>
                Rs.{car.ex_showroom_price?.toLocaleString()}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6e6e73',
                marginTop: '2px',
              }}>
                On-road: Rs.{car.on_road_price?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Specs table below */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e5e5e5',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          marginBottom: '32px',
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `160px repeat(${compareList.length}, 1fr)`,
            background: '#e8531a',
            padding: '12px 0',
          }}>
            <div style={{
              padding: '0 16px',
              fontSize: '12px',
              fontWeight: '700',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Spec
            </div>
            {compareList.map(car => (
              <div key={car.id} style={{
                padding: '0 16px',
                fontSize: '13px',
                fontWeight: '700',
                color: 'white',
                textAlign: 'center',
                borderLeft: '1px solid rgba(255,255,255,0.2)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {car.name.split(' ').slice(0,2).join(' ')}
              </div>
            ))}
          </div>

          {/* Spec rows */}
          {specs.map((spec, i) => (
            <div key={spec.key} style={{
              display: 'grid',
              gridTemplateColumns: `160px repeat(${compareList.length}, 1fr)`,
              background: i % 2 === 0 ? 'white' : '#fafafa',
              borderBottom: '1px solid #f0f0f0',
            }}>
              <div style={{
                padding: '14px 16px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#6e6e73',
                background: '#f5f5f7',
                borderRight: '1px solid #e5e5e5',
                display: 'flex',
                alignItems: 'center',
              }}>
                {spec.label}
              </div>
              {compareList.map(car => (
                <div key={car.id} style={{
                  padding: '14px 16px',
                  fontSize: '14px',
                  fontWeight: spec.highlight ? '700' : '400',
                  color: spec.highlight ? '#e8531a' : '#1d1d1f',
                  textAlign: 'center',
                  borderLeft: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {spec.format(car[spec.key as keyof typeof car] as any)}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1d1d1f',
              marginBottom: '16px',
            }}>
              You might also want to compare
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '12px',
            }}>
              {suggestions.map(car => (
                <div key={car.id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e5e5',
                  padding: '14px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <img
                    src={car.images?.[0] || 
                      'https://placehold.co/200x120/f5f5f7/999?text=Car'}
                    alt={car.name}
                    style={{
                      width: '100%',
                      height: '80px',
                      objectFit: 'contain',
                      background: '#f5f5f7',
                      borderRadius: '8px',
                      marginBottom: '8px',
                    }}
                  />
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1d1d1f',
                    marginBottom: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {car.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#e8531a',
                    fontWeight: '700',
                    marginBottom: '10px',
                  }}>
                    Rs.{car.ex_showroom_price?.toLocaleString()}
                  </div>
                  <button
                    onClick={() => addToCompare(car)}
                    style={{
                      background: '#fff8f5',
                      border: '1px solid #e8531a',
                      color: '#e8531a',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    + Add to Compare
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Compare