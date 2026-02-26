"use client";

import { useState, useEffect } from 'react';
import { Battery, Zap, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CarCard from '@/components/CarCard';
import { supabase } from '@/integrations/supabase/client';

const ElectricCars = () => {
  const [electricCars, setElectricCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElectricCars();
  }, []);

  const fetchElectricCars = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('is_electric', true)
      .order('ex_showroom_price');

    if (error) {
      console.error('Error fetching electric cars:', error);
    } else {
      setElectricCars(data);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Electric Cars in Nepal</h1>
        <p className="text-muted-foreground">
          Discover the future of driving with zero emissions and cutting-edge technology
        </p>
      </div>

      {/* EV Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Zero Emissions</h3>
            <p className="text-muted-foreground text-sm">
              Drive clean with no harmful emissions, contributing to cleaner air in Nepal.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Lower Operating Costs</h3>
            <p className="text-muted-foreground text-sm">
              Save significantly on fuel costs with electricity being much cheaper than petrol.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="bg-orange-100 dark:bg-orange-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Battery className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Advanced Technology</h3>
            <p className="text-muted-foreground text-sm">
              Experience cutting-edge features and instant torque for a superior driving experience.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* EV Incentives */}
      <Card className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Leaf className="mr-2 h-5 w-5 text-green-600" />
            Government Incentives for EVs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Available Electric Cars</h2>
        <p className="text-muted-foreground">
          {electricCars.length} models available
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading electric cars...</p>
        </div>
      ) : electricCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {electricCars.map(car => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No electric cars available at the moment.</p>
        </div>
      )}

      {/* Charging Information */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Charging Your EV in Nepal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Home Charging</h4>
              <p className="text-muted-foreground text-sm">
                Most EV owners charge at home using a standard electrical outlet or a dedicated charging point.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Public Charging</h4>
              <p className="text-muted-foreground text-sm">
                Growing network of public charging stations in Kathmandu, Pokhara, and other major cities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Charging Time</h4>
              <p className="text-muted-foreground text-sm">
                Charging time varies from 30 minutes (fast charging) to 8-12 hours (home charging).
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline">
              Find Charging Stations Near You
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectricCars;