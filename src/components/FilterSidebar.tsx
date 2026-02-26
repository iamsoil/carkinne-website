import { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface FilterOptions {
  priceRange: [number, number];
  brand: string;
  category: string;
  fuelType: string;
  transmission: string;
  seating: number;
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

const FilterSidebar = ({ onFilterChange, onReset }: FilterSidebarProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 20000000],
    brand: 'all',
    category: 'all',
    fuelType: 'all',
    transmission: 'all',
    seating: 5
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      priceRange: [0, 20000000],
      brand: 'all',
      category: 'all',
      fuelType: 'all',
      transmission: 'all',
      seating: 5
    };
    setFilters(resetFilters);
    onReset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="link" onClick={resetFilters} className="text-orange-500">
          Reset All
        </Button>
      </div>
      
      <div>
        <Label>Price Range</Label>
        <div className="mt-2">
          <Slider 
            min={0} 
            max={20000000} 
            step={100000} 
            value={filters.priceRange} 
            onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Rs.0</span>
            <span>Rs.2 Crore</span>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="brand">Brand</Label>
        <Select value={filters.brand} onValueChange={(value) => handleFilterChange('brand', value)}>
          <SelectTrigger id="brand" className="mt-2">
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            <SelectItem value="suzuki">Suzuki</SelectItem>
            <SelectItem value="toyota">Toyota</SelectItem>
            <SelectItem value="hyundai">Hyundai</SelectItem>
            <SelectItem value="kia">Kia</SelectItem>
            <SelectItem value="mg">MG</SelectItem>
            <SelectItem value="honda">Honda</SelectItem>
            <SelectItem value="nissan">Nissan</SelectItem>
            <SelectItem value="tata">Tata</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
          <SelectTrigger id="category" className="mt-2">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="suv">SUV</SelectItem>
            <SelectItem value="sedan">Sedan</SelectItem>
            <SelectItem value="hatchback">Hatchback</SelectItem>
            <SelectItem value="muv">MUV</SelectItem>
            <SelectItem value="van">Van</SelectItem>
            <SelectItem value="pickup">Pickup</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="fuel-type">Fuel Type</Label>
        <Select value={filters.fuelType} onValueChange={(value) => handleFilterChange('fuelType', value)}>
          <SelectTrigger id="fuel-type" className="mt-2">
            <SelectValue placeholder="Select fuel type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fuel Types</SelectItem>
            <SelectItem value="petrol">Petrol</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
            <SelectItem value="electric">Electric</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="transmission">Transmission</Label>
        <Select value={filters.transmission} onValueChange={(value) => handleFilterChange('transmission', value)}>
          <SelectTrigger id="transmission" className="mt-2">
            <SelectValue placeholder="Select transmission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transmissions</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="automatic">Automatic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Seating Capacity</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[2, 4, 5, 6, 7, 8].map((seats) => (
            <Button
              key={seats}
              variant={filters.seating === seats ? "default" : "outline"}
              onClick={() => handleFilterChange('seating', seats)}
              className={filters.seating === seats ? "bg-orange-500" : ""}
            >
              {seats}+
            </Button>
          ))}
        </div>
      </div>
      
      <Button className="w-full mt-4">
        <Filter className="h-4 w-4 mr-2" />
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;