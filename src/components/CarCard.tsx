import { useState } from 'react';
import { Heart, Fuel, Settings, Users, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
  mileage_kmpl
}: CarCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
      <div className="relative">
        {/* Car Image */}
        <div className="aspect-video bg-gray-200 relative overflow-hidden">
          {images && images.length > 0 ? (
            <img 
              src={images[0]} 
              alt={`${brand} ${name}`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
          
          {/* Brand Badge */}
          <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-semibold">
            {brand}
          </div>
          
          {/* Status Badges */}
          <div className="absolute top-2 right-2 flex space-x-1">
            {is_new && (
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                NEW
              </span>
            )}
            {is_featured && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                POPULAR
              </span>
            )}
          </div>
          
          {/* Save Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-2 right-2 rounded-full bg-white hover:bg-orange-100"
            onClick={() => setIsSaved(!isSaved)}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-bold text-lg">{name} {variant}</h3>
        </div>
        
        <div className="mb-3">
          <p className="text-orange-500 font-bold text-xl">
            {formatPrice(ex_showroom_price)}
          </p>
          <p className="text-sm text-slate-600">
            On-road: {formatPrice(on_road_price)}
          </p>
        </div>
        
        {/* Specs */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-xs">
          <div className="flex items-center">
            <Fuel className="h-3 w-3 mr-1 text-orange-500" />
            <span>{fuel_type}</span>
          </div>
          <div className="flex items-center">
            <Settings className="h-3 w-3 mr-1 text-orange-500" />
            <span>{transmission}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1 text-orange-500" />
            <span>{seating} Seats</span>
          </div>
          <div className="flex items-center">
            <Gauge className="h-3 w-3 mr-1 text-orange-500" />
            <span>{engine_cc}cc</span>
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-slate-600">
            EMI from <span className="font-semibold text-orange-500">Rs.{emi.toLocaleString('en-IN')}/month</span>
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
            View Details
          </Button>
          <Button variant="outline" size="sm">
            Compare
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;