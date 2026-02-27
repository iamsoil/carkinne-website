"use client";

import { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { 
  Home, 
  Car, 
  Plus, 
  FileText, 
  MapPin, 
  Tag, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
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
      const { count: totalCars } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true });
      
      const { count: blogPosts } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });
      
      const { count: showrooms } = await supabase
        .from('showrooms')
        .select('*', { count: 'exact', head: true });
      
      const { count: featuredCars } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true);
      
      setStats({
        totalCars: totalCars || 0,
        blogPosts: blogPosts || 0,
        showrooms: showrooms || 0,
        featuredCars: featuredCars || 0
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin' },
    { id: 'cars', label: 'Cars', icon: Car, path: '/admin/cars' },
    { id: 'add-car', label: 'Add New Car', icon: Plus, path: '/admin/cars/new' },
    { id: 'blog', label: 'Blog Posts', icon: FileText, path: '/admin/blog' },
    { id: 'showrooms', label: 'Showrooms', icon: MapPin, path: '/admin/showrooms' },
    { id: 'offers', label: 'Offers', icon: Tag, path: '/admin/offers' },
  ];

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-[#d2d2d7] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#d2d2d7]">
          <h1 className="text-xl font-bold">
            <span className="text-black">Car</span>
            <span className="text-[#e8531a]">Kinne</span>
          </h1>
          <button 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => {
                  setActiveItem(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center px-4 py-3 rounded-lg mb-1 text-sm font-medium transition-colors ${
                  activeItem === item.id
                    ? 'text-[#e8531a] bg-[#fff8f5]'
                    : 'text-[#6e6e73] hover:bg-[#f5f5f7]'
                }`}
              >
                <Icon size={18} className="mr-3" />
                {item.label}
              </Link>
            );
          })}
          
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-3 rounded-lg mb-1 text-sm font-medium text-[#6e6e73] hover:bg-[#f5f5f7] transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-[#d2d2d7]">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <div className="w-6"></div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-6">
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
                        <Link 
                          to={`/admin/cars/edit/${car.id}`}
                          className="text-[#e8531a] hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;