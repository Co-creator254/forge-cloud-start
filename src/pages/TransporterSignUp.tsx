
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Truck, Check, MapPin, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Form validation schema
const transporterSchema = z.object({
  businessName: z.string().min(3, "Business name must be at least 3 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  counties: z.array(z.string()).min(1, "Please select at least one county"),
  businessReg: z.string().optional(),
  yearsInBusiness: z.string().min(1, "Please select years in business"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  vehicleType: z.string().min(1, "Please select a vehicle type"),
  vehicleCount: z.string().min(1, "Please select number of vehicles"),
  loadCapacity: z.string().min(1, "Please select load capacity"),
  rates: z.string().min(3, "Please provide your rates"),
  availableTimes: z.array(z.string()).min(1, "Please select at least one available time"),
  specialFeatures: z.array(z.string()).optional(),
});

const TransporterSignUp: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [user, setUser] = useState<any>(null);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [businessReg, setBusinessReg] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [description, setDescription] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleCount, setVehicleCount] = useState('');
  const [loadCapacity, setLoadCapacity] = useState('');
  const [rates, setRates] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [specialFeatures, setSpecialFeatures] = useState<string[]>([]);
  
  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Meru', 'Kakamega', 
    'Nyeri', 'Machakos', 'Uasin Gishu', 'Kirinyaga', 'Bungoma', 'Bomet'
  ];

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleCountySelection = (county: string) => {
    if (selectedCounties.includes(county)) {
      setSelectedCounties(selectedCounties.filter(c => c !== county));
    } else {
      setSelectedCounties([...selectedCounties, county]);
    }
  };

  const handleAvailableTimeToggle = (time: string) => {
    if (availableTimes.includes(time)) {
      setAvailableTimes(availableTimes.filter(t => t !== time));
    } else {
      setAvailableTimes([...availableTimes, time]);
    }
  };

  const handleSpecialFeatureToggle = (feature: string) => {
    if (specialFeatures.includes(feature)) {
      setSpecialFeatures(specialFeatures.filter(f => f !== feature));
    } else {
      setSpecialFeatures([...specialFeatures, feature]);
    }
  };

  const validateFormStep1 = () => {
    try {
      const step1Data = {
        businessName,
        phone,
        email,
        counties: selectedCounties,
        businessReg,
        yearsInBusiness,
        description
      };
      
      // Partial validation for step 1 fields only
      const step1Schema = transporterSchema.pick({
        businessName: true,
        phone: true,
        email: true,
        counties: true,
        yearsInBusiness: true,
        description: true
      });
      
      step1Schema.parse(step1Data);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setFormErrors(newErrors);
      }
      return false;
    }
  };

  const validateFormStep2 = () => {
    try {
      const step2Data = {
        vehicleType,
        vehicleCount,
        loadCapacity,
        rates,
        availableTimes,
        specialFeatures
      };
      
      // Partial validation for step 2 fields only
      const step2Schema = transporterSchema.pick({
        vehicleType: true,
        vehicleCount: true,
        loadCapacity: true,
        rates: true,
        availableTimes: true,
        specialFeatures: true
      });
      
      step2Schema.parse(step2Data);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setFormErrors(newErrors);
      }
      return false;
    }
  };

  const handleNextStep = () => {
    if (validateFormStep1()) {
      setFormStep(2);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before continuing.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormStep2()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to register as a transporter.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Prepare data for insertion
      const transporterData = {
        user_id: user.id,
        name: businessName,
        service_type: "transport",
        counties: selectedCounties,
        contact_info: `${phone} | ${email}`,
        capacity: vehicleCount,
        load_capacity: parseInt(loadCapacity.split('-')[0]) || 1000,
        rates: rates,
        has_refrigeration: specialFeatures.includes('refrigeration'),
        vehicle_type: vehicleType
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('transporters')
        .insert(transporterData)
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Registration Successful",
        description: "Your transporter account has been created. You'll start receiving transport requests soon.",
      });
      
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
                {!user && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-700">
                      You are not logged in. Please <a href="/login" className="text-primary font-medium">sign in</a> or 
                      <a href="/signup" className="text-primary font-medium"> create an account</a> to register as a transporter.
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className={formErrors.businessName ? "text-destructive" : ""}>
                        Business Name*
                      </Label>
                      <Input 
                        id="businessName"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Your transport company name"
                        className={formErrors.businessName ? "border-destructive" : ""}
                      />
                      {formErrors.businessName && (
                        <p className="text-xs text-destructive">{formErrors.businessName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className={formErrors.phone ? "text-destructive" : ""}>
                        Phone Number*
                      </Label>
                      <Input 
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+254..."
                        className={formErrors.phone ? "border-destructive" : ""}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-destructive">{formErrors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className={formErrors.email ? "text-destructive" : ""}>
                        Email Address*
                      </Label>
                      <Input 
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@yourcompany.com"
                        className={formErrors.email ? "border-destructive" : ""}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-destructive">{formErrors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className={formErrors.counties ? "text-destructive" : ""}>Counties Served*</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {counties.map((county) => (
                          <div key={county} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`county-${county}`} 
                              checked={selectedCounties.includes(county)}
                              onCheckedChange={() => handleCountySelection(county)}
                            />
                            <label 
                              htmlFor={`county-${county}`} 
                              className="text-sm cursor-pointer"
                            >
                              {county}
                            </label>
                          </div>
                        ))}
                      </div>
                      {formErrors.counties && (
                        <p className="text-xs text-destructive">{formErrors.counties}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessReg">
                        Business Registration Number (Optional)
                      </Label>
                      <Input 
                        id="businessReg"
                        value={businessReg}
                        onChange={(e) => setBusinessReg(e.target.value)}
                        placeholder="KE12345678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsInBusiness" className={formErrors.yearsInBusiness ? "text-destructive" : ""}>
                        Years in Business*
                      </Label>
                      <Select value={yearsInBusiness} onValueChange={setYearsInBusiness}>
                        <SelectTrigger className={formErrors.yearsInBusiness ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select years" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<1">Less than 1 year</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5+">More than 5 years</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.yearsInBusiness && (
                        <p className="text-xs text-destructive">{formErrors.yearsInBusiness}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className={formErrors.description ? "text-destructive" : ""}>
                      Business Description*
                    </Label>
                    <Textarea 
                      id="description" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us more about your transport services..."
                      rows={4}
                      className={formErrors.description ? "border-destructive" : ""}
                    />
                    {formErrors.description && (
                      <p className="text-xs text-destructive">{formErrors.description}</p>
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNextStep} disabled={!user}>
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
                      <Label htmlFor="vehicleType" className={formErrors.vehicleType ? "text-destructive" : ""}>
                        Vehicle Type*
                      </Label>
                      <Select value={vehicleType} onValueChange={setVehicleType}>
                        <SelectTrigger className={formErrors.vehicleType ? "border-destructive" : ""}>
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
                      {formErrors.vehicleType && (
                        <p className="text-xs text-destructive">{formErrors.vehicleType}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleCount" className={formErrors.vehicleCount ? "text-destructive" : ""}>
                        Number of Vehicles*
                      </Label>
                      <Select value={vehicleCount} onValueChange={setVehicleCount}>
                        <SelectTrigger className={formErrors.vehicleCount ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2-5">2-5</SelectItem>
                          <SelectItem value="6-10">6-10</SelectItem>
                          <SelectItem value="10+">More than 10</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.vehicleCount && (
                        <p className="text-xs text-destructive">{formErrors.vehicleCount}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loadCapacity" className={formErrors.loadCapacity ? "text-destructive" : ""}>
                        Load Capacity*
                      </Label>
                      <Select value={loadCapacity} onValueChange={setLoadCapacity}>
                        <SelectTrigger className={formErrors.loadCapacity ? "border-destructive" : ""}>
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
                      {formErrors.loadCapacity && (
                        <p className="text-xs text-destructive">{formErrors.loadCapacity}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rates" className={formErrors.rates ? "text-destructive" : ""}>
                        Average Rates*
                      </Label>
                      <Input 
                        id="rates" 
                        value={rates}
                        onChange={(e) => setRates(e.target.value)}
                        placeholder="e.g., KES 5,000 per trip"
                        className={formErrors.rates ? "border-destructive" : ""}
                      />
                      {formErrors.rates && (
                        <p className="text-xs text-destructive">{formErrors.rates}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label 
                        htmlFor="availableTimes" 
                        className={formErrors.availableTimes ? "text-destructive" : ""}
                      >
                        Available Times*
                      </Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="morning" 
                            checked={availableTimes.includes('morning')}
                            onCheckedChange={() => handleAvailableTimeToggle('morning')}
                          />
                          <label htmlFor="morning" className="text-sm">Morning (5AM-11AM)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="afternoon" 
                            checked={availableTimes.includes('afternoon')}
                            onCheckedChange={() => handleAvailableTimeToggle('afternoon')}
                          />
                          <label htmlFor="afternoon" className="text-sm">Afternoon (11AM-4PM)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="evening" 
                            checked={availableTimes.includes('evening')}
                            onCheckedChange={() => handleAvailableTimeToggle('evening')}
                          />
                          <label htmlFor="evening" className="text-sm">Evening (4PM-9PM)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="night" 
                            checked={availableTimes.includes('night')}
                            onCheckedChange={() => handleAvailableTimeToggle('night')}
                          />
                          <label htmlFor="night" className="text-sm">Night (9PM-5AM)</label>
                        </div>
                      </div>
                      {formErrors.availableTimes && (
                        <p className="text-xs text-destructive">{formErrors.availableTimes}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Special Features</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="refrigeration" 
                            checked={specialFeatures.includes('refrigeration')}
                            onCheckedChange={() => handleSpecialFeatureToggle('refrigeration')}
                          />
                          <label htmlFor="refrigeration" className="text-sm">Refrigerated Transport</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="tracking" 
                            checked={specialFeatures.includes('tracking')}
                            onCheckedChange={() => handleSpecialFeatureToggle('tracking')}
                          />
                          <label htmlFor="tracking" className="text-sm">GPS Tracking</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="insurance" 
                            checked={specialFeatures.includes('insurance')}
                            onCheckedChange={() => handleSpecialFeatureToggle('insurance')}
                          />
                          <label htmlFor="insurance" className="text-sm">Cargo Insurance</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="loading" 
                            checked={specialFeatures.includes('loading')}
                            onCheckedChange={() => handleSpecialFeatureToggle('loading')}
                          />
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
                <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
              </CardFooter>
            </>
          )}
        </Card>
      </main>
    </div>
  );
};

export default TransporterSignUp;
