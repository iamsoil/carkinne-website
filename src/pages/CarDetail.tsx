import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Car, 
  Fuel, 
  Gauge, 
  Users, 
  Calendar, 
  Zap,
  Heart,
  Share2,
  MapPin,
  Phone,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CarDetail = () => {
  const { slug } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  
  // Sample car data
  const car = {
    id: 1,
    name: 'Suzuki Swift',
    brand: 'Suzuki',
    model: 'Swift',
    variant: 'VXI MT',
    year: 2025,
    exShowroomPrice: 2650000,
    onRoadPrice: 2950000,
    category: 'Hatchback',
    images: [
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549399542-7e7f8c6c1b5b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop'
    ],
    isFeatured: true,
    isNew: true,
    fuelType: 'Petrol',
    transmission: 'Manual',
    mileage: 23.5,
    seating: 5,
    engineCC: 1197,
    colors: ['White', 'Red', 'Blue', 'Silver'],
    features: [
      'Power Steering',
      'Power Windows',
      'Air Conditioning',
      'Bluetooth Connectivity',
      'Rear Parking Sensors',
      'Alloy Wheels'
    ],
    isElectric: false,
    batteryRange: null
  };

  // Sample showroom data
  const showrooms = [
    {
      id: 1,
      name: 'Suzuki Kathmandu',
      address: 'New Baneshwor, Kathmandu',
      phone: '01-4444444',
      distance: '2.5 km'
    },
    {
      id: 2,
      name: 'Suzuki Lalitpur',
      address: 'Pulchowk, Lalitpur',
      phone: '01-5555555',
      distance: '5.2 km'
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
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          <a href="/" className="hover:text-orange-500">Home</a> / 
          <a href="/cars" className="hover:text-orange-500"> Cars</a> / 
          <span className="text-foreground"> {car.name} {car.variant}</span>
        </div>
        
        {/* Car Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{car.name} {car.variant}</h1>
            <p className="text-muted-foreground">{car.year} | {car.category}</p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-orange-500 text-orange-500' : ''}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Images and Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative rounded-lg overflow-hidden mb-4">
              <img 
                src={car.images[0]} 
                alt={car.name} 
                className="w-full h-96 object-cover"
              />
              {car.isNew && (
                <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                  NEW
                </Badge>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-2 mb-8">
              {car.images.slice(1).map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${car.name} ${index + 2}`} 
                  className="w-full h-24 object-cover rounded cursor-pointer"
                />
              ))}
            </div>
            
            {/* Key Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <Fuel className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm text-muted-foreground">Fuel Type</p>
                  <p className="font-medium">{car.fuelType}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Gauge className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm text-muted-foreground">Transmission</p>
                  <p className="font-medium">{car.transmission}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm text-muted-foreground">Seating</p>
                  <p className="font-medium">{car.seating} Seats</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Car className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm text-muted-foreground">Engine</p>
                  <p className="font-medium">{car.engineCC} cc</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Detailed Specs */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Performance</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Engine</span>
                      <span>{car.engineCC} cc</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Fuel Type</span>
                      <span>{car.fuelType}</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Transmission</span>
                      <span>{car.transmission}</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Mileage</span>
                      <span>{car.mileage} kmpl</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Dimensions</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Length</span>
                      <span>3,840 mm</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Width</span>
                      <span>1,750 mm</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Height</span>
                      <span>1,520 mm</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Ground Clearance</span>
                      <span>170 mm</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Price and Actions */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Rs.{car.exShowroomPrice.toLocaleString()}</h2>
                  <p className="text-muted-foreground text-sm">Ex-showroom price</p>
                  <p className="text-orange-500 font-medium">On-road price: Rs.{car.onRoadPrice.toLocaleString()}</p>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">EMI Calculator</p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-lg font-bold">Rs.{calculateEMI(car.exShowroomPrice).toLocaleString()}/month</p>
                    <p className="text-xs text-muted-foreground">at 10% interest for 5 years</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 mb-6">
                  <Button className="w-full">Get On-Road Price</Button>
                  <Button variant="outline" className="w-full">Book Test Drive</Button>
                  <Button variant="outline" className="w-full">Send Enquiry</Button>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Available Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {car.colors.map((color, index) => (
                      <Badge key={index} variant="secondary">{color}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Showrooms */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Nearby Showrooms</h2>
                <div className="space-y-4">
                  {showrooms.map((showroom) => (
                    <div key={showroom.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{showroom.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {showroom.address}
                          </div>
                        </div>
                        <Badge variant="secondary">{showroom.distance}</Badge>
                      </div>
                      <div className="flex items-center mt-2">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{showroom.phone}</span>
                      </div>
                      <Button variant="link" size="sm" className="p-0 mt-2 h-auto">
                        Get Directions
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-4">
                  View All Showrooms
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;