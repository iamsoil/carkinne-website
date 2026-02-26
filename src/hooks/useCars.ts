import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Car {
  id: string;
  name: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  variant: string;
  ex_showroom_price: number;
  on_road_price: number;
  price_on_request: boolean;
  engine_cc: number;
  fuel_type: string;
  transmission: string;
  mileage_kmpl: number;
  seating: number;
  colors: string[];
  images: string[];
  features: string[];
  category: string;
  is_electric: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_discontinued: boolean;
  battery_range_km: number;
  source_url: string;
  updated_at: string;
  created_at: string;
}

export const useCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setCars(data as Car[]);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching cars:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return { cars, loading, error };
};

export const useCarBySlug = (slug: string) => {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        
        setCar(data as Car);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching car:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCar();
    }
  }, [slug]);

  return { car, loading, error };
};