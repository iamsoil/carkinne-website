"use client";

import { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CarCard from '@/components/CarCard';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { supabase } from '@/lib/supabase';
import { formatNPR } from '@/utils/format';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick filter options
  const quickFilters = [
    'Under 20L', '20-40L', '40-60L', '60L+', 'Electric', 'SUV', 'Sedan'
  ];

  // Popular brands
  const popularBrands = [
    'Suzuki', 'Toyota', 'Hyundai', 'Kia', 'MG', 'Honda', 'Nissan', 'BYD'
  ];

  // Latest offers (mock data)
  const latestOffers = [
    {
      id: '1',
      title: 'Dashain Special Offer',
      description: 'Get up to Rs.2L off on selected models',
      discount_amount: 200000,
      valid_until: '2024-10-31',
      image_url: 'https://placehold.co/300x200/f59e0b/ffffff?text=Special+Offer',
      car: 'Toyota Fortuner',
      type: 'Festival Offer'
    },
    {
      id: '2',
      title: 'Free Accessories',
      description: 'Free accessories worth Rs.50,000 with all new purchases',
      discount_amount: 50000,
      valid_until: '2024-11-15',
      image_url: 'https://placehold.co/300x200/0f172a/ffffff?text=Free+Accessories',
      car: 'Honda City',
      type: 'Free Accessories'
    },
    {
      id: '3',
      title: 'Low Interest EMI',
      description: 'Special financing at just 7% interest rate',
      discount_amount: 0,
      valid_until: '2024-12-31',
      image_url: 'https://placehold.co/300x200/0f172a/ffffff?text=Low+Interest',
      car: 'Suzuki Swift',
      type: 'Finance Offer'
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

  // EMI Calculator state
  const [carPrice, setCarPrice] = useState(3000000);
  const [downPct, setDownPct] = useState(10);
  const [tenure, setTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(10.5);

  // Calculate EMI
  const calculateEMI = () => {
    const downPayment = carPrice * (downPct / 100);
    const loanAmount = carPrice - downPayment;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    if (r === 0) return loanAmount / n;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return emi;
  };

  const emi = calculateEMI();

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('is_featured', true)
        .limit(6);

      if (error) throw error;
      
      setFeaturedCars(data || []);
      console.log('Featured cars fetched:', data);
    } catch (err) {
      console.error('Error fetching featured cars:', err);
      setError('Unable to load cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchFeaturedCars}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[80vh] w-full flex items-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10"></div>
        
        {/* Content */}
        <div className="relative z-10 w-full px-6 md:px-20 lg:pl-20">
          <div className="max-w-2xl">
            {/* Small label */}
            <div className="flex items-center mb-4">
              <div className="w-8 h-0.5 bg-[#e8531a] mr-3"></div>
              <span className="text-white text-xs font-medium uppercase tracking-widest">
                Nepal's Smartest Car Buying Guide
              </span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-white text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Find Your Perfect Car in Nepal
            </h1>
            
            {/* Subheadline */}
            <p className="text-white/80 text-lg md:text-xl font-normal mt-4">
              Compare prices, calculate EMI, find showrooms
            </p>
            
            {/* Search bar */}
            <div className="mt-8 max-w-2xl">
              <div className="flex bg-white rounded-xl p-1.5">
                <Input
                  type="text"
                  placeholder="Search Toyota, Suzuki..."
                  className="border-0 focus-visible:ring-0 text-base text-[#1d1d1f] placeholder:text-gray-400 flex-grow px-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="bg-[#e8531a] hover:bg-[#e8531a]/90 text-white font-medium rounded-lg px-6 py-4 whitespace-nowrap">
                  Search
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-5 text-white/70 text-sm">
              150+ Cars   |   50+ Showrooms   |   Updated Monthly
            </div>
            
            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {quickFilters.map((filter, index) => (
                <button
                  key={index}
                  className="px-4 py-2 text-xs text-white bg-white/15 border border-white/30 rounded-full hover:bg-white hover:text-[#1d1d1f] transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Social proof (desktop only) */}
        <div className="absolute bottom-10 left-20 hidden md:block">
          <p className="text-white text-sm font-normal mb-2">Trusted by Nepal's car buyers</p>
          <div className="flex">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"
                style={{ marginLeft: i === 0 ? 0 : -8 }}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-14 bg-white">
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
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="border border-border rounded-2xl overflow-hidden animate-pulse">
                  <div className="bg-gray-200 h-48 w-full"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {featuredCars.map((car) => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>
          )}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Car Price (Rs.)</label>
                <Input 
                  type="number" 
                  placeholder="e.g. 3000000" 
                  className="w-full" 
                  value={carPrice}
                  onChange={(e) => setCarPrice(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Down Payment (%)</label>
                <Input 
                  type="number" 
                  placeholder="e.g. 10" 
                  defaultValue="10" 
                  className="w-full" 
                  value={downPct}
                  onChange={(e) => setDownPct(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Loan Term (Years)</label>
                <Input 
                  type="number" 
                  placeholder="e.g. 5" 
                  defaultValue="5" 
                  className="w-full" 
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Interest Rate (%)</label>
                <Input 
                  type="number" 
                  placeholder="e.g. 10.5" 
                  defaultValue="10.5" 
                  className="w-full" 
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-2xl font-semibold text-[#e8531a]">
                {formatNPR(Math.round(emi))} <span className="text-base font-normal text-foreground">/ month</span>
              </p>
            </div>
            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                className="text-[#e8531a] hover:text-[#e8531a]/90 p-0 h-auto"
                onClick={() => navigate('/emi-calculator')}
              >
                Full Calculator →
              </Button>
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
              <div 
                key={offer.id} 
                className="bg-white border border-[#d2d2d7] rounded-2xl overflow-hidden"
              >
                <div className="relative">
                  <img 
                    src={offer.image_url} 
                    alt={offer.title} 
                    className="w-full h-48 object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#e8531a] text-white text-[11px] font-semibold uppercase px-2 py-1 rounded-full">
                    {offer.type}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#1d1d1f] mb-1">{offer.car}</h3>
                  <p className="text-sm text-[#6e6e73] mb-3">{offer.title}</p>
                  <p className="text-[#e8531a] font-semibold text-sm mb-4">
                    {offer.discount_amount > 0 ? `Save Rs. ${offer.discount_amount.toLocaleString('en-IN')}` : offer.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-[#6e6e73]">
                      Valid until: {new Date(offer.valid_until).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border border-[#1d1d1f] text-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-white rounded-lg"
                      onClick={() => navigate('/offers')}
                    >
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