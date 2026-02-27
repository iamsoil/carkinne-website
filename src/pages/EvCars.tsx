"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CarCard from '@/components/CarCard';
import { supabase } from '@/integrations/supabase/client';

const EvCars = () => {
  const [evCars, setEvCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchEvCars();
  }, []);

  const fetchEvCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('is_electric', true);

      if (error) throw error;
      setEvCars(data || []);
    } catch (err) {
      console.error('Error fetching EV cars:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter cars based on active filter
  const filteredCars = evCars.filter(car => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Under 50L') return car.ex_showroom_price < 5000000;
    if (activeFilter === '50L-1Cr') return car.ex_showroom_price >= 5000000 && car.ex_showroom_price <= 10000000;
    if (activeFilter === 'Above 1Cr') return car.ex_showroom_price > 10000000;
    return car.category === activeFilter;
  });

  // Format price in Nepali format
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs. ${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `Rs. ${(price / 100000).toFixed(1)} L`;
    }
    return `Rs. ${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="py-16 text-center">
        <h1 className="text-4xl font-semibold text-[#1d1d1f] mb-3">Electric Cars in Nepal</h1>
        <p className="text-[#6e6e73] max-w-2xl mx-auto">Go electric — compare EVs available in Nepal</p>
      </div>

      {/* Stats Bar */}
      <div className="py-8 border-y border-[#d2d2d7]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
          <div className="flex items-center">
            <span className="font-semibold text-[#e8531a] text-lg">5+ EVs</span>
            <span className="text-[#6e6e73] ml-2">Available</span>
          </div>
          <div className="h-4 w-px bg-[#d2d2d7] hidden md:block"></div>
          <div className="flex items-center">
            <span className="font-semibold text-[#e8531a] text-lg">500km</span>
            <span className="text-[#6e6e73] ml-2">Range</span>
          </div>
          <div className="h-4 w-px bg-[#d2d2d7] hidden md:block"></div>
          <div className="flex items-center">
            <span className="font-semibold text-[#e8531a] text-lg">Save</span>
            <span className="text-[#6e6e73] ml-2">on Fuel</span>
          </div>
        </div>
      </div>

      {/* Why Electric Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-[#d2d2d7] rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Lower Running Cost</h3>
                <p className="text-[13px] text-[#6e6e73] mt-2">Rs. 1-2/km vs Rs. 8-12/km petrol</p>
              </CardContent>
            </Card>
            <Card className="border border-[#d2d2d7] rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Tax Benefits</h3>
                <p className="text-[13px] text-[#6e6e73] mt-2">EVs get reduced customs duty in Nepal</p>
              </CardContent>
            </Card>
            <Card className="border border-[#d2d2d7] rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Low Maintenance</h3>
                <p className="text-[13px] text-[#6e6e73] mt-2">No oil changes, fewer moving parts</p>
              </CardContent>
            </Card>
            <Card className="border border-[#d2d2d7] rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Eco Friendly</h3>
                <p className="text-[13px] text-[#6e6e73] mt-2">Zero direct emissions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* EV Listings */}
      <div className="py-16 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-2">Available Electric Cars</h2>
            <p className="text-[#6e6e73]">Updated prices for Nepal market</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {['All', 'Under 50L', '50L-1Cr', 'Above 1Cr', 'Sedan', 'SUV', 'Hatchback'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm rounded-full ${
                  activeFilter === filter
                    ? 'bg-[#1d1d1f] text-white'
                    : 'bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:border-[#1d1d1f]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Car Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="border border-[#d2d2d7] rounded-2xl overflow-hidden animate-pulse">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Charging Info Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#1d1d1f]">Charging in Nepal</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-4">Home Charging</h3>
              <ul className="space-y-3 text-[#6e6e73]">
                <li>Standard 15A socket: 8-12 hours</li>
                <li>Dedicated home charger: 4-6 hours</li>
                <li>Cost: ~Rs. 10-15 per unit</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-4">Public Charging</h3>
              <ul className="space-y-3 text-[#6e6e73]">
                <li>Fast DC chargers: 30-60 mins</li>
                <li>Available at: Kathmandu, Pokhara, Chitwan</li>
                <li>Growing network across Nepal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvCars;