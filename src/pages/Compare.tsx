"use client";

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Compare = () => {
  const [cars, setCars] = useState<any[]>([
    {
      id: '1',
      name: 'Swift',
      brand: 'Suzuki',
      variant: 'VXI MT',
      ex_showroom_price: 2650000,
      on_road_price: 2950000,
      fuel_type: 'Petrol',
      transmission: 'Manual',
      seating: 5,
      engine_cc: 1197,
      mileage_kmpl: 23.5,
      is_electric: false,
      images: ['https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=600&h=400']
    },
    {
      id: '2',
      name: 'Creta',
      brand: 'Hyundai',
      variant: 'SX(O) Turbo DCT',
      ex_showroom_price: 5200000,
      on_road_price: 5800000,
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      seating: 5,
      engine_cc: 1482,
      mileage_kmpl: 16.8,
      is_electric: false,
      images: ['https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=600&h=400']
    }
  ]);

  const addCar = () => {
    if (cars.length < 4) {
      setCars([
        ...cars,
        {
          id: `${cars.length + 1}`,
          name: 'Select Car',
          brand: '',
          variant: '',
          ex_showroom_price: 0,
          on_road_price: 0,
          fuel_type: '',
          transmission: '',
          seating: 0,
          engine_cc: 0,
          mileage_kmpl: 0,
          is_electric: false,
          images: ['https://placehold.co/300x200/cccccc/ffffff?text=Select+Car']
        }
      ]);
    }
  };

  const removeCar = (index: number) => {
    if (cars.length > 2) {
      const newCars = [...cars];
      newCars.splice(index, 1);
      setCars(newCars);
    }
  };

  const updateCar = (index: number, car: any) => {
    const newCars = [...cars];
    newCars[index] = car;
    setCars(newCars);
  };

  // Format price in Nepali format
  const formatPrice = (price: number) => {
    return `Rs.${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Compare Cars</h1>
        <p className="text-muted-foreground">
          Compare up to 4 cars side by side to find the perfect match
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[800px]">
          {/* Specification Labels */}
          <div className="w-1/4 pr-4">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-10 flex items-center font-medium">Car</div>
                  <div className="h-10 flex items-center">Price</div>
                  <div className="h-10 flex items-center">Fuel Type</div>
                  <div className="h-10 flex items-center">Transmission</div>
                  <div className="h-10 flex items-center">Engine</div>
                  <div className="h-10 flex items-center">Mileage</div>
                  <div className="h-10 flex items-center">Seating</div>
                  <div className="h-10 flex items-center">Category</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Car Comparisons */}
          {cars.map((car, index) => (
            <div key={index} className="w-1/4 px-2">
              <Card className="mb-4 relative">
                {cars.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeCar(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                
                <CardContent className="p-4">
                  <div className="mb-4">
                    <img 
                      src={car.images[0]} 
                      alt={`${car.brand} ${car.name}`} 
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-10 flex items-center">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Car" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="swift">Suzuki Swift</SelectItem>
                          <SelectItem value="creta">Hyundai Creta</SelectItem>
                          <SelectItem value="fortuner">Toyota Fortuner</SelectItem>
                          <SelectItem value="sonet">Kia Sonet</SelectItem>
                          <SelectItem value="zs-ev">MG ZS EV</SelectItem>
                          <SelectItem value="city">Honda City</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="h-10 flex items-center font-semibold text-orange-500">
                      {formatPrice(car.ex_showroom_price)}
                    </div>
                    
                    <div className="h-10 flex items-center">
                      {car.fuel_type}
                    </div>
                    
                    <div className="h-10 flex items-center">
                      {car.transmission}
                    </div>
                    
                    <div className="h-10 flex items-center">
                      {car.engine_cc}cc
                    </div>
                    
                    <div className="h-10 flex items-center">
                      {car.mileage_kmpl} kmpl
                    </div>
                    
                    <div className="h-10 flex items-center">
                      {car.seating} Seats
                    </div>
                    
                    <div className="h-10 flex items-center">
                      SUV
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {cars.length < 4 && (
        <div className="mt-6 text-center">
          <Button onClick={addCar} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Car
          </Button>
        </div>
      )}

      {/* Comparison Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Comparison Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Best Value</h4>
              <p className="text-sm text-muted-foreground">
                Suzuki Swift offers the best value for money with excellent mileage.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Best Features</h4>
              <p className="text-sm text-muted-foreground">
                Hyundai Creta comes with premium features and advanced technology.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Best for Families</h4>
              <p className="text-sm text-muted-foreground">
                Toyota Fortuner is ideal for large families with 7-seat capacity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Compare;