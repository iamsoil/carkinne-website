"use client";

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const IconUser = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const fetchBlogPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
    } else {
      setPosts(data);
      setFilteredPosts(data);
    }
    setLoading(false);
  };

  const filterPosts = () => {
    let result = [...posts];
    
    // Search filter
    if (searchQuery) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(post => post.category === selectedCategory);
    }
    
    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());
    } else if (sortBy === 'popular') {
      // In a real app, this would be based on views or likes
      result.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    }
    
    setFilteredPosts(result);
  };

  // Get unique categories
  const categories = Array.from(new Set(posts.map(post => post.category))).filter(Boolean);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
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
            BLOG
          </div>
          <h1 style={{
            fontSize: isMobile ? '26px' : '34px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '0 0 8px',
            letterSpacing: '-1px',
            lineHeight: 1.2,
          }}>
            Latest from<span style={{ color: '#e8531a' }}> CarKinne</span>
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#6e6e73',
            margin: 0,
            lineHeight: 1.6,
            maxWidth: '600px',
          }}>
            News, reviews and buying guides for Nepal's car market
          </p>
        </div>
      </div>

      {/* SEARCH + FILTER BAR */}
      <div style={{
        background: 'white',
        padding: '0 24px 24px',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <div style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999',
                pointerEvents: 'none',
              }}>
                <IconSearch />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #d2d2d7',
                  borderRadius: '8px',
                  padding: '8px 12px 8px 32px',
                  fontSize: '12px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#e8531a'}
                onBlur={(e) => e.target.style.borderColor = '#d2d2d7'}
              />
            </div>
            
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                border: '1px solid #d2d2d7',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer',
                width: '160px',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = '#e8531a'}
              onBlur={(e) => e.target.style.borderColor = '#d2d2d7'}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                border: '1px solid #d2d2d7',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer',
                width: '150px',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = '#e8531a'}
              onBlur={(e) => e.target.style.borderColor = '#d2d2d7'}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* POSTS GRID */}
      <div style={{
        background: '#f5f5f7',
        padding: isMobile ? '24px 16px' : '40px 24px',
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '20px',
            }}>
              {[...Array(3)].map((_, index) => (
                <div 
                  key={index}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid #e5e5e5',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    height: '180px',
                    background: '#f0f0f0',
                  }} />
                  <div style={{ padding: '16px' }}>
                    <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', width: '60%' }} />
                    <div style={{ height: '10px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '6px', width: '80%' }} />
                    <div style={{ height: '10px', background: '#f0f0f0', borderRadius: '4px', width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '20px',
            }}>
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid #e5e5e5',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#e8531a';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,83,26,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img 
                    src={post.cover_image || 'https://placehold.co/600x400/1d1d1f/ffffff?text=CarKinne'} 
                    alt={post.title} 
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                    }}
                  />
                  
                  <div style={{ padding: '16px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}>
                      {post.category && (
                        <span style={{
                          background: '#fff8f5',
                          border: '1px solid #fde8da',
                          color: '#e8531a',
                          fontSize: '10px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          borderRadius: '4px',
                          padding: '2px 8px',
                        }}>
                          {post.category}
                        </span>
                      )}
                      <div style={{
                        fontSize: '11px',
                        color: '#6e6e73',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <IconCalendar />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                    </div>
                    
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '800',
                      color: '#1d1d1f',
                      margin: '8px 0 6px',
                      letterSpacing: '-0.3px',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {post.title}
                    </h3>
                    
                    <p style={{
                      fontSize: '12px',
                      color: '#6e6e73',
                      lineHeight: '1.6',
                      margin: '0 0 12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {post.excerpt}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div style={{
                        fontSize: '11px',
                        color: '#6e6e73',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <IconUser />
                        <span>{post.author}</span>
                      </div>
                      
                      <Link 
                        to={`/blog/${post.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#e8531a',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                      >
                        Read More
                        <IconArrow />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #e5e5e5',
              padding: '48px 24px',
              textAlign: 'center',
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '800',
                color: '#1d1d1f',
                margin: '0 0 8px',
              }}>
                No articles found
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#6e6e73',
                margin: '0 0 24px',
              }}>
                Try a different search or category
              </p>
              <button
                onClick={clearFilters}
                style={{
                  background: '#e8531a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
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
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;