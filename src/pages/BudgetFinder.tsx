"use client";

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const IconCity = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
  </svg>
)

const IconHighway = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L8 22M12 2l4 20M12 2v20"/><line x1="4" y1="8" x2="20" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/>
  </svg>
)

const IconMountain = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3l4 8 5-5 5 15H2L8 3z"/>
  </svg>
)

const IconFamily = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
    <path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
)

const IconBusiness = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
  </svg>
)

const IconCar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h11l4 4 2 1v4a2 2 0 01-2 2h-2"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const BudgetFinder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState<number>(3000000);
  const [usage, setUsage] = useState<string[]>([]);
  const [fuelType, setFuelType] = useState<string>('No preference');
  const [transmission, setTransmission] = useState<string>('No preference');
  const [features, setFeatures] = useState<string[]>([]);
  const [rankings, setRankings] = useState<Record<string, number | null>>({
    '1': null, '2': null, '3': null, '4': null, '5': null, '6': null
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = [
    { id: '1', label: 'Low purchase price' },
    { id: '2', label: 'Low running cost' },
    { id: '3', label: 'Brand reputation' },
    { id: '4', label: 'Good resale value' },
    { id: '5', label: 'Features and comfort' },
    { id: '6', label: 'Easy to maintain' },
  ];

  // Quick select budget ranges
  const budgetRanges = [
    { label: 'Under 15L', min: 500000, max: 1500000 },
    { label: '15-25L', min: 1500000, max: 2500000 },
    { label: '25-40L', min: 2500000, max: 4000000 },
    { label: '40-60L', min: 4000000, max: 6000000 },
    { label: '60L-1Cr', min: 6000000, max: 10000000 },
    { label: '1Cr+', min: 10000000, max: 20000000 }
  ];

  // Format price in Nepali format
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      const crore = price / 10000000;
      return `Rs. ${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(1)} Crore`;
    } else if (price >= 100000) {
      const lakh = price / 100000;
      return `Rs. ${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} Lakh`;
    } else {
      return `Rs. ${price.toLocaleString('en-IN')}`;
    }
  };

  // Handle budget quick select
  const handleBudgetSelect = (min: number, max: number) => {
    const midpoint = Math.round((min + max) / 2);
    setBudget(midpoint);
  };

  // Toggle usage selection
  const toggleUsage = (option: string) => {
    setUsage(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option) 
        : [...prev, option]
    );
  };

  // Toggle feature selection
  const toggleFeature = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(item => item !== feature) 
        : [...prev, feature]
    );
  };

  // Handle rank selection
  const handleRankSelect = (itemId: string, rank: number) => {
    setRankings(prev => {
      // Create a copy of the current rankings
      const newRankings = { ...prev };
      
      // If this rank is already assigned to another item, unassign it
      Object.keys(newRankings).forEach(key => {
        if (newRankings[key] === rank) {
          newRankings[key] = null;
        }
      });
      
      // Assign the rank to the current item
      newRankings[itemId] = rank;
      
      return newRankings;
    });
  };

  // Calculate match score for cars
  const calculateMatchScore = (car: any) => {
    let score = 0;
    
    // Budget filter (hard filter)
    if (car.ex_showroom_price > budget) return -1;
    
    // Fuel type preference
    if (fuelType !== 'No preference' && car.fuel_type === fuelType) {
      score += 3;
    }
    
    // Transmission preference
    if (transmission !== 'No preference' && car.transmission === transmission) {
      score += 3;
    }
    
    // Usage matching
    if (usage.includes('Daily city driving') && car.mileage_kmpl > 20) {
      score += 2;
    }
    if (usage.includes('Highway trips') && car.category === 'Sedan') {
      score += 2;
    }
    if (usage.includes('Hilly terrain') && car.category === 'SUV') {
      score += 2;
    }
    if (usage.includes('Family use') && car.seating >= 5) {
      score += 2;
    }
    if (usage.includes('Business use') && car.category === 'Sedan') {
      score += 2;
    }
    if (usage.includes('First car') && car.category === 'Hatchback') {
      score += 2;
    }
    
    // Features matching
    if (features.includes('High mileage') && car.mileage_kmpl > 20) {
      score += 1;
    }
    if (features.includes('Automatic') && car.transmission === 'Automatic') {
      score += 1;
    }
    
    return score;
  };

  // Get results based on user preferences
  const getResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch cars within budget
      const { data: cars, error } = await supabase
        .from('cars')
        .select('*')
        .lte('ex_showroom_price', budget)
        .limit(20); // Limit to 20 cars to avoid performance issues

      if (error) throw error;

      if (!cars || cars.length === 0) {
        setResults([]);
        scrollToTop();
        setStep(5);
        return;
      }

      // Calculate match scores
      const scoredCars = cars
        .map(car => ({
          ...car,
          score: calculateMatchScore(car)
        }))
        .filter(car => car.score >= 0)
        .sort((a, b) => b.score - a.score);

      setResults(scoredCars);
      scrollToTop();
      setStep(5);
    } catch (err) {
      console.error('Error fetching budget results:', err);
      setError('Unable to load car recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Usage options
  const usageOptions = [
    { icon: IconCity, label: 'Daily city driving', value: 'Daily city driving' },
    { icon: IconHighway, label: 'Highway trips', value: 'Highway trips' },
    { icon: IconMountain, label: 'Hilly terrain', value: 'Hilly terrain' },
    { icon: IconFamily, label: 'Family use', value: 'Family use' },
    { icon: IconBusiness, label: 'Business use', value: 'Business use' },
    { icon: IconCar, label: 'First car', value: 'First car' }
  ];

  // Feature options
  const featureOptions = [
    'Sunroof', '4WD', 'High mileage', 'Low maintenance',
    'Apple CarPlay', '7 seats', 'Good resale value',
    'ABS & Airbags', 'Reverse Camera', 'Keyless Entry'
  ];

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f0f0f0',
            borderTop: '3px solid #e8531a',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto',
          }}></div>
          <p style={{ fontSize: '14px', color: '#6e6e73', marginTop: '16px' }}>
            Finding your perfect match...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}>
        <div style={{
          background: 'white',
          border: '1px solid #e5e5e5',
          borderRadius: '16px',
          padding: '40px 24px',
          textAlign: 'center',
          maxWidth: '400px',
        }}>
          <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </p>
          <button
            onClick={getResults}
            style={{
              background: '#e8531a',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#c94415';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(232,83,26,0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#e8531a';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: isMobile ? '24px 16px' : '40px 24px',
      }}>
        {/* Progress bar - only show for steps 1-4 */}
        {step <= 4 && (
          <>
            <div style={{
              width: '100%',
              height: '3px',
              background: '#e5e5e5',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div 
                style={{
                  height: '100%',
                  background: '#e8531a',
                  width: `${(step / 4) * 100}%`,
                  transition: 'width 0.4s',
                }}
              ></div>
            </div>
            <p style={{
              fontSize: '12px',
              color: '#6e6e73',
              textAlign: 'center',
              marginTop: '8px',
              marginBottom: '24px',
            }}>
              Step {step} of 4
            </p>
          </>
        )}

        {step === 1 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '32px',
            alignItems: 'start',
          }}>
            {/* LEFT COLUMN */}
            <div>
              <div style={{
                display: 'inline-block',
                background: '#fff8f5',
                border: '1px solid #e8531a',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#e8531a',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '16px',
              }}>
                BUDGET FINDER
              </div>
              <h1 style={{
                fontSize: isMobile ? '28px' : '36px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: '12px 0 12px',
                letterSpacing: '-1px',
                lineHeight: '1.2',
              }}>
                Find Your<br />
                <span style={{ color: '#e8531a' }}>"Perfect Car"</span>
              </h1>
              <p style={{
                fontSize: '13px',
                color: '#6e6e73',
                lineHeight: '1.7',
                margin: '0 0 28px',
              }}>
                Answer 4 quick questions and we'll match you with the best cars within your budget in Nepal.
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '28px',
              }}>
                {[
                  { title: 'Set your budget', desc: 'Choose your max price range' },
                  { title: 'Tell us your needs', desc: 'City, family, business or off-road' },
                  { title: 'Set preferences', desc: 'Fuel type, transmission and features' },
                  { title: 'Get matched', desc: 'See ranked cars tailored to you' }
                ].map((stepItem, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#fff8f5',
                      border: '1px solid #fde8da',
                      color: '#e8531a',
                      fontSize: '12px',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: '0',
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#1d1d1f',
                        marginBottom: '2px',
                      }}>
                        {stepItem.title}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#6e6e73',
                        lineHeight: '1.5',
                      }}>
                        {stepItem.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: '#fff8f5',
                border: '1px solid #fde8da',
                borderRadius: '14px',
                padding: '16px',
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#1d1d1f',
                  marginBottom: '10px',
                }}>
                  Smart Buying Tips
                </div>
                {[
                  "Add 10–15% to ex-showroom for on-road costs",
                  "Factor in insurance, fuel and service costs",
                  "Check resale value before buying"
                ].map((tip, index) => (
                  <div 
                    key={index}
                    style={{
                      fontSize: '12px',
                      color: '#6e6e73',
                      lineHeight: '1.5',
                      paddingLeft: '12px',
                      borderLeft: '2px solid #e8531a',
                      marginBottom: '8px',
                    }}
                  >
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN - BUDGET CARD */}
            <div style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '20px',
              padding: isMobile ? '24px 20px' : '40px',
            }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  fontSize: isMobile ? '22px' : '28px',
                  fontWeight: '800',
                  letterSpacing: '-0.5px',
                  margin: 0,
                }}>
                  What's your budget?
                </h2>
                <p style={{
                  fontSize: '13px',
                  color: '#6e6e73',
                  margin: '8px 0 28px',
                }}>
                  We'll only show cars within your range
                </p>
                
                <div style={{
                  fontSize: isMobile ? '28px' : '36px',
                  fontWeight: '800',
                  color: '#e8531a',
                  margin: '0 0 20px',
                }}>
                  {formatPrice(budget)}
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <input
                    type="range"
                    min="500000"
                    max="20000000"
                    step="100000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '4px',
                      accentColor: '#e8531a',
                    }}
                  />
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: '#6e6e73',
                  marginBottom: '24px',
                }}>
                  <span>Rs. 5 Lakh</span>
                  <span>Rs. 2 Crore</span>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
                  gap: '8px',
                  marginBottom: '28px',
                }}>
                  {budgetRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handleBudgetSelect(range.min, range.max)}
                      style={{
                        border: '1px solid #d2d2d7',
                        borderRadius: '20px',
                        padding: '8px 4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#1d1d1f',
                        background: 'white',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#e8531a';
                        e.currentTarget.style.color = '#e8531a';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#d2d2d7';
                        e.currentTarget.style.color = '#1d1d1f';
                      }}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => { scrollToTop(); setStep(2); }}
                  style={{
                    width: '100%',
                    background: '#1d1d1f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#e8531a';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#1d1d1f';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{
            background: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '20px',
            padding: isMobile ? '24px 20px' : '40px',
          }}>
            <div>
              <h1 style={{
                fontSize: isMobile ? '22px' : '28px',
                fontWeight: '800',
                letterSpacing: '-0.5px',
                textAlign: 'center',
                margin: 0,
              }}>
                How will you use it?
              </h1>
              <p style={{
                fontSize: '13px',
                color: '#6e6e73',
                textAlign: 'center',
                margin: '8px 0 28px',
              }}>
                Select all that apply
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '28px',
              }}>
                {usageOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = usage.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => toggleUsage(option.value)}
                      style={{
                        border: isSelected ? '2px solid #e8531a' : '1px solid #d2d2d7',
                        borderRadius: '16px',
                        padding: '20px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: isSelected ? '#fff8f5' : 'white',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#e8531a';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#d2d2d7';
                        }
                      }}
                    >
                      <Icon 
                        style={{
                          color: isSelected ? '#e8531a' : '#6e6e73',
                        }} 
                      />
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#1d1d1f',
                        textAlign: 'center',
                      }}>
                        {option.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <button 
                  onClick={() => { scrollToTop(); setStep(1); }}
                  style={{
                    color: '#6e6e73',
                    fontSize: '13px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    padding: 0,
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => { scrollToTop(); setStep(3); }}
                  style={{
                    background: '#1d1d1f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 28px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#e8531a';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#1d1d1f';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{
            background: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '20px',
            padding: isMobile ? '24px 20px' : '40px',
          }}>
            <div>
              <h1 style={{
                fontSize: isMobile ? '22px' : '28px',
                fontWeight: '800',
                letterSpacing: '-0.5px',
                textAlign: 'center',
                margin: 0,
              }}>
                Your preferences
              </h1>
              <p style={{
                fontSize: '13px',
                color: '#6e6e73',
                textAlign: 'center',
                margin: '8px 0 28px',
              }}>
                Help us narrow down your options
              </p>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#6e6e73',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '10px',
                }}>
                  Fuel Type
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Petrol', 'Diesel', 'Electric', 'No preference'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFuelType(type)}
                      style={{
                        border: '1px solid',
                        borderColor: fuelType === type ? '#1d1d1f' : '#d2d2d7',
                        borderRadius: '20px',
                        padding: '7px 14px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: fuelType === type ? '#1d1d1f' : 'white',
                        color: fuelType === type ? 'white' : '#1d1d1f',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => {
                        if (fuelType !== type) {
                          e.currentTarget.style.borderColor = '#e8531a';
                          e.currentTarget.style.color = '#e8531a';
                        }
                      }}
                      onMouseLeave={e => {
                        if (fuelType !== type) {
                          e.currentTarget.style.borderColor = '#d2d2d7';
                          e.currentTarget.style.color = '#1d1d1f';
                        }
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#6e6e73',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '10px',
                }}>
                  Transmission
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Manual', 'Automatic', 'No preference'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTransmission(type)}
                      style={{
                        border: '1px solid',
                        borderColor: transmission === type ? '#1d1d1f' : '#d2d2d7',
                        borderRadius: '20px',
                        padding: '7px 14px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: transmission === type ? '#1d1d1f' : 'white',
                        color: transmission === type ? 'white' : '#1d1d1f',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => {
                        if (transmission !== type) {
                          e.currentTarget.style.borderColor = '#e8531a';
                          e.currentTarget.style.color = '#e8531a';
                        }
                      }}
                      onMouseLeave={e => {
                        if (transmission !== type) {
                          e.currentTarget.style.borderColor = '#d2d2d7';
                          e.currentTarget.style.color = '#1d1d1f';
                        }
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#6e6e73',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '10px',
                }}>
                  Must-have features
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {featureOptions.map((feature) => {
                    const isSelected = features.includes(feature);
                    return (
                      <button
                        key={feature}
                        onClick={() => toggleFeature(feature)}
                        style={{
                          border: '1px solid',
                          borderColor: isSelected ? '#e8531a' : '#d2d2d7',
                          borderRadius: '20px',
                          padding: '7px 14px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: isSelected ? '#fff8f5' : 'white',
                          color: isSelected ? '#e8531a' : '#1d1d1f',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = '#e8531a';
                            e.currentTarget.style.color = '#e8531a';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = '#d2d2d7';
                            e.currentTarget.style.color = '#1d1d1f';
                          }
                        }}
                      >
                        {feature}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <button 
                  onClick={() => { scrollToTop(); setStep(2); }}
                  style={{
                    color: '#6e6e73',
                    fontSize: '13px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    padding: 0,
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => { scrollToTop(); setStep(4); }}
                  style={{
                    background: '#1d1d1f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 28px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#e8531a';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#1d1d1f';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{
            background: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '20px',
            padding: isMobile ? '24px 20px' : '40px',
          }}>
            <div>
              <h1 style={{
                fontSize: isMobile ? '22px' : '28px',
                fontWeight: '800',
                letterSpacing: '-0.5px',
                textAlign: 'center',
                margin: 0,
              }}>
                What matters most?
              </h1>
              <p style={{
                fontSize: '13px',
                color: '#6e6e73',
                textAlign: 'center',
                margin: '8px 0 28px',
              }}>
                Tap the numbers to rank your priorities — 1 is most important
              </p>
              
              <div style={{ marginBottom: '28px' }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: 'white',
                      border: '1px solid #e5e5e5',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1d1d1f',
                    }}>
                      {item.label}
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5, 6].map((rank) => (
                        <button
                          key={rank}
                          onClick={() => handleRankSelect(item.id, rank)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            border: '1px solid',
                            borderColor: rankings[item.id] === rank ? '#e8531a' : '#d2d2d7',
                            background: rankings[item.id] === rank ? '#e8531a' : 'white',
                            color: rankings[item.id] === rank ? 'white' : '#6e6e73',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {rank}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <button 
                  onClick={() => { scrollToTop(); setStep(3); }}
                  style={{
                    color: '#6e6e73',
                    fontSize: '13px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    padding: 0,
                  }}
                >
                  Back
                </button>
                <button
                  onClick={getResults}
                  style={{
                    background: '#e8531a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 28px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#c94415';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(232,83,26,0.35)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#e8531a';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Find My Car
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{
            background: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '20px',
            padding: isMobile ? '24px 20px' : '40px',
          }}>
            <div>
              <h1 style={{
                fontSize: isMobile ? '22px' : '28px',
                fontWeight: '800',
                letterSpacing: '-0.5px',
                textAlign: 'center',
                margin: 0,
              }}>
                Your Perfect Matches
              </h1>
              <p style={{
                fontSize: '13px',
                color: '#6e6e73',
                textAlign: 'center',
                margin: '8px 0 28px',
              }}>
                Based on your budget and preferences
              </p>
              
              {results.length > 0 ? (
                <>
                  {/* Best match card */}
                  <div style={{
                    border: '2px solid #e8531a',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    marginBottom: '24px',
                  }}>
                    <div style={{
                      padding: '6px 16px',
                      background: '#e8531a',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      BEST MATCH
                    </div>
                    <img 
                      src={results[0].images?.[0] || 'https://placehold.co/600x300/1d1d1f/ffffff?text=Best+Match'} 
                      alt={results[0].name} 
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                      }}
                    />
                    <div style={{ padding: '20px' }}>
                      <div style={{
                        display: 'inline-block',
                        background: '#fff8f5',
                        border: '1px solid #fde8da',
                        borderRadius: '20px',
                        padding: '3px 10px',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#e8531a',
                        marginBottom: '8px',
                      }}>
                        {results[0].brand}
                      </div>
                      <h3 style={{
                        fontSize: isMobile ? '18px' : '22px',
                        fontWeight: '800',
                        margin: '4px 0 4px',
                      }}>
                        {results[0].name} {results[0].variant}
                      </h3>
                      <p style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#e8531a',
                        margin: '0 0 14px',
                      }}>
                        {formatPrice(results[0].ex_showroom_price)}
                      </p>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '6px',
                        }}>
                          <IconCheck style={{ color: '#e8531a' }} />
                          <span style={{ fontSize: '13px' }}>Within your budget</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '6px',
                        }}>
                          <IconCheck style={{ color: '#e8531a' }} />
                          <span style={{ fontSize: '13px' }}>
                            {transmission === 'No preference' 
                              ? 'Available in manual and automatic' 
                              : `${transmission} transmission`}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '6px',
                        }}>
                          <IconCheck style={{ color: '#e8531a' }} />
                          <span style={{ fontSize: '13px' }}>Matches your usage needs</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => navigate(`/cars/${results[0].slug}`)}
                          style={{
                            flex: 1,
                            background: '#1d1d1f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#e8531a';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = '#1d1d1f';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => navigate('/emi-calculator')}
                          style={{
                            flex: 1,
                            background: 'white',
                            color: '#1d1d1f',
                            border: '1px solid #d2d2d7',
                            borderRadius: '12px',
                            padding: '12px',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#e8531a';
                            e.currentTarget.style.color = '#e8531a';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#d2d2d7';
                            e.currentTarget.style.color = '#1d1d1f';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          Calculate EMI
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Other matches */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: '12px',
                    marginBottom: '24px',
                  }}>
                    {results.slice(1, 3).map((car, index) => (
                      <div
                        key={car.id}
                        style={{
                          border: '1px solid #e5e5e5',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#e8531a';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#e5e5e5';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <img 
                          src={car.images?.[0] || 'https://placehold.co/300x200/f5f5f7/6e6e73?text=Car'} 
                          alt={car.name} 
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                          }}
                        />
                        <div style={{ padding: '12px' }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '6px',
                          }}>
                            <h4 style={{
                              fontSize: '13px',
                              fontWeight: '800',
                              margin: 0,
                            }}>
                              {car.name}
                            </h4>
                            <span style={{
                              fontSize: '10px',
                              color: '#e8531a',
                              fontWeight: '700',
                            }}>
                              {90 - index * 5}% match
                            </span>
                          </div>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#e8531a',
                            margin: '0 0 8px',
                          }}>
                            {formatPrice(car.ex_showroom_price)}
                          </p>
                          <button
                            onClick={() => navigate(`/cars/${car.slug}`)}
                            style={{
                              fontSize: '12px',
                              color: '#e8531a',
                              fontWeight: '600',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              padding: 0,
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* More options */}
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '800',
                      margin: '0 0 12px',
                    }}>
                      More options
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                      gap: '10px',
                    }}>
                      {results.slice(2, 6).map((car) => (
                        <div
                          key={car.id}
                          style={{
                            border: '1px solid #e5e5e5',
                            borderRadius: '12px',
                            display: 'flex',
                            overflow: 'hidden',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#e8531a';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#e5e5e5';
                          }}
                        >
                          <img 
                            src={car.images?.[0] || 'https://placehold.co/120x80/f5f5f7/6e6e73?text=Car'} 
                            alt={car.name} 
                            style={{
                              width: isMobile ? '80px' : '90px',
                              minWidth: isMobile ? '80px' : '90px',
                              flexShrink: 0,
                              objectFit: 'cover',
                            }}
                          />
                          <div style={{ padding: isMobile ? '8px 10px' : '10px 12px' }}>
                            <p style={{
                              fontSize: '10px',
                              textTransform: 'uppercase',
                              color: '#6e6e73',
                              margin: '0 0 2px',
                            }}>
                              {car.brand}
                            </p>
                            <h4 style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              margin: '0 0 4px',
                            }}>
                              {car.name}
                            </h4>
                            <p style={{
                              fontSize: '13px',
                              color: '#e8531a',
                              fontWeight: '700',
                              margin: '0 0 6px',
                            }}>
                              {formatPrice(car.ex_showroom_price)}
                            </p>
                            <button
                              onClick={() => navigate(`/cars/${car.slug}`)}
                              style={{
                                fontSize: '11px',
                                color: '#e8531a',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                padding: 0,
                              }}
                            >
                              View →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bottom row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '28px',
                    paddingTop: '20px',
                    borderTop: '1px solid #f0f0f0',
                  }}>
                    <button 
                      onClick={() => { scrollToTop(); setStep(1); }}
                      style={{
                        color: '#6e6e73',
                        fontSize: '13px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        padding: 0,
                      }}
                    >
                      Start Over
                    </button>
                    <button
                      onClick={() => navigate('/cars')}
                      style={{
                        background: 'white',
                        color: '#1d1d1f',
                        border: '1px solid #d2d2d7',
                        borderRadius: '12px',
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#e8531a';
                        e.currentTarget.style.color = '#e8531a';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#d2d2d7';
                        e.currentTarget.style.color = '#1d1d1f';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Compare Top 3
                    </button>
                  </div>
                </>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                }}>
                  <div style={{
                    display: 'inline-block',
                    background: '#fff8f5',
                    border: '1px solid #e8531a',
                    borderRadius: '6px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#e8531a',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '16px',
                  }}>
                    NO MATCHES
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#1d1d1f',
                    margin: '0 0 8px',
                  }}>
                    No cars found in this budget
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#6e6e73',
                    margin: '0 0 24px',
                  }}>
                    Try increasing your budget or adjusting your preferences
                  </p>
                  <button
                    onClick={() => { scrollToTop(); setStep(1); }}
                    style={{
                      background: '#e8531a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#c94415';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(232,83,26,0.35)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#e8531a';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Adjust Budget
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default BudgetFinder;