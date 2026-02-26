import { useState } from 'react';
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
import { Zap, Fuel, Gauge, Users, Battery } from 'lucide-react';

const ElectricCars = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedRange, setSelectedRange] = useState('all');
  
  // Sample electric car data
  const electricCars = [
    {
      id: 1,
      name: 'MG ZS EV',
      brand: 'MG',
      variant: 'Excite',
      exShowroomPrice: 4750000,
      image: 'https://images.unsplash.com/photo-1617467367028-7a8ec8c1c7a9?w=800&auto=format&fit=crop',
      isFeatured: true,
      isNew: true,
      fuelType: 'Electric',
      transmission: 'Automatic',
      seating: 5,
      engineCC: 0,
      batteryRange: 320,
      chargingTime: '8 hours (Home), 40 mins (Fast)',
      features: ['Sunroof', 'Cruise Control', 'Automatic Climate Control']
    },
    {
      id: 2,
      name: 'Tata Nexon EV',
      brand: 'Tata',
      variant: 'XZ Plus',
      exShowroomPrice: 4200000,
      image: 'https://images.unsplash.com/photo-1617467367028-7a8ec8c1c7a9?w=800&auto=format&fit=crop',
      isFeatured: true,
      isNew: true,
      fuelType: 'Electric',
      transmission: 'Automatic',
      seating: 5,
      engineCC: 0,
      batteryRange: 312,
      chargingTime: '9 hours (Home), 60 mins (Fast)',
      features: ['Connected Car', 'Voice Control', 'Wireless Charging']
    },
    {
      id: 3,
      name: 'Hyundai Kona Electric',
      brand: 'Hyundai',
      variant: 'Premium',
      exShowroomPrice: 5800000,
      image: 'https://images.unsplash.com/photo-1617467367028-7a8ec8c1c7a9?w=800&auto=format&fit=crop',
      isFeatured: true,
      isNew: false,
      fuelType: 'Electric',
      transmission: 'Automatic',
      seating: 5,
      engineCC: 0,
      batteryRange: 452,
      chargingTime: '9.5 hours (Home), 54 mins (Fast)',
      features: ['SmartSense', 'Ventilated Seats', 'Wireless Charger']
    },
    {
      id: 4,
      name: 'Nissan Leaf',
      brand: 'Nissan',
      variant: 'Tekna',
      exShowroomPrice: 6500000,
      image: 'https://images.unsplash.com/photo-1617467367028-7a8ec8c1c7a9?w=800&auto=format&fit=crop',
      isFeatured: true,
      isNew: false,
      fuelType: 'Electric',
      transmission: 'Automatic',
      seating: 5,
      engineCC: 0,
      batteryRange: 385,
      chargingTime: '11 hours (Home), 40 mins (Fast)',
      features: ['ProPilot Assist', 'E-Pedal', 'Apple CarPlay']
    }
  ];

  const brands = ['all', 'MG', 'Tata', 'Hyundai', 'Nissan'];
  const ranges = ['all', '200-300', '300-400', '400+'];

  const filteredCars = electricCars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          car.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || car.brand === selectedBrand;
    const matchesRange = selectedRange === 'all' || 
                         (selectedRange === '200-300' && car.batteryRange >= 200 && car.batteryRange < 300) ||
                         (selectedRange === '300-400' && car.batteryRange >= 300 && car.batteryRange < 400) ||
                         (selectedRange === '400+' && car.batteryRange >= 400);
    
    return matchesSearch && matchesBrand && matchesRange;
  });

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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Electric Cars in Nepal</h1>
          <p className="text-muted-foreground">Discover the future of driving with zero emissions</p>
        </div>
        
        {/* EV Benefits Banner */}
        <Card className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold">Why Go Electric?</h2>
                <p>Save money, reduce emissions, and enjoy a smooth driving experience</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Zap className="h-6 w-6 mr-2" />
                  <span>Zero Emissions</span>
                </div>
                <div className="flex items-center">
                  <Fuel className="h-6 w-6 mr-2" />
                  <span>Lower Running Cost</span>
                </div>
                <div className="flex items-center">
                  <Gauge className="h-6 w-6 mr-2" />
                  <span>Smooth Driving</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search Electric Cars</Label>
              <div className="relative mt-2">
                <Input 
                  id="search"
                  type="text" 
                  placeholder="Search by name or brand..." 
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
              <Label htmlFor="brand">Brand</Label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger id="brand" className="mt-2">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand === 'all' ? 'All Brands' : brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="range">Range</Label>
              <Select value={selectedRange} onValueChange={setSelectedRange}>
                <SelectTrigger id="range" className="mt-2">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {ranges.map(range => (
                    <SelectItem key={range} value={range}>
                      {range === 'all' ? 'All Ranges' : 
                       range === '200-300' ? '200-300 km' :
                       range === '300-400' ? '300-400 km' : '400+ km'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Electric Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
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
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    NEW
                  </Badge>
                )}
                <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                  <Battery className="h-3 w-3 mr-1" />
                  {car.batteryRange} km
                </div>
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
                    <Zap className="w-4 h-4 mr-1 text-green-500" />
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
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Charging: {car.chargingTime}
                </p>
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
        
        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No electric cars found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
        
        {/* EV Guide Section */}
        <Card className="mt-12">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Electric Car Guide for Nepal</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Charging Infrastructure</h3>
                <p className="text-muted-foreground text-sm">
                  Nepal is developing EV charging infrastructure with government support. 
                  Home charging and public charging stations are becoming more common.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Government Incentives</h3>
                <p className="text-muted-foreground text-sm">
                  EV buyers in Nepal enjoy tax exemptions, reduced registration fees, 
                  and other incentives to promote electric mobility.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Maintenance Benefits</h3>
                <p className="text-muted-foreground text-sm">
                  Electric cars have fewer moving parts, resulting in lower maintenance 
                  costs and longer service intervals compared to petrol/diesel cars.
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">Learn More About EVs</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ElectricCars;