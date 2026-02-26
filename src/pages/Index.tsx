import { useState } from 'react';
import { Search, Car, Zap, Fuel, Users, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data for featured cars
  const featuredCars = [
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

  // Sample data for brands
  const brands = [
    { id: 1, name: 'Suzuki', logo: 'https://placehold.co/100x50?text=Suzuki' },
    { id: 2, name: 'Toyota', logo: 'https://placehold.co/100x50?text=Toyota' },
    { id: 3, name: 'Hyundai', logo: 'https://placehold.co/100x50?text=Hyundai' },
    { id: 4, name: 'Kia', logo: 'https://placehold.co/100x50?text=Kia' },
    { id: 5, name: 'MG', logo: 'https://placehold.co/100x50?text=MG' },
    { id: 6, name: 'Honda', logo: 'https://placehold.co/100x50?text=Honda' },
    { id: 7, name: 'Nissan', logo: 'https://placehold.co/100x50?text=Nissan' },
    { id: 8, name: 'BYD', logo: 'https://placehold.co/100x50?text=BYD' }
  ];

  // Sample data for offers
  const offers = [
    { id: 1, title: 'Dashain Special', description: 'Up to Rs.2L off on selected cars', image: 'https://placehold.co/300x200?text=Offer' },
    { id: 2, title: 'Free Accessories', description: 'Worth Rs.50,000 with every purchase', image: 'https://placehold.co/300x200?text=Offer' },
    { id: 3, title: 'Low Interest Rate', description: 'Finance at just 8.5% interest', image: 'https://placehold.co/300x200?text=Offer' },
    { id: 4, title: 'Exchange Bonus', description: 'Up to Rs.1L for old car exchange', image: 'https://placehold.co/300x200?text=Offer' }
  ];

  // Sample data for showrooms
  const showrooms = [
    { id: 1, name: 'Suzuki Kathmandu', city: 'Kathmandu', address: 'New Baneshwor' },
    { id: 2, name: 'Toyota Pokhara', city: 'Pokhara', address: 'Lakeside' },
    { id: 3, name: 'Hyundai Lalitpur', city: 'Lalitpur', address: 'Pulchowk' },
    { id: 4, name: 'Kia Bhaktapur', city: 'Bhaktapur', address: 'Thimi' }
  ];

  // Sample data for blog posts
  const blogPosts = [
    { id: 1, title: 'Top 5 SUVs under 50 Lakhs in Nepal', excerpt: 'Find the best value SUVs for your budget', image: 'https://placehold.co/400x250?text=Blog+1' },
    { id: 2, title: 'Electric Cars: The Future of Nepal', excerpt: 'Why EVs are becoming popular in Nepal', image: 'https://placehold.co/400x250?text=Blog+2' },
    { id: 3, title: 'How to Calculate True Car Ownership Cost', excerpt: 'Beyond the showroom price - what you should know', image: 'https://placehold.co/400x250?text=Blog+3' }
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
      {/* Announcement Bar */}
      <div className="bg-orange-500 text-white py-2 px-4 text-center text-sm font-medium">
        🎉 Dashain Special: Up to Rs.2L off on selected cars
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Car in Nepal
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Compare prices, calculate EMI, find showrooms — all in one place
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search Toyota, Suzuki, Budget..." 
              className="pl-10 py-6 text-lg rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full">
              Search
            </Button>
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {['Under 20L', '20-40L', '40-60L', '60L+', 'Electric', 'SUV', 'Sedan'].map((filter) => (
              <Badge key={filter} variant="secondary" className="px-4 py-2 text-sm cursor-pointer hover:bg-orange-500 hover:text-white">
                {filter}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Popular Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                <img src={brand.logo} alt={brand.name} className="max-h-10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Cars</h2>
            <Button variant="link">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
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
      </section>

      {/* Budget Finder CTA */}
      <section className="py-12 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Find By Budget
          </h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Tell us your budget, we'll find your perfect car
          </p>
          <Button variant="secondary" className="bg-white text-orange-500 hover:bg-gray-100">
            Find My Car
          </Button>
        </div>
      </section>

      {/* EMI Calculator Widget */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">EMI Calculator</h2>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium">Car Price (Rs.)</label>
                  <Input type="number" placeholder="3000000" />
                </div>
                <div>
                  <label className="text-sm font-medium">Down Payment (%)</label>
                  <Input type="number" placeholder="20" />
                </div>
                <div>
                  <label className="text-sm font-medium">Loan Tenure (Years)</label>
                  <Input type="number" placeholder="5" />
                </div>
              </div>
              <Button className="w-full">Calculate EMI</Button>
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span>Monthly EMI:</span>
                  <span className="font-bold">Rs.50,000</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Total Interest:</span>
                  <span>Rs.300,000</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Total Amount:</span>
                  <span className="font-bold">Rs.33,00,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Latest Offers */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Latest Offers</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {offers.map((offer) => (
                <CarouselItem key={offer.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full">
                    <img 
                      src={offer.image} 
                      alt={offer.title} 
                      className="w-full h-40 object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg">{offer.title}</h3>
                      <p className="text-muted-foreground">{offer.description}</p>
                      <Button className="mt-4 w-full">View Offer</Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Top Showrooms */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Top Showrooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {showrooms.map((showroom) => (
              <Card key={showroom.id}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg">{showroom.name}</h3>
                  <p className="text-muted-foreground">{showroom.city}</p>
                  <p className="text-sm mt-2">{showroom.address}</p>
                  <Button className="mt-4 w-full">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Latest from Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id}>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <Button variant="link" className="p-0 h-auto">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;