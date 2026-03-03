"use client";

import { useState, useEffect, useRef } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(() => {
    return localStorage.getItem('announcement_dismissed') !== 'true'
  });
  const [announcement, setAnnouncement] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Hide header on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  // Focus input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const header = document.querySelector('header');
      if (header && !header.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (!error && data) {
        setAnnouncement(data);
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navItems = [
    { name: 'Cars', href: '/cars' },
    { name: 'Budget Finder', href: '/budget-finder' },
    { name: 'EMI Calculator', href: '/emi-calculator' },
    { name: 'Showrooms', href: '/showrooms' },
    { name: 'EV Cars', href: '/electric-cars' },
    { name: 'Offers', href: '/offers' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${isScrolled ? 'bg-white/85 border-b border-border' : 'bg-white/85'}`}>
      {/* Announcement Bar */}{
        showAnnouncement && announcement && (
          <div 
            className="text-center py-2 text-xs tracking-wide"
            style={{ 
              backgroundColor: announcement.bg_color || '#1d1d1f',
              color: announcement.text_color || '#ffffff'
            }}
          >
            <div className="container mx-auto px-4 flex justify-between items-center">
              <div></div>
              <span>{announcement.message}</span>
              <div className="flex items-center">
                {announcement.link_text && (
                  <a 
                    href={announcement.link_url || '#'} 
                    className="hover:opacity-70 transition-opacity mr-3"
                  >
                    {announcement.link_text}
                  </a>
                )}
                <button 
                  className="hover:opacity-70 transition-opacity"
                  onClick={() => {
                    setShowAnnouncement(false);
                    localStorage.setItem('announcement_dismissed', 'true');
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              <a href="/" className="text-foreground hover:text-accent transition-colors">
                Car<span className="text-accent">Kinne</span>
              </a>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  fontSize: '14px',
                  fontWeight: location.pathname === item.href ? '700' : '500',
                  color: location.pathname === item.href ? '#e8531a' : '#1d1d1f',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => {
                  if (location.pathname !== item.href)
                    e.currentTarget.style.color = '#e8531a'
                }}
                onMouseLeave={e => {
                  if (location.pathname !== item.href)
                    e.currentTarget.style.color = '#1d1d1f'
                }}
              >
                {item.name}
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  width: location.pathname === item.href ? '100%' : '0',
                  background: '#e8531a',
                  transition: 'width 0.3s',
                  borderRadius: '2px',
                }} />
              </a>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#1d1d1f]"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-foreground hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-3 max-w-2xl mx-auto">
                <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search cars, blogs, brands..."
                  className="flex-1 text-base outline-none text-[#1d1d1f] placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#e8531a] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#e8531a]/90 transition-colors flex-shrink-0"
                >
                  Search
                </button>
              </div>

              {/* Quick links below search */}
              <div className="max-w-2xl mx-auto mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-gray-400">
                  Quick:
                </span>
                {['Toyota', 'Hyundai', 'Kia', 'Electric', 'SUV', 'Under 30L'].map(q => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      navigate(`/cars?search=${encodeURIComponent(q)}`);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-xs text-[#e8531a] bg-[#fff8f5] px-3 py-1 rounded-full hover:bg-[#e8531a] hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '8px 0',
                  fontSize: '15px',
                  fontWeight: location.pathname === item.href ? '700' : '500',
                  color: location.pathname === item.href ? '#e8531a' : '#1d1d1f',
                  textDecoration: 'none',
                  borderLeft: location.pathname === item.href ? '3px solid #e8531a' : 'none',
                  paddingLeft: location.pathname === item.href ? '10px' : '0',
                  transition: 'all 0.2s',
                }}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;