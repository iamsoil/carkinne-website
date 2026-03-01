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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
              fontSize: isMobile ? '18px' : '24px',
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
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '16px' : '32px 24px',
      }}>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MOBILE LAYOUT
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {isMobile ? (
          <div>
            {/* Car images side by side at top */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${compareList.length}, 1fr)`,
              gap: '12px',
              marginBottom: '20px',
            }}>
              {compareList.map(car => (
                <div key={car.id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e5e5',
                  padding: '12px',
                  textAlign: 'center',
                  position: 'relative',
                }}>
                  <button
                    onClick={() => {
                      removeFromCompare(car.id)
                      if (compareList.length <= 2) navigate('/cars')
                    }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#f5f5f7',
                      border: 'none',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#999',
                    }}
                  >
                    <X size={11} />
                  </button>
                  <img
                    src={car.images?.[0] || 'https://placehold.co/200x120/f5f5f7/999?text=Car'}
                    alt={car.name}
                    style={{
                      width: '100%',
                      height: '80px',
                      objectFit: 'contain',
                      background: '#f5f5f7',
                      borderRadius: '8px',
                    }}
                  />
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#1d1d1f',
                    marginTop: '8px',
                    lineHeight: '1.3',
                  }}>
                    {car.name}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#e8531a',
                    marginTop: '4px',
                  }}>
                    Rs.{car.ex_showroom_price?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Specs as list rows */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
              overflow: 'hidden',
            }}>
              {specs.map((spec, i) => (
                <div key={spec.key} style={{
                  display: 'grid',
                  gridTemplateColumns: `120px repeat(${compareList.length}, 1fr)`,
                  background: i % 2 === 0 ? 'white' : '#fafafa',
                  borderBottom: '1px solid #f0f0f0',
                }}>
                  {/* Spec label */}
                  <div style={{
                    padding: '12px 10px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#6e6e73',
                    background: '#f5f5f7',
                    display: 'flex',
                    alignItems: 'center',
                    borderRight: '1px solid #e5e5e5',
                  }}>
                    {spec.label}
                  </div>
                  {/* Values */}
                  {compareList.map(car => (
                    <div key={car.id} style={{
                      padding: '12px 8px',
                      fontSize: '12px',
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
          </div>

        ) : (
          /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             DESKTOP LAYOUT (keep existing table)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
          <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #e5e5e5',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            {/* Car cards header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `180px repeat(${cols}, 1fr)`,
              borderBottom: '2px solid #e8531a',
            }}>
              <div style={{
                background: '#f5f5f7',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: '#999',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.5px',
              }}>
                Specifications
              </div>
              {compareList.map(car => (
                <div key={car.id} style={{
                  padding: '20px',
                  textAlign: 'center',
                  borderLeft: '1px solid #f0f0f0',
                  position: 'relative',
                }}>
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
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#999',
                    }}
                  >
                    <X size={12} />
                  </button>
                  <div style={{
                    width: '100%',
                    height: '130px',
                    background: '#f5f5f7',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '12px',
                  }}>
                    <img
                      src={car.images?.[0] || 'https://placehold.co/400x250/f5f5f7/999?text=No+Image'}
                      alt={car.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#1d1d1f',
                    marginBottom: '4px',
                  }}>
                    {car.name}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#e8531a',
                  }}>
                    Rs. {car.ex_showroom_price?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Spec rows */}
            {specs.map((spec, i) => (
              <div key={spec.key} style={{
                display: 'grid',
                gridTemplateColumns: `180px repeat(${cols}, 1fr)`,
                background: i % 2 === 0 ? 'white' : '#fafafa',
                borderBottom: '1px solid #f0f0f0',
              }}>
                <div style={{
                  padding: '14px 20px',
                  background: '#f5f5f7',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#6e6e73',
                  display: 'flex',
                  alignItems: 'center',
                  borderRight: '1px solid #e5e5e5',
                }}>
                  {spec.label}
                </div>
                {compareList.map(car => (
                  <div key={car.id} style={{
                    padding: '14px 20px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: spec.highlight ? '700' : '400',
                    color: spec.highlight ? '#e8531a' : '#1d1d1f',
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
        )}

        {/* Suggestions - same for both */}
        {suggestions.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h2 style={{
              fontSize: isMobile ? '16px' : '20px',
              fontWeight: '700',
              color: '#1d1d1f',
              marginBottom: '16px',
            }}>
              You might also want to compare
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile 
                ? 'repeat(2, 1fr)' 
                : 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '12px',
            }}>
              {suggestions.map(car => (
                <div key={car.id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e5e5',
                  padding: '12px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <img
                    src={car.images?.[0] || 'https://placehold.co/200x120/f5f5f7/999?text=Car'}
                    alt={car.name}
                    style={{
                      width: '100%',
                      height: '70px',
                      objectFit: 'contain',
                      background: '#f5f5f7',
                      borderRadius: '8px',
                    }}
                  />
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1d1d1f',
                    marginTop: '8px',
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
                    fontWeight: '600',
                    marginBottom: '8px',
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
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    + Add
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