import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Helmet } from 'react-helmet-async'

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
)
const IconWhatsApp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.103 1.508 5.834L0 24l6.335-1.479A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.031-1.371l-.361-.214-3.741.873.944-3.658-.235-.374A9.877 9.877 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/>
  </svg>
)
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const IconLink = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>
)

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<any>(null)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [recommendedPosts, setRecommendedPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()
      if (error) throw error
      setPost(data)
      
      // Fetch related posts from same category, exclude current
      const { data: related } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('category', data.category)
        .neq('slug', slug)
        .limit(3)
      setRelatedPosts(related || [])
      
      // Fetch recommended posts from different categories
      const { data: recommended } = await supabase
        .from('blog_posts')
        .select('*')
        .neq('slug', slug)
        .neq('category', data.category)
        .limit(2)
      setRecommendedPosts(recommended || [])
    } catch (err) {
      console.error('Error fetching post:', err)
    } finally {
      setLoading(false)
    }
  }

  const getReadingTime = (content: string) => {
    const words = content?.replace(/<[^>]*>/g, '').split(' ').length || 0
    return Math.ceil(words / 200)
  }

  const shareUrl = `https://carkinne.com/blog/${slug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '40px 16px' : '60px 24px' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            height: i === 0 ? '40px' : '16px',
            background: '#f0f0f0', borderRadius: '6px',
            marginBottom: '16px', width: i === 1 ? '60%' : '100%',
            animation: 'pulse 1.5s infinite',
          }} />
        ))}
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      </div>
    )
  }

  if (!post) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', color: '#1d1d1f', marginBottom: '12px' }}>Post not found</h2>
        <button onClick={() => navigate('/blog')} style={{
          background: '#e8531a', color: 'white', border: 'none',
          borderRadius: '10px', padding: '12px 24px',
          fontSize: '14px', fontWeight: '700', cursor: 'pointer',
        }}>Back to Blog</button>
      </div>
    )
  }

  // Sticky share sidebar (desktop only)
  const ShareSidebar = () => (
    <div style={{
      position: 'sticky', top: '100px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '12px',
    }}>
      <div style={{ fontSize: '11px', fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Share</div>
      {[
        { href: `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`, bg: '#25D366', icon: <IconWhatsApp /> },
        { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, bg: '#1877F2', icon: <IconFacebook /> },
        { href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`, bg: '#000', icon: <IconX /> },
      ].map((item, i) => (
        <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '10px',
            background: item.bg, color: 'white', textDecoration: 'none',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >{item.icon}</a>
      ))}
      <button onClick={handleCopy} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '40px', height: '40px', borderRadius: '10px',
        background: copied ? '#e8531a' : 'white',
        border: '1.5px solid #e5e5e5',
        color: copied ? 'white' : '#1d1d1f',
        cursor: 'pointer', transition: 'all 0.2s',
      }}><IconLink /></button>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>{post.title} | CarKinne</title>
        <meta name="description" content={post.excerpt || post.content?.slice(0, 150)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.content?.slice(0, 150)} />
        <meta property="og:image" content={post.cover_image} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.content?.slice(0, 150)} />
        <meta name="twitter:image" content={post.cover_image} />
      </Helmet>

      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
        background: 'white', minHeight: '100vh',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 24px' }}>

          {/* TWO COLUMN LAYOUT */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 56px',
            gap: '48px',
            alignItems: 'start',
          }}>
            {/* MAIN CONTENT */}
            <div>
              {/* CATEGORY + META */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {post.category && (
                  <span style={{
                    background: '#fff8f5', border: '1px solid #e8531a',
                    borderRadius: '6px', padding: '4px 12px',
                    fontSize: '11px', fontWeight: '700',
                    color: '#e8531a', textTransform: 'uppercase', letterSpacing: '1px',
                  }}>{post.category}</span>
                )}
              </div>

              {/* TITLE */}
              <h1 style={{
                fontSize: isMobile ? '26px' : '38px',
                fontWeight: '800', color: '#1d1d1f',
                lineHeight: 1.2, letterSpacing: '-1px',
                margin: '0 0 20px',
              }}>{post.title}</h1>

              {/* AUTHOR + DATE + READ TIME */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                marginBottom: '28px', flexWrap: 'wrap',
                paddingBottom: '20px', borderBottom: '1px solid #f0f0f0',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#e8531a', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '14px', fontWeight: '700',
                  flexShrink: 0,
                }}>
                  {(post.author || 'CarKinne').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1d1d1f' }}>
                    {post.author || 'CarKinne Team'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6e6e73' }}>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })} · {getReadingTime(post.content)} min read
                  </div>
                </div>
              </div>

              {/* COVER IMAGE */}
              {post.cover_image && (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  style={{
                    width: '100%', height: 'auto',
                    borderRadius: '16px', marginBottom: '40px',
                    display: 'block',
                  }}
                />
              )}

              {/* CONTENT */}
              <div
                className="blog-content"
                style={{ fontSize: '17px', lineHeight: '1.85', color: '#1d1d1f', letterSpacing: '-0.1px' }}
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />

              {/* MOBILE SHARE */}
              {isMobile && (
                <div style={{ marginTop: '48px', paddingTop: '28px', borderTop: '1px solid #e5e5e5' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Share this article</div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { href: `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`, bg: '#25D366', label: 'WhatsApp', icon: <IconWhatsApp /> },
                      { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, bg: '#1877F2', label: 'Facebook', icon: <IconFacebook /> },
                      { href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`, bg: '#000', label: 'X', icon: <IconX /> },
                    ].map((item, i) => (
                      <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          background: item.bg, color: 'white',
                          borderRadius: '10px', padding: '10px 16px',
                          fontSize: '13px', fontWeight: '700', textDecoration: 'none',
                        }}
                      >{item.icon}{item.label}</a>
                    ))}
                    <button onClick={handleCopy} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: copied ? '#e8531a' : 'white',
                      color: copied ? 'white' : '#1d1d1f',
                      border: '1.5px solid #e5e5e5', borderRadius: '10px',
                      padding: '10px 16px', fontSize: '13px', fontWeight: '700',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}><IconLink />{copied ? 'Copied!' : 'Copy Link'}</button>
                  </div>
                </div>
              )}

              {/* RECOMMENDED FOR YOU */}
              {recommendedPosts.length > 0 && (
                <div style={{
                  marginTop: '64px', paddingTop: '40px',
                  borderTop: '1px solid #e5e5e5',
                }}>
                  <div style={{
                    display: 'inline-block',
                    background: '#fff8f5', border: '1px solid #e8531a',
                    borderRadius: '6px', padding: '4px 12px',
                    fontSize: '11px', fontWeight: '700',
                    color: '#e8531a', textTransform: 'uppercase',
                    letterSpacing: '1px', marginBottom: '12px',
                  }}>Recommended</div>
                  <h2 style={{
                    fontSize: isMobile ? '20px' : '24px',
                    fontWeight: '800', color: '#1d1d1f',
                    margin: '0 0 24px', letterSpacing: '-0.5px',
                  }}>Recommended For You</h2>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: '20px',
                  }}>
                    {recommendedPosts.map(rec => (
                      <div
                        key={rec.id}
                        onClick={() => {
                          navigate(`/blog/${rec.slug}`)
                          window.scrollTo(0, 0)
                        }}
                        style={{
                          display: 'flex', gap: '16px',
                          background: 'white', border: '1px solid #e5e5e5',
                          borderRadius: '16px', overflow: 'hidden',
                          cursor: 'pointer', transition: 'all 0.2s',
                          padding: '16px',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#e8531a'
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,83,26,0.12)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#e5e5e5'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        {rec.cover_image && (
                          <img src={rec.cover_image} alt={rec.title}
                            style={{
                              width: '90px', height: '90px',
                              objectFit: 'cover', borderRadius: '10px',
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {rec.category && (
                            <span style={{
                              fontSize: '10px', fontWeight: '700',
                              color: '#e8531a', textTransform: 'uppercase',
                              letterSpacing: '0.5px', display: 'block', marginBottom: '6px',
                            }}>{rec.category}</span>
                          )}
                          <div style={{
                            fontSize: '14px', fontWeight: '700',
                            color: '#1d1d1f', lineHeight: 1.4,
                            marginBottom: '8px',
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}>{rec.title}</div>
                          <div style={{ fontSize: '12px', color: '#6e6e73' }}>
                            {new Date(rec.published_at).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* STICKY SHARE SIDEBAR (desktop only) */}
            {!isMobile && <ShareSidebar />}
          </div>

          {/* MORE ARTICLES */}
          {relatedPosts.length > 0 && (
            <div style={{
              marginTop: '72px', paddingTop: '48px',
              borderTop: '1px solid #e5e5e5',
            }}>
              <div style={{
                display: 'inline-block',
                background: '#fff8f5', border: '1px solid #e8531a',
                borderRadius: '6px', padding: '4px 12px',
                fontSize: '11px', fontWeight: '700',
                color: '#e8531a', textTransform: 'uppercase',
                letterSpacing: '1px', marginBottom: '12px',
              }}>More Articles</div>
              <h2 style={{
                fontSize: isMobile ? '20px' : '26px',
                fontWeight: '800', color: '#1d1d1f',
                margin: '0 0 28px', letterSpacing: '-0.5px',
              }}>You might also like</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: '20px',
              }}>
                {relatedPosts.map(related => (
                  <div
                    key={related.id}
                    onClick={() => {
                      navigate(`/blog/${related.slug}`)
                      window.scrollTo(0, 0)
                    }}
                    style={{
                      background: 'white', border: '1px solid #e5e5e5',
                      borderRadius: '16px', overflow: 'hidden',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#e8531a'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,83,26,0.12)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e5e5e5'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {related.cover_image && (
                      <img src={related.cover_image} alt={related.title}
                        style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                    )}
                    <div style={{ padding: '16px' }}>
                      {related.category && (
                        <span style={{
                          fontSize: '10px', fontWeight: '700',
                          color: '#e8531a', textTransform: 'uppercase',
                          letterSpacing: '0.5px', display: 'block', marginBottom: '6px',
                        }}>{related.category}</span>
                      )}
                      <div style={{
                        fontSize: '15px', fontWeight: '700',
                        color: '#1d1d1f', lineHeight: 1.4, marginBottom: '8px',
                      }}>{related.title}</div>
                      <div style={{ fontSize: '12px', color: '#6e6e73' }}>
                        {new Date(related.published_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* MORE ARTICLES BUTTON */}
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <button
                  onClick={() => {
                    navigate('/blog')
                    window.scrollTo(0, 0)
                  }}
                  style={{
                    background: 'white', color: '#1d1d1f',
                    border: '1.5px solid #e5e5e5',
                    borderRadius: '10px', padding: '12px 32px',
                    fontSize: '14px', fontWeight: '700',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#e8531a'
                    e.currentTarget.style.color = '#e8531a'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                    e.currentTarget.style.color = '#1d1d1f'
                  }}
                >
                  More Articles
                </button>
              </div>
            </div>
          )}

          {/* BACK TO BLOG - bottom */}
          <div style={{ textAlign: 'center', marginTop: '24px', marginBottom: isMobile ? '48px' : '80px' }}>
            <button
              onClick={() => {
                navigate('/blog')
                window.scrollTo(0, 0)
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'none', border: '1.5px solid #e5e5e5',
                borderRadius: '10px', padding: '12px 28px',
                fontSize: '14px', fontWeight: '700',
                color: '#6e6e73', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#e8531a'
                e.currentTarget.style.color = '#e8531a'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e5e5e5'
                e.currentTarget.style.color = '#6e6e73'
              }}
            >
              <IconArrowLeft /> Back to Blog
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .blog-content h2 { font-size: 24px; font-weight: 800; margin: 40px 0 16px; }
        .blog-content h3 { font-size: 20px; font-weight: 700; margin: 32px 0 12px; }
        .blog-content p { margin: 0 0 20px; }
        .blog-content ul, .blog-content ol { padding-left: 24px; margin: 0 0 20px; }
        .blog-content li { margin-bottom: 8px; }
        .blog-content blockquote { border-left: 3px solid #e8531a; padding: 12px 20px; margin: 28px 0; background: #fff8f5; border-radius: 0 8px 8px 0; font-style: italic; color: #6e6e73; }
        .blog-content a { color: #e8531a; text-decoration: none; }
        .blog-content a:hover { text-decoration: underline; }
        .blog-content img { max-width: 100%; border-radius: 12px; margin: 24px 0; }
      `}</style>
    </>
  )
}

export default BlogPost