"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError('Invalid email or password');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#d2d2d7] p-10 max-w-[420px] w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-black">Car</span>
            <span className="text-[#e8531a]">Kinne</span>
          </h1>
          <p className="text-[#6e6e73] text-sm mt-2">Admin Panel</p>
        </div>
        
        <div className="border-t border-[#d2d2d7] mb-6"></div>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#d2d2d7] rounded-xl px-4 py-3 focus:outline-none focus:border-[#e8531a]"
              required
            />
          </div>
          
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#d2d2d7] rounded-xl px-4 py-3 focus:outline-none focus:border-[#e8531a]"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-[#e8531a] text-white rounded-xl py-3.5 font-medium hover:bg-[#e8531a]/90 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;