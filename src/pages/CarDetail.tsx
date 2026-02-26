"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Share2, Calendar, Fuel, Settings, Users, Gauge, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CarCard from '@/components/CarCard';
import { supabase } from '@/integrations/supabase/client';

const CarDetail = () => {
  const { slug } = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [similarCars, setSimilarCars] = useState<any[]>([]);

  useEffect(() => {
    if (slug) {
      fetchCar();
    }
  }, [slug]);

  useEffect(() => {
    if (car) {
      fetchSimilarCars();
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

  const fetchSimilarCars = async () => {
    if (!car) return;
    
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('category', car.category)
      .neq('id', car.id)
      .limit(3);

    if (!error) {
      setSimilarCars(data);
    }
  };

  // Calculate EMI (10% down payment, 5 year loan, 10% interest)
  const calculateEMI = () => {
    if (!car) return 0;
    const loanAmount = car.ex_showroom_price * 0.9; // 10% down payment
    const interestRate = 10; // 10% annual interest
    const loanTerm = 5; // 5 years
    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;
    
    const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    return Math.round(emi);
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

  const emi = calculateEMI();

  // Format price in Nepali format
  const formatPrice = (price: number) => {
    return `Rs.${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <a href="/" className="hover:text-foreground">Home</a> / 
        <a href="/cars" className="hover:text-foreground"> Cars</a> / 
        <span className="text-foreground"> {car.name} {car.variant}</span>
      </div>

      {/* Car Header */}
      <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
        {/* Car Images */}
        <div className="md:w-2/3">
          <div className="relative rounded-lg overflow-hidden mb-4">
            <img 
              src={car.images[activeImageIndex] || 'https://placehold.co/800x600/cccccc/ffffff?text=Car+Image'} 
              alt={`${car.brand} ${car.name}`} 
              className="w-full h-96 object-cover"
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
          
          {car.images.length > 1 && (
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
          )}
        </div>

        {/* Car Details */}
        <div className="md:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{car.name} {car.variant}</h1>
                  <p className="text-muted-foreground">{car.brand} • {car.year}</p>
                </div>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-4 flex items-center gap-2">
                {car.is_new && (
                  <Badge className="bg-green-500">NEW</Badge>
                )}
                {car.is_featured && (
                  <Badge className="bg-orange-500">POPULAR</Badge>
                )}
                {car.is_electric && (
                  <Badge className="bg-blue-500">ELECTRIC</Badge>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-3xl font-bold text-orange-500">
                {formatPrice(car.ex_showroom_price)}
              </p>
              <p className="text-sm text-muted-foreground">
                On-road: {formatPrice(car.on_road_price)}
              </p>
              {car.price_on_request && (
                <p className="text-sm text-orange-500 font-medium mt-1">
                  Price on Request
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">EMI</p>
                <p className="font-bold text-orange-500">
                  Rs.{emi.toLocaleString('en-IN')}/mo
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Fuel</p>
                <p className="font-bold">{car.fuel_type}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button className="w-full">
                Get Best Offer
              </Button>
              <Button variant="outline" className="w-full">
                Request Callback
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Car Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Engine</span>
                    <span className="font-medium">{car.engine_cc} cc</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Fuel Type</span>
                    <span className="font-medium">{car.fuel_type}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Transmission</span>
                    <span className="font-medium">{car.transmission}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Seating Capacity</span>
                    <span className="font-medium">{car.seating} Seats</span>
                  </div>
                  {car.mileage_kmpl && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Mileage</span>
                      <span className="font-medium">{car.mileage_kmpl} kmpl</span>
                    </div>
                  )}
                  {car.battery_range_km && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Battery Range</span>
                      <span className="font-medium">{car.battery_range_km} km</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Model</span>
                    <span className="font-medium">{car.model}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Variant</span>
                    <span className="font-medium">{car.variant}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Year</span>
                    <span className="font-medium">{car.year}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{car.category}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Colors</span>
                    <span className="font-medium">
                      {car.colors ? car.colors.join(', ') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Features */}
          {car.features && car.features.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {car.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Price History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Price History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Current Price</span>
                  <span className="font-bold text-orange-500">
                    {formatPrice(car.ex_showroom_price)}
                  </span>
                </div>
                <div className="h-32 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-muted-foreground">Price trend chart would appear here</p>
                </div>
                <Button variant="outline" className="w-full">
                  Set Price Alert
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Dealer Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Authorized Dealer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h3 className="font-bold">Saz Motors</h3>
                  <p className="text-sm text-muted-foreground">Suzuki Authorized Dealer</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p>Kamaladi, Kathmandu</p>
                <p>📞 01-4256789</p>
                <Button className="w-full mt-3">
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Cars */}
      {similarCars.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Similar Cars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarCars.map((similarCar) => (
              <CarCard key={similarCar.id} {...similarCar} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CarDetail;