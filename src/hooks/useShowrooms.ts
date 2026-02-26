import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Showroom {
  id: string;
  brand: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  latitude: number;
  longitude: number;
  google_maps_url: string;
  working_hours: string;
  is_authorized: boolean;
  rating?: number;
  reviews?: number;
  services?: string[];
}

export const useShowrooms = () => {
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowrooms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('showrooms')
          .select('*')
          .order('city', { ascending: true });

        if (error) throw error;
        
        setShowrooms(data as Showroom[]);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching showrooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowrooms();
  }, []);

  return { showrooms, loading, error };
};