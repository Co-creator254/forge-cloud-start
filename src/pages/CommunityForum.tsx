
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, TrendingUp } from 'lucide-react';

const CommunityForum: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Community Forum</h1>
        <p className="text-muted-foreground">Connect with fellow farmers and agricultural experts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Discussions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Join ongoing conversations about farming practices, market trends, and more.</p>
            <Button className="mt-4 w-full">View Discussions</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Connect with farmers, experts, and agricultural professionals.</p>
            <Button className="mt-4 w-full">Join Community</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Stay updated with the latest trending discussions and topics.</p>
            <Button className="mt-4 w-full">Explore Trends</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityForum;
