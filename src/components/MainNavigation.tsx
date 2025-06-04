import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Package, TrendingUp, Truck, Database, FileText, Briefcase, BarChart } from 'lucide-react';

const MainNavigation = () => {
  const location = useLocation();
  
  const farmingNavigation = [
    {
      name: "Portail Agriculteur",
      href: "/farmer-portal",
      description: "Tableau de bord complet pour la gestion de votre exploitation"
    }
  ];

  return (
    <NavigationMenu className="max-w-full w-full justify-start">
      <NavigationMenuList className="flex flex-wrap gap-1">
        {/* Commodity Trading Section */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={location.pathname.includes('/commodity-trading') ? 'bg-accent' : ''}>
            <Package className="h-4 w-4 mr-2" />
            Commodity Trading
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <Link to="/commodity-trading/marketplace">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Marketplace</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Buy and sell agricultural commodities</p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link to="/commodity-trading/barter">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Barter Exchange</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Trade commodities without money</p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link to="/commodity-trading/my-trades">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">My Trades</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Track your transactions</p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link to="/commodity-trading/price-trends">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Price Trends</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Market price analysis</p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link to="/commodity-trading/community">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Community Forums</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Connect with farmers in your region</p>
                  </NavigationMenuLink>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        {/* Supply Chain Problems Section */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={location.pathname.includes('/supply-chain-problems') ? 'bg-accent' : ''}>
            <Truck className="h-4 w-4 mr-2" />
            Supply Chain Solutions
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <Link to="/supply-chain-problems/post-harvest-losses">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Post-Harvest Losses</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Solutions to reduce losses</p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link to="/supply-chain-problems/logistics">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Logistics Issues</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Transportation and storage solutions</p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link to="/supply-chain-problems/market-access">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Market Access</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Connect farmers to markets</p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link to="/supply-chain-problems/price-volatility">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Price Volatility</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Mitigate market fluctuations</p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link to="/supply-chain-problems/quality-control">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Quality Control</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Standards and verification</p>
                  </NavigationMenuLink>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        {/* Data Integration */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={location.pathname.includes('/kilimo-ams') || location.pathname.includes('/data-jobs') ? 'bg-accent' : ''}>
            <BarChart className="h-4 w-4 mr-2" />
            Data Integration
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <li>
                <Link to="/kilimo-ams-data">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Kilimo & AMIS Data</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Real-time agricultural statistics</p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link to="/data-jobs">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Data Jobs</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Manage data integration processes</p>
                  </NavigationMenuLink>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        {/* API Services */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={
            location.pathname.includes('/supply-chain-api') || 
            location.pathname.includes('/tender-api') || 
            location.pathname.includes('/jobs-api') ? 'bg-accent' : ''}>
            <Database className="h-4 w-4 mr-2" />
            API Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <li>
                <Link to="/supply-chain-api">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Supply Chain API</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Access agricultural data</p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link to="/tender-api">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Tender API</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Agricultural tender information</p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link to="/jobs-api">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Jobs API</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Agricultural job listings</p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link to="/api-docs">
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">API Documentation</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Developer resources</p>
                  </NavigationMenuLink>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
