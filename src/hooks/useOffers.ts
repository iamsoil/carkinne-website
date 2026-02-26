import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Offer {
  id: string;
  title: string;
  description: string;
  car_id: string;
  discount_amount: number;
  valid_until: string;
  image_url: string;
  offer_type: string;
  is_featured: boolean;
  car?: {
    name: string;
    brand: string;
    image: string;
  };
}

export const useOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('offers')
          .select(`
            *,
            car:cars(name, brand, images)
          `)
          .order('valid_until', { ascending: true });

        if (error) throw error;
        
        // Transform the data to match our interface
        const transformedOffers = data.map(offer => ({
          ...offer,
          car: {
            name: offer.car?.name || '',
            brand: offer.car?.brand || '',
            image: offer.car?.images?.[0] || ''
          }
        }));
        
        setOffers(transformedOffers as Offer[]);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching offers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return { offers, loading, error };
};