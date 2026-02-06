
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  TrendingUp, 
  Truck, 
  Users, 
  MessageCircle, 
  BarChart3,
  DollarSign,
  Megaphone,
  Globe
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Market Data',
    href: '/kilimo-ams-data',
    icon: TrendingUp,
  },
  {
    name: 'Logistics',
    href: '/logistics',
    icon: Truck,
  },
  {
    name: 'Equipment',
    href: '/equipment-marketplace',
    icon: Truck,
  },
  {
    name: 'Service Providers',
    href: '/service-providers',
    icon: Users,
  },
  {
    name: 'Advertise Business',
    href: '/business-marketing',
    icon: Megaphone,
    highlight: true,
  },
  {
    name: 'Trading',
    href: '/commodity-trading',
    icon: DollarSign,
  },
  {
    name: 'Community',
    href: '/community-forum',
    icon: MessageCircle,
  },
  {
    name: 'Analytics',
    href: '/sentiment-analysis',
    icon: BarChart3,
  },
  {
    name: 'Export Opportunities',
    href: '/ExportMarketOpportunities',
    icon: Globe, // Use an existing icon for consistency
  },
];

export const MainNav: React.FC = () => {
  const location = useLocation();

  // Show only essential nav items to prevent overflow
  const essentialItems = navigationItems.slice(0, 6);
  const moreItems = navigationItems.slice(6);

  return (
    <nav className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-hide">
      <Link to="/" className="flex items-center space-x-2 mr-4 flex-shrink-0">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold">S</span>
        </div>
        <span className="hidden xl:inline-block font-bold text-sm">SokoConnect</span>
      </Link>
      
      {essentialItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link key={item.name} to={item.href} className="flex-shrink-0">
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center gap-1 px-2 lg:px-3 text-xs lg:text-sm",
                item.highlight && !isActive && "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200",
                item.highlight && isActive && "bg-green-600 hover:bg-green-700"
              )}
            >
              <item.icon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              <span className="hidden lg:inline whitespace-nowrap">{item.name}</span>
            </Button>
          </Link>
        );
      })}
      
      {/* More dropdown for additional items */}
      <Link to="/more" className="flex-shrink-0">
        <Button variant="ghost" size="sm" className="px-2 lg:px-3 text-xs lg:text-sm">
          <span>More</span>
          <span className="ml-1 text-muted-foreground">+{moreItems.length}</span>
        </Button>
      </Link>
    </nav>
  );
};
