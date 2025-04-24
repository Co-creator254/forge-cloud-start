
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ServiceProviderType } from "@/types";
import { registerServiceProvider } from "@/services/serviceProvidersAPI";
import { useToast } from "@/hooks/use-toast";

const kenyaCounties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa", "Homa Bay", 
  "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", 
  "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", 
  "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", 
  "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka Nithi", 
  "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

const formSchema = z.object({
  name: z.string().min(3, "Business name must be at least 3 characters"),
  businessType: z.enum(["storage", "transport", "quality-control", "training", "input-supplier", "inspector", "market-linkage"] as const),
  description: z.string().min(20, "Description must be at least 20 characters"),
  services: z.string().min(3, "Please list at least one service"),
  county: z.string().min(1, "Please select a county"),
  specificLocation: z.string().min(3, "Please provide a specific location"),
  contactInfo: z.string().min(10, "Please provide valid contact information"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  tags: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

type FormData = z.infer<typeof formSchema>;

const ServiceProviderRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      businessType: "storage",
      description: "",
      services: "",
      county: "",
      specificLocation: "",
      contactInfo: "",
      website: "",
      tags: "",
      termsAccepted: false
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Process the services and tags from comma-separated strings to arrays
      const services = data.services.split(',').map(service => service.trim());
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
      
      await registerServiceProvider({
        name: data.name,
        businessType: data.businessType as ServiceProviderType,
        description: data.description,
        services,
        location: {
          county: data.county,
          specificLocation: data.specificLocation
        },
        contactInfo: data.contactInfo,
        website: data.website || undefined,
        tags
      });
      
      toast({
        title: "Registration successful",
        description: "Your service provider profile has been submitted for verification.",
      });
      
      navigate("/service-providers");
    } catch (error) {
      console.error("Error registering service provider:", error);
      toast({
        title: "Registration failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="hidden md:block">
            <MainNav />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Register as a Service Provider</h1>
            <p className="text-muted-foreground mt-2">
              Join our directory to showcase your agricultural services to farmers across Kenya
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Please provide accurate information about your business. All submissions are reviewed before being published.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., AgroCool Storage Solutions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select business type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="storage">Storage Facility</SelectItem>
                              <SelectItem value="transport">Transport Service</SelectItem>
                              <SelectItem value="quality-control">Quality Control</SelectItem>
                              <SelectItem value="training">Training Provider</SelectItem>
                              <SelectItem value="input-supplier">Input Supplier</SelectItem>
                              <SelectItem value="inspector">Inspector</SelectItem>
                              <SelectItem value="market-linkage">Market Linkage</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="county"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>County</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select county" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {kenyaCounties.map((county) => (
                                <SelectItem key={county} value={county}>{county}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="specificLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specific Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Industrial Area, Nakuru Town" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide a more specific location within the county
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your services, experience, and what makes your business unique..." 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Services Offered</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cold storage, Dry storage, Inventory management" {...field} />
                        </FormControl>
                        <FormDescription>
                          List your services separated by commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., organic, certified, nationwide" {...field} />
                        </FormControl>
                        <FormDescription>
                          Add keywords that describe your business, separated by commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Information</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., info@example.com | +254712345678" {...field} />
                          </FormControl>
                          <FormDescription>
                            Email and/or phone number where clients can reach you
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I accept the terms and conditions
                          </FormLabel>
                          <FormDescription>
                            By submitting this form, you agree to our privacy policy and terms of service.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Registration"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 items-start text-sm text-muted-foreground">
              <p>
                Once submitted, your registration will be reviewed by our team for verification.
              </p>
              <p>
                This process typically takes 1-2 business days. You'll receive a confirmation email once approved.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ServiceProviderRegistration;
