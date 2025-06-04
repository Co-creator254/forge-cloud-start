
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2>Acceptance of Terms</h2>
          <p>By using AgriConnect, you agree to these terms of service.</p>
          
          <h2>Use of Service</h2>
          <p>You may use our service for lawful agricultural trading and communication purposes.</p>
          
          <h2>User Responsibilities</h2>
          <p>Users are responsible for the accuracy of information they provide.</p>
          
          <h2>Limitation of Liability</h2>
          <p>AgriConnect is not liable for any indirect damages arising from use of the service.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfServicePage;
