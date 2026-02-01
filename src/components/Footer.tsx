import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Truck, 
  HelpCircle, 
  Phone, 
  Shield,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
  Leaf,
  Package,
  BarChart3,
  Handshake,
  Bluetooth,
  Trophy,
  MessageCircle,
  Link2,
  Footprints
} from 'lucide-react';

// WhatsApp icon component since lucide doesn't have it
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Contact info (not hardcoded - can be moved to config/env)
const CONTACT_INFO = {
  phone: '+254 745 824 354',
  email: 'info@sokoconnect.co.ke',
  location: 'Nairobi, Kenya',
  whatsappGroupLink: 'https://chat.whatsapp.com/LZQF0tXWP9RGm6Hk7Oscxg?mode=ac_t'
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {/* Platform - 5 items */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-green-400 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-400" />
              Platform
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/commodity-trading" className="hover:text-green-400 transition-colors flex items-center gap-2">
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
                <Link to="/supply-chain-dashboard" className="hover:text-green-400 transition-colors flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-yellow-500" />
                  Supply Chain
                </Link>
              </li>
            </ul>
          </div>

          {/* Features - 6 items */}
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
                  Market Prices
                </Link>
              </li>
              <li>
                <Link to="/bluetooth-marketplace" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Bluetooth className="h-4 w-4 text-sky-500" />
                  Bluetooth Market
                </Link>
              </li>
              <li>
                <Link to="/farmer-success-stories" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Farmer Success Stories
                </Link>
              </li>
              <li>
                <Link to="/market-demand-hotspot" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  Demand Hotspots
                </Link>
              </li>
              <li>
                <Link to="/carbon-footprint" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Footprints className="h-4 w-4 text-emerald-500" />
                  Carbon Footprint
                </Link>
              </li>
            </ul>
          </div>

          {/* Support - 5 items */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-blue-400 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-400" />
              Support
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/partners-showcase" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  Partners
                </Link>
              </li>
              <li>
                <Link to="/networking" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-purple-500" />
                  Networking
                </Link>
              </li>
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
                <Link to="/community-forums" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-sky-500" />
                  Community Forum
                </Link>
              </li>
              <li>
                <Link to="/partner-with-us" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-orange-500" />
                  Partner with Us
                </Link>
              </li>
            </ul>
          </div>

          {/* SokoConnect - Company Info */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-orange-400 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-orange-400" />
              SokoConnect
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Connecting farmers, traders, and service providers for a better agricultural ecosystem across Africa.
            </p>
            
            {/* Navigate to other pages */}
            <div className="mb-4">
              <Link to="/more" className="text-sm text-primary hover:text-green-400 transition-colors flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Explore All Features →
              </Link>
            </div>
            
            {/* Legal Links */}
            <div className="pt-4 border-t border-gray-700">
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <Link to="/terms-of-service" className="hover:text-gray-300 flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Terms
                </Link>
                <Link to="/privacy-policy" className="hover:text-gray-300 flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Privacy
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
              <a href="https://facebook.com/sokoconnect" target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={CONTACT_INFO.whatsappGroupLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors" aria-label="WhatsApp Group">
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/sokoconnect" target="_blank" rel="noopener noreferrer" className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/sokoconnect" target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-700 rounded-full hover:bg-blue-800 transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/sokoconnect" target="_blank" rel="noopener noreferrer" className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400">
              <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2 hover:text-green-400 transition-colors">
                <Mail className="h-4 w-4 text-green-500" />
                {CONTACT_INFO.email}
              </a>
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-green-400 transition-colors">
                <Phone className="h-4 w-4 text-green-500" />
                {CONTACT_INFO.phone}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                {CONTACT_INFO.location}
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
