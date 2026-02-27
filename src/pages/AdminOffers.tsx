"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

const AdminOffers = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    car_name: '',
    offer_type: 'Festival Offer',
    discount_text: '',
    discount_amount: 0,
    valid_until: '',
    image_url: '',
    show_on_homepage: false,
    is_active: true
  });
  const [message, setMessage] = useState<{type: string, text: string} | null>(null);

  const offerTypes = [
    'Festival Offer', 
    'Exchange Offer', 
    'Finance Offer', 
    'Free Accessories', 
    'EV Special'
  ];

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setMessage({type: 'error', text: 'Failed to load offers'});
    } finally {
      setLoading(false);
    }
  };

  const toggleHomepage = async (id: string, showOnHomepage: boolean) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ show_on_homepage: !showOnHomepage })
        .eq('id', id);
      
      if (error) throw error;
      fetchOffers();
      setMessage({type: 'success', text: 'Offer homepage status updated'});
    } catch (error) {
      console.error('Error updating offer:', error);
      setMessage({type: 'error', text: 'Failed to update offer status'});
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchOffers();
      setMessage({type: 'success', text: 'Offer deleted successfully'});
    } catch (error) {
      console.error('Error deleting offer:', error);
      setMessage({type: 'error', text: 'Failed to delete offer'});
    }
  };

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title || '',
      car_name: offer.car_name || '',
      offer_type: offer.offer_type || 'Festival Offer',
      discount_text: offer.discount_text || '',
      discount_amount: offer.discount_amount || 0,
      valid_until: offer.valid_until || '',
      image_url: offer.image_url || '',
      show_on_homepage: offer.show_on_homepage || false,
      is_active: offer.is_active !== undefined ? offer.is_active : true
    });
    setView('form');
  };

  const handleAddNew = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      car_name: '',
      offer_type: 'Festival Offer',
      discount_text: '',
      discount_amount: 0,
      valid_until: '',
      image_url: '',
      show_on_homepage: false,
      is_active: true
    });
    setView('form');
  };

  const handleCancel = () => {
    setView('list');
    setEditingOffer(null);
    setMessage(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    const numberValue = type === 'number' ? Number(value) : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? numberValue : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingOffer) {
        const { error } = await supabase
          .from('offers')
          .update(formData)
          .eq('id', editingOffer.id);
        
        if (error) throw error;
        setMessage({type: 'success', text: 'Offer updated successfully'});
      } else {
        const { error } = await supabase
          .from('offers')
          .insert([formData]);
        
        if (error) throw error;
        setMessage({type: 'success', text: 'Offer created successfully'});
        
        // Reset form
        setFormData({
          title: '',
          car_name: '',
          offer_type: 'Festival Offer',
          discount_text: '',
          discount_amount: 0,
          valid_until: '',
          image_url: '',
          show_on_homepage: false,
          is_active: true
        });
      }
      
      fetchOffers();
      setView('list');
    } catch (error) {
      console.error('Error saving offer:', error);
      setMessage({type: 'error', text: 'Failed to save offer'});
    }
  };

  if (view === 'form') {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#1d1d1f]">
              {editingOffer ? 'Edit Offer' : 'Add New Offer'}
            </h1>
            <button
              onClick={handleCancel}
              className="flex items-center text-[#6e6e73] hover:text-[#1d1d1f]"
            >
              <X size={20} className="mr-1" />
              Cancel
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white border border-[#d2d2d7] rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Car Name *
                </label>
                <input
                  type="text"
                  name="car_name"
                  value={formData.car_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Offer Type *
                </label>
                <select
                  name="offer_type"
                  value={formData.offer_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                >
                  {offerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Discount Text *
                </label>
                <input
                  type="text"
                  name="discount_text"
                  value={formData.discount_text}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Save Rs. 2,00,000 or Free charger"
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Discount Amount
                </label>
                <input
                  type="number"
                  name="discount_amount"
                  value={formData.discount_amount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Valid Until *
                </label>
                <input
                  type="date"
                  name="valid_until"
                  value={formData.valid_until}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                />
                {formData.image_url && (
                  <div className="mt-3">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="h-32 object-cover rounded-lg border border-[#d2d2d7]"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="show_on_homepage"
                  checked={formData.show_on_homepage}
                  onChange={handleChange}
                  id="show_on_homepage"
                  className="h-4 w-4 text-[#e8531a] border-[#d2d2d7] rounded focus:ring-[#e8531a]"
                />
                <label htmlFor="show_on_homepage" className="ml-2 text-sm text-[#1d1d1f]">
                  Show on Homepage
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  id="is_active"
                  className="h-4 w-4 text-[#e8531a] border-[#d2d2d7] rounded focus:ring-[#e8531a]"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-[#1d1d1f]">
                  Is Active
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#e8531a] text-white rounded-lg py-3 font-medium hover:bg-[#e8531a]/90"
            >
              Save Offer
            </button>
          </form>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1d1d1f]">Offers & Deals</h1>
          <button
            onClick={handleAddNew}
            className="flex items-center bg-[#e8531a] text-white px-4 py-2 rounded-lg hover:bg-[#e8531a]/90"
          >
            <Plus size={16} className="mr-1" />
            Add Offer
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e8531a]"></div>
          </div>
        ) : (
          <div className="bg-white border border-[#d2d2d7] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f5f5f7]">
                  <tr>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Image</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Car</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Discount</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Valid Until</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Homepage</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr 
                      key={offer.id} 
                      className="border-b border-[#d2d2d7] hover:bg-[#f5f5f7]"
                    >
                      <td className="py-3 px-4">
                        {offer.image_url ? (
                          <img 
                            src={offer.image_url} 
                            alt={offer.title} 
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium">{offer.car_name}</td>
                      <td className="py-3 px-4">{offer.title}</td>
                      <td className="py-3 px-4">{offer.offer_type}</td>
                      <td className="py-3 px-4">{offer.discount_text}</td>
                      <td className="py-3 px-4">
                        {offer.valid_until ? format(new Date(offer.valid_until), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleHomepage(offer.id, offer.show_on_homepage)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            offer.show_on_homepage
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {offer.show_on_homepage ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(offer)}
                            className="border border-[#d2d2d7] rounded-lg px-3 py-1 text-sm flex items-center hover:bg-[#f5f5f7]"
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(offer.id)}
                            className="border border-[#ff3b30] text-[#ff3b30] rounded-lg px-3 py-1 text-sm flex items-center hover:bg-[#ff3b30] hover:text-white"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {offers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#6e6e73]">No offers found</p>
                <button
                  onClick={handleAddNew}
                  className="mt-4 text-[#e8531a] hover:underline"
                >
                  Create your first offer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOffers;