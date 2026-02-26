"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Heart, Share2, Calendar, Fuel, Settings, Users, Gauge, 
  ChevronDown, MapPin, Phone, Clock, Check, Palette,
  CalendarIcon, IndianRupee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmiCalculator } from '@/components/EmiCalculator';
import { supabase } from '@/integrations/supabase/client';

const CarDetail = () => {
  const { slug } = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showEmiModal, setShowEmiModal] = useState(false);
  const [similarCars, setSimilarCars] = useState<any[]>([]);
  const [showrooms, setShowrooms] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [expandedOnRoad, setExpandedOnRoad] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchCar();
    }
  }, [slug]);

  useEffect(() => {
    if (car) {
      fetchRelatedData();
    }
  }, [car]);

  const fetchCar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching car:', error);
    } else {
      setCar(data);
    }
    setLoading(false);
  };

  const fetchRelatedData = async () => {
    // Fetch similar cars
    const { data: similarData } = await supabase
      .from('cars')
      .select('*')
      .neq('id', car.id)
      .limit(4);
    
    if (similarData) setSimilarCars(similarData);

    // Fetch showrooms
    const { data: showroomData } = await supabase
      .from('showrooms')
      .select('*')
      .eq('brand', car.brand);
    
    if (showroomData) setShowrooms(showroomData);

    // Fetch offers
    const { data: offerData } = await supabase
      .from('offers')
      .select('*')
      .limit(3);
    
    if (offerData) setOffers(offerData);
  };

  // Calculate on-road price breakdown
  const calculateOnRoadPrice = () => {
    if (!car) return null;
    
    const exShowroom = car.ex_showroom_price;
    const registration = Math.round(exShowroom * 0.1); // 10% registration
    const insurance = Math.round(exShowroom * 0.02); // 2% insurance
    const roadTax = Math.round(exShowroom * 0.01); // 1% road tax
    
    return {
      exShowroom,
      registration,
      insurance,
      roadTax,
      total: exShowroom + registration + insurance + roadTax
    };
  };

  const onRoadBreakdown = calculateOnRoadPrice();

  // Format price in Nepali format
  const formatPrice = (price: number) => {
    return `Rs.${price.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Car Not Found</h2>
          <p className="text-muted-foreground">The car you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-4" onClick={() => window.location.href = '/cars'}>
            Browse All Cars
          </Button>
        </div>
      </div>
    );
  }

  // Calculate EMI (10% down payment, 5 year loan, 10% interest)
  const calculateEMI = () => {
    const loanAmount = car.ex_showroom_price * 0.9; // 10% down payment
    const interestRate = 10; // 10% annual interest
    const loanTerm = 5; // 5 years
    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;
    
    const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    return Math.round(emi);
  };

  const emi = calculateEMI();

  // SEO Meta tags
  const metaTitle = `${car.name} Price in Nepal 2025 — ${formatPrice(car.ex_showroom_price)} | CarKinne`;
  const metaDescription = `${car.name} price in Nepal starts at ${formatPrice(car.ex_showroom_price)}. Check full specs, EMI, colors, variants and find nearest showroom. Updated ${formatDate(car.updated_at || new Date().toISOString())}.`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* SEO Meta */}
      <div className="hidden">
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </div>

      {/* TOP SECTION */}
      <div className="mb-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-2">
          <a href="/" className="hover:text-foreground">Home</a> / 
          <a href="/cars" className="hover:text-foreground"> Cars</a> / 
          <a href={`/cars?brand=${car.brand}`} className="hover:text-foreground"> {car.brand}</a> / 
          <span className="text-foreground"> {car.name}</span>
        </div>
        
        {/* Last updated badge */}
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>Price updated: {formatDate(car.updated_at || new Date().toISOString())}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* IMAGE GALLERY */}
        <div className="lg:w-2/3">
          {/* Large main image */}
          <div className="relative rounded-lg overflow-hidden mb-4 bg-gray-100">
            <img 
              src={car.images[activeImageIndex] || 'https://placehold.co/800x600/cccccc/ffffff?text=Car+Image'} 
              alt={`${car.brand} ${car.name}`} 
              className="w-full h-96 object-contain cursor-pointer"
              onClick={() => console.log('Open fullscreen lightbox')}
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 rounded-full"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
          
          {/* Thumbnail strip */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {car.images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border-2 ${activeImageIndex === index ? 'border-orange-500' : 'border-transparent'}`}
              >
                <img 
                  src={image} 
                  alt={`${car.brand} ${car.name} ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* PRICE CARD */}
        <div className="lg:w-1/3">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="mb-4">
                <h1 className="text-2xl font-bold">{car.name} {car.variant}</h1>
                <p className="text-muted-foreground">{car.brand} • {car.year}</p>
              </div>
              
              {/* Ex-showroom price */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Ex-showroom Price</p>
                <p className="text-3xl font-bold text-orange-500">
                  {formatPrice(car.ex_showroom_price)}
                </p>
              </div>
              
              {/* Estimated On-Road Price */}
              <div className="mb-4 border rounded-lg p-4">
                <button 
                  className="flex justify-between items-center w-full"
                  onClick={() => setExpandedOnRoad(!expandedOnRoad)}
                >
                  <span className="font-medium">Estimated On-Road Price</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedOnRoad ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedOnRoad && onRoadBreakdown && (
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Ex-showroom</span>
                      <span>{formatPrice(onRoadBreakdown.exShowroom)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Registration</span>
                      <span>~{formatPrice(onRoadBreakdown.registration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance (1yr)</span>
                      <span>~{formatPrice(onRoadBreakdown.insurance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Road tax</span>
                      <span>~{formatPrice(onRoadBreakdown.roadTax)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total On-Road</span>
                      <span className="text-orange-500">{formatPrice(onRoadBreakdown.total)}</span>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-2">
                  Note: On-road price is estimated and may vary
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => setShowEmiModal(true)}
                >
                  Calculate EMI
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`https://wa.me/97798XXXXXXXX?text=I'm interested in ${car.name} ${car.variant}`, '_blank')}
                >
                  Enquire on WhatsApp
                </Button>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => document.getElementById('showrooms-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Find Showroom
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KEY SPECS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 my-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
          <Gauge className="h-6 w-6 mx-auto text-orange-500 mb-2" />
          <p className="text-sm font-medium">{car.engine_cc} cc</p>
          <p className="text-xs text-muted-foreground">Engine</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
          <Fuel className="h-6 w-6 mx-auto text-orange-500 mb-2" />
          <p className="text-sm font-medium">
            {car.mileage_kmpl ? `${car.mileage_kmpl} kmpl` : 'N/A'}
          </p>
          <p className="text-xs text-muted-foreground">Mileage</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
          <Fuel className="h-6 w-6 mx-auto text-orange-500 mb-2" />
          <p className="text-sm font-medium">{car.fuel_type}</p>
          <p className="text-xs text-muted-foreground">Fuel</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
          <Settings className="h-6 w-6 mx-auto text-orange-500 mb-2" />
          <p className="text-sm font-medium">{car.transmission}</p>
          <p className="text-xs text-muted-foreground">Transmission</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
          <Users className="h-6 w-6 mx-auto text-orange-500 mb-2" />
          <p className="text-sm font-medium">{car.seating} Seats</p>
          <p className="text-xs text-muted-foreground">Seating</p>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="specifications" className="w-full mb-12">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="emi">EMI Calculator</TabsTrigger>
        </TabsList>
        
        {/* Specifications Tab */}
        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Full Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Engine & Performance</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Engine Type</span>
                      <span className="font-medium">Turbocharged</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Engine Size</span>
                      <span className="font-medium">{car.engine_cc} cc</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Max Power</span>
                      <span className="font-medium">150 bhp</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Max Torque</span>
                      <span className="font-medium">250 Nm</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Fuel System</span>
                      <span className="font-medium">Direct Injection</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mt-4">Dimensions & Weight</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Length</span>
                      <span className="font-medium">4795 mm</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Width</span>
                      <span className="font-medium">1855 mm</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Height</span>
                      <span className="font-medium">1835 mm</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Wheelbase</span>
                      <span className="font-medium">2745 mm</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Kerb Weight</span>
                      <span className="font-medium">2180 kg</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Suspension & Brakes</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Front Suspension</span>
                      <span className="font-medium">MacPherson Strut</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Rear Suspension</span>
                      <span className="font-medium">Multi-link</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Front Brakes</span>
                      <span className="font-medium">Ventilated Disc</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Rear Brakes</span>
                      <span className="font-medium">Disc</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mt-4">Fuel & Tyres</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Fuel Tank Capacity</span>
                      <span className="font-medium">80 L</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Tyre Size</span>
                      <span className="font-medium">265/60 R18</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Spare Wheel</span>
                      <span className="font-medium">Full Size</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Features Tab */}
        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>ABS</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Airbags (6)</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Sunroof</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>LED Headlights</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Automatic Climate Control</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Touchscreen Infotainment</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Bluetooth Connectivity</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Cruise Control</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Parking Sensors</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Keyless Entry</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Push Button Start</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Electric Folding Mirrors</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Colors Tab */}
        <TabsContent value="colors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {['White Pearl', 'Silver', 'Black', 'Red', 'Blue', 'Bronze'].map((color, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setActiveImageIndex(index % car.images.length)}
                  >
                    <div className="w-12 h-12 rounded-full mx-auto mb-2 border" 
                         style={{ backgroundColor: getColorCode(color) }}></div>
                    <p className="font-medium">{color}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Variants Tab */}
        <TabsContent value="variants" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{car.name} Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Variant</th>
                      <th className="text-left py-3">Price</th>
                      <th className="text-left py-3">Key Difference</th>
                      <th className="text-left py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{car.name} Base</p>
                          <p className="text-sm text-muted-foreground">Manual</p>
                        </div>
                      </td>
                      <td className="py-3 font-medium">Rs.45,00,000</td>
                      <td className="py-3 text-sm">Basic features</td>
                      <td className="py-3">
                        <Button size="sm">Enquire</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{car.name} Mid</p>
                          <p className="text-sm text-muted-foreground">Manual</p>
                        </div>
                      </td>
                      <td className="py-3 font-medium">Rs.48,50,000</td>
                      <td className="py-3 text-sm">+Sunroof, Leather seats</td>
                      <td className="py-3">
                        <Button size="sm">Enquire</Button>
                      </td>
                    </tr>
                    <tr className="border-b bg-orange-50 dark:bg-orange-900/20">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{car.name} {car.variant}</p>
                          <p className="text-sm text-muted-foreground">Automatic</p>
                        </div>
                      </td>
                      <td className="py-3 font-bold text-orange-500">
                        {formatPrice(car.ex_showroom_price)}
                      </td>
                      <td className="py-3 text-sm">+Cruise control, Premium sound</td>
                      <td className="py-3">
                        <Button className="bg-orange-500 hover:bg-orange-600">Selected</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{car.name} Top</p>
                          <p className="text-sm text-muted-foreground">Automatic</p>
                        </div>
                      </td>
                      <td className="py-3 font-medium">Rs.55,00,000</td>
                      <td className="py-3 text-sm">+360 camera, Massage seats</td>
                      <td className="py-3">
                        <Button size="sm">Enquire</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* EMI Calculator Tab */}
        <TabsContent value="emi" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>EMI Calculator for {car.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <EmiCalculator prefillPrice={car.ex_showroom_price} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Current offers on this car */}
      {offers.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Current Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden">
                <img 
                  src={offer.image_url || 'https://placehold.co/400x200/f59e0b/ffffff?text=Special+Offer'} 
                  alt={offer.title} 
                  className="w-full h-32 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">{offer.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                  <Button size="sm" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Showrooms selling this car */}
      <section id="showrooms-section" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Showrooms Selling {car.name}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Map</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-muted-foreground">Map showing showrooms would appear here</p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Showrooms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-80 overflow-y-auto">
                {showrooms.map((showroom) => (
                  <div key={showroom.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{showroom.name}</h3>
                      {showroom.is_authorized && (
                        <Badge className="bg-green-500">Authorized</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{showroom.address}</p>
                    <div className="flex items-center text-sm mb-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{showroom.city}</span>
                    </div>
                    <div className="flex items-center text-sm mb-1">
                      <Phone className="h-3 w-3 mr-1" />
                      <span>{showroom.phone}</span>
                    </div>
                    <div className="flex items-center text-sm mb-3">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{showroom.working_hours}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Directions
                      </Button>
                      <Button size="sm" className="flex-1">
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* You might also like */}
      {similarCars.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarCars.slice(0, 4).map((similarCar) => (
              <Card key={similarCar.id} className="overflow-hidden">
                <img 
                  src={similarCar.images[0]} 
                  alt={`${similarCar.brand} ${similarCar.name}`} 
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-bold">{similarCar.name} {similarCar.variant}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{similarCar.brand}</p>
                  <p className="text-orange-500 font-bold">
                    {formatPrice(similarCar.ex_showroom_price)}
                  </p>
                  <Button size="sm" className="w-full mt-3">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Compare with similar cars */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Compare with Similar Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarCars.slice(0, 3).map((similarCar) => (
            <Card key={similarCar.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <img 
                    src={similarCar.images[0]} 
                    alt={`${similarCar.brand} ${similarCar.name}`} 
                    className="w-16 h-16 object-cover rounded-md mr-3"
                  />
                  <div>
                    <h3 className="font-bold">{similarCar.name}</h3>
                    <p className="text-sm text-muted-foreground">{similarCar.brand}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span className="font-medium">{formatPrice(similarCar.ex_showroom_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engine</span>
                    <span className="font-medium">{similarCar.engine_cc} cc</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel</span>
                    <span className="font-medium">{similarCar.fuel_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transmission</span>
                    <span className="font-medium">{similarCar.transmission}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  Compare
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* EMI Calculator Modal */}
      <Dialog open={showEmiModal} onOpenChange={setShowEmiModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>EMI Calculator for {car.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <EmiCalculator prefillPrice={car.ex_showroom_price} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to get color codes
const getColorCode = (color: string) => {
  const colors: Record<string, string> = {
    'White Pearl': '#f8f9fa',
    'Silver': '#c0c0c0',
    'Black': '#000000',
    'Red': '#dc2626',
    'Blue': '#2563eb',
    'Bronze': '#d97706'
  };
  return colors[color] || '#cccccc';
};

export default CarDetail;