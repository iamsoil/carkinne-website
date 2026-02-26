import { MapPin, Phone, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ShowroomCardProps {
  id: string;
  name: string;
  brand: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  workingHours: string;
  rating: number;
  reviews: number;
  isAuthorized: boolean;
  image: string;
  services: string[];
}

const ShowroomCard = ({
  id,
  name,
  brand,
  address,
  city,
  phone,
  email,
  workingHours,
  rating,
  reviews,
  isAuthorized,
  image,
  services
}: ShowroomCardProps) => {
  // Calculate star ratings
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{brand}</p>
          </div>
          {isAuthorized && (
            <Badge className="bg-orange-100 text-orange-800">
              Authorized
            </Badge>
          )}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <MapPin className="h-4 w-4 mr-1" />
          {address}, {city}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <Phone className="h-4 w-4 mr-1" />
          {phone}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Clock className="h-4 w-4 mr-1" />
          {workingHours}
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < fullStars ? 'fill-orange-500 text-orange-500' : 'text-muted-foreground'}`} 
              />
            ))}
            {hasHalfStar && (
              <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
            )}
          </div>
          <span className="ml-2 text-sm">
            {rating} ({reviews} reviews)
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {services.slice(0, 3).map((service, index) => (
            <span key={index} className="bg-muted text-xs px-2 py-1 rounded">
              {service}
            </span>
          ))}
          {services.length > 3 && (
            <span className="bg-muted text-xs px-2 py-1 rounded">
              +{services.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            Call Now
          </Button>
          <Button size="sm" className="flex-1">
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShowroomCard;