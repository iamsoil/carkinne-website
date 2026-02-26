import { useState } from 'react';
import { Car, Fuel, Gauge, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice, formatEMI } from '@/utils/formatters';
import { useEMI } from '@/hooks/useEMI';

interface CarSpecs {
  id: string;
  name: string;
  brand: string;
  variant: string;
  exShowroomPrice: number;
  image: string;
  fuelType: string;
  transmission: string;
  seating: number;
  engineCC: number;
  mileage: number;
  features: string[];
  isElectric: boolean;
  batteryRange?: number;
}

interface CarComparisonTableProps {
  cars: CarSpecs[];
  onRemoveCar: (index: number) => void;
  onAddCar: () => void;
}

const CarComparisonTable = ({ cars, onRemoveCar, onAddCar }: CarComparisonTableProps) => {
  const [selectedCars, setSelectedCars] = useState<CarSpecs[]>(cars);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="w-1/4 border p-4 text-left">Specification</th>
            {selectedCars.map((car, index) => (
              <th key={index} className="w-1/4 border p-4">
                <div className="flex flex-col items-center">
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="w-32 h-24 object-cover rounded mb-2"
                  />
                  <h3 className="font-bold">{car.name}</h3>
                  <p className="text-sm text-muted-foreground">{car.variant}</p>
                  <p className="font-bold text-orange-500">{formatPrice(car.exShowroomPrice)}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => onRemoveCar(index)}
                  >
                    Remove
                  </Button>
                </div>
              </th>
            ))}
            {selectedCars.length < 4 && (
              <th className="w-1/4 border p-4">
                <Button variant="outline" className="w-full h-full" onClick={onAddCar}>
                  + Add Car
                </Button>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-4 font-medium">Engine</td>
            {selectedCars.map((car, index) => (
              <td key={index} className="border p-4 text-center">
                {car.isElectric ? 'Electric Motor' : `${car.engineCC} cc`}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-4 font-medium">Fuel Type</td>
            {selectedCars.map((car, index) => (
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
            {selectedCars.map((car, index) => (
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
            {selectedCars.map((car, index) => (
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
            {selectedCars.map((car, index) => (
              <td key={index} className="border p-4 text-center">
                {car.isElectric 
                  ? `${car.batteryRange} km range` 
                  : `${car.mileage} kmpl`}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-4 font-medium">Key Features</td>
            {selectedCars.map((car, index) => (
              <td key={index} className="border p-4">
                <ul className="space-y-1">
                  {car.features.slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {car.features.length > 5 && (
                    <li className="text-sm text-muted-foreground">
                      +{car.features.length - 5} more
                    </li>
                  )}
                </ul>
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-4 font-medium">EMI (5yr @10%)</td>
            {selectedCars.map((car, index) => {
              const emiCalculations = useEMI(car.exShowroomPrice);
              return (
                <td key={index} className="border p-4 text-center font-bold">
                  {formatEMI(emiCalculations.monthlyEMI)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CarComparisonTable;