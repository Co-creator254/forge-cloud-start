
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { Leaf, Users, Calendar, Tag, MapPin, ExternalLink } from 'lucide-react';

// Mock data for featured content (in a real app, this would come from an API)
const featuredNews = [
  {
    id: 1,
    title: "Kenya Introduces New Drought-Resistant Maize Variety",
    source: "Kenya Agricultural Research Institute",
    date: "2024-06-15",
    tags: ["maize", "drought-resistant", "research"],
    location: "Nationwide",
    summary: "The Kenya Agricultural Research Institute has introduced a new drought-resistant maize variety that can thrive with up to 30% less water than traditional varieties.",
    url: "#"
  },
  {
    id: 2,
    title: "Digital Payments Transform Rural Farmer Cooperatives",
    source: "Digital Farmers Kenya",
    date: "2024-06-10",
    tags: ["digital payments", "cooperatives", "rural"],
    location: "Western Kenya",
    summary: "Digital payment systems have been implemented across 200 rural farmer cooperatives, reducing transaction costs and increasing financial transparency.",
    url: "#"
  },
  {
    id: 3,
    title: "Avocado Exports to Europe Increase by 25%",
    source: "Kenya Export Promotion Council",
    date: "2024-06-08",
    tags: ["exports", "avocado", "market access"],
    location: "Central Kenya",
    summary: "Kenya's avocado exports to European markets have increased by 25% in the first half of 2024, driven by improved quality control measures.",
    url: "#"
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
    url: "#"
  },
  {
    id: 2,
    title: "Bulk Transport for Agricultural Goods",
    provider: "AgriMove Logistics",
    date: "2024-06-14",
    tags: ["transport", "logistics", "bulk"],
    location: "Nationwide",
    summary: "Specialized bulk transport services for agricultural goods with temperature-controlled options and real-time tracking.",
    url: "#"
  },
  {
    id: 3,
    title: "Soil Testing and Advisory Services",
    provider: "SoilSmart Kenya",
    date: "2024-06-05",
    tags: ["soil testing", "advisory", "farm management"],
    location: "Eastern and Central Kenya",
    summary: "Comprehensive soil testing with detailed reports and customized recommendations for optimal crop selection and fertilizer application.",
    url: "#"
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
    url: "#"
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
    url: "#"
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
    url: "#"
  }
];

const FeaturedContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
                  <a href={item.url} className="flex items-center justify-center">
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
        {renderContentItems(featuredNews)}
      </TabsContent>
      
      <TabsContent value="services" className="mt-0">
        {renderContentItems(featuredServices)}
      </TabsContent>
      
      <TabsContent value="products" className="mt-0">
        {renderContentItems(featuredProducts)}
      </TabsContent>
    </Tabs>
  );
};

export default FeaturedContent;
