
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BriefcaseBusiness, Users, Building, MapPin } from 'lucide-react';

// Sample jobs data (to be replaced with real API integration)
const SAMPLE_JOBS = [
  {
    id: 'j1',
    title: 'Agricultural Extension Officer',
    company: 'Ministry of Agriculture',
    location: 'Nairobi County',
    type: 'Full-time',
    salary: 'KES 60,000 - 80,000 per month',
    description: 'Provide technical advice and support to farmers on modern agricultural practices, pest management, and crop selection.',
    requirements: 'Bachelor\'s degree in Agriculture or related field. 3+ years experience in extension services.',
    postedDate: '2023-10-15',
    contactEmail: 'careers@agriculture.go.ke'
  },
  {
    id: 'j2',
    title: 'Farm Manager',
    company: 'Green Valley Farms',
    location: 'Nakuru County',
    type: 'Full-time',
    salary: 'KES 70,000 - 100,000 per month',
    description: 'Oversee day-to-day operations of a 50-acre mixed crop and dairy farm. Supervise farm workers and implement modern farming techniques.',
    requirements: 'Diploma or Degree in Agriculture. 5+ years of farm management experience.',
    postedDate: '2023-10-20',
    contactEmail: 'hr@greenvalley.co.ke'
  },
  {
    id: 'j3',
    title: 'Agricultural Data Analyst',
    company: 'AgriTech Solutions Ltd',
    location: 'Mombasa County',
    type: 'Remote',
    salary: 'KES 90,000 - 120,000 per month',
    description: 'Analyze agricultural data to provide insights for improving farm productivity and sustainability.',
    requirements: 'Bachelor\'s in Data Science, Statistics, or Agriculture. Experience with agricultural data and analytics tools.',
    postedDate: '2023-10-25',
    contactEmail: 'careers@agritechsolutions.com'
  },
  {
    id: 'j4',
    title: 'Livestock Extension Officer',
    company: 'Kenya Livestock Research Organization',
    location: 'Machakos County',
    type: 'Full-time',
    salary: 'KES 55,000 - 75,000 per month',
    description: 'Provide technical support to livestock farmers on animal husbandry, health management, and breed improvement.',
    requirements: 'Degree in Veterinary Science or Animal Husbandry. 2+ years experience in livestock extension.',
    postedDate: '2023-11-02',
    contactEmail: 'jobs@klro.org'
  },
  {
    id: 'j5',
    title: 'Irrigation Technician',
    company: 'Water Harvest Kenya',
    location: 'Kajiado County',
    type: 'Contract',
    salary: 'KES 45,000 - 60,000 per month',
    description: 'Install, maintain, and repair irrigation systems for small-scale and commercial farmers.',
    requirements: 'Diploma in Water Engineering or related field. Experience with modern irrigation systems.',
    postedDate: '2023-11-05',
    contactEmail: 'info@waterharvest.co.ke'
  }
];

const JobsAPI: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('jobs');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState(SAMPLE_JOBS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Filter jobs based on search criteria
    let filteredJobs = [...SAMPLE_JOBS];
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) || 
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (location) {
      const locationTerm = location.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(locationTerm)
      );
    }
    
    if (jobType) {
      filteredJobs = filteredJobs.filter(job => 
        job.type.toLowerCase() === jobType.toLowerCase()
      );
    }
    
    // Simulate API delay
    setTimeout(() => {
      setJobs(filteredJobs);
      setIsLoading(false);
      toast({
        title: "Jobs Loaded",
        description: `Found ${filteredJobs.length} jobs matching your criteria`,
      });
    }, 800);
  };

  const handleTryAPI = () => {
    const apiCall = `
// Example API call for agricultural jobs
import { fetchJobs } from 'agritender-api';

// Get all jobs
const allJobs = await fetchJobs();

// Filter by location and type
const filteredJobs = await fetchJobs({
  location: 'Nairobi',
  jobType: 'Full-time',
  searchTerm: 'agriculture'
});
`;
    navigator.clipboard.writeText(apiCall);
    toast({
      title: "API Example Copied",
      description: "Example code for the jobs API endpoint has been copied to your clipboard",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto pt-24">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Agricultural Jobs API</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Access agricultural job opportunities across Kenya through our comprehensive jobs API.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Jobs API Explorer</CardTitle>
            <CardDescription>
              Browse through available agricultural jobs and opportunities across Kenya
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
                <TabsTrigger value="jobs" className="flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4" />
                  <span>Available Jobs</span>
                </TabsTrigger>
                <TabsTrigger value="employers" className="flex items-center gap-2" disabled>
                  <Building className="h-4 w-4" />
                  <span>Employers (Coming Soon)</span>
                </TabsTrigger>
                <TabsTrigger value="training" className="flex items-center gap-2" disabled>
                  <Users className="h-4 w-4" />
                  <span>Training Opportunities (Coming Soon)</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 mb-4">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      placeholder="Job title, keywords..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="County, city..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobType">Job Type</Label>
                    <select 
                      id="jobType" 
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md mt-1"
                    >
                      <option value="">All Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? 'Loading...' : 'Search Jobs'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleTryAPI}
                    >
                      Copy API Example
                    </Button>
                  </div>
                </form>
              </div>

              <TabsContent value="jobs" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <Card key={job.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{job.title}</CardTitle>
                              <CardDescription>{job.company}</CardDescription>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                                {job.type}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            <div>
                              <span className="font-medium">Salary:</span> {job.salary}
                            </div>
                            <div>
                              <span className="font-medium">Description:</span> {job.description}
                            </div>
                            <div>
                              <span className="font-medium">Requirements:</span> {job.requirements}
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">Posted:</span> {job.postedDate}
                              </div>
                              <Button size="sm">Apply Now</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No jobs found. Try adjusting your search criteria.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button variant="default" onClick={() => navigate('/supply-chain-api')}>
              Go to Supply Chain API
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-16 bg-muted/30 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Jobs API Documentation</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Endpoints</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><code>/jobs</code> - Agricultural job listings</li>
                <li><code>/employers</code> - Information about agricultural employers (Coming Soon)</li>
                <li><code>/training</code> - Agricultural training opportunities (Coming Soon)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">How to Use This API</h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li>Register for an API key using the form below</li>
                <li>Include your API key in the Authorization header</li>
                <li>Make GET requests to the endpoints listed above</li>
                <li>Filter results by adding query parameters (e.g., ?location=Nairobi&type=Full-time)</li>
                <li>Handle the JSON response in your application</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Authentication</h3>
              <p>API access requires an API key. Fill out the form below to request your API key:</p>
              <div className="mt-4 p-4 border rounded-lg bg-background">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Input id="organization" placeholder="Your company or organization" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input id="purpose" placeholder="How you plan to use the API" className="mt-1" />
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    className="w-full md:w-auto"
                    onClick={() => {
                      toast({
                        title: "Request Submitted",
                        description: "Your API key request has been submitted successfully. We'll email you with your API key shortly.",
                      });
                    }}
                  >
                    Request API Key
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-muted/30 py-8 px-6 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto">
          <p>© {new Date().getFullYear()} AgriTender Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default JobsAPI;
