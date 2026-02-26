"use client";

import { useState } from 'react';
import { Search, ChevronRight, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CarCard from '@/components/CarCard';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Quick filter options
  const quickFilters = [
    'Under 20L', '20-40L', '40-60L', '60L+', 'Electric', 'SUV', 'Sedan'
  ];

  // Popular brands
  const popularBrands = [
    { name: 'Suzuki', logo: 'https://placehold.co/100x40/0f172a/ffffff?text=Suzuki' },
    { name: 'Toyota', logo: 'https://placehold.co/100x40/0f172a/ffffff?text=Toyota' },
    { name: 'Hyundai', logo: 'https://placehold.co/100x40/0f172a/ffffff?text=Hyundai' },
    { name: 'Kia', logo: 'https://placehold.co/100x40/0f172a/ffffff?text=Kia' },
    { name: 'MG', logo: 'https://placehold.co/100x40/0f172a/ffffff?text=MG' },
    { name: 'Honda', logo: 'https://placehold.co/100x40/0f172a/ffffff?text=Honda' },
    { name: 'Nissan', logo: 'https://placehold.co/100x40/0f172a/ffffff?text=Nissan' },
    { name: 'BYD', logo: 'https://placehold.co/100x40/0f172a/ffffff?text=BYD' },
  ];

  // Featured cars (mock data for now)
  const featuredCars = [
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
      is_electric: false,
      is_featured: true,
      is_new: true,
      images: ['https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=600&h=400'],
      mileage_kmpl: 23.5
    },
    {
      id: '2',
      name: 'Fortuner',
      brand: 'Toyota',
      variant: '2.8 GD-6 4WD',
      ex_showroom_price: 11500000,
      on_road_price: 12800000,
      fuel_type: 'Diesel',
      transmission: 'Automatic',
      seating: 7,
      engine_cc: 2755,
      is_electric: false,
      is_featured: true,
      is_new: true,
      images: ['https://images.unsplash.com/photo-1549399542-7e7f8c7a5e3d?auto=format&fit=crop&w=600&h=400'],
      mileage_kmpl: 12.0
    },
    {
      id: '3',
      name: 'Creta',
      brand: 'Hyundai',
      variant: 'SX(O) Turbo DCT',
      ex_showroom_price: 5200000,
      on_road_price: 5800000,
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      seating: 5,
      engine_cc: 1482,
      is_electric: false,
      is_featured: true,
      is_new: true,
      images: ['https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=600&h=400'],
      mileage_kmpl: 16.8
    },
    {
      id: '4',
      name: 'ZS EV',
      brand: 'MG',
      variant: 'Excite',
      ex_showroom_price: 4750000,
      on_road_price: 5200000,
      fuel_type: 'Electric',
      transmission: 'Automatic',
      seating: 5,
      engine_cc: 0,
      is_electric: true,
      is_featured: true,
      is_new: true,
      images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e7e1?auto=format&fit=crop&w=600&h=400'],
      mileage_kmpl: 0,
      battery_range_km: 320
    },
    {
      id: '5',
      name: 'Sonet',
      brand: 'Kia',
      variant: 'HTX Plus',
      ex_showroom_price: 4100000,
      on_road_price: 4600000,
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      seating: 5,
      engine_cc: 1493,
      is_electric: false,
      is_featured: false,
      is_new: true,
      images: ['https://images.unsplash.com/photo-1596779911828-609b0b4e8c7b?auto=format&fit=crop&w=600&h=400'],
      mileage_kmpl: 18.2
    },
    {
      id: '6',
      name: 'City',
      brand: 'Honda',
      variant: 'SV',
      ex_showroom_price: 3850000,
      on_road_price: 4300000,
      fuel_type: 'Petrol',
      transmission: 'Manual',
      seating: 5,
      engine_cc: 1498,
      is_electric: false,
      is_featured: false,
      is_new: true,
      images: ['https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=600&h=400'],
      mileage_kmpl: 17.8
    }
  ];

  // Latest offers (mock data)
  const latestOffers = [
    {
      id: '1',
      title: 'Dashain Special Offer',
      description: 'Get up to Rs.2L off on selected models',
      discount_amount: 200000,
      valid_until: '2024-10-31',
      image_url: 'https://placehold.co/300x200/f59e0b/ffffff?text=Special+Offer'
    },
    {
      id: '2',
      title: 'Free Accessories',
      description: 'Free accessories worth Rs.50,000 with all new purchases',
      discount_amount: 50000,
      valid_until: '2024-11-15',
      image_url: 'https://placehold.co/300x200/0f172a/ffffff?text=Free+Accessories'
    },
    {
      id: '3',
      title: 'Low Interest EMI',
      description: 'Special financing at just 7% interest rate',
      discount_amount: 0,
      valid_until: '2024-12-31',
      image_url: 'https://placehold.co/300x200/0f172a/ffffff?text=Low+Interest'
    }
  ];

  // Top showrooms (mock data)
  const topShowrooms = [
    {
      id: '1',
      name: 'Saz Motors - Kathmandu',
      brand: 'Suzuki',
      address: 'Kamaladi, Kathmandu',
      city: 'Kathmandu',
      phone: '01-4256789',
      is_authorized: true
    },
    {
      id: '2',
      name: 'Toyota Nepal - Thapathali',
      brand: 'Toyota',
      address: 'Thapathali, Kathmandu',
      city: 'Kathmandu',
      phone: '01-4234567',
      is_authorized: true
    },
    {
      id: '3',
      name: 'Hyundai Nepal - Pulchowk',
      brand: 'Hyundai',
      address: 'Pulchowk, Lalitpur',
      city: 'Lalitpur',
      phone: '01-5523456',
      is_authorized: true
    },
    {
      id: '4',
      name: 'Kia Nepal - New Road',
      brand: 'Kia',
      address: 'New Road, Pokhara',
      city: 'Pokhara',
      phone: '061-465789',
      is_authorized: true
    }
  ];

  // Blog posts (mock data)
  const latestBlogPosts = [
    {
      id: '1',
      title: 'Top 5 SUVs Under 50 Lakhs in Nepal',
      excerpt: 'Explore the best SUV options available in Nepal under 50 lakhs...',
      cover_image: 'https://placehold.co/400x250/0f172a/ffffff?text=SUV+Guide',
      published_at: '2024-09-15'
    },
    {
      id: '2',
      title: 'Electric Cars: The Future of Transportation in Nepal',
      excerpt: 'As Nepal moves towards sustainable transportation, electric vehicles...',
      cover_image: 'https://placehold.co/400x250/0f172a/ffffff?text=EV+Future',
      published_at: '2024-09-10'
    },
    {
      id: '3',
      title: 'How to Calculate True Cost of Car Ownership',
      excerpt: 'Beyond the ex-showroom price, several factors contribute to the total...',
      cover_image: 'https://placehold.co/400x250/0f172a/ffffff?text=Car+Cost',
      published_at: '2024-09-05'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"></div>
        
        {/* Decorative car silhouette */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3 h-full opacity-15 hidden lg:block">
          <svg viewBox="0 0 500 300" className="w-full h-full text-orange-500">
            <path 
              d="M50,200 L100,150 L200,150 L250,100 L350,100 L400,150 L450,150 L450,200 L400,200 L350,200 L300,200 L250,200 L200,200 L150,200 L100,200 L50,200 Z" 
              fill="currentColor" 
              stroke="currentColor" 
              strokeWidth="2"
            />
            <circle cx="120" cy="220" r="20" fill="currentColor" />
            <circle cx="380" cy="220" r="20" fill="currentColor" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Find Your Perfect Car in Nepal
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Compare prices, calculate EMI, find showrooms — all in one place
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative shadow-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Toyota, Suzuki, Budget..."
                className="pl-10 py-6 text-base rounded-full bg-white/100 border-white/20 text-slate-900 placeholder:text-slate-500 focus-visible:ring-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-orange-500 hover:bg-orange-600 text-slate-900">
                Search
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="text-white/80 text-sm mb-6">
            🚗 150+ Cars Listed | 🏢 50+ Showrooms | ⭐ Updated Monthly
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {quickFilters.map((filter, index) => (
              <Button
                key={index}
                variant="secondary"
                className="rounded-full bg-white/20 hover:bg-orange-500 text-white border-white/30 hover:text-slate-900"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Popular Brands</h2>
            <div className="w-10 h-1 bg-orange-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {popularBrands.map((brand, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer border-t-4 border-transparent hover:border-orange-500"
              >
                <Car className="h-8 w-8 text-orange-500 mb-2" />
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="max-h-8 object-contain mb-2"
                />
                <p className="font-bold text-slate-900 text-sm">{brand.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Cars</h2>
              <div className="w-10 h-1 bg-orange-500 mt-1"></div>
            </div>
            <a href="/cars" className="text-orange-500 hover:text-orange-400 flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} {...car} />
            ))}
          </div>
        </div>
      </section>

      {/* Find By Budget CTA */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Find By Budget
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Tell us your budget, we'll find your perfect car
          </p>
          <Button 
            size="lg" 
            className="bg-white text-orange-500 hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-semibold"
            onClick={() => window.location.href = '/budget-finder'}
          >
            Find My Car →
          </Button>
        </div>
      </section>

      {/* EMI Calculator Widget */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">EMI Calculator</h2>
              <div className="w-10 h-1 bg-orange-500 mx-auto mt-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Car Price (Rs.)</label>
                <Input type="number" placeholder="e.g. 3000000" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Down Payment (%)</label>
                <Input type="number" placeholder="e.g. 10" defaultValue="10" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Loan Term (Years)</label>
                <Input type="number" placeholder="e.g. 5" defaultValue="5" className="w-full" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button className="bg-orange-500 hover:bg-orange-600 rounded-full px-8 text-white">
                Calculate EMI
              </Button>
            </div>
            <div className="mt-6 p-4 bg-slate-100 rounded-lg">
              <p className="text-center text-lg">
                Monthly EMI: <span className="font-bold text-orange-500">Rs.55,000</span>
              </p>
              <p className="text-center text-sm text-slate-600 mt-2">
                Total Interest: Rs.300,000 | Total Amount: Rs.33,00,000
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Offers */}
      <section className="py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Latest Offers</h2>
            <div className="w-10 h-1 bg-orange-500 mx-auto mt-1"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img 
                  src={offer.image_url} 
                  alt={offer.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-slate-600 mb-4">{offer.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-500 font-semibold">
                      {offer.discount_amount > 0 ? `Save up to Rs.${offer.discount_amount.toLocaleString('en-IN')}` : 'Special Offer'}
                    </span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Showrooms */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Top Showrooms</h2>
            <div className="w-10 h-1 bg-orange-500 mx-auto mt-1"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topShowrooms.map((showroom) => (
              <div key={showroom.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="font-bold">{showroom.name}</h3>
                    <p className="text-sm text-slate-600">{showroom.brand}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p>{showroom.address}, {showroom.city}</p>
                  <p>📞 {showroom.phone}</p>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Get Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest from Blog */}
      <section className="py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Latest from Blog</h2>
              <div className="w-10 h-1 bg-orange-500 mt-1"></div>
            </div>
            <a href="/blog" className="text-orange-500 hover:text-orange-400 flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestBlogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img 
                  src={post.cover_image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-slate-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                      {new Date(post.published_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MadeWithDyad />
    </div>
  );
};

export default Index;