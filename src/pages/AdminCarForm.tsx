"use client";

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AdminCarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    variant: '',
    category: 'SUV',
    ex_showroom_price: 0,
    on_road_price: 0,
    engine_cc: 0,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    mileage_kmpl: 0,
    seating: 5,
    battery_range_km: 0,
    images: [''],
    features: '',
    is_featured: false,
    is_new: false,
    is_electric: false,
    slug: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: string, text: string} | null>(null);

  useEffect(() => {
    if (isEdit) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setFormData({
        name: data.name || '',
        brand: data.brand || '',
        model: data.model || '',
        year: data.year || new Date().getFullYear(),
        variant: data.variant || '',
        category: data.category || 'SUV',
        ex_showroom_price: data.ex_showroom_price || 0,
        on_road_price: data.on_road_price || 0,
        engine_cc: data.engine_cc || 0,
        fuel_type: data.fuel_type || 'Petrol',
        transmission: data.transmission || 'Manual',
        mileage_kmpl: data.mileage_kmpl || 0,
        seating: data.seating || 5,
        battery_range_km: data.battery_range_km || 0,
        images: data.images || [''],
        features: data.features ? data.features.join(', ') : '',
        is_featured: data.is_featured || false,
        is_new: data.is_new || false,
        is_electric: data.is_electric || false,
        slug: data.slug || ''
      });
    } catch (error) {
      console.error('Error fetching car:', error);
      setMessage({type: 'error', text: 'Error loading car data'});
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' && !isEdit && { slug: generateSlug(value) })
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const carData = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        year: parseInt(formData.year.toString()),
        ex_showroom_price: parseInt(formData.ex_showroom_price.toString()),
        on_road_price: parseInt(formData.on_road_price.toString()),
        engine_cc: parseInt(formData.engine_cc.toString()),
        mileage_kmpl: parseFloat(formData.mileage_kmpl.toString()),
        seating: parseInt(formData.seating.toString()),
        battery_range_km: parseInt(formData.battery_range_km.toString()),
        images: formData.images.filter(img => img)
      };
      
      if (isEdit) {
        const { error } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', id);
        
        if (error) throw error;
        setMessage({type: 'success', text: 'Car updated successfully!'});
      } else {
        const { error } = await supabase
          .from('cars')
          .insert([carData]);
        
        if (error) throw error;
        setMessage({type: 'success', text: 'Car created successfully!'});
        // Reset form
        setFormData({
          name: '',
          brand: '',
          model: '',
          year: new Date().getFullYear(),
          variant: '',
          category: 'SUV',
          ex_showroom_price: 0,
          on_road_price: 0,
          engine_cc: 0,
          fuel_type: 'Petrol',
          transmission: 'Manual',
          mileage_kmpl: 0,
          seating: 5,
          battery_range_km: 0,
          images: [''],
          features: '',
          is_featured: false,
          is_new: false,
          is_electric: false,
          slug: ''
        });
      }
    } catch (error) {
      console.error('Error saving car:', error);
      setMessage({type: 'error', text: 'Error saving car. Please try again.'});
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e8531a]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1d1d1f]">
          {isEdit ? 'Edit Car' : 'Add New Car'}
        </h1>
        <p className="text-[#6e6e73]">
          {isEdit ? 'Update car details' : 'Add a new car to the inventory'}
        </p>
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
              Car Name *
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
              Brand *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Model
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Variant
            </label>
            <input
              type="text"
              name="variant"
              value={formData.variant}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
            >
              <option value="Hatchback">Hatchback</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="MPV">MPV</option>
              <option value="Pickup">Pickup</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Ex-showroom Price *
            </label>
            <input
              type="number"
              name="ex_showroom_price"
              value={formData.ex_showroom_price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              On-road Price
            </label>
            <input
              type="number"
              name="on_road_price"
              value={formData.on_road_price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Engine CC
            </label>
            <input
              type="number"
              name="engine_cc"
              value={formData.engine_cc}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Fuel Type
            </label>
            <select
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Transmission
            </label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
            >
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Mileage (kmpl)
            </label>
            <input
              type="number"
              step="0.1"
              name="mileage_kmpl"
              value={formData.mileage_kmpl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Seating Capacity
            </label>
            <input
              type="number"
              name="seating"
              value={formData.seating}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
            />
          </div>
          
          {formData.fuel_type === 'Electric' && (
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                Battery Range (km)
              </label>
              <input
                type="number"
                name="battery_range_km"
                value={formData.battery_range_km}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
            Features (comma separated)
          </label>
          <input
            type="text"
            name="features"
            value={formData.features}
            onChange={handleChange}
            placeholder="ABS, Airbags, Sunroof, etc."
            className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
            Image URLs
          </label>
          {formData.images.map((image, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Add Image
          </button>
        </div>
        
        {formData.images[0] && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Image Preview
            </label>
            <img 
              src={formData.images[0]} 
              alt="Preview" 
              className="w-64 h-48 object-cover rounded-lg border border-[#d2d2d7]"
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              Is Featured
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_new"
              checked={formData.is_new}
              onChange={handleChange}
              id="is_new"
              className="h-4 w-4 text-[#e8531a] border-[#d2d2d7] rounded focus:ring-[#e8531a]"
            />
            <label htmlFor="is_new" className="ml-2 text-sm text-[#1d1d1f]">
              Is New
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_electric"
              checked={formData.is_electric}
              onChange={handleChange}
              id="is_electric"
              className="h-4 w-4 text-[#e8531a] border-[#d2d2d7] rounded focus:ring-[#e8531a]"
            />
            <label htmlFor="is_electric" className="ml-2 text-sm text-[#1d1d1f]">
              Is Electric
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/cars')}
            className="px-6 py-2 border border-[#d2d2d7] text-[#1d1d1f] rounded-lg hover:bg-[#f5f5f7]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#e8531a] text-white rounded-lg hover:bg-[#e8531a]/90 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Car' : 'Add Car')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCarForm;