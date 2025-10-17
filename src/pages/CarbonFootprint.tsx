import { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, TrendingDown, Award, BarChart3, Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CarbonEmission {
  id: string;
  user_id: string;
  entity_type: string;
  activity_type: string;
  emission_source: string;
  quantity: number;
  unit: string;
  co2_equivalent: number;
  date_recorded: string;
  location?: string;
  county?: string;
  verified: boolean;
  created_at: string;
}

interface CarbonOffsetProject {
  id: string;
  project_name: string;
  project_type: string;
  organizer_id: string;
  location: string;
  county: string;
  description: string;
  carbon_offset_potential: number;
  cost_per_tonne: number;
  currency: string;
  status: string;
  participants_count: number;
  created_at: string;
}

const CarbonFootprint = () => {
  const { toast } = useToast();
  const [emissions, setEmissions] = useState<CarbonEmission[]>([]);
  const [offsetProjects, setOffsetProjects] = useState<CarbonOffsetProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tracking");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to view carbon tracking.",
          variant: "destructive",
        });
        return;
      }

      // Fetch emissions
      const { data: emissionsData, error: emissionsError } = await supabase
        .from('carbon_emissions')
        .select('*')
        .eq('user_id', user.id)
        .order('date_recorded', { ascending: false });

      if (emissionsError) throw emissionsError;

      // Fetch offset projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('carbon_offset_projects')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      setEmissions(emissionsData || []);
      setOffsetProjects(projectsData || []);
    } catch (error) {
      console.error('Error fetching carbon data:', error);
      toast({
        title: "Error",
        description: "Failed to load carbon tracking data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalEmissions = emissions.reduce((sum, e) => sum + e.co2_equivalent, 0);
  const verifiedEmissions = emissions.filter(e => e.verified).length;

  return (
    <div className="flex min-h-screen flex-col pb-20 md:pb-0">
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Leaf className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Carbon Footprint Tracking</h1>
              <p className="text-xl mb-8">
                Measure, reduce, and offset your agricultural carbon emissions
              </p>
              <Button size="lg" variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                Record Emissions
              </Button>
            </div>
          </div>
        </section>

        <div className="container px-4 py-12">
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <Leaf className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">{totalEmissions.toFixed(1)}</div>
                <p className="text-sm text-muted-foreground">Total CO₂e (tonnes)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingDown className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">{emissions.length}</div>
                <p className="text-sm text-muted-foreground">Emission Records</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">{verifiedEmissions}</div>
                <p className="text-sm text-muted-foreground">Verified</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">{offsetProjects.length}</div>
                <p className="text-sm text-muted-foreground">Offset Projects</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tracking">Emission Tracking</TabsTrigger>
              <TabsTrigger value="offsets">Carbon Offsets</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="tracking" className="mt-6">
              {isLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <Card key={n} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : emissions.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Leaf className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No emissions recorded</h3>
                    <p className="text-muted-foreground mb-4">
                      Start tracking your carbon emissions to understand your environmental impact.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Record First Emission
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {emissions.map((emission) => (
                    <Card key={emission.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{emission.activity_type}</CardTitle>
                            <CardDescription>{emission.emission_source}</CardDescription>
                          </div>
                          {emission.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <Award className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">CO₂ Equivalent</span>
                          <span className="font-semibold text-lg">{emission.co2_equivalent.toFixed(2)} tonnes</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Quantity</span>
                          <span>{emission.quantity} {emission.unit}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Entity Type</span>
                          <Badge variant="outline">{emission.entity_type}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(emission.date_recorded).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="offsets" className="mt-6">
              {isLoading ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <Card key={n} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : offsetProjects.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Leaf className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No offset projects available</h3>
                    <p className="text-muted-foreground">
                      Check back soon for carbon offset opportunities.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {offsetProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2">{project.project_name}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline">{project.project_type}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {project.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Offset Potential</span>
                            <span className="font-semibold">{project.carbon_offset_potential} tonnes/year</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Cost per Tonne</span>
                            <span className="font-semibold">{project.currency} {project.cost_per_tonne}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Location</span>
                            <span>{project.county}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Participants</span>
                            <span>{project.participants_count}</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4">
                          Purchase Offsets
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Carbon Insights & Analytics</CardTitle>
                  <CardDescription>
                    Detailed breakdown and trends of your carbon emissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>Carbon analytics and visualization coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default CarbonFootprint;