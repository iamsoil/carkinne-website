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

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
        
        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
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