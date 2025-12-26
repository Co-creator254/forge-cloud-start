import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  X, 
  Package, 
  Users, 
  MapPin, 
  Calendar, 
  Truck, 
  Building2,
  Leaf,
  ShoppingCart,
  MessageSquare
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'marketplace' | 'service' | 'community' | 'event';
  route: string;
  icon: React.ReactNode;
  tags?: string[];
}

// Searchable pages and features - excludes admin/internal routes
const SEARCHABLE_ITEMS: SearchResult[] = [
  // Marketplaces
  { id: 'commodity', title: 'Commodity Trading', description: 'Buy and sell agricultural commodities', type: 'marketplace', route: '/commodity-trading', icon: <Package className="h-5 w-5" />, tags: ['trading', 'crops', 'grains'] },
  { id: 'equipment', title: 'Equipment Marketplace', description: 'Farm equipment for sale and rent', type: 'marketplace', route: '/equipment-marketplace', icon: <Truck className="h-5 w-5" />, tags: ['tractors', 'machinery', 'tools'] },
  { id: 'farm-inputs', title: 'Farm Inputs', description: 'Seeds, fertilizers, and farming supplies', type: 'marketplace', route: '/farm-inputs', icon: <Leaf className="h-5 w-5" />, tags: ['seeds', 'fertilizer', 'pesticides'] },
  { id: 'bulk-orders', title: 'Bulk Orders', description: 'Group purchasing for better prices', type: 'marketplace', route: '/bulk-orders', icon: <ShoppingCart className="h-5 w-5" />, tags: ['wholesale', 'group buying'] },
  { id: 'barter', title: 'Barter Exchange', description: 'Exchange products without cash', type: 'marketplace', route: '/commodity-trading/barter', icon: <Package className="h-5 w-5" />, tags: ['exchange', 'trade'] },
  { id: 'export', title: 'Export Market', description: 'International export opportunities', type: 'marketplace', route: '/export-market', icon: <Building2 className="h-5 w-5" />, tags: ['international', 'export'] },
  
  // Services
  { id: 'logistics', title: 'Logistics Solutions', description: 'Transport and delivery services', type: 'service', route: '/logistics', icon: <Truck className="h-5 w-5" />, tags: ['transport', 'delivery', 'shipping'] },
  { id: 'service-providers', title: 'Service Providers', description: 'Agricultural service providers directory', type: 'service', route: '/service-providers', icon: <Users className="h-5 w-5" />, tags: ['services', 'contractors'] },
  { id: 'warehouses', title: 'Warehouse Locator', description: 'Find storage facilities', type: 'service', route: '/warehouse-locator', icon: <Building2 className="h-5 w-5" />, tags: ['storage', 'cold storage'] },
  
  // Community
  { id: 'forum', title: 'Community Forum', description: 'Discuss with fellow farmers', type: 'community', route: '/community-forum', icon: <MessageSquare className="h-5 w-5" />, tags: ['discussions', 'questions'] },
  { id: 'cooperatives', title: 'Cooperatives Management', description: 'Manage farmer cooperatives', type: 'community', route: '/cooperatives-management', icon: <Users className="h-5 w-5" />, tags: ['groups', 'sacco'] },
  { id: 'success-stories', title: 'Success Stories', description: 'Farmer success stories', type: 'community', route: '/success-stories', icon: <Users className="h-5 w-5" />, tags: ['stories', 'testimonials'] },
  
  // Events & Training
  { id: 'training', title: 'Training Events', description: 'Agricultural training and workshops', type: 'event', route: '/training-events', icon: <Calendar className="h-5 w-5" />, tags: ['workshops', 'learning'] },
  { id: 'ag-events', title: 'Agricultural Events', description: 'Upcoming agricultural events', type: 'event', route: '/agricultural-events', icon: <Calendar className="h-5 w-5" />, tags: ['shows', 'exhibitions'] },
  
  // Market Information
  { id: 'market-prices', title: 'Market Prices', description: 'Current commodity prices', type: 'page', route: '/market-prices', icon: <Package className="h-5 w-5" />, tags: ['prices', 'rates'] },
  { id: 'routes', title: 'Major Routes Marketplace', description: 'Trade along major highways', type: 'page', route: '/major-routes-marketplace', icon: <MapPin className="h-5 w-5" />, tags: ['roads', 'roadside'] },
  
  // Food Security
  { id: 'food-rescue', title: 'Food Rescue', description: 'Reduce food waste through donations', type: 'page', route: '/food-rescue', icon: <Package className="h-5 w-5" />, tags: ['donations', 'surplus'] },
  { id: 'imperfect', title: 'Imperfect Surplus Produce', description: 'Buy imperfect but good produce', type: 'page', route: '/imperfect-surplus', icon: <Leaf className="h-5 w-5" />, tags: ['discount', 'ugly produce'] },
  
  // Farm Management
  { id: 'farm-dashboard', title: 'Farm Dashboard', description: 'Manage your farm operations', type: 'page', route: '/farmer-portal', icon: <Leaf className="h-5 w-5" />, tags: ['management', 'farm'] },
  { id: 'batch-tracking', title: 'Batch Tracking', description: 'Track product batches', type: 'page', route: '/batch-tracking', icon: <Package className="h-5 w-5" />, tags: ['traceability', 'tracking'] },
  { id: 'carbon', title: 'Carbon Footprint', description: 'Track your carbon emissions', type: 'page', route: '/carbon-footprint', icon: <Leaf className="h-5 w-5" />, tags: ['sustainability', 'emissions'] },
];

interface GlobalSearchProps {
  isOpen?: boolean;
  onClose?: () => void;
  trigger?: React.ReactNode;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen: externalIsOpen, onClose, trigger }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = externalIsOpen !== undefined ? externalIsOpen : isOpen;

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = SEARCHABLE_ITEMS.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(searchLower);
      const matchDescription = item.description.toLowerCase().includes(searchLower);
      const matchTags = item.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      return matchTitle || matchDescription || matchTags;
    });

    setResults(filtered);
  }, [searchTerm]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.route);
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setResults([]);
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  const handleOpen = () => {
    if (externalIsOpen === undefined) {
      setIsOpen(true);
    }
  };

  // Keyboard shortcut to open search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'marketplace': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'service': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'community': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'event': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={handleOpen}>{trigger}</div>
      ) : (
        <Button variant="outline" size="sm" onClick={handleOpen} className="gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      )}

      <Dialog open={open} onOpenChange={(v) => v ? handleOpen() : handleClose()}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="sr-only">Search SokoConnect</DialogTitle>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search pages, marketplaces, services..."
                className="border-0 focus-visible:ring-0 text-lg"
              />
              {searchTerm && (
                <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto p-4 pt-2">
            {searchTerm && results.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found for "{searchTerm}"</p>
                <p className="text-sm mt-1">Try different keywords</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-2">
                {results.map((result) => (
                  <Card 
                    key={result.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSelect(result)}
                  >
                    <CardContent className="flex items-center gap-4 p-3">
                      <div className="flex-shrink-0 p-2 bg-muted rounded-lg">
                        {result.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">{result.title}</h4>
                          <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!searchTerm && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Quick Links</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {SEARCHABLE_ITEMS.slice(0, 6).map((item) => (
                      <Button 
                        key={item.id} 
                        variant="outline" 
                        className="justify-start gap-2 h-auto py-2"
                        onClick={() => handleSelect(item)}
                      >
                        {item.icon}
                        <span className="truncate">{item.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalSearch;