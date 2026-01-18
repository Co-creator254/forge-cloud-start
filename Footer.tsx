import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Branding Section */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-lg mb-4 text-foreground">SokoConnect</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting farmers, traders, and service providers for a better agricultural ecosystem.
            </p>
          </div>

          {/* MARKETPLACE Column */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2.5">
              <li><Link to="/commodity-trading" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Buy Produce</Link></li>
              <li><Link to="/commodity-trading" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sell Products</Link></li>
              <li><Link to="/agricultural-marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Agricultural Marketplace</Link></li>
              <li><Link to="/farmer-portal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Farmer Portal</Link></li>
              <li><Link to="/logistics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Logistics</Link></li>
              <li><Link to="/cooperatives-management" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cooperatives</Link></li>
            </ul>
          </div>

          {/* LEARN Column */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Learn</h4>
            <ul className="space-y-2.5">
              <li><Link to="/market-prices" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Market Prices</Link></li>
              <li><Link to="/price-trends" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Price Trends</Link></li>
              <li><Link to="/training-events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Training Courses</Link></li>
              <li><Link to="/success-stories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Success Stories</Link></li>
              <li><Link to="/city-markets" className="text-sm text-muted-foreground hover:text-foreground transition-colors">City Markets</Link></li>
              <li><Link to="/supply-chain-problems" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Supply Chain</Link></li>
            </ul>
          </div>

          {/* CONNECT Column */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2.5">
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/community-forum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Community</Link></li>
              <li><a href="mailto:support@sokoconnect.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Report Bug</a></li>
              <li><a href="mailto:feedback@sokoconnect.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Feedback</a></li>
            </ul>
          </div>

          {/* COMPANY Column */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><a href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              <li><Link to="/partner-with-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-semibold text-green-600">Partner With Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom Section: Legal Links and Copyright */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Legal</h4>
            <div className="flex flex-wrap gap-4">
              <a href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="/accessibility" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Accessibility</a>
              <a href="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>

          {/* Copyright and Social */}
          <div className="text-right md:text-right">
            <p className="text-xs text-muted-foreground mb-3">
              © 2026 SokoConnect. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="block">Made with ❤️ for Kenyan farmers</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;