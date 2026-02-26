"use client";

import { useState, useEffect } from 'react';
import { Calendar, Tag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const Offers = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('valid_until');

    if (error) {
      console.error('Error fetching offers:', error);
    } else {
      setOffers(data);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (validUntil: string) => {
    const today = new Date();
    const endDate = new Date(validUntil);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredOffers = offers.filter(offer => {
    if (filter === 'all') return true;
    if (filter === 'active') return getDaysRemaining(offer.valid_until) > 0;
    if (filter === 'expiring') return getDaysRemaining(offer.valid_until) <= 7 && getDaysRemaining(offer.valid_until) > 0;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Latest Car Offers</h1>
        <p className="text-muted-foreground">
          Find the best deals and discounts on cars in Nepal
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          onClick={() => setFilter('all')}
        >
          All Offers
        </Button>
        <Button 
          variant={filter === 'active' ? 'default' : 'outline'} 
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button 
          variant={filter === 'expiring' ? 'default' : 'outline'} 
          onClick={() => setFilter('expiring')}
        >
          Expiring Soon
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading offers...</p>
        </div>
      ) : filteredOffers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map(offer => {
            const daysRemaining = getDaysRemaining(offer.valid_until);
            const isActive = daysRemaining > 0;
            
            return (
              <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={offer.image_url || 'https://placehold.co/600x400/f59e0b/ffffff?text=Special+Offer'} 
                    alt={offer.title} 
                    className="w-full h-48 object-cover"
                  />
                  <Badge 
                    className={`absolute top-4 right-4 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    {isActive ? 'Active' : 'Expired'}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-muted-foreground mb-4">{offer.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    {offer.discount_amount > 0 && (
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-orange-500 mr-2" />
                        <p className="font-semibold text-orange-500">
                          Save up to Rs.{offer.discount_amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <p className="text-sm">
                        Valid until: {formatDate(offer.valid_until)}
                      </p>
                    </div>
                    
                    {isActive && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <p className="text-sm">
                          {daysRemaining} days remaining
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline">
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No offers available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Offers;