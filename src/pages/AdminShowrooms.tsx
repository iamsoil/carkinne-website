"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

const AdminShowrooms = () => {
  const [showrooms, setShowrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingShowroom, setEditingShowroom] = useState<any>(null);
  const [formData, setFormData] = useState({
    brand: '',
    name: '',
    address: '',
    city: '',
    phone: '',
    working_hours: '',
    google_maps_url: '',
    is_featured: false,
    is_authorized: true
  });
  const [message, setMessage] = useState<{type: string, text: string} | null>(null);

  const brands = ['Suzuki', 'Toyota', 'Hyundai', 'Kia', 'MG', 'Honda', 'Nissan', 'BYD', 'Other'];
  const cities = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 'Butwal', 'Chitwan', 'Dharan', 'Other'];

  useEffect(() => {
    fetchShowrooms();
  }, []);

  const fetchShowrooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('showrooms')
        .select('*')
        .order('city');
      
      if (error) throw error;
      setShowrooms(data || []);
    } catch (error) {
      console.error('Error fetching showrooms:', error);
      setMessage({type: 'error', text: 'Failed to load showrooms'});
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('showrooms')
        .update({ is_featured: !isFeatured })
        .eq('id', id);
      
      if (error) throw error;
      fetchShowrooms();
      setMessage({type: 'success', text: 'Showroom featured status updated'});
    } catch (error) {
      console.error('Error updating showroom:', error);
      setMessage({type: 'error', text: 'Failed to update showroom status'});
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this showroom?')) return;
    
    try {
      const { error } = await supabase
        .from('showrooms')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchShowrooms();
      setMessage({type: 'success', text: 'Showroom deleted successfully'});
    } catch (error) {
      console.error('Error deleting showroom:', error);
      setMessage({type: 'error', text: 'Failed to delete showroom'});
    }
  };

  const handleEdit = (showroom: any) => {
    setEditingShowroom(showroom);
    setFormData({
      brand: showroom.brand || '',
      name: showroom.name || '',
      address: showroom.address || '',
      city: showroom.city || '',
      phone: showroom.phone || '',
      working_hours: showroom.working_hours || '',
      google_maps_url: showroom.google_maps_url || '',
      is_featured: showroom.is_featured || false,
      is_authorized: showroom.is_authorized !== undefined ? showroom.is_authorized : true
    });
    setView('form');
  };

  const handleAddNew = () => {
    setEditingShowroom(null);
    setFormData({
      brand: '',
      name: '',
      address: '',
      city: '',
      phone: '',
      working_hours: '',
      google_maps_url: '',
      is_featured: false,
      is_authorized: true
    });
    setView('form');
  };

  const handleCancel = () => {
    setView('list');
    setEditingShowroom(null);
    setMessage(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingShowroom) {
        const { error } = await supabase
          .from('showrooms')
          .update(formData)
          .eq('id', editingShowroom.id);
        
        if (error) throw error;
        setMessage({type: 'success', text: 'Showroom updated successfully'});
      } else {
        const { error } = await supabase
          .from('showrooms')
          .insert([formData]);
        
        if (error) throw error;
        setMessage({type: 'success', text: 'Showroom created successfully'});
        
        // Reset form
        setFormData({
          brand: '',
          name: '',
          address: '',
          city: '',
          phone: '',
          working_hours: '',
          google_maps_url: '',
          is_featured: false,
          is_authorized: true
        });
      }
      
      fetchShowrooms();
      setView('list');
    } catch (error) {
      console.error('Error saving showroom:', error);
      setMessage({type: 'error', text: 'Failed to save showroom'});
    }
  };

  if (view === 'form') {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#1d1d1f]">
              {editingShowroom ? 'Edit Showroom' : 'Add New Showroom'}
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
                  Brand *
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Working Hours
                </label>
                <input
                  type="text"
                  name="working_hours"
                  value={formData.working_hours}
                  onChange={handleChange}
                  placeholder="Sun-Fri 9:00am-6:00pm"
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Google Maps URL
                </label>
                <input
                  type="text"
                  name="google_maps_url"
                  value={formData.google_maps_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  id="is_featured"
                  className="h-4 w-4 text-[#e8531a] border-[#d2d2d7] rounded focus:ring-[#e8531a]"
                />
                <label htmlFor="is_featured" className="ml-2 text-sm text-[#1d1d1f]">
                  Show on Homepage
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_authorized"
                  checked={formData.is_authorized}
                  onChange={handleChange}
                  id="is_authorized"
                  className="h-4 w-4 text-[#e8531a] border-[#d2d2d7] rounded focus:ring-[#e8531a]"
                />
                <label htmlFor="is_authorized" className="ml-2 text-sm text-[#1d1d1f]">
                  Is Authorized Dealer
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#e8531a] text-white rounded-lg py-3 font-medium hover:bg-[#e8531a]/90"
            >
              Save Showroom
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
          <h1 className="text-2xl font-bold text-[#1d1d1f]">Showrooms</h1>
          <button
            onClick={handleAddNew}
            className="flex items-center bg-[#e8531a] text-white px-4 py-2 rounded-lg hover:bg-[#e8531a]/90"
          >
            <Plus size={16} className="mr-1" />
            Add Showroom
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
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Brand</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">City</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Phone</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Featured</th>
                    <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {showrooms.map((showroom) => (
                    <tr 
                      key={showroom.id} 
                      className="border-b border-[#d2d2d7] hover:bg-[#f5f5f7]"
                    >
                      <td className="py-3 px-4">{showroom.brand}</td>
                      <td className="py-3 px-4 font-medium">{showroom.name}</td>
                      <td className="py-3 px-4">{showroom.city}</td>
                      <td className="py-3 px-4">{showroom.phone}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleFeatured(showroom.id, showroom.is_featured)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            showroom.is_featured
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {showroom.is_featured ? 'Featured' : 'Not Featured'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(showroom)}
                            className="border border-[#d2d2d7] rounded-lg px-3 py-1 text-sm flex items-center hover:bg-[#f5f5f7]"
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(showroom.id)}
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
            
            {showrooms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#6e6e73]">No showrooms found</p>
                <button
                  onClick={handleAddNew}
                  className="mt-4 text-[#e8531a] hover:underline"
                >
                  Add your first showroom
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminShowrooms;