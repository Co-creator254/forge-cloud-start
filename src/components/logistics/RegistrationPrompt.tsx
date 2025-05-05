
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RegistrationPrompt: React.FC = () => {
  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle>Register Your Service</CardTitle>
        <CardDescription>
          Are you a logistics provider? Register your service to appear on our map.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button variant="default" onClick={() => window.location.href = "/service-provider-registration"}>
            Register as Service Provider
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/transporter-signup"}>
            Register as Transporter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationPrompt;
