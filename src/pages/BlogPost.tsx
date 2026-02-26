"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, User, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

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
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  const fetchRelatedPosts = async () => {
    if (!post) return;
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', post.category)
      .neq('id', post.id)
      .eq('is_published', true)
      .limit(3);

    if (!error) {
      setRelatedPosts(data);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
          <p className="text-muted-foreground">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-4" onClick={() => window.location.href = '/blog'}>
            Browse All Posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <a href="/" className="hover:text-foreground">Home</a> / 
        <a href="/blog" className="hover:text-foreground"> Blog</a> / 
        <span className="text-foreground"> {post.title}</span>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.category && (
              <Badge variant="secondary">{post.category}</Badge>
            )}
            <Badge variant="outline">
              {formatDate(post.published_at)}
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground">{post.author}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <img 
            src={post.cover_image || 'https://placehold.co/800x400/0f172a/ffffff?text=Blog+Cover'} 
            alt={post.title} 
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12">
          <Tag className="h-4 w-4 text-muted-foreground mt-1" />
          {post.tags && post.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="outline">{tag}</Badge>
          ))}
        </div>

        {/* Author Box */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              <div className="ml-4">
                <h3 className="font-bold">CarKinne Team</h3>
                <p className="text-sm text-muted-foreground">
                  We're a team of car enthusiasts providing the latest information about cars in Nepal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={relatedPost.cover_image || 'https://placehold.co/400x250/0f172a/ffffff?text=Blog+Post'} 
                    alt={relatedPost.title} 
                    className="w-full h-40 object-cover"
                  />
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {relatedPost.category && (
                        <Badge variant="secondary" className="text-xs">{relatedPost.category}</Badge>
                      )}
                    </div>
                    <h3 className="font-bold line-clamp-2 mb-2">{relatedPost.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(relatedPost.published_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogPost;