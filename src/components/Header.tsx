"use client";

import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';

const Header = () => {
  const { isDark, toggleDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [announcement, setAnnouncement] = useState<any>(null);
  const location = useLocation();

  // Hide header on admin pages
  if (location.pathname.startsWith('/admin')) return null;

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
    <header className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${isScrolled ? 'bg-white/85 dark:bg-[#1a1a1a]/85 border-b border-border dark:border-gray-800' : 'bg-white/85 dark:bg-[#1a1a1a]/85'}`}>
      {/* Announcement Bar */}
      {showAnnouncement && announcement && (
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
                onClick={() => setShowAnnouncement(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              <a href="/" className="text-[#1d1d1f] dark:text-white hover:text-accent dark:hover:text-accent transition-colors">
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
                className="text-sm font-medium text-[#1d1d1f] dark:text-white hover:text-accent dark:hover:text-accent transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDark} 
              className="text-foreground hover:text-white dark:hover:text-white"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#1a1a1a] border-t border-border dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-2 text-base font-medium text-[#1d1d1f] dark:text-white hover:text-accent dark:hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
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