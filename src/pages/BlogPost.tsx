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
      <div style={{
        maxWidth: '800px', margin: '0 auto',
        padding: isMobile ? '40px 16px' : '60px 24px',
      }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            height: i === 0 ? '40px' : '16px',
            background: '#f0f0f0',
            borderRadius: '6px',
            marginBottom: '16px',
            width: i === 1 ? '60%' : '100%',
            animation: 'pulse 1.5s infinite',
          }} />
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
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
        }}>
          Back to Blog
        </button>
      </div>
    )
  }

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
        background: 'white',
        minHeight: '100vh',
      }}>
        {/* BACK BUTTON */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '20px 16px 0' : '32px 24px 0' }}>
          <button
            onClick={() => navigate('/blog')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'none', border: 'none',
              fontSize: '13px', fontWeight: '600',
              color: '#6e6e73', cursor: 'pointer',
              fontFamily: 'inherit', padding: 0,
              marginBottom: '32px',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#e8531a'}
            onMouseLeave={e => e.currentTarget.style.color = '#6e6e73'}
          >
            <IconArrowLeft /> Back to Blog
          </button>

          {/* CATEGORY + DATE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {post.category && (
              <span style={{
                background: '#fff8f5', border: '1px solid #e8531a',
                borderRadius: '6px', padding: '4px 12px',
                fontSize: '11px', fontWeight: '700',
                color: '#e8531a', textTransform: 'uppercase', letterSpacing: '1px',
              }}>
                {post.category}
              </span>
            )}
            <span style={{ fontSize: '13px', color: '#6e6e73' }}>
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
            <span style={{ fontSize: '13px', color: '#6e6e73' }}>
              {getReadingTime(post.content)} min read
            </span>
          </div>

          {/* TITLE */}
          <h1 style={{
            fontSize: isMobile ? '26px' : '38px',
            fontWeight: '800', color: '#1d1d1f',
            lineHeight: 1.2, letterSpacing: '-1px',
            margin: '0 0 16px',
          }}>
            {post.title}
          </h1>

          {/* EXCERPT */}
          {post.excerpt && (
            <p style={{
              fontSize: isMobile ? '15px' : '17px',
              color: '#6e6e73', lineHeight: 1.6,
              margin: '0 0 28px',
            }}>
              {post.excerpt}
            </p>
          )}

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
            style={{ fontSize: '16px', lineHeight: '1.8', color: '#1d1d1f' }}
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {/* SHARE SECTION */}
          <div style={{
            marginTop: '56px', paddingTop: '32px',
            borderTop: '1px solid #e5e5e5',
          }}>
            <div style={{
              fontSize: '13px', fontWeight: '700',
              color: '#6e6e73', textTransform: 'uppercase',
              letterSpacing: '1px', marginBottom: '16px',
            }}>
              Share this article
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#25D366', color: 'white',
                  borderRadius: '10px', padding: '10px 18px',
                  fontSize: '13px', fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                <IconWhatsApp /> WhatsApp
              </a>
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#1877F2', color: 'white',
                  borderRadius: '10px', padding: '10px 18px',
                  fontSize: '13px', fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                <IconFacebook /> Facebook
              </a>
              {/* X/Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#000', color: 'white',
                  borderRadius: '10px', padding: '10px 18px',
                  fontSize: '13px', fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                <IconX /> X
              </a>
              {/* Copy Link */}
              <button
                onClick={handleCopy}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: copied ? '#e8531a' : 'white',
                  color: copied ? 'white' : '#1d1d1f',
                  border: '1.5px solid #e5e5e5',
                  borderRadius: '10px', padding: '10px 18px',
                  fontSize: '13px', fontWeight: '700',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                <IconLink /> {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* BACK TO BLOG */}
          <div style={{ marginTop: '48px', marginBottom: isMobile ? '48px' : '80px' }}>
            <button
              onClick={() => navigate('/blog')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'none', border: '1.5px solid #e5e5e5',
                borderRadius: '10px', padding: '12px 24px',
                fontSize: '14px', fontWeight: '700',
                color: '#1d1d1f', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s',
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
              <IconArrowLeft /> Back to Blog
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogPost