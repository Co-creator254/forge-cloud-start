import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Building2, 
  Truck, 
  BookOpen, 
  HelpCircle, 
  Phone, 
  Shield,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
  Leaf,
  Tractor,
  Package,
  BarChart3,
  Store,
  Stethoscope,
  Handshake
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
          {/* Platform - Core Trading */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-green-400 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-400" />
              Platform
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/marketplace" className="hover:text-green-400 transition-colors flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Commodity Trading
                </Link>
              </li>
              <li>
                <Link to="/logistics" className="hover:text-green-400 transition-colors flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-500" />
                  Logistics
                </Link>
              </li>
              <li>
                <Link to="/service-providers" className="hover:text-green-400 transition-colors flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-purple-500" />
                  Service Providers
                </Link>
              </li>
              <li>
                <Link to="/farm-input-marketplace" className="hover:text-green-400 transition-colors flex items-center gap-2">
                  <Package className="h-4 w-4 text-orange-500" />
                  Farm Input Marketplace
                </Link>
              </li>
              <li>
                <Link to="/equipment-marketplace" className="hover:text-green-400 transition-colors flex items-center gap-2">
                  <Tractor className="h-4 w-4 text-yellow-500" />
                  Equipment Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-blue-400 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-400" />
              Support
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-500" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-500" />
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  Community Forum
                </Link>
              </li>
              <li>
                <Link to="/partners" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-orange-500" />
                  Partner with us
                </Link>
              </li>
            </ul>
          </div>

          {/* Features - Prioritized correctly */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-purple-400 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              Features
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/farmer-portal" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-500" />
                  Farmer Portal
                </Link>
              </li>
              <li>
                <Link to="/market-prices" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Market Data
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/city-markets" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Store className="h-4 w-4 text-orange-500" />
                  City Markets
                </Link>
              </li>
              <li>
                <Link to="/veterinary" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-red-500" />
                  Veterinary Services
                </Link>
              </li>
            </ul>
          </div>

          {/* SokoConnect - Company Info */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <h2 className="text-lg font-bold mb-4 text-orange-400 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-orange-400" />
              SokoConnect
            </h2>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              Connecting farmers, traders, and service providers for a better agricultural ecosystem across Africa.
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-orange-500" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-500" />
                  Contact
                </Link>
              </li>
            </ul>
            
            {/* Legal Links */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <Link to="/terms" className="hover:text-gray-300 flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Terms
                </Link>
                <Link to="/privacy" className="hover:text-gray-300 flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Privacy
                </Link>
                <Link to="/cookies" className="hover:text-gray-300 flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Contact */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Follow Us:</span>
              <a href="https://facebook.com/sokoconnect" target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/sokoconnect" target="_blank" rel="noopener noreferrer" className="p-2 bg-sky-500 rounded-full hover:bg-sky-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/sokoconnect" target="_blank" rel="noopener noreferrer" className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/sokoconnect" target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-700 rounded-full hover:bg-blue-800 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/sokoconnect" target="_blank" rel="noopener noreferrer" className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400">
              <a href="mailto:info@sokoconnect.co.ke" className="flex items-center gap-2 hover:text-green-400 transition-colors">
                <Mail className="h-4 w-4 text-green-500" />
                info@sokoconnect.co.ke
              </a>
              <a href="tel:+254700000000" className="flex items-center gap-2 hover:text-green-400 transition-colors">
                <Phone className="h-4 w-4 text-green-500" />
                +254 700 000 000
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                Nairobi, Kenya
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 mt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SokoConnect. All rights reserved. | Empowering African Agriculture</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
