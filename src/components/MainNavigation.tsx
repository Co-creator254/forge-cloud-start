
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { 
  Database, 
  Users, 
  MessageSquare, 
  BarChart3, 
  TrendingUp,
  Truck,
  GraduationCap,
  Handshake,
  Home,
  Globe,
  Building2
} from "lucide-react";

const MainNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className={cn(navigationMenuTriggerStyle(), isActive('/') && !location.pathname.includes('/') ? 'bg-accent' : '')}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Database className="h-4 w-4 mr-2" />
            Data & API
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    to="/supply-chain-api"
                  >
                    <Database className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Supply Chain API
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Access comprehensive agricultural supply chain data through our API
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/kilimo-ams-data" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Market Data</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Real-time market prices and agricultural statistics
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/api-docs" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">API Documentation</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Complete API reference and integration guides
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/data-management" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Data Management</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Manage and monitor data feeds and quality
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Users className="h-4 w-4 mr-2" />
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/service-providers" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Service Providers</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Find agricultural service providers near you
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/logistics-solutions-map" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <Truck className="h-4 w-4 mb-1" />
                    <div className="text-sm font-medium leading-none">Logistics Solutions</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Transportation and warehousing services
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/training-events" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <GraduationCap className="h-4 w-4 mb-1" />
                    <div className="text-sm font-medium leading-none">Training Events</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Agricultural training and capacity building
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/market-linkages" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <Handshake className="h-4 w-4 mb-1" />
                    <div className="text-sm font-medium leading-none">Market Linkages</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Connect with buyers and market opportunities
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <TrendingUp className="h-4 w-4 mr-2" />
            Trading
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/commodity-trading" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Commodity Trading</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Trade agricultural commodities and products
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/farmer-exporter-collaboration" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <Globe className="h-4 w-4 mb-1" />
                    <div className="text-sm font-medium leading-none">Export Collaboration</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Connect with exporters for international markets
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/exporter-profile" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <Building2 className="h-4 w-4 mb-1" />
                    <div className="text-sm font-medium leading-none">Exporter Profile</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Create your export business profile
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/market-demand-hotspot" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Demand Hotspots</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Identify high-demand markets and opportunities
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <MessageSquare className="h-4 w-4 mr-2" />
            Community
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[500px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/community-forum" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Community Forum</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Connect with other farmers and share experiences
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/quality-control-discussions" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Quality Control</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Discussions on quality standards and practices
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/farmer-success-stories" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Success Stories</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Learn from successful farming practices
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[500px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/sentiment-analysis" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Sentiment Analysis</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Market sentiment and farmer feedback analysis
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/supply-chain-problems" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Supply Chain Issues</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Identify and address supply chain challenges
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
