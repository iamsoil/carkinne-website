"use client";

import { useState, useEffect } from 'react';
import { Moon, Sun, Search, Menu, X, Car } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { name: 'Cars', href: '/cars' },
    { name: 'Budget Finder', href: '/budget-finder' },
    { name: 'EMI Calculator', href: '/emi-calculator' },
    { name: 'Showrooms', href: '/showrooms' },
    { name: 'EV Cars', href: '/electric-cars' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header className={`sticky top-0 z-50 ${isScrolled ? 'shadow-md' : ''}`}>
      {/* Announcement Bar */}
      <div className="bg-orange-700 text-white text-center py-2 text-sm font-medium">
        🎉 Dashain Special: Up to Rs.2L off on selected cars
      </div>

      {/* Main Navigation */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                Car<span className="text-orange-500">Kinne</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-white hover:text-orange-500 transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-white hover:text-orange-500">
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
              
              <Button variant="ghost" size="icon" className="text-white hover:text-orange-500">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-white hover:text-orange-500"
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
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-2 text-base font-medium text-white hover:text-orange-500 transition-colors"
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