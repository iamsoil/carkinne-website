"use client";

import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CarCard from '@/components/CarCard';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Quick filter options
  const quickFilters = [
    'Under 20L', '20-40L', '40-60L', '60L+', 'Electric', 'SUV', 'Sedan'
  ];

  // Popular brands
  const popularBrands = [
    'Suzuki', 'Toyota', 'Hyundai', 'Kia', 'MG', 'Honda', 'Nissan', 'BYD'
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
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-foreground leading-tight tracking-tight">
            Find Your Perfect Car in Nepal
          </h1>
          <p className="text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
            Compare prices, calculate EMI, find showrooms
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-10">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search Toyota, Suzuki, Budget..."
                className="pl-6 pr-32 py-6 text-base rounded-xl bg-white border border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg bg-accent hover:bg-accent/90 text-white px-6">
                Search
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="text-muted-foreground text-sm mt-6 flex flex-wrap justify-center gap-4">
            <span>150+ Cars</span>
            <span className="hidden sm:block">•</span>
            <span>50+ Showrooms</span>
            <span className="hidden sm:block">•</span>
            <span>Updated Monthly</span>
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {quickFilters.map((filter, index) => (
              <button
                key={index}
                className="px-5 py-2 text-sm font-medium text-foreground bg-white border border-border rounded-full hover:border-foreground transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-semibold text-center text-foreground mb-3">
            Popular Brands
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 mt-12">
            {popularBrands.map((brand, index) => (
              <div 
                key={index} 
                className="bg-white border border-border rounded-xl p-6 flex items-center justify-center hover:border-foreground transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <p className="font-medium text-foreground text-sm">{brand}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-semibold text-foreground">Featured Cars</h2>
            </div>
            <a href="/cars" className="text-foreground hover:text-accent flex items-center font-medium">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {featuredCars.map((car) => (
              <CarCard key={car.id} {...car} />
            ))}
          </div>
        </div>
      </section>

      {/* Find By Budget CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-semibold text-foreground mb-3">
            Find By Budget
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us your budget, we'll find your perfect car
          </p>
          
          <Button 
            size="lg" 
            className="mt-8 bg-foreground text-white hover:bg-accent rounded-xl px-8 py-6 text-lg font-medium"
            onClick={() => window.location.href = '/budget-finder'}
          >
            Find My Car
          </Button>
        </div>
      </section>

      {/* EMI Calculator Widget */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-border p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-semibold text-foreground">EMI Calculator</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Car Price (Rs.)</label>
                <Input type="number" placeholder="e.g. 3000000" className="w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Down Payment (%)</label>
                <Input type="number" placeholder="e.g. 10" defaultValue="10" className="w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Loan Term (Years)</label>
                <Input type="number" placeholder="e.g. 5" defaultValue="5" className="w-full" />
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button className="bg-accent hover:bg-accent/90 rounded-xl px-8 text-white">
                Calculate EMI
              </Button>
            </div>
            <div className="mt-8 p-6 bg-secondary rounded-xl">
              <p className="text-center text-lg">
                Monthly EMI: <span className="font-semibold text-accent">Rs.55,000</span>
              </p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Total Interest: Rs.300,000 | Total Amount: Rs.33,00,000
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Offers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-semibold text-center text-foreground mb-3">
            Latest Offers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {latestOffers.map((offer) => (
              <div key={offer.id} className="bg-white border border-border rounded-2xl overflow-hidden">
                <img 
                  src={offer.image_url} 
                  alt={offer.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                  <p className="text-muted-foreground mb-4">{offer.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-accent font-semibold">
                      {offer.discount_amount > 0 ? `Save up to Rs.${offer.discount_amount.toLocaleString('en-IN')}` : 'Special Offer'}
                    </span>
                    <Button variant="outline" size="sm" className="border border-border text-foreground hover:bg-foreground hover:text-white">
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
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-semibold text-center text-foreground mb-3">
            Top Showrooms
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {topShowrooms.map((showroom) => (
              <div key={showroom.id} className="bg-white border border-border rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="font-semibold">{showroom.name}</h3>
                    <p className="text-sm text-muted-foreground">{showroom.brand}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p>{showroom.address}, {showroom.city}</p>
                  <p>📞 {showroom.phone}</p>
                  <Button variant="outline" size="sm" className="w-full mt-4 border border-border text-foreground hover:bg-foreground hover:text-white">
                    Get Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest from Blog */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-semibold text-foreground">Latest from Blog</h2>
            </div>
            <a href="/blog" className="text-foreground hover:text-accent flex items-center font-medium">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {latestBlogPosts.map((post) => (
              <div key={post.id} className="bg-white border border-border rounded-2xl overflow-hidden">
                <img 
                  src={post.cover_image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.published_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <Button variant="outline" size="sm" className="border border-border text-foreground hover:bg-foreground hover:text-white">
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