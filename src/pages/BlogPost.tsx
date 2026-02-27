"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8531a] mx-auto mb-4"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">Post Not Found</h2>
          <p className="text-[#6e6e73] mb-6">The blog post you're looking for doesn't exist.</p>
          <a 
            href="/blog" 
            className="inline-block bg-[#1d1d1f] text-white px-6 py-3 rounded-lg hover:bg-[#e8531a] transition-colors"
          >
            ← Back to Blog
          </a>
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
    <div className="min-h-screen bg-white">
      {/* SEO Meta */}
      <div className="hidden">
        <title>{post.seo_title || post.title} | CarKinne</title>
        <meta name="description" content={post.seo_description || post.excerpt} />
      </div>

      {/* Cover Image */}
      <div className="w-full h-96 overflow-hidden">
        <img 
          src={post.cover_image || 'https://placehold.co/1200x400/f5f5f7/6e6e73?text=Blog+Cover'} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <a 
          href="/blog" 
          className="text-[#e8531a] hover:underline mb-8 inline-block"
        >
          ← Back to Blog
        </a>
        
        <div className="mb-4">
          <span className="inline-block bg-[#f5f5f7] text-[#6e6e73] text-xs px-3 py-1 rounded-full">
            {post.category || 'General'}
          </span>
        </div>
        
        <h1 className="text-4xl font-bold text-[#1d1d1f] mt-4 mb-2">
          {post.title}
        </h1>
        
        <p className="text-[#6e6e73] text-sm mt-2">
          By {post.author || 'CarKinne Team'} · {formatDate(post.published_at || post.created_at)}
        </p>
        
        <div className="border-t border-[#d2d2d7] my-8"></div>
        
        <div className="prose prose-lg max-w-none">
          {post.content ? (
            <div 
              className="text-[#1d1d1f] text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          ) : (
            <div>
              <p className="text-[#1d1d1f] text-base leading-relaxed">
                {post.excerpt}
              </p>
              <p className="text-[#6e6e73] text-base mt-6">
                Full article coming soon. Subscribe to our newsletter for updates.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-[#f5f5f7] py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-8">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div 
                  key={relatedPost.id} 
                  className="bg-white border border-[#d2d2d7] rounded-xl overflow-hidden"
                >
                  <img 
                    src={relatedPost.cover_image || 'https://placehold.co/600x300/f5f5f7/6e6e73?text=Blog+Image'} 
                    alt={relatedPost.title} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-5">
                    <span className="inline-block bg-[#e8531a] text-white text-xs px-2 py-1 rounded mb-2">
                      {relatedPost.category || 'General'}
                    </span>
                    <h3 className="font-semibold text-[#1d1d1f] text-base line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-[#6e6e73] text-sm line-clamp-2 mb-4">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6e6e73] text-xs">
                        {formatDate(relatedPost.published_at || relatedPost.created_at)}
                      </span>
                      <a 
                        href={`/blog/${relatedPost.slug}`} 
                        className="text-[#e8531a] text-xs hover:underline"
                      >
                        Read →
                      </a>
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