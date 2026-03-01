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
      padding: '16px 24px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>

        {/* Icon + label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}>
          <GitCompare size={18} color="#e8531a" />
          <span style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#1d1d1f',
          }}>
            Compare ({compareList.length}/3)
          </span>
        </div>

        {/* Car pills */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flex: 1,
          flexWrap: 'wrap',
        }}>
          {compareList.map(car => (
            <div key={car.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#fff8f5',
              border: '1.5px solid #e8531a',
              borderRadius: '20px',
              padding: '6px 14px',
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#1d1d1f',
                maxWidth: '160px',
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
                }}
              >
                <X size={13} />
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: 3 - compareList.length }).map((_, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 16px',
              border: '1.5px dashed #d2d2d7',
              borderRadius: '20px',
              fontSize: '12px',
              color: '#999',
            }}>
              + Add car
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexShrink: 0,
        }}>
          <button
            onClick={clearCompare}
            style={{
              border: '1px solid #d2d2d7',
              background: 'white',
              color: '#6e6e73',
              borderRadius: '10px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Clear All
          </button>
          <button
            onClick={() => navigate('/compare')}
            disabled={compareList.length < 2}
            style={{
              background: compareList.length >= 2
                ? '#e8531a' : '#d2d2d7',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: compareList.length >= 2
                ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
            }}
          >
            Compare Now →
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompareBar