import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Helmet } from 'react-helmet-async'

const BlogPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        Loading...
      </div>
    )
  }

  if (!post) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        Post not found
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | CarKinne</title>
        <meta name="description" content={post.excerpt || post.content?.slice(0, 150)} />

        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.content?.slice(0, 150)} />
        <meta property="og:image" content={post.cover_image} />
        <meta property="og:url" content={`https://carkinne.com/blog/${post.slug}`} />
        <meta property="og:type" content="article" />

        {/* Twitter/X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.content?.slice(0, 150)} />
        <meta name="twitter:image" content={post.cover_image} />
      </Helmet>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ 
          fontSize: '14px', 
          color: '#e8531a', 
          fontWeight: '700',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          {new Date(post.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '800', 
          color: '#1d1d1f',
          lineHeight: '1.2',
          marginBottom: '20px'
        }}>
          {post.title}
        </h1>

        {post.cover_image && (
          <img 
            src={post.cover_image} 
            alt={post.title}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              marginBottom: '30px'
            }}
          />
        )}

        <div 
          style={{ 
            fontSize: '16px', 
            lineHeight: '1.7',
            color: '#1d1d1f'
          }}
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
      </div>
    </>
  )
}

export default BlogPost