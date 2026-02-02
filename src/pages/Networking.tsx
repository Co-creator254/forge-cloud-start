import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Calendar, 
  Handshake, 
  UserCheck, 
  Search, 
  MapPin, 
  MessageSquare,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Globe,
  Phone,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NetworkingEvent {
  id: string;
  title: string;
  event_type: string;
  start_date: string;
  location: string;
  county: string;
  current_participants: number;
  max_participants: number;
}

interface FarmerProfile {
  user_id: string;
  full_name: string;
  county: string;
  farming_type: string;
  bio: string;
  avatar_url: string;
}

const NetworkingPage: React.FC = () => {
  const [events, setEvents] = useState<NetworkingEvent[]>([]);
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch networking events
      const { data: eventsData } = await supabase
        .from('agricultural_events')
        .select('*')
        .eq('event_type', 'networking')
        .order('start_date', { ascending: true })
        .limit(6);

      // Fetch farmer profiles for networking
      const { data: farmersData } = await supabase
        .from('profiles')
        .select('user_id, full_name, county, farming_type, bio, avatar_url')
        .not('full_name', 'is', null)
        .limit(12);

      setEvents(eventsData || []);
      setFarmers(farmersData || []);
    } catch (error) {
      console.error('Error fetching networking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const networkingFeatures = [
    { 
      icon: <Users className="h-8 w-8 text-green-600" />, 
      title: 'Farmer Directory', 
      description: 'Connect with farmers across all 47 counties in Kenya',
      count: '5,000+'
    },
    { 
      icon: <Handshake className="h-8 w-8 text-blue-600" />, 
      title: 'Business Matching', 
      description: 'Find buyers, suppliers, and partners for your farm',
      count: '500+'
    },
    { 
      icon: <GraduationCap className="h-8 w-8 text-purple-600" />, 
      title: 'Mentorship Programs', 
      description: 'Learn from experienced farmers and agribusiness experts',
      count: '200+'
    },
    { 
      icon: <Calendar className="h-8 w-8 text-orange-600" />, 
      title: 'Networking Events', 
      description: 'Attend agricultural expos, workshops, and field days',
      count: '50+'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Agricultural Networking Hub
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Connect with farmers, buyers, suppliers, and agricultural experts across Kenya. 
            Build partnerships that grow your farm business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search farmers, events, or opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <Button size="lg" variant="secondary">
              Find Connections
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {networkingFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-3">{feature.icon}</div>
                  <div className="text-2xl font-bold text-primary mb-1">{feature.count}</div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="farmers" className="space-y-8">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
              <TabsTrigger value="farmers">Farmers</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            </TabsList>

            <TabsContent value="farmers" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Connect with Farmers</h2>
                <p className="text-muted-foreground">Find and connect with farmers across Kenya</p>
              </div>

              {loading ? (
                <div className="text-center py-12">Loading farmers...</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {farmers.length > 0 ? farmers.map((farmer) => (
                    <Card key={farmer.user_id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6 text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                          {farmer.avatar_url ? (
                            <img src={farmer.avatar_url} alt={farmer.full_name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <Users className="h-10 w-10 text-primary" />
                          )}
                        </div>
                        <h3 className="font-semibold mb-1">{farmer.full_name || 'Anonymous Farmer'}</h3>
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3" />
                          {farmer.county || 'Kenya'}
                        </div>
                        {farmer.farming_type && (
                          <Badge variant="secondary" className="mb-3">{farmer.farming_type}</Badge>
                        )}
                        <Button size="sm" className="w-full" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="col-span-full text-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No farmers found. Be the first to join!</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Networking Events</h2>
                <p className="text-muted-foreground">Upcoming agricultural networking events</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length > 0 ? events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{event.event_type}</Badge>
                        <Badge variant="outline">{event.county}</Badge>
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.start_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {event.current_participants || 0}/{event.max_participants || '∞'} participants
                        </span>
                        <Button size="sm">Register</Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No upcoming events. Check back soon!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Business Opportunities</h2>
                <p className="text-muted-foreground">Find partnerships, buyers, and investment opportunities</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-5 w-5 text-green-500" />
                      <Badge className="bg-green-100 text-green-800">Buyer Request</Badge>
                    </div>
                    <CardTitle className="text-lg">Bulk Maize Purchase</CardTitle>
                    <CardDescription>Looking for 50 tonnes of Grade A maize in Nakuru region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">View Details</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <Badge className="bg-blue-100 text-blue-800">Partnership</Badge>
                    </div>
                    <CardTitle className="text-lg">Export Partnership</CardTitle>
                    <CardDescription>Seeking farmers to supply avocados for export market</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">View Details</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-5 w-5 text-purple-500" />
                      <Badge className="bg-purple-100 text-purple-800">Mentorship</Badge>
                    </div>
                    <CardTitle className="text-lg">Dairy Farming Mentor</CardTitle>
                    <CardDescription>Experienced dairy farmer offering mentorship to beginners</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">View Details</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Network?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of farmers and agribusiness professionals on SokoConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary">
              <UserCheck className="h-4 w-4 mr-2" />
              Create Profile
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Globe className="h-4 w-4 mr-2" />
              Browse Directory
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NetworkingPage;
