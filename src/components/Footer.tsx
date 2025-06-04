
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">AgriConnect</h3>
            <p className="text-sm text-muted-foreground">
              Connecting farmers, traders, and service providers for a better agricultural ecosystem.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/commodity-trading" className="text-muted-foreground hover:text-foreground">Commodity Trading</Link></li>
              <li><Link to="/logistics" className="text-muted-foreground hover:text-foreground">Logistics</Link></li>
              <li><Link to="/service-providers" className="text-muted-foreground hover:text-foreground">Service Providers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link to="/community-forum" className="text-muted-foreground hover:text-foreground">Community Forum</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 AgriConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
