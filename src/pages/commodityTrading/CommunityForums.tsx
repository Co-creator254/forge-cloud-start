
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const CommunityForums: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Community Forums</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Connect with farmers, traders, and agricultural experts across Kenya.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Agricultural Community Forums</CardTitle>
            <CardDescription>
              This feature is coming soon. Stay tuned for updates!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>The community forums will allow farmers and traders to:</p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Discuss best practices for farming and trading</li>
              <li>Share market insights and opportunities</li>
              <li>Ask questions and get expert advice</li>
              <li>Connect with potential buyers and sellers</li>
              <li>Stay updated on agricultural events and news</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CommunityForums;
