import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Fuel, Gauge, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatEMI } from '@/utils/formatters';
import { useEMI } from '@/hooks/useEMI';

interface CarCardProps {
  id: string;
  name: string;
  brand: string;
  variant: string;
  exShowroomPrice: number;
  category: string;
  image: string;
  isFeatured?: boolean;
  isNew?: boolean;
  fuelType: string;
  transmission: string;
  seating: number;
  engineCC: number;
  batteryRange?: number;
  slug: string;
}

const CarCard = ({
  id,
  name,
  brand,
  variant,
  exShowroomPrice,
  category,
  image,
  isFeatured,
  isNew,
  fuelType,
  transmission,
  seating,
  engineCC,
  batteryRange,
  slug
}: CarCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const emiCalculations = useEMI(exShowroomPrice);

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-white text-foreground">
          {brand}
        </Badge>
        {isNew && (
          <Badge className="absolute top-2 right-2 bg-orange-500">
            NEW
          </Badge>
        )}
        {isFeatured && !isNew && (
          <Badge className="absolute top-2 right-2 bg-blue-500">
            FEATURED
          </Badge>
        )}
        {batteryRange && (
          <Badge className="absolute bottom-2 left-2 bg-green-500 text-white">
            {batteryRange} km
          </Badge>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-2 right-12 bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-orange-500 text-orange-500' : ''}`} />
        </Button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{name} {variant}</h3>
        <p className="text-orange-500 font-bold text-xl">
          {formatPrice(exShowroomPrice)}
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          On-road price: {formatPrice(exShowroomPrice * 1.15)}
        </p>
        <div className="flex justify-between text-sm mb-4">
          <span className="flex items-center">
            <Fuel className="w-4 h-4 mr-1" />
            {fuelType}
          </span>
          <span className="flex items-center">
            <Gauge className="w-4 h-4 mr-1" />
            {transmission}
          </span>
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {seating} Seats
          </span>
          <span className="flex items-center">
            <Car className="w-4 h-4 mr-1" />
            {engineCC}cc
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          EMI from {formatEMI(emiCalculations.monthlyEMI)}
        </p>
        <div className="flex gap-2">
          <Button className="flex-1" asChild>
            <Link to={`/cars/${slug}`}>View Details</Link>
          </Button>
          <Button variant="outline">Compare</Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;