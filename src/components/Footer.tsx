import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Building2, 
  Truck, 
  BookOpen, 
  HelpCircle, 
  Phone, 
  FileText, 
  Shield, 
  Cookie,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  MapPin
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
          {/* Marketplace */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-green-400 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              MARKETPLACE
            </h2>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="hover:text-green-400 transition-colors flex items-center gap-2"><span className="text-green-500">•</span> Buy Produce</Link></li>
              <li><Link to="/sell" className="hover:text-green-400 transition-colors flex items-center gap-2"><span className="text-green-500">•</span> Sell Products</Link></li>
              <li><Link to="/agricultural-marketplace" className="hover:text-green-400 transition-colors flex items-center gap-2"><span className="text-green-500">•</span> Agricultural Marketplace</Link></li>
              <li><Link to="/farmer-portal" className="hover:text-green-400 transition-colors flex items-center gap-2"><span className="text-green-500">•</span> Farmer Portal</Link></li>
              <li><Link to="/logistics" className="hover:text-green-400 transition-colors flex items-center gap-2"><span className="text-green-500">•</span> Logistics</Link></li>
              <li><Link to="/cooperatives" className="hover:text-green-400 transition-colors flex items-center gap-2"><span className="text-green-500">•</span> Cooperatives</Link></li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-blue-400 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              LEARN
            </h2>
            <ul className="space-y-2">
              <li><Link to="/market-prices" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-500">•</span> Market Prices</Link></li>
              <li><Link to="/price-trends" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-500">•</span> Price Trends</Link></li>
              <li><Link to="/training" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-500">•</span> Training Courses</Link></li>
              <li><Link to="/success-stories" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-500">•</span> Success Stories</Link></li>
              <li><Link to="/city-markets" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-500">•</span> City Markets</Link></li>
              <li><Link to="/supply-chain" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span className="text-blue-500">•</span> Supply Chain</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-purple-400 flex items-center gap-2">
              <Users className="h-5 w-5" />
              CONNECT
            </h2>
            <ul className="space-y-2">
              <li><Link to="/help" className="hover:text-purple-400 transition-colors flex items-center gap-2"><span className="text-purple-500">•</span> Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-purple-400 transition-colors flex items-center gap-2"><span className="text-purple-500">•</span> Contact</Link></li>
              <li><Link to="/faq" className="hover:text-purple-400 transition-colors flex items-center gap-2"><span className="text-purple-500">•</span> FAQ</Link></li>
              <li><Link to="/community" className="hover:text-purple-400 transition-colors flex items-center gap-2"><span className="text-purple-500">•</span> Community</Link></li>
              <li><Link to="/report-bug" className="hover:text-purple-400 transition-colors flex items-center gap-2"><span className="text-purple-500">•</span> Report Bug</Link></li>
              <li><Link to="/feedback" className="hover:text-purple-400 transition-colors flex items-center gap-2"><span className="text-purple-500">•</span> Feedback</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-orange-400 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              COMPANY
            </h2>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="text-orange-500">•</span> About Us</Link></li>
              <li><Link to="/blog" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="text-orange-500">•</span> Blog</Link></li>
              <li><Link to="/careers" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="text-orange-500">•</span> Careers</Link></li>
              <li><Link to="/partners" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="text-orange-500">•</span> Partner With Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-red-400 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              LEGAL
            </h2>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-red-400 transition-colors flex items-center gap-2"><span className="text-red-500">•</span> Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-red-400 transition-colors flex items-center gap-2"><span className="text-red-500">•</span> Privacy</Link></li>
              <li><Link to="/accessibility" className="hover:text-red-400 transition-colors flex items-center gap-2"><span className="text-red-500">•</span> Accessibility</Link></li>
              <li><Link to="/cookies" className="hover:text-red-400 transition-colors flex items-center gap-2"><span className="text-red-500">•</span> Cookies</Link></li>
            </ul>
          </div>

          {/* Support & Integrations */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-cyan-400 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              SUPPORT
            </h2>
            <ul className="space-y-2">
              <li><Link to="/payments" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="text-cyan-500">•</span> Payments</Link></li>
              <li><Link to="/pricing" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="text-cyan-500">•</span> Pricing</Link></li>
              <li><a href="https://haystack.deepset.ai" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="text-cyan-500">•</span> Haystack AI</a></li>
              <li><Link to="/api-docs" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="text-cyan-500">•</span> API Docs</Link></li>
            </ul>
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
