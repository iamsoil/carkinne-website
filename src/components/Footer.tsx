import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const navigation = {
    product: [
      { name: 'Cars', href: '/cars' },
      { name: 'Budget Finder', href: '/budget-finder' },
      { name: 'EMI Calculator', href: '/emi-calculator' },
      { name: 'Compare Cars', href: '/compare' },
      { name: 'Electric Cars', href: '/electric-cars' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Showrooms', href: '/showrooms' },
      { name: 'Offers', href: '/offers' },
    ],
    resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Car Guides', href: '#' },
      { name: 'Financing', href: '#' },
      { name: 'Insurance', href: '#' },
      { name: 'FAQ', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="border-t py-12 bg-muted/50">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold text-orange-500 mb-4">CarKinne</div>
            <p className="text-sm text-muted-foreground mb-4">
              Nepal's Smartest Car Buying Guide
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-orange-500">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-orange-500">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-orange-500">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-orange-500">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    className="text-sm text-muted-foreground hover:text-orange-500"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    className="text-sm text-muted-foreground hover:text-orange-500"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    className="text-sm text-muted-foreground hover:text-orange-500"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    className="text-sm text-muted-foreground hover:text-orange-500"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CarKinne.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;