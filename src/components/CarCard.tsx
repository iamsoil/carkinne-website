import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Fuel, Settings, Users, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCompare } from '@/contexts/CompareContext';
import { useNavigate } from 'react-router-dom';

interface CarCardProps {
  id: string;
  name: string;
  brand: string;
  variant: string;
  ex_showroom_price: number;
  on_road_price: number;
  fuel_type: string;
  transmission: string;
  seating: number;
  engine_cc: number;
  is_electric: boolean;
  is_featured: boolean;
  is_new: boolean;
  images: string[];
  mileage_kmpl?: number;
  slug: string;
}

const CarCard = ({
  id,
  name,
  brand,
  variant,
  ex_showroom_price,
  on_road_price,
  fuel_type,
  transmission,
  seating,
  engine_cc,
  is_electric,
  is_featured,
  is_new,
  images,
  mileage_kmpl,
  slug
}: CarCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const navigate = useNavigate();
  const inCompare = isInCompare(id);

  // Format price in Nepali format
  const formatPrice = (price: number) => {
    return `Rs.${price.toLocaleString('en-IN')}`;
  };

  // Calculate EMI (10% down payment, 5 year loan, 10% interest)
  const calculateEMI = () => {
    const loanAmount = ex_showroom_price * 0.9; // 10% down payment
    const interestRate = 10; // 10% annual interest
    const loanTerm = 5; // 5 years
    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;
    
    const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    return Math.round(emi);
  };

  const emi = calculateEMI();

  return (
    <Card className="overflow-hidden border border-border rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        {/* Car Image */}
        <div className="aspect-video bg-gray-100 relative overflow-hidden">
          {images && images.length > 0 ? (
            <img 
              src={images[0]} 
              alt={`${brand} ${name}`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          {/* Brand Badge */}
          <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {brand}
          </div>
          
          {/* Status Badges */}
          <div className="absolute top-3 right-3 flex space-x-2">
            {is_new && (
              <span className="bg-foreground text-white px-2 py-1 rounded text-xs font-medium">
                NEW
              </span>
            )}
            {is_featured && (
              <span className="bg-accent text-white px-2 py-1 rounded text-xs font-medium">
                POPULAR
              </span>
            )}
          </div>
          
          {/* Save Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-3 right-3 rounded-full bg-white hover:bg-accent hover:text-white border border-border"
            onClick={() => setIsSaved(!isSaved)}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="mb-1">
          <h3 className="font-semibold text-lg text-foreground">{name} {variant}</h3>
        </div>
        
        <div className="mb-3">
          <p className="text-accent font-semibold text-xl">
            {formatPrice(ex_showroom_price)}
          </p>
          <p className="text-sm text-muted-foreground">
            On-road: {formatPrice(on_road_price)}
          </p>
        </div>
        
        {/* Specs */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Fuel className="h-3 w-3 mr-1 text-accent" />
            <span>{fuel_type}</span>
          </div>
          <span>•</span>
          <div className="flex items-center">
            <Settings className="h-3 w-3 mr-1 text-accent" />
            <span>{transmission}</span>
          </div>
          <span>•</span>
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1 text-accent" />
            <span>{seating} Seats</span>
          </div>
          <span>•</span>
          <div className="flex items-center">
            <Gauge className="h-3 w-3 mr-1 text-accent" />
            <span>{engine_cc}cc</span>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            EMI from <span className="font-medium text-accent">Rs.{emi.toLocaleString('en-IN')}/month</span>
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Link to={`/cars/${slug}`} className="flex-1">
            <Button className="w-full bg-foreground text-white hover:bg-accent rounded-lg">
              View Details
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const carData = {
                id, name, brand, variant,
                ex_showroom_price, on_road_price,
                fuel_type, transmission, seating,
                engine_cc, is_electric, images,
                mileage_kmpl, slug
              }
              if (inCompare) {
                removeFromCompare(id)
              } else {
                addToCompare(carData)
              }
            }}
            style={{
              borderColor: inCompare ? '#e8531a' : undefined,
              background: inCompare ? '#fff8f5' : undefined,
              color: inCompare ? '#e8531a' : undefined,
            }}
            className="border rounded-lg text-sm font-medium"
          >
            {inCompare ? '✓ Added' : 'Compare'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;