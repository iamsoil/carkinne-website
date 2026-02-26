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
import { Car, Fuel, Gauge, Users } from 'lucide-react';

const Compare = () => {
  const [cars, setCars] = useState([
    {
      id: 1,
      name: 'Suzuki Swift',
      brand: 'Suzuki',
      variant: 'VXI MT',
      exShowroomPrice: 2650000,
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop',
      fuelType: 'Petrol',
      transmission: 'Manual',
      seating: 5,
      engineCC: 1197,
      mileage: 23.5,
      features: ['Power Steering', 'Power Windows', 'Air Conditioning']
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
      seating: 5,
      engineCC: 1482,
      mileage: 16.8,
      features: ['Sunroof', 'Cruise Control', 'Automatic Climate Control']
    }
  ]);

  const addCar = (carId: number) => {
    // In a real app, this would fetch car data from API
    // For now, we'll just duplicate the existing cars
    if (cars.length < 4) {
      const newCar = {
        ...cars[carId - 1],
        id: cars.length + 1,
        name: cars[carId - 1].name + ' (Copy)'
      };
      setCars([...cars, newCar]);
    }
  };

  const removeCar = (index: number) => {
    const newCars = [...cars];
    newCars.splice(index, 1);
    setCars(newCars);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Compare Cars</h1>
          <p className="text-muted-foreground">Compare up to 4 cars side by side</p>
        </div>
        
        {/* Car Selection */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 mb-4">
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select first car" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="swift">Suzuki Swift</SelectItem>
                <SelectItem value="creta">Hyundai Creta</SelectItem>
                <SelectItem value="sonet">Kia Sonet</SelectItem>
                <SelectItem value="city">Honda City</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select second car" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="swift">Suzuki Swift</SelectItem>
                <SelectItem value="creta">Hyundai Creta</SelectItem>
                <SelectItem value="sonet">Kia Sonet</SelectItem>
                <SelectItem value="city">Honda City</SelectItem>
              </SelectContent>
            </Select>
            
            <Button>Add Car to Compare</Button>
          </div>
        </div>
        
        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-1/4 border p-4 text-left">Specification</th>
                {cars.map((car, index) => (
                  <th key={index} className="w-1/4 border p-4">
                    <div className="flex flex-col items-center">
                      <img 
                        src={car.image} 
                        alt={car.name} 
                        className="w-32 h-24 object-cover rounded mb-2"
                      />
                      <h3 className="font-bold">{car.name}</h3>
                      <p className="text-sm text-muted-foreground">{car.variant}</p>
                      <p className="font-bold text-orange-500">Rs.{car.exShowroomPrice.toLocaleString()}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => removeCar(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </th>
                ))}
                {cars.length < 4 && (
                  <th className="w-1/4 border p-4">
                    <Button variant="outline" className="w-full h-full" onClick={() => addCar(1)}>
                      + Add Car
                    </Button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-4 font-medium">Engine</td>
                {cars.map((car, index) => (
                  <td key={index} className="border p-4 text-center">{car.engineCC} cc</td>
                ))}
              </tr>
              <tr>
                <td className="border p-4 font-medium">Fuel Type</td>
                {cars.map((car, index) => (
                  <td key={index} className="border p-4 text-center">
                    <div className="flex items-center justify-center">
                      <Fuel className="h-4 w-4 mr-2 text-orange-500" />
                      {car.fuelType}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border p-4 font-medium">Transmission</td>
                {cars.map((car, index) => (
                  <td key={index} className="border p-4 text-center">
                    <div className="flex items-center justify-center">
                      <Gauge className="h-4 w-4 mr-2 text-orange-500" />
                      {car.transmission}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border p-4 font-medium">Seating Capacity</td>
                {cars.map((car, index) => (
                  <td key={index} className="border p-4 text-center">
                    <div className="flex items-center justify-center">
                      <Users className="h-4 w-4 mr-2 text-orange-500" />
                      {car.seating} Seats
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border p-4 font-medium">Mileage</td>
                {cars.map((car, index) => (
                  <td key={index} className="border p-4 text-center">{car.mileage} kmpl</td>
                ))}
              </tr>
              <tr>
                <td className="border p-4 font-medium">Key Features</td>
                {cars.map((car, index) => (
                  <td key={index} className="border p-4">
                    <ul className="space-y-1">
                      {car.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border p-4 font-medium">EMI (5yr @10%)</td>
                {cars.map((car, index) => (
                  <td key={index} className="border p-4 text-center font-bold">
                    Rs.{Math.round((car.exShowroomPrice * 0.10 / 12) / (1 - Math.pow(1 + 0.10 / 12, -60))).toLocaleString()}/month
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Recommendation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Our Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="font-bold text-lg">Hyundai Creta SX(O) Turbo DCT</h3>
                <p className="text-muted-foreground">Best overall value for money</p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-sm">Better features and comfort</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-sm">Higher resale value</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-sm">More spacious interior</span>
                  </li>
                </ul>
              </div>
              <Button>View Details</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Compare;