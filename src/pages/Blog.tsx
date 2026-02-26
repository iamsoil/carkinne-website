"use client";

import { useState, useEffect } from 'react';
import { Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CarKinne Blog</h1>
        <p className="text-muted-foreground">
          Latest news, reviews, and insights about cars in Nepal
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading blog posts...</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={post.cover_image || 'https://placehold.co/600x400/0f172a/ffffff?text=Blog+Post'} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
              
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.category && (
                    <Badge variant="secondary">{post.category}</Badge>
                  )}
                  <Badge variant="outline">
                    {formatDate(post.published_at)}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm text-muted-foreground">{post.author}</span>
                  </div>
                  
                  <Button variant="link" className="p-0 h-auto">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts match your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Blog;