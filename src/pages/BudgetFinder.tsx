"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CarCard from '@/components/CarCard';

const BudgetFinder = () => {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState<[number, number]>([2000000, 4000000]);
  const [category, setCategory] = useState('any');
  const [fuelType, setFuelType] = useState('any');
  const [seating, setSeating] = useState('any');
  const [transmission, setTransmission] = useState('any');
  const [results, setResults] = useState<any[]>([]);

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // In a real app, this would call an API to get recommendations
      // For now, we'll use mock data
      setResults([
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
          id: '3',
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
        }
      ]);
      setStep(6);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setBudget([2000000, 4000000]);
    setCategory('any');
    setFuelType('any');
    setSeating('any');
    setTransmission('any');
    setResults([]);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-semibold mb-3">Find Your Perfect Car</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Answer a few questions and we'll recommend the best cars for your needs
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {step < 6 ? (
          <Card className="border border-border rounded-2xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-semibold">
                  {step === 1 && "What's your budget?"}
                  {step === 2 && "What type of car do you need?"}
                  {step === 3 && "Fuel preference?"}
                  {step === 4 && "Seating capacity?"}
                  {step === 5 && "Transmission preference?"}
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  Step {step} of 5
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-secondary rounded-full h-2 mt-6">
                <div 
                  className="bg-accent h-2 rounded-full" 
                  style={{ width: `${(step / 5) * 100}%` }}
                ></div>
              </div>
            </CardHeader>
            
            <CardContent>
              {step === 1 && (
                <div className="space-y-8">
                  <div>
                    <Label className="mb-5 block text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Budget Range: Rs.{budget[0].toLocaleString('en-IN')} - Rs.{budget[1].toLocaleString('en-IN')}
                    </Label>
                    <Slider
                      min={500000}
                      max={15000000}
                      step={100000}
                      value={budget}
                      onValueChange={setBudget}
                      minStepsBetweenThumbs={1}
                      className="mt-8"
                    />
                    <div className="flex justify-between mt-3">
                      <span className="text-sm">Rs.5L</span>
                      <span className="text-sm">Rs.1.5Cr</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <Button 
                      variant="outline" 
                      onClick={() => setBudget([500000, 2000000])}
                      className="border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg"
                    >
                      Under 20L
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setBudget([2000000, 4000000])}
                      className="border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg"
                    >
                      20-40L
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setBudget([4000000, 6000000])}
                      className="border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg"
                    >
                      40-60L
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setBudget([6000000, 15000000])}
                      className="border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg"
                    >
                      60L+
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-6">
                  <RadioGroup value={category} onValueChange={setCategory}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="any" id="category-any" className="border border-border" />
                      <Label htmlFor="category-any">Any Category</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="suv" id="category-suv" className="border border-border" />
                      <Label htmlFor="category-suv">SUV</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="sedan" id="category-sedan" className="border border-border" />
                      <Label htmlFor="category-sedan">Sedan</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="hatchback" id="category-hatchback" className="border border-border" />
                      <Label htmlFor="category-hatchback">Hatchback</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="muv" id="category-muv" className="border border-border" />
                      <Label htmlFor="category-muv">MUV</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-6">
                  <RadioGroup value={fuelType} onValueChange={setFuelType}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="any" id="fuel-any" className="border border-border" />
                      <Label htmlFor="fuel-any">Any Fuel Type</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="petrol" id="fuel-petrol" className="border border-border" />
                      <Label htmlFor="fuel-petrol">Petrol</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="diesel" id="fuel-diesel" className="border border-border" />
                      <Label htmlFor="fuel-diesel">Diesel</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="electric" id="fuel-electric" className="border border-border" />
                      <Label htmlFor="fuel-electric">Electric</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="hybrid" id="fuel-hybrid" className="border border-border" />
                      <Label htmlFor="fuel-hybrid">Hybrid</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              {step === 4 && (
                <div className="space-y-6">
                  <RadioGroup value={seating} onValueChange={setSeating}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="any" id="seating-any" className="border border-border" />
                      <Label htmlFor="seating-any">Any Seating</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="2" id="seating-2" className="border border-border" />
                      <Label htmlFor="seating-2">2 Seater</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="5" id="seating-5" className="border border-border" />
                      <Label htmlFor="seating-5">5 Seater</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="7" id="seating-7" className="border border-border" />
                      <Label htmlFor="seating-7">7 Seater</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              {step === 5 && (
                <div className="space-y-6">
                  <RadioGroup value={transmission} onValueChange={setTransmission}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="any" id="transmission-any" className="border border-border" />
                      <Label htmlFor="transmission-any">Any Transmission</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="manual" id="transmission-manual" className="border border-border" />
                      <Label htmlFor="transmission-manual">Manual</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="automatic" id="transmission-automatic" className="border border-border" />
                      <Label htmlFor="transmission-automatic">Automatic</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              <div className="flex justify-between mt-10">
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={step === 1}
                  className="border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg"
                >
                  Previous
                </Button>
                <Button onClick={nextStep} className="bg-accent hover:bg-accent/90 text-white rounded-lg">
                  {step === 5 ? "Get Recommendations" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-3">Your Perfect Matches</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Based on your preferences, here are the cars we recommend
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {results.map(car => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>
            
            <div className="text-center">
              <Button onClick={resetQuiz} variant="outline" className="border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg">
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetFinder;