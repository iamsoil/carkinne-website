import { useCompare } from '@/contexts/CompareContext'
import { useNavigate } from 'react-router-dom'
import { X, GitCompare } from 'lucide-react'

const CompareBar = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare()
  const navigate = useNavigate()

  if (compareList.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderTop: '3px solid #e8531a',
      boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
      zIndex: 9999,
      padding: '12px 16px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>

        {/* TOP ROW - label + buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <GitCompare size={16} color="#e8531a" />
            <span style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#1d1d1f',
            }}>
              Compare ({compareList.length}/3)
            </span>
          </div>

          {/* Action buttons always visible */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={clearCompare}
              style={{
                border: '1px solid #d2d2d7',
                background: 'white',
                color: '#6e6e73',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Clear
            </button>
            <button
              onClick={() => navigate('/compare')}
              disabled={compareList.length < 2}
              style={{
                background: compareList.length >= 2
                  ? '#e8531a' : '#d2d2d7',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 16px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: compareList.length >= 2
                  ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap',
              }}
            >
              Compare Now →
            </button>
          </div>
        </div>

        {/* BOTTOM ROW - selected car pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {compareList.map(car => (
            <div key={car.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fff8f5',
              border: '1.5px solid #e8531a',
              borderRadius: '20px',
              padding: '4px 10px',
              maxWidth: '160px',
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#1d1d1f',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {car.name}
              </span>
              <button
                onClick={() => removeFromCompare(car.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#e8531a',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: 3 - compareList.length }).map((_, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 12px',
              border: '1.5px dashed #d2d2d7',
              borderRadius: '20px',
              fontSize: '11px',
              color: '#bbb',
            }}>
              + Add car
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CompareBar