"use client";

import { useState } from 'react';
import { Link } from 'react-router-dom';

const EvCharging = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  const cities = [
    'All Cities', 'Kathmandu', 'Lalitpur', 'Pokhara', 
    'Biratnagar', 'Butwal', 'Chitwan', 'Birgunj', 'Hetauda'
  ];

  const stations = [
    { 
      name: 'NEA Charging Station - Kathmandu', 
      address: 'Durbar Marg, Kathmandu',
      city: 'Kathmandu',
      connectors: ['CCS2', 'CHAdeMO'],
      operator: 'NEA' 
    },
    { 
      name: 'Labim Mall Charging Station',
      address: 'Pulchowk, Lalitpur', 
      city: 'Lalitpur',
      connectors: ['CCS2'],
      operator: 'ElectriVa' 
    },
    { 
      name: 'NEA Charging Station - Butwal',
      address: 'Butwal, Rupandehi',
      city: 'Butwal', 
      connectors: ['CCS2', 'GBT'],
      operator: 'NEA' 
    },
    { 
      name: 'Sathi Auto Parts',
      address: 'Sitalpati, Kathmandu',
      city: 'Kathmandu',
      connectors: ['CCS2'],
      operator: 'Sathi' 
    },
    { 
      name: 'MG Charging Hub',
      address: 'Naxal, Kathmandu',
      city: 'Kathmandu',
      connectors: ['CCS2', 'AC'],
      operator: 'MG' 
    },
    { 
      name: 'TATA Charging Station',
      address: 'New Baneshwor, Kathmandu',
      city: 'Kathmandu',
      connectors: ['CCS2'],
      operator: 'TATA' 
    },
    { 
      name: 'NEA Charging - Pokhara',
      address: 'Lakeside, Pokhara',
      city: 'Pokhara',
      connectors: ['CCS2', 'GBT'],
      operator: 'NEA' 
    },
    { 
      name: 'BYD Charging Station',
      address: 'Biratnagar, Morang',
      city: 'Biratnagar',
      connectors: ['CCS2'],
      operator: 'BYD' 
    },
  ];

  // Filter stations based on search and city
  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          station.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'All Cities' || station.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-[#f5f5f7] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1d1d1f] mb-2">
            EV Charging Stations in Nepal
          </h1>
          <p className="text-base text-[#6e6e73] mb-8">
            Find charging points across Nepal
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search stations..."
                className="w-full px-4 py-3 rounded-lg border border-[#d2d2d7] focus:outline-none focus:border-[#1d1d1f]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-3 rounded-lg border border-[#d2d2d7] focus:outline-none focus:border-[#1d1d1f] bg-white"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="py-6 bg-white border-b border-[#d2d2d7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-4">
            <div className="bg-white border border-[#d2d2d7] rounded-2xl px-5 py-2 text-sm font-medium text-[#1d1d1f]">
              150+ Stations
            </div>
            <div className="bg-white border border-[#d2d2d7] rounded-2xl px-5 py-2 text-sm font-medium text-[#1d1d1f]">
              15+ Cities
            </div>
            <div className="bg-white border border-[#d2d2d7] rounded-2xl px-5 py-2 text-sm font-medium text-[#1d1d1f]">
              Multiple Connectors
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Stations List */}
          <div className="w-full lg:w-96">
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6">
              Charging Stations
            </h2>
            
            <div className="space-y-3">
              {filteredStations.map((station, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-[#d2d2d7] rounded-xl p-4"
                >
                  <h3 className="text-sm font-semibold text-[#1d1d1f]">
                    {station.name}
                  </h3>
                  <p className="text-xs text-[#6e6e73] mt-1">
                    {station.address}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {station.connectors.map((connector, idx) => (
                      <span 
                        key={idx} 
                        className="bg-[#f5f5f7] rounded-md px-2 py-1 text-[11px] text-[#1d1d1f]"
                      >
                        {connector}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-[11px] font-medium text-[#e8531a] uppercase">
                      {station.operator}
                    </span>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(station.name)}+Nepal`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-[#e8531a] text-[#e8531a] rounded-lg px-3.5 py-1.5 text-xs font-medium hover:bg-[#e8531a] hover:text-white transition-colors"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Side - Map */}
          <div className="flex-1">
            <p className="text-sm text-[#6e6e73] mb-4">
              📍 Charging stations across Nepal
            </p>
            <div className="rounded-2xl overflow-hidden border border-[#d2d2d7]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1822139.1!2d84.1!3d28.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1"
                width="100%"
                height="600"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Add Your Station Section */}
      <div className="bg-[#f5f5f7] py-12">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-3">
            Know a charging station we missed?
          </h2>
          <p className="text-base text-[#6e6e73] mb-8">
            Help the EV community by adding missing stations
          </p>
          <a
            href="mailto:hello@carkinne.com?subject=Add Charging Station"
            className="inline-block bg-[#e8531a] text-white rounded-lg px-6 py-3 text-base font-medium hover:bg-[#e8531a]/90 transition-colors"
          >
            Add a Station
          </a>
        </div>
      </div>
    </div>
  );
};

export default EvCharging;