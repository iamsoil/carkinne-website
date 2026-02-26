"use client";

import { useState, useEffect } from 'react';
import { Battery, Zap, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CarCard from '@/components/CarCard';

const ElectricCars = () => {
  const [electricCars, setElectricCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      setElectricCars([
        {
          id: '1',
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
          id: '2',
          name: 'Nexon EV',
          brand: 'Tata',
          variant: 'XZ+',
          ex_showroom_price: 3950000,
          on_road_price: 4400000,
          fuel_type: 'Electric',
          transmission: 'Automatic',
          seating: 5,
          engine_cc: 0,
          is_electric: true,
          is_featured: true,
          is_new: true,
          images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e7e1?auto=format&fit=crop&w=600&h=400'],
          mileage_kmpl: 0,
          battery_range_km: 312
        },
        {
          id: '3',
          name: 'i20 Electric',
          brand: 'Hyundai',
          variant: 'Magnata',
          ex_showroom_price: 4200000,
          on_road_price: 4650000,
          fuel_type: 'Electric',
          transmission: 'Automatic',
          seating: 5,
          engine_cc: 0,
          is_electric: true,
          is_featured: false,
          is_new: true,
          images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e7e1?auto=format&fit=crop&w=600&h=400'],
          mileage_kmpl: 0,
          battery_range_km: 305
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-semibold mb-3">Electric Cars in Nepal</h1>
        <p className="text-muted-foreground max-w-3xl">
          Discover the future of driving with zero emissions and cutting-edge technology
        </p>
      </div>

      {/* EV Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card className="border border-border rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
              <Leaf className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-3">Zero Emissions</h3>
            <p className="text-muted-foreground text-sm">
              Drive clean with no harmful emissions, contributing to cleaner air in Nepal.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-border rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
              <Zap className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-3">Lower Operating Costs</h3>
            <p className="text-muted-foreground text-sm">
              Save significantly on fuel costs with electricity being much cheaper than petrol.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-border rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
              <Battery className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-3">Advanced Technology</h3>
            <p className="text-muted-foreground text-sm">
              Experience cutting-edge features and instant torque for a superior driving experience.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* EV Incentives */}
      <Card className="mb-16 border border-border rounded-2xl bg-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-semibold">
            <Leaf className="mr-3 h-6 w-6 text-accent" />
            Government Incentives for EVs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h4 className="font-semibold mb-2">Tax Benefits</h4>
              <p className="text-muted-foreground text-sm">
                Reduced customs duty and VAT on electric vehicles to promote adoption.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Subsidies</h4>
              <p className="text-muted-foreground text-sm">
                Government subsidies for EV purchases to make them more affordable.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Charging Infrastructure</h4>
              <p className="text-muted-foreground text-sm">
                Expanding public charging stations across major cities in Nepal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Import Facilitation</h4>
              <p className="text-muted-foreground text-sm">
                Streamlined import procedures for electric vehicles and components.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Electric Cars */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-semibold">Available Electric Cars</h2>
        <p className="text-muted-foreground">
          {electricCars.length} models available
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading electric cars...</p>
        </div>
      ) : electricCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {electricCars.map(car => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No electric cars available at the moment.</p>
        </div>
      )}

      {/* Charging Information */}
      <Card className="mt-16 border border-border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Charging Your EV in Nepal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Home Charging</h4>
              <p className="text-muted-foreground text-sm">
                Most EV owners charge at home using a standard electrical outlet or a dedicated charging point.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Public Charging</h4>
              <p className="text-muted-foreground text-sm">
                Growing network of public charging stations in Kathmandu, Pokhara, and other major cities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Charging Time</h4>
              <p className="text-muted-foreground text-sm">
                Charging time varies from 30 minutes (fast charging) to 8-12 hours (home charging).
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button variant="outline" className="border border-border text-foreground hover:bg-foreground hover:text-white rounded-lg">
              Find Charging Stations Near You
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectricCars;