"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// SVG Icons
const IconTag = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const IconShare = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)

const Offers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('valid_until');

    if (error) {
      console.error('Error fetching offers:', error);
    } else {
      setOffers(data);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (validUntil: string) => {
    const today = new Date();
    const endDate = new Date(validUntil);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredOffers = offers.filter(offer => {
    if (filter === 'all') return true;
    if (filter === 'active') return getDaysRemaining(offer.valid_until) > 0;
    if (filter === 'expiring') return getDaysRemaining(offer.valid_until) <= 7 && getDaysRemaining(offer.valid_until) > 0;
    return true;
  });

  const handleShare = (offerId: string) => {
    const url = `${window.location.origin}/offers/${offerId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
      minHeight: '100vh',
      background: 'white',
    }}>
      {/* HERO SECTION */}
      <div style={{
        background: 'white',
        padding: isMobile ? '28px 16px 20px' : '40px 24px 28px',
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
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
            OFFERS
          </div>
          <h1 style={{
            fontSize: isMobile ? '26px' : '34px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 8px',
            letterSpacing: '-1px',
            lineHeight: 1.2,
          }}>
            Latest Car<span style={{ color: '#e8531a' }}> Offers</span>
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#6e6e73',
            margin: 0,
            lineHeight: 1.6,
            maxWidth: '600px',
          }}>
            Find the best deals and discounts on cars in Nepal
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{
        background: 'white',
        padding: isMobile ? '16px 16px 20px' : '16px 24px 24px',
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          gap: '24px',
        }}>
          {['all', 'active', 'expiring'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              style={{
                fontSize: '13px',
                fontWeight: filter === filterOption ? '700' : '500',
                color: filter === filterOption ? '#e8531a' : '#6e6e73',
                background: 'none',
                border: 'none',
                padding: '0 0 4px',
                cursor: 'pointer',
                borderBottom: filter === filterOption ? '2px solid #e8531a' : 'none',
                fontFamily: 'inherit',
              }}
            >
              {filterOption === 'all' ? 'All Offers' : 
               filterOption === 'active' ? 'Active' : 'Expiring Soon'}
            </button>
          ))}
        </div>
      </div>

      {/* OFFERS GRID */}
      <div style={{
        background: '#f5f5f7',
        padding: isMobile ? '24px 16px' : '40px 24px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '24px',
            }}>
              {[...Array(6)].map((_, index) => (
                <div 
                  key={index}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid #e5e5e5',
                    animation: 'pulse 1.5s infinite',
                  }}
                >
                  <div style={{
                    height: '180px',
                    background: '#f0f0f0',
                  }} />
                  <div style={{ padding: '20px' }}>
                    <div style={{ height: '20px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '16px' }} />
                    <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '12px', width: '80%' }} />
                    <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOffers.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '24px',
            }}>
              {filteredOffers.map(offer => {
                const daysRemaining = getDaysRemaining(offer.valid_until);
                const isActive = daysRemaining > 0;
                
                return (
                  <div
                    key={offer.id}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid #e5e5e5',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#e8531a';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,83,26,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e5e5e5';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={offer.image_url || 'https://placehold.co/600x400/f59e0b/ffffff?text=Special+Offer'} 
                        alt={offer.title} 
                        style={{
                          width: '100%',
                          height: isMobile ? '200px' : '240px',
                          objectFit: 'cover',
                        }}
                      />
                      <div 
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          background: isActive ? '#22c55e' : '#ef4444',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '700',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {isActive ? 'Active' : 'Expired'}
                      </div>
                    </div>
                    
                    <div style={{ padding: '24px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#1d1d1f',
                        margin: '0 0 12px',
                        lineHeight: 1.4,
                      }}>
                        {offer.title}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#6e6e73',
                        margin: '0 0 20px',
                        lineHeight: 1.6,
                      }}>
                        {offer.description}
                      </p>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '16px',
                      }}>
                        <div style={{ color: '#e8531a' }}>
                          <IconTag />
                        </div>
                        <p style={{
                          fontSize: '15px',
                          fontWeight: '700',
                          color: '#e8531a',
                          margin: 0,
                        }}>
                          Save up to Rs.{offer.discount_amount?.toLocaleString('en-IN') || 'N/A'}
                        </p>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        fontSize: '13px',
                        color: '#6e6e73',
                      }}>
                        <IconCalendar />
                        <span>Valid until: {formatDate(offer.valid_until)}</span>
                      </div>
                      
                      {isActive && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '20px',
                          fontSize: '13px',
                          color: '#6e6e73',
                        }}>
                          <IconClock />
                          <span>{daysRemaining} days remaining</span>
                        </div>
                      )}
                      
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                      }}>
                        <button
                          onClick={() => {
                            if (offer.car_id) {
                              navigate(`/cars/${offer.car_id}`);
                            } else {
                              // Fallback if no car_id
                              console.log('No car associated with this offer');
                            }
                          }}
                          style={{
                            flex: 1,
                            background: '#e8531a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '12px 20px',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#c94415';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(232,83,26,0.35)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = '#e8531a';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleShare(offer.id)}
                          style={{
                            background: 'white',
                            color: '#1d1d1f',
                            border: '1.5px solid #d2d2d7',
                            borderRadius: '10px',
                            padding: '12px 20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#e8531a';
                            e.currentTarget.style.color = '#e8531a';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#d2d2d7';
                            e.currentTarget.style.color = '#1d1d1f';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <IconShare />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #e5e5e5',
              padding: isMobile ? '40px 20px' : '60px 32px',
              textAlign: 'center',
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
                COMING SOON
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: '0 0 12px',
                letterSpacing: '-0.5px',
              }}>
                Offers Coming Soon
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#6e6e73',
                margin: '0 0 32px',
                lineHeight: 1.6,
                maxWidth: '500px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
                We're collecting the best car deals in Nepal. Check back soon for exclusive offers, discounts, and limited-time promotions.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '16px',
                marginBottom: '32px',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
                <div
                  style={{
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#e8531a';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(232,83,26,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ color: '#e8531a', marginTop: '2px' }}>
                    <IconTag />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#1d1d1f', marginBottom: '4px' }}>
                      Exchange Bonus
                    </div>
                    <div style={{ fontSize: '13px', color: '#6e6e73', lineHeight: 1.5 }}>
                      Trade in your old car for extra savings
                    </div>
                  </div>
                </div>
                
                <div
                  style={{
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#e8531a';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(232,83,26,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ color: '#e8531a', marginTop: '2px' }}>
                    <IconCalendar />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#1d1d1f', marginBottom: '4px' }}>
                      Festival Offers
                    </div>
                    <div style={{ fontSize: '13px', color: '#6e6e73', lineHeight: 1.5 }}>
                      Special deals during Dashain, Tihar & more
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/cars')}
                style={{
                  background: '#e8531a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#c94415';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(232,83,26,0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#e8531a';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Browse All Cars
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Offers;