
import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import ResultCard from '@/components/ResultCard';
import { Category, DataItem, SearchFilters } from '@/types';
import { fetchData, getCategoryName } from '@/services/api';
import DetailView from '@/components/DetailView';

const SearchSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category | 'all'>('all');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DataItem[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    
    const filters: SearchFilters = {
      query: query.trim() === '' ? undefined : query,
      location: location.trim() === '' ? undefined : location,
      dateFrom,
      dateTo,
    };
    
    if (activeTab !== 'all') {
      filters.category = activeTab;
    }
    
    try {
      const data = await fetchData(filters);
      setResults(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setLocation('');
    setDateFrom(undefined);
    setDateTo(undefined);
    setIsFiltersOpen(false);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleItemClick = (item: DataItem) => {
    setSelectedItem(item);
  };

  const closeDetail = () => {
    setSelectedItem(null);
  };

  return (
    <section id="search-section" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-fade-up">
        <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-2">
          Search & Discover
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Find What You Need</h2>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
          Search across agricultural issues, tender opportunities, and supply chain jobs throughout Kenya.
        </p>
      </div>
      
      <Card className="p-6 rounded-xl shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-border">
        <div className="mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as Category | 'all')}>
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All Categories</TabsTrigger>
              <TabsTrigger value="agriculture" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Agricultural Issues</TabsTrigger>
              <TabsTrigger value="tender" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tender Opportunities</TabsTrigger>
              <TabsTrigger value="supply-chain" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Supply Chain Jobs</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="md:w-auto w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {(location || dateFrom || dateTo) && 
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {[location, dateFrom, dateTo].filter(Boolean).length}
                  </span>
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Results</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Nairobi, Nakuru..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="date-from" className="text-xs">From</Label>
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        className="border rounded-md"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date-to" className="text-xs">To</Label>
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        className="border rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={clearFilters} className="text-sm">
                    <X className="mr-1 h-4 w-4" />
                    Clear
                  </Button>
                  <Button size="sm" onClick={() => {
                    setIsFiltersOpen(false);
                    handleSearch();
                  }} className="text-sm">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button onClick={handleSearch} className="md:w-auto w-full">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <h3 className="text-lg font-medium mb-4">
              {results.length} Result{results.length !== 1 ? 's' : ''} {activeTab !== 'all' ? `in ${getCategoryName(activeTab as Category)}` : ''}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {results.map((item) => (
                <ResultCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No results found. Try adjusting your search criteria.</p>
          </div>
        )}
      </Card>
      
      {selectedItem && (
        <DetailView item={selectedItem} onClose={closeDetail} />
      )}
    </section>
  );
};

export default SearchSection;
