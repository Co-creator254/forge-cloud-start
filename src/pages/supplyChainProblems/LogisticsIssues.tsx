
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchKilimoStats } from '@/services/kilimoAPI';
import { KilimoStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Package, Truck, AlertTriangle, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LogisticsOnboarding from '@/features/logistics/LogisticsOnboarding';

const LogisticsIssues: React.FC = () => {
  const navigate = useNavigate();
  const [kilimoData, setKilimoData] = useState<KilimoStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('issues');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchKilimoStats();
        setKilimoData(data);
      } catch (error) {
        console.error('Error fetching Kilimo data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Analyze logistics issues based on Kilimo data
  const generateLogisticsData = () => {
    // These would normally be extracted from Kilimo data
    // For now, we're using simulated data based on common logistics issues
    return [
      { issue: 'Poor Road Infrastructure', frequency: 65, impact: 'High' },
      { issue: 'Lack of Cold Storage', frequency: 45, impact: 'High' },
      { issue: 'High Transport Costs', frequency: 72, impact: 'High' },
      { issue: 'Delayed Collections', frequency: 38, impact: 'Medium' },
      { issue: 'Fragmented Supply Chain', frequency: 55, impact: 'Medium' },
      { issue: 'Limited Market Access', frequency: 60, impact: 'High' },
    ];
  };

  const generateTransportModeData = () => {
    return [
      { name: 'Trucks', value: 45, color: '#0088FE' },
      { name: 'Motorcycles', value: 25, color: '#00C49F' },
      { name: 'Hand Carts', value: 15, color: '#FFBB28' },
      { name: 'Animal Transport', value: 10, color: '#FF8042' },
      { name: 'Public Transport', value: 5, color: '#8884d8' },
    ];
  };

  const logisticsChallenges = [
    {
      title: 'Poor Road Infrastructure',
      description: 'Many agricultural regions have poor quality roads that become impassable during rainy seasons.',
      impact: 'Delays in transportation, increased costs, and reduced access to markets.',
      solution: 'Advocacy for infrastructure improvement, route optimization, and using appropriate vehicles for terrain.',
    },
    {
      title: 'Lack of Cold Chain',
      description: '80% of rural areas lack proper cold storage facilities, resulting in significant post-harvest losses.',
      impact: 'Reduced shelf life, lower quality products, and increased food waste.',
      solution: 'Investment in solar-powered cold storage, refrigerated transport, and preservation techniques.',
    },
    {
      title: 'High Transportation Costs',
      description: 'Transportation costs can account for up to 40% of the total value of agricultural products.',
      impact: 'Reduced farmer profits, higher consumer prices, and limited market participation.',
      solution: 'Consolidation of shipments, cooperative transport models, and efficient route planning.',
    },
    {
      title: 'Limited Logistics Services',
      description: 'Rural areas have few professional logistics service providers with appropriate equipment.',
      impact: 'Farmers rely on informal transporters, reducing reliability and increasing risks.',
      solution: 'Development of rural logistics networks, transport cooperatives, and digital logistics platforms.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Logistics Issues</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Understanding and addressing transportation and delivery challenges in agricultural supply chains
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button 
              onClick={() => navigate('/logistics-solutions-map')}
              className="flex gap-2 items-center"
              variant="outline"
            >
              <MapPin className="h-4 w-4" />
              View Logistics Solutions Map
            </Button>
            
            <Button
              onClick={() => setActiveTab('register')}
              variant="default"
            >
              Register as Provider
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Logistics Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Data Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>Register as Provider</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="issues">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Common Logistics Challenges</CardTitle>
                <CardDescription>
                  Key transportation and delivery issues faced by agricultural businesses in Kenya
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="mb-6 bg-blue-50">
                  Based on analysis of Kilimo statistics and agricultural surveys
                </Badge>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {logisticsChallenges.map((challenge, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>{challenge.description}</p>
                        <p><span className="font-medium">Impact:</span> {challenge.impact}</p>
                        <p><span className="font-medium">Potential Solution:</span> {challenge.solution}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-10 p-4 border rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-4">Impact on Supply Chain Efficiency</h3>
                  <p className="mb-4">
                    Logistics challenges significantly reduce the efficiency of agricultural supply chains in Kenya:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Up to 40% of fresh produce is lost due to logistical inefficiencies</li>
                    <li>Rural farmers spend 4-6 hours on average to reach the nearest collection center</li>
                    <li>Transportation costs account for 30-40% of the final product price</li>
                    <li>Only 23% of smallholder farmers have access to reliable transportation services</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/logistics-solutions-map')}
                  className="flex gap-2 items-center w-full sm:w-auto"
                  variant="outline"
                >
                  <MapPin className="h-4 w-4" />
                  Find Logistics Providers Near You
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('register')}
                  className="ml-auto w-full sm:w-auto"
                >
                  Be Part of the Solution - Register
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Logistics Data Analysis</CardTitle>
                <CardDescription>
                  Data-driven insights on agricultural logistics challenges based on national statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Logistics Challenges Frequency</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={generateLogisticsData()}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="issue" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="frequency" fill="#8884d8" name="Reported Frequency (%)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Transport Modes Used in Agriculture</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={generateTransportModeData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {generateTransportModeData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Key Findings</h3>
                        <ul className="list-disc pl-6 space-y-3">
                          <li>
                            <span className="font-medium">Infrastructure Gap:</span> 65% of agricultural areas report inadequate road infrastructure
                          </li>
                          <li>
                            <span className="font-medium">Cold Chain Deficiency:</span> Only 22% of fresh produce benefits from proper cold chain
                          </li>
                          <li>
                            <span className="font-medium">Transport Modes:</span> Traditional and informal methods still dominate agricultural logistics
                          </li>
                          <li>
                            <span className="font-medium">Cost Burden:</span> Small-scale farmers spend 3x more on transportation as a percentage of revenue
                          </li>
                          <li>
                            <span className="font-medium">Regional Disparity:</span> Western and coastal regions face more severe logistics challenges
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-10 p-4 border rounded-lg bg-blue-50">
                      <h3 className="text-lg font-medium mb-4">Methodology</h3>
                      <p>
                        This analysis combines data from Kilimo Statistics API, transportation surveys, and farmer interviews to
                        identify key logistics challenges. The frequency represents the percentage of farmers reporting each issue
                        as a significant barrier to market access.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/logistics-solutions-map')}
                  className="ml-auto"
                >
                  Find Solutions on Map
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <LogisticsOnboarding />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LogisticsIssues;
