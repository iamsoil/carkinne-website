import { Link } from 'react-router-dom';
import { Calendar, User, Tag, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';

interface BlogPostCardProps {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  category: string;
  readTime: string;
  slug: string;
}

const BlogPostCard = ({
  id,
  title,
  excerpt,
  coverImage,
  author,
  publishedAt,
  category,
  readTime,
  slug
}: BlogPostCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={coverImage} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground ml-2 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {readTime}
          </span>
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-2">
          <Link to={`/blog/${slug}`} className="hover:text-orange-500">
            {title}
          </Link>
        </h3>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDate(publishedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;