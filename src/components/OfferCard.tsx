import { Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/utils/formatters';
import { formatDate } from '@/utils/formatters';

interface OfferCardProps {
  id: string;
  title: string;
  description: string;
  car: {
    name: string;
    brand: string;
    image: string;
  };
  discountAmount: number;
  validUntil: string;
  imageUrl: string;
  offerType: string;
  isFeatured: boolean;
}

const OfferCard = ({
  id,
  title,
  description,
  car,
  discountAmount,
  validUntil,
  imageUrl,
  offerType,
  isFeatured
}: OfferCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        {isFeatured && (
          <Badge className="absolute top-2 left-2 bg-orange-500">
            FEATURED
          </Badge>
        )}
        <Badge className="absolute top-2 right-2 bg-white text-foreground">
          {offerType}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm mb-3">{description}</p>
        
        <div className="flex items-center mb-2">
          <img 
            src={car.image} 
            alt={car.name} 
            className="w-12 h-12 object-cover rounded mr-3"
          />
          <div>
            <p className="font-medium">{car.name}</p>
            <p className="text-sm text-muted-foreground">{car.brand}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-orange-500 font-bold">
            <Tag className="h-4 w-4 mr-1" />
            Save {formatPrice(discountAmount)}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            Valid until {formatDate(validUntil)}
          </div>
        </div>
        
        <Button className="w-full">View Offer Details</Button>
      </div>
    </div>
  );
};

export default OfferCard;