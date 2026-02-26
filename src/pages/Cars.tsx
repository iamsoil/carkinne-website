"use client";

import { useState, useEffect } from 'react';
import { Filter, Grid, List, ChevronDown, SlidersHorizontal } from 'lucide-react';
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
import CarCard from '@/components/CarCard';
import { supabase } from '@/integrations/supabase/client';

const Cars = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, searchQuery, priceRange, selectedBrands, selectedCategories, selectedFuelTypes]);

  const fetchCars = async () => {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('is_featured', { ascending: false });

    if (error) {
      console.error('Error fetching cars:', error);
    } else {
      setCars(data);
      setFilteredCars(data);
    }
  };

  const filterCars = () => {
    let result = [...cars];
    
    // Search filter
    if (searchQuery) {
      result = result.filter(car => 
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.variant.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Price filter
    result = result.filter(car => 
      car.ex_showroom_price >= priceRange[0] && 
      car.ex_showroom_price <= priceRange[1]
    );
    
    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(car => selectedBrands.includes(car.brand));
    }
    
    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(car => selectedCategories.includes(car.category));
    }
    
    // Fuel type filter
    if (selectedFuelTypes.length > 0) {
      result = result.filter(car => selectedFuelTypes.includes(car.fuel_type));
    }
    
    setFilteredCars(result);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const toggleFuelType = (fuelType: string) => {
    setSelectedFuelTypes(prev => 
      prev.includes(fuelType) 
        ? prev.filter(f => f !== fuelType) 
        : [...prev, fuelType]
    );
  };

  // Get unique values for filters
  const brands = Array.from(new Set(cars.map(car => car.brand)));
  const categories = Array.from(new Set(cars.map(car => car.category)));
  const fuelTypes = Array.from(new Set(cars.map(car => car.fuel_type)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Cars</h1>
        <p className="text-muted-foreground">
          Browse through our extensive collection of cars available in Nepal
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by brand, model, or variant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="mileage">Best Mileage</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-none border-l"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <Label className="mb-2 block">Price Range</Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rs.{priceRange[0].toLocaleString('en-IN')}</span>
                  <span className="text-sm">Rs.{priceRange[1].toLocaleString('en-IN')}</span>
                </div>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    value={priceRange[0]} 
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  />
                </div>
              </div>
            </div>

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

            {/* Categories */}
            <div>
              <Label className="mb-2 block">Categories</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <Checkbox 
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={`category-${category}`} className="ml-2 text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Fuel Types */}
            <div>
              <Label className="mb-2 block">Fuel Type</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {fuelTypes.map(fuelType => (
                  <div key={fuelType} className="flex items-center">
                    <Checkbox 
                      id={`fuel-${fuelType}`}
                      checked={selectedFuelTypes.includes(fuelType)}
                      onCheckedChange={() => toggleFuelType(fuelType)}
                    />
                    <Label htmlFor={`fuel-${fuelType}`} className="ml-2 text-sm">
                      {fuelType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => {
              setSelectedBrands([]);
              setSelectedCategories([]);
              setSelectedFuelTypes([]);
              setPriceRange([0, 15000000]);
            }}>
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {filteredCars.length} of {cars.length} cars
        </p>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map(car => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCars.map(car => (
            <Card key={car.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img 
                      src={car.images[0]} 
                      alt={`${car.brand} ${car.name}`} 
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{car.name} {car.variant}</h3>
                        <p className="text-muted-foreground">{car.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-500 font-bold text-xl">
                          Rs.{car.ex_showroom_price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          On-road: Rs.{car.on_road_price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Fuel</p>
                        <p className="font-medium">{car.fuel_type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Transmission</p>
                        <p className="font-medium">{car.transmission}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Seating</p>
                        <p className="font-medium">{car.seating} Seats</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Engine</p>
                        <p className="font-medium">{car.engine_cc}cc</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button>View Details</Button>
                      <Button variant="outline">Compare</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No cars match your filters. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Cars;