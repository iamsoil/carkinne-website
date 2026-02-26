import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, User, Tag, Share2, Heart, MessageCircle } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Aashish Thapa',
      content: 'Great insights on EVs in Nepal. Looking forward to more content like this!',
      date: '2024-10-12',
      likes: 5
    },
    {
      id: 2,
      author: 'Sunita KC',
      content: 'The comparison between diesel and petrol cars was very helpful. Thanks!',
      date: '2024-10-10',
      likes: 3
    }
  ]);
  const [newComment, setNewComment] = useState('');

  // Sample blog post data
  const post = {
    id: 1,
    title: 'Top 5 SUVs under 50 Lakhs in Nepal',
    content: `
      <p>When it comes to choosing an SUV in Nepal, the options can be overwhelming. With so many brands and models available, finding the right one for your budget and needs requires careful consideration. In this guide, we'll explore the top 5 SUVs you can get for under Rs. 50 lakhs in Nepal.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Hyundai Creta</h2>
      <p>The Hyundai Creta has been a popular choice among Nepali car buyers for its stylish design, spacious interior, and feature-rich cabin. Priced competitively, it offers excellent value for money.</p>
      
      <h3 className="text-xl font-semibold mt-6 mb-2">Key Features:</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>1.4L Turbocharged Engine</li>
        <li>Automatic Climate Control</li>
        <li>7-inch Touchscreen Infotainment</li>
        <li>ESP with Hill Assist</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">2. Kia Sonet</h2>
      <p>Kia Sonet has quickly gained popularity in the Nepali market with its bold design and premium features. It's a compact SUV that punches above its weight class.</p>
      
      <h3 className="text-xl font-semibold mt-6 mb-2">Key Features:</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>1.2L Petrol and 1.5L Diesel Engine Options</li>
        <li>Digital Instrument Cluster</li>
        <li>Auto AC with Rear Vents</li>
        <li>6 Airbags</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">3. MG Hector Plus</h2>
      <p>The MG Hector Plus offers a premium SUV experience at a competitive price point. With its internet connectivity features and spacious 6-seater layout, it's perfect for families.</p>
      
      <h3 className="text-xl font-semibold mt-6 mb-2">Key Features:</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>6/7 Seater Configuration</li>
        <li>Internet Car Technology</li>
        <li>Panoramic Sunroof</li>
        <li>BOSE Sound System</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">4. Nissan Kicks</h2>
      <p>Nissan Kicks brings a unique design language to the Nepali SUV market. With its premium interior and comfortable ride quality, it's a strong contender in this segment.</p>
      
      <h3 className="text-xl font-semibold mt-6 mb-2">Key Features:</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>1.5L Petrol Engine</li>
        <li>7-inch Display with Apple CarPlay</li>
        <li>Automatic Climate Control</li>
        <li>LED Headlamps</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">5. Renault Kiger</h2>
      <p>The Renault Kiger is the newest entrant in this list but has already made a strong impression with its feature-rich offering and competitive pricing.</p>
      
      <h3 className="text-xl font-semibold mt-6 mb-2">Key Features:</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>1.0L Turbo Petrol Engine</li>
        <li>8-inch Touchscreen with Navigation</li>
        <li>Wireless Charging</li>
        <li>6 Airbags</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
      <p>Choosing the right SUV depends on your specific needs, whether it's family transportation, city driving, or off-road capability. All the SUVs mentioned above offer excellent value for money and are well-suited for Nepali driving conditions. We recommend taking a test drive of at least 2-3 models before making your final decision.</p>
      
      <p>Remember to factor in additional costs like insurance, registration, and on-road charges when budgeting for your new SUV. For the most accurate pricing and availability, visit your nearest authorized dealership.</p>
    `,
    excerpt: 'Find the best value SUVs for your budget with our comprehensive comparison',
    coverImage: 'https://placehold.co/800x400?text=SUV+Guide',
    author: 'CarKinne Team',
    publishedAt: '2024-10-15',
    category: 'Buying Guide',
    readTime: '5 min read',
    tags: ['SUV', 'Buying Guide', 'Hyundai', 'Kia', 'MG', 'Nissan', 'Renault']
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'You',
        content: newComment,
        date: new Date().toISOString().split('T')[0],
        likes: 0
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          <a href="/" className="hover:text-orange-500">Home</a> / 
          <a href="/blog" className="hover:text-orange-500"> Blog</a> / 
          <span className="text-foreground"> {post.title}</span>
        </div>
        
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center mb-4">
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                {post.category}
              </Badge>
              <span className="text-sm text-muted-foreground ml-4 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center">
                <Heart 
                  className={`h-5 w-5 mr-1 cursor-pointer ${liked ? 'fill-orange-500 text-orange-500' : 'text-muted-foreground'}`} 
                  onClick={() => setLiked(!liked)}
                />
                <span>24</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-1 text-muted-foreground" />
                <span>{comments.length} comments</span>
              </div>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </header>
          
          {/* Cover Image */}
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
          />
          
          {/* Article Content */}
          <div 
            className="prose max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Social Share */}
          <Card className="mb-12">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-bold text-lg">Did you find this helpful?</h3>
                  <p className="text-muted-foreground">Share it with your friends and family</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.714c0-.939.144-1.286.642-1.286h3.358v-4h-5c-4.029 0-5 2.5-5 5v3z"/>
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.268-.059 1.644-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-2.507-5.809l-1.415 1.416c.111.321.171.669.171 1.036 0 2.209-1.791 4-4 4-.367 0-.715-.06-1.036-.171l-1.416 1.415c.749.338 1.561.527 2.452.527 3.314 0 6-2.686 6-6 0-.891-.189-1.703-.527-2.452zm-3.536 3.535l-7.952 7.952c-.322-.111-.67-.171-1.036-.171-2.209 0-4 1.791-4 4s1.791 4 4 4c2.209 0 4-1.791 4-4 0-.366-.06-.714-.171-1.036l7.952-7.952-1.414-1.414z"/>
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Comments Section */}
          <Card className="mb-12">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
              
              {/* Add Comment Form */}
              <div className="mb-8">
                <h3 className="font-medium mb-3">Add a Comment</h3>
                <Textarea 
                  placeholder="Share your thoughts..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3"
                />
                <Button onClick={handleAddComment}>Post Comment</Button>
              </div>
              
              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{comment.author}</h4>
                        <p className="text-sm text-muted-foreground">{formatDate(comment.date)}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{comment.content}</p>
                    <div className="flex items-center mt-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-orange-500">
                        <Heart className="h-4 w-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Related Articles */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((id) => (
                <Card key={id} className="overflow-hidden">
                  <img 
                    src={`https://placehold.co/400x250?text=Article+${id}`} 
                    alt={`Related article ${id}`} 
                    className="w-full h-32 object-cover"
                  />
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="text-xs mb-2">
                      Buying Guide
                    </Badge>
                    <h3 className="font-bold text-sm mb-2 line-clamp-2">
                      How to Choose the Right Car for Your Family
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Tips for selecting the perfect family car based on your needs
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;