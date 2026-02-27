"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

const Admin = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    blogPosts: 0,
    showrooms: 0,
    featuredCars: 0
  });
  const [recentCars, setRecentCars] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchStats();
    fetchRecentCars();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
    }
  };

  const fetchStats = async () => {
    try {
      const [cars, posts, showrooms, featured] = await Promise.all([
        supabase.from('cars').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('showrooms').select('*', { count: 'exact', head: true }),
        supabase.from('cars').select('*', { count: 'exact', head: true }).eq('is_featured', true),
      ]);
      
      setStats({
        totalCars: cars.count || 0,
        blogPosts: posts.count || 0,
        showrooms: showrooms.count || 0,
        featuredCars: featured.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (!error) {
        setRecentCars(data || []);
      }
    } catch (error) {
      console.error('Error fetching recent cars:', error);
    }
  };

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString('en-IN')}`;
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1d1d1f]">Dashboard</h1>
        <p className="text-[#6e6e73]">Welcome to your admin panel</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-[#d2d2d7] rounded-2xl p-6">
          <p className="text-3xl font-bold text-[#e8531a]">{stats.totalCars}</p>
          <p className="text-[#6e6e73] text-sm mt-1">Total Cars</p>
        </div>
        
        <div className="bg-white border border-[#d2d2d7] rounded-2xl p-6">
          <p className="text-3xl font-bold text-[#e8531a]">{stats.blogPosts}</p>
          <p className="text-[#6e6e73] text-sm mt-1">Blog Posts</p>
        </div>
        
        <div className="bg-white border border-[#d2d2d7] rounded-2xl p-6">
          <p className="text-3xl font-bold text-[#e8531a]">{stats.showrooms}</p>
          <p className="text-[#6e6e73] text-sm mt-1">Showrooms</p>
        </div>
        
        <div className="bg-white border border-[#d2d2d7] rounded-2xl p-6">
          <p className="text-3xl font-bold text-[#e8531a]">{stats.featuredCars}</p>
          <p className="text-[#6e6e73] text-sm mt-1">Featured Cars</p>
        </div>
      </div>

      {/* Recent cars table */}
      <div className="bg-white border border-[#d2d2d7] rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Cars</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#d2d2d7]">
                <th className="text-left py-3 text-[#6e6e73] font-medium">Name</th>
                <th className="text-left py-3 text-[#6e6e73] font-medium">Brand</th>
                <th className="text-left py-3 text-[#6e6e73] font-medium">Price</th>
                <th className="text-left py-3 text-[#6e6e73] font-medium">Category</th>
                <th className="text-left py-3 text-[#6e6e73] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentCars.map((car) => (
                <tr key={car.id} className="border-b border-[#d2d2d7]">
                  <td className="py-3">{car.name}</td>
                  <td className="py-3">{car.brand}</td>
                  <td className="py-3">{formatPrice(car.ex_showroom_price)}</td>
                  <td className="py-3">{car.category}</td>
                  <td className="py-3">
                    <a 
                      href={`/admin/cars/edit/${car.id}`}
                      className="text-[#e8531a] hover:underline"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;