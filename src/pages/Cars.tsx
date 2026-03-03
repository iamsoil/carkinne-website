import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useCompare } from '@/contexts/CompareContext';
import CarCard from '@/components/CarCard';

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const IconGrid = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)

const IconList = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)

const IconFilter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
)

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

function formatNPR(amount: number): string {
  if (!amount) return 'Rs. 0'
  const str = Math.round(amount).toString()
  if (str.length <= 3) return `Rs. ${str}`
  const last3 = str.slice(-3)
  const rest = str.slice(0, -3)
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return `Rs. ${formatted},${last3}`
}

const Cars = () => {
  const [searchParams] = useSearchParams()
  const searchFromUrl = searchParams.get('search') || ''
  const [cars, setCars] = useState<any[]>([])
  const [filteredCars, setFilteredCars] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState(searchFromUrl)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('featured')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => { setSearchQuery(searchFromUrl) }, [searchFromUrl])
  useEffect(() => { fetchCars() }, [])
  useEffect(() => { filterCars() }, [
    cars, searchQuery, priceRange,
    selectedBrands, selectedCategories,
    selectedFuelTypes, sortBy
  ])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cars').select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setCars(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterCars = () => {
    let result = [...cars]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(car =>
        (car.name && car.name.toLowerCase().includes(q)) ||
        (car.brand && car.brand.toLowerCase().includes(q)) ||
        (car.model && car.model.toLowerCase().includes(q)) ||
        (car.variant && car.variant.toLowerCase().includes(q)) ||
        (car.fuel_type && car.fuel_type.toLowerCase().includes(q))
      )
    }
    result = result.filter(car =>
      car.ex_showroom_price >= priceRange[0] &&
      car.ex_showroom_price <= priceRange[1]
    )
    if (selectedBrands.length > 0)
      result = result.filter(car => selectedBrands.includes(car.brand))
    if (selectedCategories.length > 0)
      result = result.filter(car => selectedCategories.includes(car.category || 'SUV'))
    if (selectedFuelTypes.length > 0)
      result = result.filter(car => selectedFuelTypes.includes(car.fuel_type))
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.ex_showroom_price || 0) - (b.ex_showroom_price || 0)); break
      case 'price-high':
        result.sort((a, b) => (b.ex_showroom_price || 0) - (a.ex_showroom_price || 0)); break
      case 'mileage':
        result.sort((a, b) => (b.mileage_kmpl || 0) - (a.mileage_kmpl || 0)); break
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
      case 'featured':
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)); break
    }
    setFilteredCars(result)
  }

  const toggleBrand = (brand: string) =>
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])
  const toggleCategory = (cat: string) =>
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  const toggleFuelType = (ft: string) =>
    setSelectedFuelTypes(prev => prev.includes(ft) ? prev.filter(f => f !== ft) : [...prev, ft])

  const clearAll = () => {
    setSelectedBrands([])
    setSelectedCategories([])
    setSelectedFuelTypes([])
    setPriceRange([0, 15000000])
    setSearchQuery('')
  }

  const activeFiltersCount =
    selectedBrands.length +
    selectedCategories.length +
    selectedFuelTypes.length +
    (priceRange[0] > 0 || priceRange[1] < 15000000 ? 1 : 0)

  const brands = Array.from(new Set(cars.map(c => c.brand))).filter(Boolean).sort()
  const categories = Array.from(new Set(cars.map(c => c.category || 'SUV'))).filter(Boolean).sort()
  const fuelTypes = Array.from(new Set(cars.map(c => c.fuel_type))).filter(Boolean).sort()

  const FilterPanel = () => (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: '1px solid #e5e5e5',
      overflow: 'hidden',
    }}>
      {/* Filter header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '700',
          color: '#1d1d1f',
        }}>
          <IconFilter />
          Filters
          {activeFiltersCount > 0 && (
            <span style={{
              background: '#e8531a',
              color: 'white',
              borderRadius: '20px',
              padding: '1px 8px',
              fontSize: '11px',
              fontWeight: '700',
            }}>
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAll}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '12px',
              color: '#e8531a',
              fontWeight: '600',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Price Range */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '700',
          color: '#6e6e73',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '12px',
        }}>
          Price Range
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            placeholder="Min"
            value={priceRange[0] || ''}
            onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
            style={{
              flex: 1,
              padding: '8px 10px',
              border: '1px solid #d2d2d7',
              borderRadius: '8px',
              fontSize: '12px',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box' as const,
            }}
            onFocus={e => e.target.style.borderColor = '#e8531a'}
            onBlur={e => e.target.style.borderColor = '#d2d2d7'}
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange[1] === 15000000 ? '' : priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value) || 15000000])}
            style={{
              flex: 1,
              padding: '8px 10px',
              border: '1px solid #d2d2d7',
              borderRadius: '8px',
              fontSize: '12px',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box' as const,
            }}
            onFocus={e => e.target.style.borderColor = '#e8531a'}
            onBlur={e => e.target.style.borderColor = '#d2d2d7'}
          />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#6e6e73',
          marginTop: '6px',
        }}>
          <span>{formatNPR(priceRange[0])}</span>
          <span>{priceRange[1] >= 15000000 ? 'No limit' : formatNPR(priceRange[1])}</span>
        </div>
      </div>

      {/* Brands */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '700',
          color: '#6e6e73',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '12px',
        }}>
          Brand
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '8px',
          maxHeight: '180px',
          overflowY: 'auto' as const,
        }}>
          {brands.map(brand => (
            <label
              key={brand}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                color: selectedBrands.includes(brand) ? '#e8531a' : '#1d1d1f',
                fontWeight: selectedBrands.includes(brand) ? '600' : '400',
              }}
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                style={{ accentColor: '#e8531a', width: '14px', height: '14px' }}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '700',
          color: '#6e6e73',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '12px',
        }}>
          Category
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '8px',
        }}>
          {categories.map(cat => (
            <label
              key={cat}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                color: selectedCategories.includes(cat) ? '#e8531a' : '#1d1d1f',
                fontWeight: selectedCategories.includes(cat) ? '600' : '400',
              }}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                style={{ accentColor: '#e8531a', width: '14px', height: '14px' }}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Fuel Types */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '700',
          color: '#6e6e73',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '12px',
        }}>
          Fuel Type
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '8px',
        }}>
          {fuelTypes.map(ft => (
            <label
              key={ft}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                color: selectedFuelTypes.includes(ft) ? '#e8531a' : '#1d1d1f',
                fontWeight: selectedFuelTypes.includes(ft) ? '600' : '400',
              }}
            >
              <input
                type="checkbox"
                checked={selectedFuelTypes.includes(ft)}
                onChange={() => toggleFuelType(ft)}
                style={{ accentColor: '#e8531a', width: '14px', height: '14px' }}
              />
              {ft}
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      minHeight: '100vh',
      background: '#f5f5f7',
    }}>

      {/* HEADER */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e5e5',
        padding: isMobile ? '20px 16px' : '24px 32px',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '0',
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                background: '#fff8f5',
                border: '1px solid #e8531a',
                borderRadius: '6px',
                padding: '3px 12px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#e8531a',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
              }}>
                Browse
              </div>
              <h1 style={{
                fontSize: isMobile ? '28px' : '36px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: '0 0 4px',
                letterSpacing: '-1px',
              }}>
                All Cars in Nepal
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#6e6e73',
                margin: 0,
              }}>
                {loading ? 'Loading...' : `${filteredCars.length} cars found`}
              </p>
            </div>

            {/* Search + Sort + View */}
            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              width: isMobile ? '100%' : 'auto',
              flexWrap: 'wrap',
            }}>
              {/* Search */}
              <div style={{
                position: 'relative',
                flex: isMobile ? 1 : undefined,
              }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  pointerEvents: 'none',
                }}>
                  <IconSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    padding: '10px 14px 10px 36px',
                    border: '1px solid #d2d2d7',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    width: isMobile ? '100%' : '220px',
                    boxSizing: 'border-box' as const,
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#e8531a'}
                  onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #d2d2d7',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="mileage">Best Mileage</option>
                <option value="newest">Newest First</option>
              </select>

              {/* View toggle */}
              <div style={{
                display: 'flex',
                border: '1px solid #d2d2d7',
                borderRadius: '10px',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '10px 14px',
                    border: 'none',
                    background: viewMode === 'grid' ? '#e8531a' : 'white',
                    color: viewMode === 'grid' ? 'white' : '#6e6e73',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <IconGrid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '10px 14px',
                    border: 'none',
                    borderLeft: '1px solid #d2d2d7',
                    background: viewMode === 'list' ? '#e8531a' : 'white',
                    color: viewMode === 'list' ? 'white' : '#6e6e73',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <IconList />
                </button>
              </div>

              {/* Mobile filter toggle */}
              {isMobile && (
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  style={{
                    padding: '10px 16px',
                    border: '1px solid',
                    borderColor: activeFiltersCount > 0 ? '#e8531a' : '#d2d2d7',
                    borderRadius: '10px',
                    background: activeFiltersCount > 0 ? '#fff8f5' : 'white',
                    color: activeFiltersCount > 0 ? '#e8531a' : '#1d1d1f',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'inherit',
                  }}
                >
                  <IconFilter />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span style={{
                      background: '#e8531a',
                      color: 'white',
                      borderRadius: '20px',
                      padding: '0 6px',
                      fontSize: '11px',
                    }}>
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FILTERS */}
      {isMobile && showMobileFilters && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(0,0,0,0.5)',
        }}
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'white',
              borderRadius: '20px 20px 0 0',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '20px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <span style={{ fontSize: '16px', fontWeight: '700' }}>Filters</span>
              <button
                onClick={() => setShowMobileFilters(false)}
                style={{
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: '#6e6e73',
                }}
              >
                <IconX />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setShowMobileFilters(false)}
              style={{
                width: '100%',
                background: '#e8531a',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: '16px',
                fontFamily: 'inherit',
              }}
            >
              Show {filteredCars.length} Cars
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '16px' : '24px 32px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '260px 1fr',
        gap: '24px',
        alignItems: 'start',
      }}>

        {/* LEFT - FILTERS (desktop only) */}
        {!isMobile && (
          <div style={{ position: 'sticky', top: '24px' }}>
            <FilterPanel />
          </div>
        )}

        {/* RIGHT - CARS */}
        <div>
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
            }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e5e5e5',
                }}>
                  <div style={{
                    height: '180px',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }} />
                  <div style={{ padding: '16px' }}>
                    <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', width: '70%' }} />
                    <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '16px', width: '40%' }} />
                    <div style={{ height: '24px', background: '#f0f0f0', borderRadius: '4px', width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCars.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '60px 24px',
              textAlign: 'center',
              border: '1px solid #e5e5e5',
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}>🔍</div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1d1d1f',
                margin: '0 0 8px',
              }}>
                No cars found
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6e6e73',
                margin: '0 0 20px',
              }}>
                Try adjusting your filters or search query
              </p>
              <button
                onClick={clearAll}
                style={{
                  background: '#e8531a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
            }}>
              {filteredCars.map(car => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredCars.map(car => (
                <div
                  key={car.id}
                  style={{
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#e8531a'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,83,26,0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <img
                    src={car.images?.[0]}
                    alt={car.name}
                    style={{
                      width: '200px',
                      minWidth: '200px',
                      height: '140px',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{
                    flex: 1,
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                  }}>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1d1d1f',
                        marginBottom: '4px',
                      }}>
                        {car.name} {car.variant}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#e8531a',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}>
                        {car.brand}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap',
                      }}>
                        {[
                          { label: 'Fuel', value: car.fuel_type },
                          { label: 'Transmission', value: car.transmission },
                          { label: 'Seats', value: `${car.seating}` },
                          { label: 'Engine', value: car.is_electric ? 'Electric' : `${car.engine_cc}cc` },
                        ].map((spec, i) => (
                          <div key={i}>
                            <div style={{ fontSize: '10px', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              {spec.label}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1d1d1f' }}>
                              {spec.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#e8531a',
                        letterSpacing: '-0.5px',
                        marginBottom: '4px',
                      }}>
                        {formatNPR(car.ex_showroom_price)}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6e6e73',
                        marginBottom: '12px',
                      }}>
                        On-road: {formatNPR(car.on_road_price)}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => window.location.href = `/cars/${car.slug}`}
                          style={{
                            background: '#1d1d1f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#e8531a'}
                          onMouseLeave={e => e.currentTarget.style.background = '#1d1d1f'}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => isInCompare(car.id)
                            ? removeFromCompare(car.id)
                            : addToCompare(car)
                          }
                          style={{
                            background: isInCompare(car.id) ? '#fff8f5' : 'white',
                            color: isInCompare(car.id) ? '#e8531a' : '#1d1d1f',
                            border: `1px solid ${isInCompare(car.id) ? '#e8531a' : '#d2d2d7'}`,
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s',
                          }}
                        >
                          {isInCompare(car.id) ? '✓ Added' : 'Compare'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cars;