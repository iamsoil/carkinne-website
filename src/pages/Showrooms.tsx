"use client";

import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const Showrooms = () => {
  const [showrooms, setShowrooms] = useState<any[]>([]);
  const [filteredShowrooms, setFilteredShowrooms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchShowrooms();
  }, []);

  useEffect(() => {
    filterShowrooms();
  }, [showrooms, searchQuery, selectedBrands, selectedCities]);

  const fetchShowrooms = async () => {
    const { data, error } = await supabase
      .from('showrooms')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching showrooms:', error);
    } else {
      setShowrooms(data);
      setFilteredShowrooms(data);
    }
  };

  const filterShowrooms = () => {
    let result = [...showrooms];
    
    // Search filter
    if (searchQuery) {
      result = result.filter(showroom => 
        showroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        showroom.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        showroom.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        showroom.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(showroom => selectedBrands.includes(showroom.brand));
    }
    
    // City filter
    if (selectedCities.length > 0) {
      result = result.filter(showroom => selectedCities.includes(showroom.city));
    }
    
    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'brand') {
      result.sort((a, b) => a.brand.localeCompare(b.brand));
    } else if (sortBy === 'city') {
      result.sort((a, b) => a.city.localeCompare(b.city));
    }
    
    setFilteredShowrooms(result);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };

  const toggleCity = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city) 
        : [...prev, city]
    );
  };

  // Get unique values for filters
  const brands = Array.from(new Set(showrooms.map(showroom => showroom.brand)));
  const cities = Array.from(new Set(showrooms.map(showroom => showroom.city)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Car Showrooms in Nepal</h1>
        <p className="text-muted-foreground">
          Find authorized dealers and showrooms near you
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by showroom name, brand, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="brand">Brand</SelectItem>
              <SelectItem value="city">City</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brands */}
            <div>
              <Label className="mb-2 block">Brands</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map(brand => (
                  <div key={brand} className="flex items-center">
                    <Checkbox 
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => toggleBrand(brand)}
                    />
                    <Label htmlFor={`brand-${brand}`} className="ml-2 text-sm">
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Cities */}
            <div>
              <Label className="mb-2 block">Cities</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {cities.map(city => (
                  <div key={city} className="flex items-center">
                    <Checkbox 
                      id={`city-${city}`}
                      checked={selectedCities.includes(city)}
                      onCheckedChange={() => toggleCity(city)}
                    />
                    <Label htmlFor={`city-${city}`} className="ml-2 text-sm">
                      {city}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => {
              setSelectedBrands([]);
              setSelectedCities([]);
            }}>
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {filteredShowrooms.length} of {showrooms.length} showrooms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShowrooms.map(showroom => (
          <Card key={showroom.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{showroom.name}</h3>
                  <p className="text-muted-foreground">{showroom.brand}</p>
                </div>
                {showroom.is_authorized && (
                  <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs font-semibold flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Authorized
                  </div>
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    {showroom.address}, {showroom.city}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                  <p className="text-sm">{showroom.phone}</p>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <p className="text-sm">{showroom.working_hours}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1">
                  Get Directions
                </Button>
                <Button variant="outline">
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredShowrooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No showrooms match your filters. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Showrooms;