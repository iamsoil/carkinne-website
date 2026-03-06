"use client";

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)

const IconUser = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const IconShare = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)

const IconFacebook = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
)

const IconWhatsApp = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.528 5.847L.057 23.571a.75.75 0 00.921.921l5.724-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22.5a10.44 10.44 0 01-5.339-1.463l-.383-.228-3.968 1.02 1.02-3.968-.228-.383A10.44 10.44 0 011.5 12C1.5 6.201 6.201 1.5 12 1.5S22.5 6.201 22.5 12 17.799 22.5 12 22.5z"/>
  </svg>
)

const IconTwitter = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const IconLink = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>
)

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    if (post) {
      fetchRelatedPosts();
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (err) {
      console.error('Error fetching blog post:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .neq('id', post.id)
        .eq('is_published', true)
        .limit(3);

      if (!error) {
        setRelatedPosts(data || []);
      }
    } catch (err) {
      console.error('Error fetching related posts:', err);
    }
  };

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
        <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '36px',
            height: '36px',
            border: '3px solid #f0f0f0',
            borderTop: '3px solid #e8531a',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto',
          }}></div>
          <p style={{ fontSize: '13px', color: '#6e6e73', marginTop: '12px' }}>
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
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
          padding: '48px 32px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
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
            NOT FOUND
          </div>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: '#1d1d1f',
            margin: '8px 0 8px',
          }}>
            Post Not Found
          </h2>
          <p style={{
            fontSize: '13px',
            color: '#6e6e73',
            margin: '0 0 20px',
          }}>
            The blog post you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/blog')}
            style={{
              background: '#e8531a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{
      background: 'white',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    }}>
      {/* SEO Meta */}
      <div className="hidden">
        <title>{post.seo_title || post.title} | CarKinne</title>
        <meta name="description" content={post.seo_description || post.excerpt} />
      </div>

      {/* Article content */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: isMobile ? '20px 16px' : '40px 24px',
      }}>
        <div style={{ marginBottom: '12px' }}>
          <span style={{
            background: '#fff8f5',
            border: '1px solid #fde8da',
            color: '#e8531a',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderRadius: '6px',
            padding: '4px 12px',
          }}>
            {post.category || 'General'}
          </span>
        </div>
        
        <h1 style={{
          fontSize: isMobile ? '24px' : '36px',
          fontWeight: '800',
          color: '#1d1d1f',
          letterSpacing: '-0.5px',
          lineHeight: 1.25,
          margin: '12px 0 16px',
        }}>
          {post.title}
        </h1>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}>
            <IconUser style={{ color: '#6e6e73' }} />
            <span style={{
              fontSize: '13px',
              color: '#6e6e73',
            }}>
              {post.author || 'CarKinne Team'}
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}>
            <IconCalendar style={{ color: '#6e6e73' }} />
            <span style={{
              fontSize: '13px',
              color: '#6e6e73',
            }}>
              {formatDate(post.published_at || post.created_at)}
            </span>
          </div>
        </div>
        
        <div style={{
          height: '1px',
          background: '#f0f0f0',
          margin: '0 0 28px',
        }}></div>
        
        {/* Cover Image - moved inline within content flow */}
        <img 
          src={post.cover_image || 'https://placehold.co/1200x400/f5f5f7/6e6e73?text=CarKinne'} 
          alt={post.title} 
          style={{
            width: '100%',
            height: isMobile ? '200px' : '320px',
            objectFit: 'cover',
            borderRadius: '12px',
            marginBottom: '28px',
            display: 'block',
          }}
        />
        
        <div 
          className="article-body"
          style={{
            fontSize: isMobile ? '15px' : '16px',
            lineHeight: 1.8,
            color: '#1d1d1f',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        <style>{`
          .article-body h2 { font-size: 22px; font-weight: 800; color: #1d1d1f; margin: 32px 0 12px; letter-spacing: -0.3px; }
          .article-body h3 { font-size: 18px; font-weight: 700; color: #1d1d1f; margin: 24px 0 10px; }
          .article-body p { margin: 0 0 18px; }
          .article-body ul, .article-body ol { padding-left: 20px; margin: 0 0 18px; }
          .article-body li { margin-bottom: 8px; }
          .article-body a { color: #e8531a; text-decoration: none; }
          .article-body a:hover { text-decoration: underline; }
          .article-body img { width: 100%; border-radius: 12px; margin: 24px 0; }
          .article-body blockquote { border-left: 3px solid #e8531a; margin: 24px 0; padding: 12px 20px; background: #fff8f5; border-radius: 0 8px 8px 0; font-style: italic; color: #6e6e73; }
          .article-body strong { color: #1d1d1f; font-weight: 700; }
          .article-body table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px; }
          .article-body th { background: #f5f5f7; padding: 10px 14px; text-align: left; font-weight: 700; border-bottom: 2px solid #e5e5e5; }
          .article-body td { padding: 10px 14px; border-bottom: 1px solid #f0f0f0; }
        `}</style>
        
        {!post.content && (
          <div style={{
            padding: '0',
          }}>
            <p style={{
              fontSize: isMobile ? '15px' : '16px',
              lineHeight: 1.8,
              color: '#1d1d1f',
              margin: '0 0 12px',
            }}>
              {post.excerpt}
            </p>
            <p style={{
              fontSize: '13px',
              color: '#6e6e73',
              margin: '12px 0 0',
            }}>
              Full article coming soon. Subscribe to our newsletter for updates.
            </p>
          </div>
        )}
        
        <div style={{
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          {/* Back to Blog */}
          <span
            onClick={() => navigate('/blog')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#e8531a',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <IconArrow /> Back to Blog
          </span>

          {/* Share */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              fontWeight: '700',
              color: '#6e6e73',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              <IconShare /> Share
            </span>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title + ' — ' + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '8px',
                background: '#25D366', color: 'white', textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <IconWhatsApp />
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '8px',
                background: '#1877f2', color: 'white', textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <IconFacebook />
            </a>

            {/* X/Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '8px',
                background: '#000', color: 'white', textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <IconTwitter />
            </a>

            {/* Copy Link */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '0 12px', height: '32px', borderRadius: '8px',
                background: copied ? '#e8531a' : '#f5f5f7',
                color: copied ? 'white' : '#1d1d1f',
                border: 'none', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}
            >
              <IconLink />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div style={{
          background: '#f5f5f7',
          padding: isMobile ? '32px 16px' : '48px 24px',
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
              MORE ARTICLES
            </div>
            <h2 style={{
              fontSize: isMobile ? '20px' : '26px',
              fontWeight: '800',
              color: '#1d1d1f',
              letterSpacing: '-0.5px',
              margin: '0 0 20px',
            }}>
              Keep Reading
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '100%' : '280px'}, 1fr))`,
              gap: '16px',
            }}>
              {relatedPosts.map((relatedPost) => (
                <div 
                  key={relatedPost.id} 
                  onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                  style={{
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#e8531a';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,83,26,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img 
                    src={relatedPost.cover_image || 'https://placehold.co/600x300/f5f5f7/6e6e73?text=Blog+Image'} 
                    alt={relatedPost.title} 
                    style={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ padding: '14px' }}>
                    <div style={{
                      display: 'inline-block',
                      background: '#fff8f5',
                      border: '1px solid #fde8da',
                      color: '#e8531a',
                      fontSize: '10px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      marginBottom: '8px',
                    }}>
                      {relatedPost.category || 'General'}
                    </div>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '800',
                      color: '#1d1d1f',
                      margin: '8px 0 6px',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {relatedPost.title}
                    </h3>
                    <p style={{
                      fontSize: '12px',
                      color: '#6e6e73',
                      lineHeight: 1.6,
                      margin: '0 0 10px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {relatedPost.excerpt}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{
                        fontSize: '11px',
                        color: '#6e6e73',
                      }}>
                        {formatDate(relatedPost.published_at || relatedPost.created_at)}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#e8531a',
                      }}>
                        Read →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;