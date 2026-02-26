import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              Car<span className="text-orange-500">Kinne</span>
            </h2>
            <p className="text-white/80 mb-4">
              Nepal's Smartest Car Buying Guide. Compare prices, calculate EMI, 
              find showrooms — all in one place.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/cars" className="text-white/80 hover:text-orange-500 transition-colors">All Cars</a></li>
              <li><a href="/budget-finder" className="text-white/80 hover:text-orange-500 transition-colors">Budget Finder</a></li>
              <li><a href="/emi-calculator" className="text-white/80 hover:text-orange-500 transition-colors">EMI Calculator</a></li>
              <li><a href="/showrooms" className="text-white/80 hover:text-orange-500 transition-colors">Showrooms</a></li>
              <li><a href="/electric-cars" className="text-white/80 hover:text-orange-500 transition-colors">Electric Cars</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/blog" className="text-white/80 hover:text-orange-500 transition-colors">Blog</a></li>
              <li><a href="/offers" className="text-white/80 hover:text-orange-500 transition-colors">Offers</a></li>
              <li><a href="/compare" className="text-white/80 hover:text-orange-500 transition-colors">Compare Cars</a></li>
              <li><a href="/admin" className="text-white/80 hover:text-orange-500 transition-colors">Admin</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-white/60">
          <p>&copy; {currentYear} CarKinne.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;