import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Car } from 'lucide-react';

const BudgetFinder = () => {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [seating, setSeating] = useState('');
  const [transmission, setTransmission] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // In a real app, this would call an API to get recommendations
      // For now, we'll use sample data
      setResults([
        {
          id: 1,
          name: 'Suzuki Swift',
          brand: 'Suzuki',
          variant: 'VXI MT',
          exShowroomPrice: 2650000,
          image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop',
          fuelType: 'Petrol',
          transmission: 'Manual',
          seating: 5
        },
        {
          id: 2,
          name: 'Hyundai Creta',
          brand: 'Hyundai',
          variant: 'SX(O) Turbo DCT',
          exShowroomPrice: 5200000,
          image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop',
          fuelType: 'Petrol',
          transmission: 'Automatic',
          seating: 5
        },
        {
          id: 3,
          name: 'Kia Sonet',
          brand: 'Kia',
          variant: 'HTX Plus',
          exShowroomPrice: 4100000,
          image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop',
          fuelType: 'Petrol',
          transmission: 'Automatic',
          seating: 5
        }
      ]);
      setStep(6);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setBudget('');
    setFuelType('');
    setSeating('');
    setTransmission('');
    setCategory('');
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Find Your Perfect Car</h1>
            <p className="text-muted-foreground">Answer a few questions and we'll recommend the best cars for you</p>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <div 
                  key={num} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= num ? 'bg-orange-500 text-white' : 'bg-muted'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${(step - 1) * 25}%` }}
              ></div>
            </div>
          </div>
          
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">What's your budget?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <RadioGroup value={budget} onValueChange={setBudget}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0-20" id="0-20" />
                      <Label htmlFor="0-20">Under Rs. 20 Lakhs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="20-40" id="20-40" />
                      <Label htmlFor="20-40">Rs. 20 - 40 Lakhs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="40-60" id="40-60" />
                      <Label htmlFor="40-60">Rs. 40 - 60 Lakhs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="60+" id="60+" />
                      <Label htmlFor="60+">Above Rs. 60 Lakhs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="any" />
                      <Label htmlFor="any">Any budget</Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="pt-4">
                    <Label htmlFor="custom-budget">Or enter custom budget</Label>
                    <Input 
                      id="custom-budget" 
                      type="number" 
                      placeholder="Enter amount in Rs." 
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">What type of fuel do you prefer?</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={fuelType} onValueChange={setFuelType}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="petrol" id="petrol" className="sr-only" />
                      <Label htmlFor="petrol" className="cursor-pointer">
                        <Fuel className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>Petrol</span>
                      </Label>
                    </div>
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="diesel" id="diesel" className="sr-only" />
                      <Label htmlFor="diesel" className="cursor-pointer">
                        <Fuel className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>Diesel</span>
                      </Label>
                    </div>
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="electric" id="electric" className="sr-only" />
                      <Label htmlFor="electric" className="cursor-pointer">
                        <Zap className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>Electric</span>
                      </Label>
                    </div>
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="hybrid" id="hybrid" className="sr-only" />
                      <Label htmlFor="hybrid" className="cursor-pointer">
                        <Fuel className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>Hybrid</span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}
          
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">How many people will travel?</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={seating} onValueChange={setSeating}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="2" id="2" className="sr-only" />
                      <Label htmlFor="2" className="cursor-pointer">
                        <Users className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>2 People</span>
                      </Label>
                    </div>
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="4" id="4" className="sr-only" />
                      <Label htmlFor="4" className="cursor-pointer">
                        <Users className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>4 People</span>
                      </Label>
                    </div>
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="5" id="5" className="sr-only" />
                      <Label htmlFor="5" className="cursor-pointer">
                        <Users className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>5+ People</span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}
          
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Transmission Preference</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={transmission} onValueChange={setTransmission}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="manual" id="manual" className="sr-only" />
                      <Label htmlFor="manual" className="cursor-pointer">
                        <Gauge className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>Manual</span>
                      </Label>
                    </div>
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="automatic" id="automatic" className="sr-only" />
                      <Label htmlFor="automatic" className="cursor-pointer">
                        <Gauge className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>Automatic</span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}
          
          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">What type of car do you need?</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={category} onValueChange={setCategory}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="hatchback" id="hatchback" className="sr-only" />
                      <Label htmlFor="hatchback" className="cursor-pointer">
                        <Car className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>Hatchback</span>
                      </Label>
                    </div>
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="sedan" id="sedan" className="sr-only" />
                      <Label htmlFor="sedan" className="cursor-pointer">
                        <Car className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>Sedan</span>
                      </Label>
                    </div>
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="suv" id="suv" className="sr-only" />
                      <Label htmlFor="suv" className="cursor-pointer">
                        <Car className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>SUV</span>
                      </Label>
                    </div>
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="muv" id="muv" className="sr-only" />
                      <Label htmlFor="muv" className="cursor-pointer">
                        <Car className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>MUV</span>
                      </Label>
                    </div>
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="van" id="van" className="sr-only" />
                      <Label htmlFor="van" className="cursor-pointer">
                        <Car className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>Van</span>
                      </Label>
                    </div>
                    <div className="border rounded-lg p-4 text-center cursor-pointer data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-50">
                      <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                      <Label htmlFor="pickup" className="cursor-pointer">
                        <Car className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <span>Pickup</span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}
          
          {step === 6 && (
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-center">Your Recommendations</CardTitle>
                  <p className="text-center text-muted-foreground">Based on your preferences, here are the best cars for you</p>
                </CardHeader>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((car) => (
                  <Card key={car.id} className="overflow-hidden">
                    <div className="relative">
                      <img 
                        src={car.image} 
                        alt={car.name} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-sm font-medium">
                        {car.brand}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg">{car.name} {car.variant}</h3>
                      <p className="text-orange-500 font-bold text-xl">
                        Rs.{car.exShowroomPrice.toLocaleString()}
                      </p>
                      <div className="flex justify-between text-sm mt-3">
                        <span>{car.fuelType}</span>
                        <span>{car.transmission}</span>
                        <span>{car.seating} Seats</span>
                      </div>
                      <Button className="w-full mt-4">View Details</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            {step > 1 && step < 6 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            
            {step < 6 && (
              <Button 
                className="ml-auto" 
                onClick={handleNext}
                disabled={
                  (step === 1 && !budget) ||
                  (step === 2 && !fuelType) ||
                  (step === 3 && !seating) ||
                  (step === 4 && !transmission) ||
                  (step === 5 && !category)
                }
              >
                {step === 5 ? 'Get Recommendations' : 'Next'}
              </Button>
            )}
            
            {step === 6 && (
              <Button className="ml-auto" onClick={resetQuiz}>
                Start Over
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetFinder;