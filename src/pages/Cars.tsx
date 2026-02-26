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

  // Mock data for demonstration
  useEffect(() => {
    const mockCars = [
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
    
    setCars(mockCars);
    setFilteredCars(mockCars);
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, searchQuery, priceRange, selectedBrands, selectedCategories, selectedFuelTypes]);

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
  const categories = Array.from(new Set(cars.map(car => car.category || 'SUV')));
  const fuelTypes = Array.from(new Set(cars.map(car => car.fuel_type)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-3">All Cars</h1>
        <p className="text-muted-foreground">
          Browse through our extensive collection of cars available in Nepal
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by brand, model, or variant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 rounded-xl border border-border"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] rounded-lg border border-border">
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
            
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={`rounded-none ${viewMode === 'grid' ? 'bg-foreground text-white' : 'bg-white text-foreground hover:bg-foreground hover:text-white'}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={`rounded-none border-l border-border ${viewMode === 'list' ? 'bg-foreground text-white' : 'bg-white text-foreground hover:bg-foreground hover:text-white'}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-white border border-border rounded-2xl p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <Label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Price Range</Label>
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
                    className="rounded-lg"
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Brands */}
            <div>
              <Label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Brands</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map(brand => (
                  <div key={brand} className="flex items-center">
                    <Checkbox 
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => toggleBrand(brand)}
                      className="rounded border-border"
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
              <Label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Categories</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <Checkbox 
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                      className="rounded border-border"
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
              <Label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Fuel Type</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {fuelTypes.map(fuelType => (
                  <div key={fuelType} className="flex items-center">
                    <Checkbox 
                      id={`fuel-${fuelType}`}
                      checked={selectedFuelTypes.includes(fuelType)}
                      onCheckedChange={() => toggleFuelType(fuelType)}
                      className="rounded border-border"
                    />
                    <Label htmlFor={`fuel-${fuelType}`} className="ml-2 text-sm">
                      {fuelType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={() => {
              setSelectedBrands([]);
              setSelectedCategories([]);
              setSelectedFuelTypes([]);
              setPriceRange([0, 15000000]);
            }} className="border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg">
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6 flex justify-between items-center">
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
            <Card key={car.id} className="overflow-hidden border border-border rounded-2xl">
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
                        <h3 className="text-xl font-semibold">{car.name} {car.variant}</h3>
                        <p className="text-muted-foreground">{car.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-accent font-semibold text-xl">
                          Rs.{car.ex_showroom_price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          On-road: Rs.{car.on_road_price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Fuel</p>
                        <p className="font-medium">{car.fuel_type}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Transmission</p>
                        <p className="font-medium">{car.transmission}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Seating</p>
                        <p className="font-medium">{car.seating} Seats</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Engine</p>
                        <p className="font-medium">{car.engine_cc}cc</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button className="bg-foreground text-white hover:bg-accent rounded-lg">
                        View Details
                      </Button>
                      <Button variant="outline" className="border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg">
                        Compare
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCars.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No cars match your filters. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Cars;