"use client";

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AdminCars = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchCars(); // Refresh the list
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Error deleting car');
    }
  };

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('cars')
        .update({ is_featured: !isFeatured })
        .eq('id', id);
      
      if (error) throw error;
      fetchCars(); // Refresh the list
    } catch (error) {
      console.error('Error updating car:', error);
      alert('Error updating car');
    }
  };

  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1d1f]">Manage Cars</h1>
          <p className="text-[#6e6e73]">View and manage all cars</p>
        </div>
        <Link 
          to="/admin/cars/new"
          className="mt-4 md:mt-0 bg-[#e8531a] text-white px-4 py-2 rounded-lg hover:bg-[#e8531a]/90 transition-colors"
        >
          Add New Car
        </Link>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6e6e73]" size={20} />
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#d2d2d7] rounded-lg focus:outline-none focus:border-[#e8531a]"
          />
        </div>
      </div>

      {/* Cars table */}
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
                  <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Brand</th>
                  <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Featured</th>
                  <th className="text-left py-3 px-4 text-[#6e6e73] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car) => (
                  <tr key={car.id} className="border-b border-[#d2d2d7]">
                    <td className="py-3 px-4">
                      {car.images && car.images.length > 0 ? (
                        <img 
                          src={car.images[0]} 
                          alt={car.name} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium">{car.name}</td>
                    <td className="py-3 px-4">{car.brand}</td>
                    <td className="py-3 px-4">{formatPrice(car.ex_showroom_price)}</td>
                    <td className="py-3 px-4">{car.category}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleFeatured(car.id, car.is_featured)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          car.is_featured
                            ? 'bg-[#e8531a] text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {car.is_featured ? 'Featured' : 'Not Featured'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/cars/edit/${car.id}`}
                          className="border border-[#d2d2d7] rounded-lg px-3 py-1 text-sm flex items-center hover:bg-[#f5f5f7]"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(car.id)}
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
          
          {filteredCars.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#6e6e73]">No cars found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCars;