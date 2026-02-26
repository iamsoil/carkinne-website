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
import { Calendar, Tag, Clock } from 'lucide-react';

const Offers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedOfferType, setSelectedOfferType] = useState('all');
  
  // Sample offers data
  const offers = [
    {
      id: 1,
      title: 'Dashain Special Offer',
      description: 'Get up to Rs.2L off on selected cars during Dashain festival',
      car: {
        name: 'Suzuki Swift',
        brand: 'Suzuki',
        image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop'
      },
      discountAmount: 200000,
      validUntil: '2024-10-31',
      imageUrl: 'https://placehold.co/600x400?text=Dashain+Offer',
      offerType: 'Cash',
      isFeatured: true
    },
    {
      id: 2,
      title: 'Free Accessories Package',
      description: 'Worth Rs.50,000 with every purchase of Hyundai Creta',
      car: {
        name: 'Hyundai Creta',
        brand: 'Hyundai',
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop'
      },
      discountAmount: 50000,
      validUntil: '2024-12-31',
      imageUrl: 'https://placehold.co/600x400?text=Accessories+Offer',
      offerType: 'Accessories',
      isFeatured: true
    },
    {
      id: 3,
      title: 'Low Interest Financing',
      description: 'Finance your new car at just 8.5% interest rate',
      car: {
        name: 'Kia Sonet',
        brand: 'Kia',
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop'
      },
      discountAmount: 150000,
      validUntil: '2024-11-30',
      imageUrl: 'https://placehold.co/600x400?text=Finance+Offer',
      offerType: 'Finance',
      isFeatured: false
    },
    {
      id: 4,
      title: 'Exchange Bonus',
      description: 'Get up to Rs.1L for trading in your old car',
      car: {
        name: 'Honda City',
        brand: 'Honda',
        image: 'https://images.unsplash.com/photo-1549399542-7e7f8c6c1b5b?w=800&auto=format&fit=crop'
      },
      discountAmount: 100000,
      validUntil: '2024-12-15',
      imageUrl: 'https://placehold.co/600x400?text=Exchange+Offer',
      offerType: 'Cash',
      isFeatured: false
    },
    {
      id: 5,
      title: 'Extended Warranty',
      description: '2 years additional warranty on all Toyota models',
      car: {
        name: 'Toyota Fortuner',
        brand: 'Toyota',
        image: 'https://images.unsplash.com/photo-1544510808-075302540d70?w=800&auto=format&fit=crop'
      },
      discountAmount: 75000,
      validUntil: '2025-01-31',
      imageUrl: 'https://placehold.co/600x400?text=Warranty+Offer',
      offerType: 'Warranty',
      isFeatured: true
    },
    {
      id: 6,
      title: 'Festival Financing',
      description: 'Special financing rates for Tihar celebrations',
      car: {
        name: 'MG ZS EV',
        brand: 'MG',
        image: 'https://images.unsplash.com/photo-1617467367028-7a8ec8c1c7a9?w=800&auto=format&fit=crop'
      },
      discountAmount: 125000,
      validUntil: '2024-11-15',
      imageUrl: 'https://placehold.co/600x400?text=Tihar+Offer',
      offerType: 'Finance',
      isFeatured: false
    }
  ];

  const brands = ['all', 'Suzuki', 'Hyundai', 'Kia', 'Honda', 'Toyota', 'MG'];
  const offerTypes = ['all', 'Cash', 'Accessories', 'Finance', 'Warranty'];

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          offer.car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          offer.car.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || offer.car.brand === selectedBrand;
    const matchesOfferType = selectedOfferType === 'all' || offer.offerType === selectedOfferType;
    
    return matchesSearch && matchesBrand && matchesOfferType;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Latest Car Offers</h1>
          <p className="text-muted-foreground">Find the best deals and discounts on new cars</p>
        </div>
        
        {/* Offers Banner */}
        <Card className="mb-8 bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold">Exclusive Deals Await You!</h2>
                <p>Save up to Rs.2L on your dream car with our special offers</p>
              </div>
              <Button variant="secondary" className="bg-white text-orange-500 hover:bg-gray-100">
                View All Offers
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search Offers</Label>
              <div className="relative mt-2">
                <Input 
                  id="search"
                  type="text" 
                  placeholder="Search by offer name, car or brand..." 
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
              <Label htmlFor="offer-type">Offer Type</Label>
              <Select value={selectedOfferType} onValueChange={setSelectedOfferType}>
                <SelectTrigger id="offer-type" className="mt-2">
                  <SelectValue placeholder="Select offer type" />
                </SelectTrigger>
                <SelectContent>
                  {offerTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden">
              <div className="relative">
                <img 
                  src={offer.imageUrl} 
                  alt={offer.title} 
                  className="w-full h-48 object-cover"
                />
                {offer.isFeatured && (
                  <Badge className="absolute top-2 left-2 bg-orange-500">
                    FEATURED
                  </Badge>
                )}
                <Badge className="absolute top-2 right-2 bg-white text-foreground">
                  {offer.offerType}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{offer.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{offer.description}</p>
                
                <div className="flex items-center mb-2">
                  <img 
                    src={offer.car.image} 
                    alt={offer.car.name} 
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div>
                    <p className="font-medium">{offer.car.name}</p>
                    <p className="text-sm text-muted-foreground">{offer.car.brand}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-orange-500 font-bold">
                    <Tag className="h-4 w-4 mr-1" />
                    Save Rs.{offer.discountAmount.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    Valid until {formatDate(offer.validUntil)}
                  </div>
                </div>
                
                <Button className="w-full">View Offer Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No offers found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
        
        {/* How to Claim Offers */}
        <Card className="mt-12">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">How to Claim These Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <span className="text-orange-500 font-bold text-xl">1</span>
                </div>
                <h3 className="font-bold mb-2">Find Your Offer</h3>
                <p className="text-muted-foreground text-sm">
                  Browse through our offers and find the one that suits your needs
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <span className="text-orange-500 font-bold text-xl">2</span>
                </div>
                <h3 className="font-bold mb-2">Visit Showroom</h3>
                <p className="text-muted-foreground text-sm">
                  Visit your nearest authorized showroom with the offer details
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <span className="text-orange-500 font-bold text-xl">3</span>
                </div>
                <h3 className="font-bold mb-2">Claim Your Deal</h3>
                <p className="text-muted-foreground text-sm">
                  Present the offer and enjoy your savings on your new car
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Offers;