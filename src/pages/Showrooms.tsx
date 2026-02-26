import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Phone, Clock, Star } from 'lucide-react';

const Showrooms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  
  // Sample showroom data
  const showrooms = [
    {
      id: 1,
      name: 'Suzuki Kathmandu',
      brand: 'Suzuki',
      address: 'New Baneshwor, Kathmandu',
      city: 'Kathmandu',
      phone: '01-4444444',
      email: 'kathmandu@suzuki.com.np',
      workingHours: '9:00 AM - 6:00 PM',
      rating: 4.5,
      reviews: 128,
      isAuthorized: true,
      image: 'https://placehold.co/600x400?text=Suzuki+Showroom',
      services: ['Sales', 'Service', 'Spare Parts', 'Insurance']
    },
    {
      id: 2,
      name: 'Toyota Pokhara',
      brand: 'Toyota',
      address: 'Lakeside, Pokhara',
      city: 'Pokhara',
      phone: '061-555555',
      email: 'pokhara@toyota.com.np',
      workingHours: '9:00 AM - 7:00 PM',
      rating: 4.8,
      reviews: 95,
      isAuthorized: true,
      image: 'https://placehold.co/600x400?text=Toyota+Showroom',
      services: ['Sales', 'Service', 'Spare Parts', 'Insurance', 'Finance']
    },
    {
      id: 3,
      name: 'Hyundai Lalitpur',
      brand: 'Hyundai',
      address: 'Pulchowk, Lalitpur',
      city: 'Lalitpur',
      phone: '01-5555555',
      email: 'lalitpur@hyundai.com.np',
      workingHours: '9:00 AM - 6:00 PM',
      rating: 4.3,
      reviews: 87,
      isAuthorized: true,
      image: 'https://placehold.co/600x400?text=Hyundai+Showroom',
      services: ['Sales', 'Service', 'Spare Parts']
    },
    {
      id: 4,
      name: 'Kia Bhaktapur',
      brand: 'Kia',
      address: 'Thimi, Bhaktapur',
      city: 'Bhaktapur',
      phone: '01-6666666',
      email: 'bhaktapur@kia.com.np',
      workingHours: '10:00 AM - 6:00 PM',
      rating: 4.6,
      reviews: 76,
      isAuthorized: true,
      image: 'https://placehold.co/600x400?text=Kia+Showroom',
      services: ['Sales', 'Service', 'Spare Parts', 'Finance']
    },
    {
      id: 5,
      name: 'Honda Kathmandu',
      brand: 'Honda',
      address: 'Kupondole, Lalitpur',
      city: 'Lalitpur',
      phone: '01-7777777',
      email: 'kupondole@honda.com.np',
      workingHours: '9:00 AM - 6:00 PM',
      rating: 4.4,
      reviews: 102,
      isAuthorized: true,
      image: 'https://placehold.co/600x400?text=Honda+Showroom',
      services: ['Sales', 'Service', 'Spare Parts', 'Insurance']
    },
    {
      id: 6,
      name: 'MG Showroom',
      brand: 'MG',
      address: 'Thapathali, Kathmandu',
      city: 'Kathmandu',
      phone: '01-8888888',
      email: 'thapathali@mg.com.np',
      workingHours: '9:00 AM - 7:00 PM',
      rating: 4.7,
      reviews: 65,
      isAuthorized: true,
      image: 'https://placehold.co/600x400?text=MG+Showroom',
      services: ['Sales', 'Service', 'Spare Parts', 'Finance', 'Insurance']
    }
  ];

  const cities = ['all', 'Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur'];
  const brands = ['all', 'Suzuki', 'Toyota', 'Hyundai', 'Kia', 'Honda', 'MG'];

  const filteredShowrooms = showrooms.filter(showroom => {
    const matchesSearch = showroom.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          showroom.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'all' || showroom.city === selectedCity;
    const matchesBrand = selectedBrand === 'all' || showroom.brand === selectedBrand;
    
    return matchesSearch && matchesCity && matchesBrand;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Find Authorized Showrooms</h1>
          <p className="text-muted-foreground">Locate your nearest car showroom and get in touch</p>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search Showrooms</Label>
              <div className="relative mt-2">
                <Input 
                  id="search"
                  type="text" 
                  placeholder="Search by name or location..." 
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
              <Label htmlFor="city">City</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger id="city" className="mt-2">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>
                      {city === 'all' ? 'All Cities' : city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>
        </div>
        
        {/* Showrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShowrooms.map((showroom) => (
            <Card key={showroom.id} className="overflow-hidden">
              <img 
                src={showroom.image} 
                alt={showroom.name} 
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{showroom.name}</h3>
                    <p className="text-sm text-muted-foreground">{showroom.brand}</p>
                  </div>
                  {showroom.isAuthorized && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                      Authorized
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {showroom.address}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <Phone className="h-4 w-4 mr-1" />
                  {showroom.phone}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  {showroom.workingHours}
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(showroom.rating) ? 'fill-orange-500 text-orange-500' : 'text-muted-foreground'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm">
                    {showroom.rating} ({showroom.reviews} reviews)
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {showroom.services.map((service, index) => (
                    <span key={index} className="bg-muted text-xs px-2 py-1 rounded">
                      {service}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Call Now
                  </Button>
                  <Button size="sm" className="flex-1">
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredShowrooms.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No showrooms found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
        
        {/* Map Section */}
        <Card className="mt-12">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Showroom Locations</h2>
            <div className="bg-muted h-96 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Interactive map showing showroom locations</p>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline">View Full Map</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Showrooms;