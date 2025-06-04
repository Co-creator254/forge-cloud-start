
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2>Data Collection</h2>
          <p>We collect information to provide better services to our users.</p>
          
          <h2>Data Usage</h2>
          <p>Your data is used to improve our agricultural platform and services.</p>
          
          <h2>Data Protection</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>
          
          <h2>Contact Information</h2>
          <p>For privacy-related questions, contact us at privacy@agriconnect.com</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
