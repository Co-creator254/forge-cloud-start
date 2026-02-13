
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Phone, Star } from 'lucide-react';

const MarketplaceView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const sampleProduceListings = [
    {
      id: '1',
      name: 'Premium Maize',
      category: 'Grains',
      quantity: '50 bags (90kg each)',
      price: 'KES 4,500 per bag',
      quality: 'Grade A',
      location: 'Kitale, Trans Nzoia',
      farmer: 'Samuel Wekesa',
      contact: '+254 700 111222',
      rating: 4.8,
      harvestDate: '2024-01-10',
      description: 'Freshly harvested yellow maize, moisture content 13.5%'
    },
    {
      id: '2',
      name: 'Organic Tomatoes',
      category: 'Vegetables',
      quantity: '200 crates (20kg each)',
      price: 'KES 800 per crate',
      quality: 'Premium',
      location: 'Naivasha, Nakuru',
      farmer: 'Grace Muthoni',
      contact: '+254 701 222333',
      rating: 4.9,
      harvestDate: '2024-01-12',
      description: 'Certified organic Roma tomatoes, perfect for processing'
    },
    {
      id: '3',
      name: 'French Beans',
      category: 'Vegetables',
      quantity: '100 kg',
      price: 'KES 120 per kg',
      quality: 'Export Grade',
      location: 'Meru County',
      farmer: 'John Mwenda',
      contact: '+254 702 333444',
      rating: 4.7,
      harvestDate: '2024-01-13',
      description: 'Export quality French beans, ready for immediate delivery'
    }
  ];

  const filteredProduce = sampleProduceListings.filter(produce => {
    const matchesSearch = produce.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produce.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || produce.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(sampleProduceListings.map(p => p.category)));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[400px] flex items-center justify-center text-white mb-12">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              alt="Agricultural Marketplace" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>
          
          <div className="relative z-10 container mx-auto px-6">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-orange-500 hover:bg-orange-600 border-none text-white px-4 py-1 text-base">
                Fresh Produce
              </Badge>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Agricultural <br/>
                <span className="text-orange-400">Marketplace</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl">
                Buy fresh agricultural produce directly from verified farmers. Fair prices, quality guaranteed.
              </p>
              
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Verified Farmers
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Quality Checks
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Secure Payment
                 </div>
              </div>
            </div>
        </div>
      </div>

        <div className="px-6 max-w-7xl mx-auto">
          <div className="mb-8">
            {/* Search Filters area starts here, removing old header title/desc */}
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search produce..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredProduce.map((produce) => (
            <Card key={produce.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{produce.name}</CardTitle>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="secondary">{produce.category}</Badge>
                      <Badge variant="default">{produce.quality}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary mb-1">{produce.price}</div>
                    <div className="text-sm text-muted-foreground">Available: {produce.quantity}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{produce.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{produce.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{produce.farmer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{produce.rating}/5.0</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Harvest Date:</div>
                    <div className="text-sm font-medium mb-2">
                      {new Date(produce.harvestDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">Freshness:</div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Fresh (2 days)
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1">Contact Farmer</Button>
                  <Button variant="outline">Add to Cart</Button>
                  <Button variant="outline">Request Quote</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProduce.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No produce found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        )}
        </div>
      </main>
    </div>
  );
};

export default MarketplaceView;
