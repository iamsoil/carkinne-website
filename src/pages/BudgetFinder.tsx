"use client";

import { useState, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Mountain, 
  Users, 
  Briefcase, 
  Car,
  GripVertical,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import CarCard from '@/components/CarCard';

const BudgetFinder = () => {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState<number>(3000000);
  const [usage, setUsage] = useState<string[]>([]);
  const [fuelType, setFuelType] = useState<string>('No preference');
  const [transmission, setTransmission] = useState<string>('No preference');
  const [features, setFeatures] = useState<string[]>([]);
  const [items, setItems] = useState([
    { id: '1', label: 'Low purchase price' },
    { id: '2', label: 'Low running cost' },
    { id: '3', label: 'Brand reputation' },
    { id: '4', label: 'Good resale value' },
    { id: '5', label: 'Features and comfort' },
    { id: '6', label: 'Easy to maintain' },
  ]);
  const [results, setResults] = useState<any[]>([]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Quick select budget ranges
  const budgetRanges = [
    { label: 'Under 15L', min: 500000, max: 1500000 },
    { label: '15-25L', min: 1500000, max: 2500000 },
    { label: '25-40L', min: 2500000, max: 4000000 },
    { label: '40-60L', min: 4000000, max: 6000000 },
    { label: '60L-1Cr', min: 6000000, max: 10000000 },
    { label: '1Cr+', min: 10000000, max: 20000000 }
  ];

  // Format price in Nepali format
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      const crore = price / 10000000;
      return `Rs. ${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(1)} Crore`;
    } else if (price >= 100000) {
      const lakh = price / 100000;
      return `Rs. ${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} Lakh`;
    } else {
      return `Rs. ${price.toLocaleString('en-IN')}`;
    }
  };

  // Handle budget quick select
  const handleBudgetSelect = (min: number, max: number) => {
    const midpoint = Math.round((min + max) / 2);
    setBudget(midpoint);
  };

  // Toggle usage selection
  const toggleUsage = (option: string) => {
    setUsage(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option) 
        : [...prev, option]
    );
  };

  // Toggle feature selection
  const toggleFeature = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(item => item !== feature) 
        : [...prev, feature]
    );
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
    const newItems = [...items];
    const draggedItem = newItems[dragItem.current!];
    newItems.splice(dragItem.current!, 1);
    newItems.splice(dragOverItem.current!, 0, draggedItem);
    dragItem.current = dragOverItem.current;
    dragOverItem.current = null;
    setItems(newItems);
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    dragItem.current = index;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const itemIndex = element?.getAttribute('data-index');
    if (itemIndex !== null && itemIndex !== undefined) {
      handleDragEnter(parseInt(itemIndex));
    }
  };

  // Mock car data for results
  const mockCars = [
    {
      id: '1',
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
      mileage_kmpl: 16.8,
      category: 'SUV'
    },
    {
      id: '2',
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
      mileage_kmpl: 17.8,
      category: 'Sedan'
    },
    {
      id: '3',
      name: 'Nexon',
      brand: 'Tata',
      variant: 'XZ+',
      ex_showroom_price: 2950000,
      on_road_price: 3300000,
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      seating: 5,
      engine_cc: 1199,
      is_electric: false,
      is_featured: true,
      is_new: true,
      images: ['https://images.unsplash.com/photo-1596779911828-609b0b4e8c7b?auto=format&fit=crop&w=600&h=400'],
      mileage_kmpl: 18.2,
      category: 'SUV'
    },
    {
      id: '4',
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
      mileage_kmpl: 23.5,
      category: 'Hatchback'
    }
  ];

  // Calculate match score for cars
  const calculateMatchScore = (car: any) => {
    let score = 0;
    
    // Budget filter (hard filter)
    if (car.ex_showroom_price > budget) return -1;
    
    // Fuel type preference
    if (fuelType !== 'No preference' && car.fuel_type === fuelType) {
      score += 3;
    }
    
    // Transmission preference
    if (transmission !== 'No preference' && car.transmission === transmission) {
      score += 3;
    }
    
    // Usage matching
    if (usage.includes('Hilly terrain') && car.category === 'SUV') {
      score += 2;
    }
    if (usage.includes('Family use') && car.seating >= 5) {
      score += 2;
    }
    if (usage.includes('First car') && car.category === 'Hatchback') {
      score += 2;
    }
    if (usage.includes('Business use') && car.category === 'Sedan') {
      score += 2;
    }
    if (usage.includes('Daily city driving') && car.mileage_kmpl > 20) {
      score += 2;
    }
    
    // Features matching
    if (features.includes('High mileage') && car.mileage_kmpl > 20) {
      score += 1;
    }
    if (features.includes('Automatic') && car.transmission === 'Automatic') {
      score += 1;
    }
    
    return score;
  };

  // Get results based on user preferences
  const getResults = () => {
    const scoredCars = mockCars
      .map(car => ({
        ...car,
        score: calculateMatchScore(car)
      }))
      .filter(car => car.score >= 0)
      .sort((a, b) => b.score - a.score);
    
    setResults(scoredCars);
    setStep(5);
  };

  // Usage options
  const usageOptions = [
    { icon: MapPin, label: 'Daily city driving', value: 'Daily city driving' },
    { icon: Navigation, label: 'Highway trips', value: 'Highway trips' },
    { icon: Mountain, label: 'Hilly terrain', value: 'Hilly terrain' },
    { icon: Users, label: 'Family use', value: 'Family use' },
    { icon: Briefcase, label: 'Business use', value: 'Business use' },
    { icon: Car, label: 'First car', value: 'First car' }
  ];

  // Feature options
  const featureOptions = [
    'Sunroof', '4WD', 'High mileage', 'Low maintenance',
    'Apple CarPlay', '7 seats', 'Good resale value',
    'ABS & Airbags', 'Reverse Camera', 'Keyless Entry'
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress bar - only show for steps 1-4 */}
        {step <= 4 && (
          <>
            <div className="w-full bg-[#d2d2d7] h-1 rounded-full mb-2">
              <div 
                className="bg-[#e8531a] h-1 rounded-full transition-all duration-500"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
            <p className="text-[#6e6e73] text-sm mb-6">Step {step} of 4</p>
          </>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-semibold mb-3">What is your budget?</h1>
              <p className="text-[#6e6e73]">We will only show cars within your range</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1d1d1f] mb-8">
                {formatPrice(budget)}
              </p>
              
              <div className="relative mb-8">
                <input
                  type="range"
                  min="500000"
                  max="20000000"
                  step="100000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-[#d2d2d7] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#e8531a] [&::-webkit-slider-thumb]:shadow"
                />
                <div className="flex justify-between text-sm text-[#6e6e73] mt-2">
                  <span>Rs. 5 Lakh</span>
                  <span>Rs. 2 Crore</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {budgetRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => handleBudgetSelect(range.min, range.max)}
                  className="border border-[#d2d2d7] rounded-full py-2.5 px-3 text-xs sm:text-sm hover:bg-[#f5f5f7] transition-colors whitespace-nowrap"
                >
                  {range.label}
                </button>
              ))}
            </div>
            
            <Button 
              onClick={() => setStep(2)}
              className="w-full bg-[#1d1d1f] text-white rounded-xl py-4 font-medium hover:bg-[#e8531a]"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-semibold mb-3">How will you use the car?</h1>
              <p className="text-[#6e6e73]">Select all that apply</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {usageOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card 
                    key={option.value}
                    className={`cursor-pointer border rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${
                      usage.includes(option.value) 
                        ? 'border-2 border-[#e8531a] bg-[#fff8f5]' 
                        : 'border-[#d2d2d7]'
                    }`}
                    onClick={() => toggleUsage(option.value)}
                  >
                    <Icon 
                      className={`mb-3 ${
                        usage.includes(option.value) 
                          ? 'text-[#e8531a]' 
                          : 'text-[#6e6e73]'
                      }`} 
                      size={28} 
                    />
                    <span className="text-sm font-medium text-[#1d1d1f] text-center">
                      {option.label}
                    </span>
                  </Card>
                );
              })}
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => setStep(1)}
                className="text-[#6e6e73] text-sm hover:text-[#1d1d1f]"
              >
                Back
              </button>
              <Button 
                onClick={() => setStep(3)}
                className="bg-[#1d1d1f] text-white rounded-xl py-4 px-8 font-medium hover:bg-[#e8531a]"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-semibold mb-3">Your preferences</h1>
              <p className="text-[#6e6e73]">Help us narrow down your options</p>
            </div>
            
            <div className="space-y-8">
              <div>
                <Label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
                  Fuel Type
                </Label>
                <div className="flex flex-wrap gap-3">
                  {['Petrol', 'Diesel', 'Electric', 'No preference'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFuelType(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        fuelType === type
                          ? 'bg-[#1d1d1f] text-white'
                          : 'bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
                  Transmission
                </Label>
                <div className="flex flex-wrap gap-3">
                  {['Manual', 'Automatic', 'No preference'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTransmission(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        transmission === type
                          ? 'bg-[#1d1d1f] text-white'
                          : 'bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
                  Must-have features
                </Label>
                <div className="flex flex-wrap gap-3">
                  {featureOptions.map((feature) => (
                    <button
                      key={feature}
                      onClick={() => toggleFeature(feature)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        features.includes(feature)
                          ? 'border border-[#e8531a] bg-[#fff8f5] text-[#e8531a]'
                          : 'border border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => setStep(2)}
                className="text-[#6e6e73] text-sm hover:text-[#1d1d1f]"
              >
                Back
              </button>
              <Button 
                onClick={() => setStep(4)}
                className="bg-[#1d1d1f] text-white rounded-xl py-4 px-8 font-medium hover:bg-[#e8531a]"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-semibold mb-3">What matters most to you?</h1>
              <p className="text-[#6e6e73]">Drag to reorder — most important at top</p>
            </div>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <Card 
                  key={item.id}
                  className="border border-[#d2d2d7] rounded-xl p-4 flex items-center"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  onTouchStart={(e) => handleTouchStart(e, index)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleDragEnd}
                  data-index={index}
                  style={{
                    cursor: 'grab',
                    userSelect: 'none',
                  }}
                >
                  <GripVertical className="text-[#d2d2d7] mr-3" size={20} />
                  <span className="text-[#1d1d1f] flex-1">{item.label}</span>
                  <div className="bg-[#f5f5f7] w-5 h-5 rounded-full flex items-center justify-center text-[#6e6e73] text-xs">
                    {index + 1}
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => setStep(3)}
                className="text-[#6e6e73] text-sm hover:text-[#1d1d1f]"
              >
                Back
              </button>
              <Button 
                onClick={getResults}
                className="bg-[#e8531a] text-white rounded-xl py-4 px-8 font-medium hover:bg-[#e8531a]/90"
              >
                Find My Car
              </Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-3xl font-semibold mb-3">Your Perfect Matches</h1>
              <p className="text-[#6e6e73]">Based on your budget and preferences</p>
            </div>
            
            {results.length > 0 ? (
              <>
                {/* Featured match */}
                <Card className="border border-[#d2d2d7] rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/5">
                        <img 
                          src={results[0].images[0]} 
                          alt={results[0].name} 
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-3/5 p-6">
                        <span className="text-[#e8531a] text-xs font-medium uppercase tracking-wider">
                          Best Match
                        </span>
                        <h3 className="text-2xl font-semibold mt-1 mb-2">{results[0].name} {results[0].variant}</h3>
                        <p className="text-[#e8531a] text-xl font-semibold mb-4">
                          {formatPrice(results[0].ex_showroom_price)}
                        </p>
                        
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center">
                            <Check className="text-[#e8531a] mr-2" size={16} />
                            <span className="text-sm">Within your budget</span>
                          </div>
                          <div className="flex items-center">
                            <Check className="text-[#e8531a] mr-2" size={16} />
                            <span className="text-sm">
                              {transmission === 'No preference' ? 'Available in both manual and automatic' : `${transmission} transmission`}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Check className="text-[#e8531a] mr-2" size={16} />
                            <span className="text-sm">Perfect for your usage needs</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <Button className="bg-[#1d1d1f] text-white rounded-lg px-6 hover:bg-[#e8531a]">
                            View Details
                          </Button>
                          <Button variant="outline" className="border border-[#d2d2d7] rounded-lg px-6">
                            Calculate EMI
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Other matches */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.slice(1, 3).map((car, index) => (
                    <Card key={car.id} className="border border-[#d2d2d7] rounded-2xl overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="w-1/3">
                            <img 
                              src={car.images[0]} 
                              alt={car.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="w-2/3 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{car.name}</h4>
                                <p className="text-sm text-[#6e6e73]">{car.brand}</p>
                              </div>
                              <span className="text-[#e8531a] text-sm font-medium">
                                {90 - (index * 5)}% match
                              </span>
                            </div>
                            <p className="text-[#e8531a] font-semibold mt-2">
                              {formatPrice(car.ex_showroom_price)}
                            </p>
                            <Button size="sm" variant="outline" className="mt-3 border border-[#d2d2d7] rounded-lg">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Other cars you might like */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Other cars you might like</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockCars.slice(0, 4).map((car) => (
                      <Card key={car.id} className="border border-[#d2d2d7] rounded-xl overflow-hidden hover:translate-y-[-2px] transition-transform">
                        <CardContent className="p-0 flex">
                          <div className="w-32">
                            <img 
                              src={car.images[0]} 
                              alt={car.name} 
                              className="w-full h-full object-cover rounded-l-xl"
                            />
                          </div>
                          <div className="p-4 flex-1">
                            <p className="text-xs uppercase text-[#6e6e73] tracking-wider mb-1">{car.brand}</p>
                            <h4 className="font-semibold text-[#1d1d1f] mb-1">{car.name}</h4>
                            <p className="text-[#e8531a] font-semibold text-sm mb-1">
                              {formatPrice(car.ex_showroom_price)}
                            </p>
                            <p className="text-[#6e6e73] text-xs mb-2">88% match</p>
                            <a href="#" className="text-[#e8531a] text-xs hover:underline">
                              View Details
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                {/* Action row */}
                <div className="flex justify-between items-center pt-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="text-[#6e6e73] text-sm hover:text-[#1d1d1f]"
                  >
                    Start Over
                  </button>
                  <Button variant="outline" className="border border-[#d2d2d7] rounded-lg">
                    Compare top 3
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#6e6e73] mb-6">
                  No exact matches found. Here are the closest options to your budget.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockCars.slice(0, 2).map((car) => (
                    <Card key={car.id} className="border border-[#d2d2d7] rounded-2xl overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="w-1/3">
                            <img 
                              src={car.images[0]} 
                              alt={car.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="w-2/3 p-4">
                            <h4 className="font-semibold">{car.name}</h4>
                            <p className="text-sm text-[#6e6e73]">{car.brand}</p>
                            <p className="text-[#e8531a] font-semibold mt-2">
                              {formatPrice(car.ex_showroom_price)}
                            </p>
                            <Button size="sm" variant="outline" className="mt-3 border border-[#d2d2d7] rounded-lg">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetFinder;