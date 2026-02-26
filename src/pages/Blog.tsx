import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, User, Tag, Clock } from 'lucide-react';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Sample blog posts
  const blogPosts = [
    {
      id: 1,
      title: 'Top 5 SUVs under 50 Lakhs in Nepal',
      excerpt: 'Find the best value SUVs for your budget with our comprehensive comparison',
      coverImage: 'https://placehold.co/600x400?text=SUV+Guide',
      author: 'CarKinne Team',
      publishedAt: '2024-10-15',
      category: 'Buying Guide',
      readTime: '5 min read',
      slug: 'top-5-suvs-under-50-lakhs'
    },
    {
      id: 2,
      title: 'Electric Cars: The Future of Nepal',
      excerpt: 'Why EVs are becoming popular in Nepal and what to expect in the coming years',
      coverImage: 'https://placehold.co/600x400?text=Electric+Cars',
      author: 'CarKinne Team',
      publishedAt: '2024-10-10',
      category: 'Electric Vehicles',
      readTime: '7 min read',
      slug: 'electric-cars-future-nepal'
    },
    {
      id: 3,
      title: 'How to Calculate True Car Ownership Cost',
      excerpt: 'Beyond the showroom price - what you should know before buying a car',
      coverImage: 'https://placehold.co/600x400?text=Ownership+Cost',
      author: 'CarKinne Team',
      publishedAt: '2024-10-05',
      category: 'Finance',
      readTime: '6 min read',
      slug: 'calculate-car-ownership-cost'
    },
    {
      id: 4,
      title: 'Monsoon Car Care Tips for Nepali Drivers',
      excerpt: 'Essential maintenance tips to keep your car in top condition during monsoon',
      coverImage: 'https://placehold.co/600x400?text=Monsoon+Care',
      author: 'CarKinne Team',
      publishedAt: '2024-09-28',
      category: 'Maintenance',
      readTime: '4 min read',
      slug: 'monsoon-car-care-tips'
    },
    {
      id: 5,
      title: 'Comparing Diesel vs Petrol Cars in Nepal',
      excerpt: 'Which fuel type is more economical for Nepali driving conditions?',
      coverImage: 'https://placehold.co/600x400?text=Diesel+vs+Petrol',
      author: 'CarKinne Team',
      publishedAt: '2024-09-20',
      category: 'Buying Guide',
      readTime: '8 min read',
      slug: 'diesel-vs-petrol-cars-nepal'
    },
    {
      id: 6,
      title: 'Best Hatchbacks for City Driving in Kathmandu',
      excerpt: 'Compact cars that are perfect for navigating Kathmandu traffic',
      coverImage: 'https://placehold.co/600x400?text=Hatchbacks',
      author: 'CarKinne Team',
      publishedAt: '2024-09-15',
      category: 'Buying Guide',
      readTime: '5 min read',
      slug: 'best-hatchbacks-kathmandu'
    }
  ];

  const categories = ['all', 'Buying Guide', 'Electric Vehicles', 'Finance', 'Maintenance'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">CarKinne Blog</h1>
          <p className="text-muted-foreground">Your trusted source for car buying advice and news</p>
        </div>
        
        {/* Blog Banner */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold">Latest Car News & Insights</h2>
                <p>Stay updated with the latest trends, reviews, and buying guides</p>
              </div>
              <Button variant="secondary" className="bg-white text-blue-500 hover:bg-gray-100">
                Subscribe to Newsletter
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search Articles</Label>
              <div className="relative mt-2">
                <Input 
                  id="search"
                  type="text" 
                  placeholder="Search by title or keywords..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category" className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  <Link to={`/blog/${post.slug}`} className="hover:text-orange-500">
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
        
        {/* Newsletter Signup */}
        <Card className="mt-12">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold">Stay Updated</h2>
                <p className="text-muted-foreground">Get the latest car news and offers delivered to your inbox</p>
              </div>
              <div className="flex w-full md:w-auto">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="rounded-r-none"
                />
                <Button className="rounded-l-none">Subscribe</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blog;