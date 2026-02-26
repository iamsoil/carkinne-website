"use client";

import { useState, useEffect } from 'react';
import { Moon, Sun, Search, Menu, X } from 'lucide-react';
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
    <header className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${isScrolled ? 'bg-white/85 border-b border-border' : 'bg-white/85'}`}>
      {/* Announcement Bar */}
      <div className="bg-foreground text-white text-center py-2 text-xs tracking-wide">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div></div>
          <span>Dashain Special — Up to Rs. 2 Lakh off on selected cars</span>
          <button className="hover:opacity-70 transition-opacity">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

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
                className="text-sm font-medium text-foreground hover:text-accent transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground hover:text-white">
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="text-foreground hover:text-white">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
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
        <div className="md:hidden bg-white border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-2 text-base font-medium text-foreground hover:text-accent transition-colors"
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