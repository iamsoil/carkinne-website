import { useState } from 'react';
import { Car, Fuel, Gauge, Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Cars = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Sample data for cars
  const cars = [
    {
      id: 1,
      name: 'Suzuki Swift',
      brand: 'Suzuki',
      variant: 'VXI MT',
      exShowroomPrice: 2650000,
      category: 'Hatchback',
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop',
      isFeatured: true,
      isNew: true,
      fuelType: 'Petrol',
      transmission: 'Manual',
      seating: 5,
      engineCC: 1197
    },
    {
      id: 2,
      name: 'Toyota Fortuner',
      brand: 'Toyota',
      variant: '2.8 GD-6 4WD',
      exShowroomPrice: 11500000,
      category: 'SUV',
      image: 'https://images.unsplash.com/photo-1544510808-075302540d70?w=800&auto=format&fit=crop',
      isFeatured: true,
      isNew: false,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      seating: 7,
      engineCC: 2755
    },
    {
      id: 3,
      name: 'Hyundai Creta',
      brand: 'Hyundai',
      variant: 'SX(O) Turbo DCT',
      exShowroomPrice: 5200000,
      category: 'SUV',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop',
      isFeatured: true,
      isNew: true,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      seating: 5,
      engineCC: 1482
    },
    {
      id: 4,
      name: 'Kia Sonet',
      brand: 'Kia',
      variant: 'HTX Plus',
      exShowroomPrice: 4100000,
      category: 'SUV',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop',
      isFeatured: true,
      isNew: true,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      seating: 5,
      engineCC: 1493
    },
    {
      id: 5,
      name: 'MG ZS EV',
      brand: 'MG',
      variant: 'Excite',
      exShowroomPrice: 4750000,
      category: 'SUV',
      image: 'https://images.unsplash.com/photo-1617467367028-7a8ec8c1c7a9?w=800&auto=format&fit=crop',
      isFeatured: true,
      isNew: true,
      fuelType: 'Electric',
      transmission: 'Automatic',
      seating: 5,
      engineCC: 0,
      batteryRange: 320
    },
    {
      id: 6,
      name: 'Honda City',
      brand: 'Honda',
      variant: 'SV',
      exShowroomPrice: 3850000,
      category: 'Sedan',
      image: 'https://images.unsplash.com/photo-1549399542-7e7f8c6c1b5b?w=800&auto=format&fit=crop',
      isFeatured: true,
      isNew: false,
      fuelType: 'Petrol',
      transmission: 'Manual',
      seating: 5,
      engineCC: 1498
    }
  ];

  // Calculate EMI function
  const calculateEMI = (price: number) => {
    const interestRate = 0.10; // 10% annual interest
    const tenure = 5; // 5 years
    const months = tenure * 12;
    const monthlyRate = interestRate / 12;
    const emi = (price * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Find Your Perfect Car</h1>
            <p className="text-muted-foreground">Compare prices, features, and offers</p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search cars..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div>
                    <Label>Price Range</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-20">Under 20L</SelectItem>
                        <SelectItem value="20-40">20L - 40L</SelectItem>
                        <SelectItem value="40-60">40L - 60L</SelectItem>
                        <SelectItem value="60+">60L+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Brand</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="suzuki">Suzuki</SelectItem>
                        <SelectItem value="toyota">Toyota</SelectItem>
                        <SelectItem value="hyundai">Hyundai</SelectItem>
                        <SelectItem value="kia">Kia</SelectItem>
                        <SelectItem value="mg">MG</SelectItem>
                        <SelectItem value="honda">Honda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="hatchback">Hatchback</SelectItem>
                        <SelectItem value="muv">MUV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Fuel Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full">Apply Filters</Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <Button variant="outline" className="hidden md:flex">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
        
        {/* Desktop Filters */}
        <div className="hidden md:flex flex-wrap gap-4 mb-8">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-20">Under 20L</SelectItem>
              <SelectItem value="20-40">20L - 40L</SelectItem>
              <SelectItem value="40-60">40L - 60L</SelectItem>
              <SelectItem value="60+">60L+</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="suzuki">Suzuki</SelectItem>
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="hyundai">Hyundai</SelectItem>
              <SelectItem value="kia">Kia</SelectItem>
              <SelectItem value="mg">MG</SelectItem>
              <SelectItem value="honda">Honda</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
              <SelectItem value="muv">MUV</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Fuel Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="petrol">Petrol</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <div className="relative">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-white text-foreground">
                  {car.brand}
                </Badge>
                {car.isNew && (
                  <Badge className="absolute top-2 right-2 bg-orange-500">
                    NEW
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{car.name} {car.variant}</h3>
                <p className="text-orange-500 font-bold text-xl">
                  Rs.{car.exShowroomPrice.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  On-road price: Rs.{(car.exShowroomPrice * 1.15).toLocaleString()}
                </p>
                <div className="flex justify-between text-sm mb-4">
                  <span className="flex items-center">
                    <Fuel className="w-4 h-4 mr-1" />
                    {car.fuelType}
                  </span>
                  <span className="flex items-center">
                    <Gauge className="w-4 h-4 mr-1" />
                    {car.transmission}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {car.seating} Seats
                  </span>
                  <span className="flex items-center">
                    <Car className="w-4 h-4 mr-1" />
                    {car.engineCC}cc
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  EMI from Rs.{calculateEMI(car.exShowroomPrice).toLocaleString()}/month
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1">View Details</Button>
                  <Button variant="outline">Compare</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;