
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Truck, Check, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TransporterSignUp: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  
  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Meru', 'Kakamega', 
    'Nyeri', 'Machakos', 'Uasin Gishu', 'Kirinyaga', 'Bungoma', 'Bomet'
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Registration Successful",
        description: "Your transporter account has been created. You'll start receiving transport requests soon.",
      });
      
      // Reset form or redirect
      setFormStep(3); // Success step
    } catch (error) {
      console.error("Error submitting transporter data:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Transport Provider Registration</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join our network of transport providers and connect with farmers who need to move their produce to markets
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
              formStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              1
            </div>
            <div className={`h-1 w-12 ${formStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
              formStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              2
            </div>
            <div className={`h-1 w-12 ${formStep >= 3 ? "bg-primary" : "bg-muted"}`}></div>
            <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
              formStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              3
            </div>
          </div>
        </div>
        
        <Card className="max-w-4xl mx-auto">
          {formStep === 1 && (
            <>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Tell us about your transport business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input id="businessName" placeholder="Your transport company name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+254..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="contact@yourcompany.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="counties">Counties Served</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select counties" />
                        </SelectTrigger>
                        <SelectContent>
                          {counties.map(county => (
                            <SelectItem key={county} value={county}>{county}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">You can select multiple counties</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessReg">Business Registration Number (Optional)</Label>
                      <Input id="businessReg" placeholder="KE12345678" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsInBusiness">Years in Business</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select years" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<1">Less than 1 year</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5+">More than 5 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Tell us more about your transport services..."
                      rows={4}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => setFormStep(2)}>
                  Continue
                </Button>
              </CardFooter>
            </>
          )}
          
          {formStep === 2 && (
            <>
              <CardHeader>
                <CardTitle>Vehicle & Service Details</CardTitle>
                <CardDescription>
                  Tell us about your transportation capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Vehicle Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="truck-small">Truck (3-5 tons)</SelectItem>
                          <SelectItem value="truck-medium">Truck (5-10 tons)</SelectItem>
                          <SelectItem value="truck-large">Heavy Truck (10+ tons)</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleCount">Number of Vehicles</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2-5">2-5</SelectItem>
                          <SelectItem value="6-10">6-10</SelectItem>
                          <SelectItem value="10+">More than 10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Load Capacity</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select capacity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<1">Less than 1 ton</SelectItem>
                          <SelectItem value="1-3">1-3 tons</SelectItem>
                          <SelectItem value="3-5">3-5 tons</SelectItem>
                          <SelectItem value="5-10">5-10 tons</SelectItem>
                          <SelectItem value="10+">More than 10 tons</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rates">Average Rates</Label>
                      <Input id="rates" placeholder="e.g., KES 5,000 per trip" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availableTimes">Available Times</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="morning" />
                          <label htmlFor="morning" className="text-sm">Morning (5AM-11AM)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="afternoon" />
                          <label htmlFor="afternoon" className="text-sm">Afternoon (11AM-4PM)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="evening" />
                          <label htmlFor="evening" className="text-sm">Evening (4PM-9PM)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="night" />
                          <label htmlFor="night" className="text-sm">Night (9PM-5AM)</label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Special Features</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="refrigeration" />
                          <label htmlFor="refrigeration" className="text-sm">Refrigerated Transport</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="tracking" />
                          <label htmlFor="tracking" className="text-sm">GPS Tracking</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="insurance" />
                          <label htmlFor="insurance" className="text-sm">Cargo Insurance</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="loading" />
                          <label htmlFor="loading" className="text-sm">Loading/Unloading Service</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setFormStep(1)}>
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Complete Registration"}
                </Button>
              </CardFooter>
            </>
          )}
          
          {formStep === 3 && (
            <>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center">Registration Complete!</CardTitle>
                <CardDescription className="text-center">
                  Thank you for joining our transport provider network
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <p>Your account has been successfully created. You will start receiving transport requests from farmers in your area soon.</p>
                  
                  <div className="flex flex-col items-center space-y-3 my-6">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-5 w-5 text-primary" />
                      <span>Access to transport requests in your regions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Geographic route planning and optimization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>Verified transporter badge on the platform</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button>Go to Dashboard</Button>
              </CardFooter>
            </>
          )}
        </Card>
      </main>
    </div>
  );
};

export default TransporterSignUp;
