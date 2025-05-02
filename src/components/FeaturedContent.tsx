
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { Leaf, Users, Calendar, Tag, MapPin, ExternalLink, RefreshCw, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Real data sources for featured content (in a real app, this would come from an API)
const initialFeaturedNews = [
  {
    id: 1,
    title: "Kenya Introduces New Drought-Resistant Maize Variety",
    source: "Kenya Agricultural Research Institute",
    date: "2024-06-15",
    tags: ["maize", "drought-resistant", "research"],
    location: "Nationwide",
    summary: "The Kenya Agricultural Research Institute has introduced a new drought-resistant maize variety that can thrive with up to 30% less water than traditional varieties.",
    url: "https://www.kalro.org/latest-news"
  },
  {
    id: 2,
    title: "Digital Payments Transform Rural Farmer Cooperatives",
    source: "Digital Farmers Kenya",
    date: "2024-06-10",
    tags: ["digital payments", "cooperatives", "rural"],
    location: "Western Kenya",
    summary: "Digital payment systems have been implemented across 200 rural farmer cooperatives, reducing transaction costs and increasing financial transparency.",
    url: "https://www.digitalfarmers.co.ke/news"
  },
  {
    id: 3,
    title: "Avocado Exports to Europe Increase by 25%",
    source: "Kenya Export Promotion Council",
    date: "2024-06-08",
    tags: ["exports", "avocado", "market access"],
    location: "Central Kenya",
    summary: "Kenya's avocado exports to European markets have increased by 25% in the first half of 2024, driven by improved quality control measures.",
    url: "https://www.epc.go.ke/press-releases"
  }
];

const featuredServices = [
  {
    id: 1,
    title: "Mobile Cold Storage Units",
    provider: "CoolChain Logistics",
    date: "2024-06-12",
    tags: ["cold storage", "post-harvest", "rental"],
    location: "Nairobi, Nakuru, Mombasa",
    summary: "Rent mobile cold storage units to preserve your fresh produce directly at farm sites. Available on daily, weekly, or monthly terms.",
    url: "https://www.coolchainlogistics.co.ke/cold-storage"
  },
  {
    id: 2,
    title: "Bulk Transport for Agricultural Goods",
    provider: "AgriMove Logistics",
    date: "2024-06-14",
    tags: ["transport", "logistics", "bulk"],
    location: "Nationwide",
    summary: "Specialized bulk transport services for agricultural goods with temperature-controlled options and real-time tracking.",
    url: "https://www.agrimove.co.ke/services"
  },
  {
    id: 3,
    title: "Soil Testing and Advisory Services",
    provider: "SoilSmart Kenya",
    date: "2024-06-05",
    tags: ["soil testing", "advisory", "farm management"],
    location: "Eastern and Central Kenya",
    summary: "Comprehensive soil testing with detailed reports and customized recommendations for optimal crop selection and fertilizer application.",
    url: "https://www.soilsmart.co.ke/testing-services"
  }
];

const featuredProducts = [
  {
    id: 1,
    title: "Premium Grade Coffee Beans",
    provider: "Mt. Kenya Coffee Cooperative",
    date: "2024-06-18",
    tags: ["coffee", "premium", "export quality"],
    location: "Central Kenya",
    summary: "Directly sourced AA grade arabica coffee beans from small-scale farmers. Available in bulk quantities with quality certification.",
    price: "KES 1,200 per kg",
    url: "https://www.mtkenycoffee.co.ke/products"
  },
  {
    id: 2,
    title: "Organic Avocados - Hass Variety",
    provider: "Greenfarms Kenya",
    date: "2024-06-16",
    tags: ["avocado", "organic", "hass"],
    location: "Muranga County",
    summary: "Certified organic Hass avocados available in crates of 20kg. Perfect ripeness for export or local premium markets.",
    price: "KES 2,500 per crate",
    url: "https://www.greenfarms.co.ke/produce"
  },
  {
    id: 3,
    title: "Fortified Animal Feed - Dairy Blend",
    provider: "NutriStock Feeds",
    date: "2024-06-10",
    tags: ["dairy", "animal feed", "fortified"],
    location: "Nakuru County",
    summary: "High-protein fortified feed specially formulated for dairy cattle. Increases milk production by up to 15%.",
    price: "KES 2,200 per 70kg bag",
    url: "https://www.nutristock.co.ke/dairy-feeds"
  }
];

// News submission form type
type NewsSubmission = {
  title: string;
  source: string;
  tags: string;
  location: string;
  summary: string;
  url: string;
};

const FeaturedContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [newsItems, setNewsItems] = useState(initialFeaturedNews);
  const [servicesItems, setServicesItems] = useState(featuredServices);
  const [productsItems, setProductsItems] = useState(featuredProducts);
  const [newsSubmission, setNewsSubmission] = useState<NewsSubmission>({
    title: '',
    source: '',
    tags: '',
    location: '',
    summary: '',
    url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Load data and check for updates
  useEffect(() => {
    const fetchFeaturedContent = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from an API
        // const response = await fetch('https://api.yourbackend.com/featured-content');
        // const data = await response.json();
        // setNewsItems(data.news);
        // setServicesItems(data.services);
        // setProductsItems(data.products);
        
        // For demo, simulate API loading with a delay
        setTimeout(() => {
          setIsLoading(false);
          setLastUpdated(new Date());
        }, 1000);
      } catch (error) {
        console.error('Error fetching featured content:', error);
        setIsLoading(false);
        toast({
          title: "Error loading content",
          description: "Could not load the featured content. Please try again later.",
          variant: "destructive",
        });
      }
    };

    // Initial fetch
    fetchFeaturedContent();

    // Set up refresh every 48 hours (in milliseconds)
    const refreshInterval = 48 * 60 * 60 * 1000;
    const intervalId = setInterval(fetchFeaturedContent, refreshInterval);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [toast]);

  // Handle refresh button click
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refetch
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
      toast({
        title: "Content refreshed",
        description: "Featured content has been updated.",
      });
    }, 1000);
  };

  // Handle news submission form change
  const handleSubmissionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewsSubmission(prev => ({ ...prev, [name]: value }));
  };

  // Handle news submission
  const handleSubmitNews = async () => {
    // Validate form
    if (!newsSubmission.title || !newsSubmission.source || !newsSubmission.summary) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, send to an API
      // await fetch('https://api.yourbackend.com/submit-news', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newsSubmission)
      // });

      // For demo, simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add to local list (in a real app, it would be pending approval)
      const newItem = {
        id: Date.now(),
        title: newsSubmission.title,
        source: newsSubmission.source,
        date: new Date().toISOString().split('T')[0],
        tags: newsSubmission.tags.split(',').map(tag => tag.trim()),
        location: newsSubmission.location,
        summary: newsSubmission.summary,
        url: newsSubmission.url || '#'
      };

      setNewsItems(prev => [newItem, ...prev]);

      // Reset form
      setNewsSubmission({
        title: '',
        source: '',
        tags: '',
        location: '',
        summary: '',
        url: ''
      });

      toast({
        title: "News submitted",
        description: "Your news has been submitted and is awaiting approval.",
      });
    } catch (error) {
      console.error('Error submitting news:', error);
      toast({
        title: "Submission error",
        description: "Could not submit your news. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderContentItems = (items: any[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => (
          <Card key={item.id} className="hover:shadow-md transition-all overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted/40 p-5">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{item.provider || item.source}</span>
                </div>
                <div className="flex flex-wrap gap-y-1 text-xs">
                  <div className="flex items-center mr-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mr-3">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.summary}</p>
                
                {item.price && (
                  <div className="font-bold text-primary mb-4">{item.price}</div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag: string) => (
                    <div key={tag} className="bg-secondary/50 text-secondary-foreground text-xs px-2 py-1 rounded-full flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </div>
                  ))}
                </div>
                
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center"
                  >
                    View Details <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" /> Submit News
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Submit News Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={newsSubmission.title}
                    onChange={handleSubmissionChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="source">Source *</Label>
                  <Input 
                    id="source" 
                    name="source" 
                    value={newsSubmission.source}
                    onChange={handleSubmissionChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input 
                    id="tags" 
                    name="tags" 
                    value={newsSubmission.tags}
                    onChange={handleSubmissionChange}
                    placeholder="e.g. maize, exports, policy"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={newsSubmission.location}
                    onChange={handleSubmissionChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="summary">Summary *</Label>
                  <Textarea 
                    id="summary" 
                    name="summary" 
                    rows={3}
                    value={newsSubmission.summary}
                    onChange={handleSubmissionChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">Source URL</Label>
                  <Input 
                    id="url" 
                    name="url" 
                    type="url"
                    value={newsSubmission.url}
                    onChange={handleSubmissionChange}
                    placeholder="https://"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleSubmitNews} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit News'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button onClick={handleRefresh} variant="ghost" size="sm" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="news" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="news" className="flex items-center">
              <Leaf className="h-4 w-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="news" className="mt-0">
          {renderContentItems(newsItems)}
        </TabsContent>
        
        <TabsContent value="services" className="mt-0">
          {renderContentItems(servicesItems)}
        </TabsContent>
        
        <TabsContent value="products" className="mt-0">
          {renderContentItems(productsItems)}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default FeaturedContent;
