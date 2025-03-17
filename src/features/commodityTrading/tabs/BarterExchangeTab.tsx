
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import BarterListing from '../components/BarterListing';
import BarterDetails from '../components/BarterDetails';
import { mockBarterListings, mockBarterHistory, mockCommunityPosts } from '../data/barterData';

interface BarterExchangeTabProps {
  searchTerm: string;
  selectedCategory: string;
  selectedLocation: string;
  isLoading: boolean;
}

const BarterExchangeTab: React.FC<BarterExchangeTabProps> = ({ searchTerm, selectedCategory, selectedLocation, isLoading }) => {
  const [activeBarterTab, setActiveBarterTab] = useState('listings');
  const [selectedListing, setSelectedListing] = useState<any>(null);

  // Enhanced filtering for barter listings
  const filteredBarterListings = mockBarterListings.filter(listing => {
    const matchesSearch = searchTerm === '' || 
      listing.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.seekingCommodities.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All Categories' || 
      listing.commodity.toLowerCase() === selectedCategory.toLowerCase();

    const matchesLocation = selectedLocation === '' || selectedLocation === 'All Locations' ||
      listing.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Handle selecting a barter listing
  const handleSelectListing = (listing: any) => {
    setSelectedListing(listing);
  };

  const closeDetail = () => {
    setSelectedListing(null);
  };

  // Render rating stars
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : i < rating ? 'text-yellow-500 fill-yellow-500 opacity-50' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Tabs value={activeBarterTab} onValueChange={setActiveBarterTab} className="w-full">
      <TabsList className="w-full mb-6 grid grid-cols-1 sm:grid-cols-4 gap-2">
        <TabsTrigger value="listings">Available Listings</TabsTrigger>
        <TabsTrigger value="my-listings">My Listings</TabsTrigger>
        <TabsTrigger value="history">Trade History</TabsTrigger>
        <TabsTrigger value="community">Community</TabsTrigger>
      </TabsList>

      {/* Available Listings Subtab */}
      <TabsContent value="listings">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Listings Grid */}
          <div className={`grid grid-cols-1 ${selectedListing ? 'lg:w-2/3' : 'w-full'} gap-4`}>
            {filteredBarterListings.length > 0 ? (
              filteredBarterListings.map((listing) => (
                <BarterListing
                  key={listing.id}
                  listing={listing}
                  isSelected={selectedListing?.id === listing.id}
                  onSelect={handleSelectListing}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p>No listings found. Try a different search or category.</p>
              </div>
            )}
          </div>
          
          {/* Selected Listing Details */}
          {selectedListing && (
            <div className="lg:w-1/3">
              <BarterDetails listing={selectedListing} onClose={closeDetail} />
            </div>
          )}
        </div>
      </TabsContent>

      {/* My Listings Subtab */}
      <TabsContent value="my-listings">
        <div className="text-center py-8">
          <p className="mb-4">You haven't created any barter listings yet.</p>
          <Button>Create New Listing</Button>
        </div>
      </TabsContent>

      {/* Trade History Subtab */}
      <TabsContent value="history">
        {mockBarterHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>You Gave</TableHead>
                  <TableHead>You Received</TableHead>
                  <TableHead>Trading Partner</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBarterHistory.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{trade.date}</TableCell>
                    <TableCell>{trade.gaveQuantity} {trade.gaveUnit} {trade.gaveItem}</TableCell>
                    <TableCell>{trade.receivedQuantity} {trade.receivedUnit} {trade.receivedItem}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{trade.partner}</span>
                        {renderRating(trade.partnerRating)}
                      </div>
                    </TableCell>
                    <TableCell>{trade.locationMet}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {trade.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No trade history found. Complete a barter to see your history.</p>
          </div>
        )}
      </TabsContent>

      {/* Community Subtab */}
      <TabsContent value="community">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCommunityPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <Badge variant="outline">{post.commodity}</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="flex items-center mr-4">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{post.author}</span>
                    <div className="ml-2">
                      {renderRating(post.authorRating)}
                    </div>
                  </div>
                  <span>Region: {post.region}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{post.date}</span>
                  <Button size="sm" variant="ghost" className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {post.replies} replies
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default BarterExchangeTab;
