"use client";

import { useState } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Showrooms = () => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');

  // Sample showroom data
  const showrooms = [
    {
      id: '1',
      name: 'Suzuki Nepal Pvt. Ltd.',
      brand: 'Suzuki',
      city: 'Kathmandu',
      address: 'Naxal, Kathmandu 44600',
      phone: '01-4413071',
      hours: 'Sun–Fri 9:00am–6:00pm',
      mapsUrl: 'https://maps.google.com/?q=Suzuki+Nepal+Naxal+Kathmandu'
    },
    {
      id: '2',
      name: 'United Traders Syndicate',
      brand: 'Toyota',
      city: 'Kathmandu',
      address: 'Naxal, Kathmandu 44600',
      phone: '01-4413100',
      hours: 'Sun–Fri 9:00am–6:00pm',
      mapsUrl: 'https://maps.google.com/?q=United+Traders+Toyota+Naxal+Kathmandu'
    },
    {
      id: '3',
      name: 'Laxmi Intercontinental Pvt. Ltd.',
      brand: 'Hyundai',
      city: 'Lalitpur',
      address: 'Jawalakhel, Lalitpur 44600',
      phone: '01-5522480',
      hours: 'Sun–Fri 9:00am–6:00pm',
      mapsUrl: 'https://maps.google.com/?q=Laxmi+Intercontinental+Hyundai+Jawalakhel'
    },
    {
      id: '4',
      name: 'Sipradi Trading Pvt. Ltd.',
      brand: 'Kia',
      city: 'Kathmandu',
      address: 'Naxal, Kathmandu 44600',
      phone: '01-4422100',
      hours: 'Sun–Fri 9:00am–6:00pm',
      mapsUrl: 'https://maps.google.com/?q=Sipradi+Trading+Kia+Naxal+Kathmandu'
    },
    {
      id: '5',
      name: 'Syakar Trading Co. Pvt. Ltd.',
      brand: 'MG',
      city: 'Kathmandu',
      address: 'Gairidhara, Kathmandu 44600',
      phone: '01-4002555',
      hours: 'Sun–Fri 9:00am–6:00pm',
      mapsUrl: 'https://maps.google.com/?q=Syakar+Trading+MG+Gairidhara+Kathmandu'
    },
    {
      id: '6',
      name: 'Sharma Transport Pvt. Ltd.',
      brand: 'Honda',
      city: 'Kathmandu',
      address: 'Tripureshwor, Kathmandu 44600',
      phone: '01-4260388',
      hours: 'Sun–Fri 9:00am–6:00pm',
      mapsUrl: 'https://maps.google.com/?q=Sharma+Transport+Honda+Tripureshwor+Kathmandu'
    },
    {
      id: '7',
      name: 'Agni Incorporated Pvt. Ltd.',
      brand: 'Nissan',
      city: 'Kathmandu',
      address: 'Chakrapath, Kathmandu 44600',
      phone: '01-4371281',
      hours: 'Sun–Fri 9:00am–6:00pm',
      mapsUrl: 'https://maps.google.com/?q=Agni+Incorporated+Nissan+Kathmandu'
    },
    {
      id: '8',
      name: 'Pashupati Motors Pvt. Ltd.',
      brand: 'BYD',
      city: 'Lalitpur',
      address: 'Sanepa, Lalitpur 44600',
      phone: '01-5548000',
      hours: 'Sun–Fri 9:00am–6:00pm',
      mapsUrl: 'https://maps.google.com/?q=Pashupati+Motors+BYD+Sanepa+Lalitpur'
    }
  ];

  const cities = ['All', 'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 'Butwal', 'Chitwan', 'Dharan'];
  const brands = ['All', 'Suzuki', 'Toyota', 'Hyundai', 'Kia', 'MG', 'Honda', 'Nissan', 'BYD'];

  // Filter showrooms based on selected city and brand
  const filteredShowrooms = showrooms.filter(showroom => {
    const cityMatch = selectedCity === 'All' || showroom.city === selectedCity;
    const brandMatch = selectedBrand === 'All' || showroom.brand === selectedBrand;
    return cityMatch && brandMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-semibold mb-2">Car Showrooms in Nepal</h1>
        <p className="text-[#6e6e73]">Find authorized dealers near you</p>
      </div>

      {/* City Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-2 text-sm whitespace-nowrap ${
              selectedCity === city
                ? 'bg-[#1d1d1f] text-white rounded-full'
                : 'bg-white border border-[#d2d2d7] text-[#1d1d1f] rounded-full hover:border-[#1d1d1f]'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Brand Filter */}
      <div className="mb-8 flex justify-end">
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="w-[200px] border border-[#d2d2d7] rounded-lg">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <p className="text-[#6e6e73] text-sm mb-4">
        Showing {filteredShowrooms.length} showroom{filteredShowrooms.length !== 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Showroom List */}
        <div className="lg:col-span-2">
          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {filteredShowrooms.length > 0 ? (
              filteredShowrooms.map((showroom) => (
                <div 
                  key={showroom.id} 
                  className="border border-[#d2d2d7] rounded-xl p-5 bg-white hover:-translate-y-0.5 transition-transform cursor-pointer"
                  style={{
                    borderLeft: '3px solid #e8531a',
                  }}
                >
                  <div className="flex items-start">
                    <div className="bg-[#f5f5f7] w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="font-bold text-[#1d1d1f]">
                        {showroom.brand.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1d1d1f] text-base">
                        {showroom.name}
                      </h3>
                      <p className="text-[#6e6e73] text-sm mb-2">
                        {showroom.brand}
                      </p>
                      <div className="flex items-center text-[#6e6e73] text-sm mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{showroom.address}</span>
                      </div>
                      <div className="flex items-center text-[#1d1d1f] text-sm mb-1">
                        <Phone className="h-4 w-4 mr-1" />
                        <a href={`tel:${showroom.phone}`} className="hover:text-[#e8531a]">
                          {showroom.phone}
                        </a>
                      </div>
                      <div className="flex items-center text-[#6e6e73] text-sm mb-3">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{showroom.hours}</span>
                      </div>
                      <div className="border-t border-[#d2d2d7] pt-3">
                        <a 
                          href={showroom.mapsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#e8531a] text-sm font-medium flex items-center hover:underline"
                        >
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-[#6e6e73]">
                  No showrooms found for this filter.
                  <br />
                  Try selecting a different city or brand.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="lg:col-span-3">
          <div className="border border-[#d2d2d7] rounded-xl overflow-hidden sticky top-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.27776862953!2d85.29111453057422!3d27.708968424465493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2snp!4v1234567890"
              width="100%"
              height="calc(100vh - 220px)"
              style={{ 
                border: 0, 
                borderRadius: '16px',
                minHeight: '600px'
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showrooms;