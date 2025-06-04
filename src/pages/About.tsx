
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>About AgriConnect</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            AgriConnect is a comprehensive agricultural platform connecting farmers, 
            traders, and service providers to create a more efficient agricultural ecosystem.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
