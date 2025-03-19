
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchKilimoStats } from '@/services/kilimoAPI';
import { KilimoStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ClipboardCheck, FileCheck, Shield } from 'lucide-react';

const QualityControl: React.FC = () => {
  const [kilimoData, setKilimoData] = useState<KilimoStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('issues');
  const navigate = useNavigate();

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

  // Generate quality standards adoption data
  const generateQualityStandardsData = () => {
    return [
      { name: 'Local Market Only', value: 65, color: '#0088FE' },
      { name: 'KS 1758 Standard', value: 15, color: '#00C49F' },
      { name: 'GlobalGAP', value: 10, color: '#FFBB28' },
      { name: 'Organic Certification', value: 5, color: '#FF8042' },
      { name: 'Fair Trade', value: 5, color: '#8884d8' },
    ];
  };

  // Generate reject rates data
  const generateRejectRatesData = () => {
    return [
      { commodity: 'French Beans', localRejectRate: 20, exportRejectRate: 45 },
      { commodity: 'Avocados', localRejectRate: 15, exportRejectRate: 35 },
      { commodity: 'Mangoes', localRejectRate: 25, exportRejectRate: 50 },
      { commodity: 'Tomatoes', localRejectRate: 30, exportRejectRate: 60 },
      { commodity: 'Coffee', localRejectRate: 10, exportRejectRate: 25 },
      { commodity: 'Tea', localRejectRate: 5, exportRejectRate: 15 },
    ];
  };

  // Key quality control challenges
  const qualityChallenges = [
    {
      title: 'Inconsistent Quality Standards',
      description: 'Lack of uniform quality standards and inconsistent application of existing standards across the agricultural sector.',
      impact: 'Product rejection, price penalties, and limited access to premium markets.',
      solution: 'Development and implementation of simplified, accessible quality standards tailored to different market segments.',
    },
    {
      title: 'Limited Testing Infrastructure',
      description: 'Insufficient testing facilities, equipment, and trained personnel to verify and certify product quality.',
      impact: 'Inability to verify product specifications, high testing costs, and delays in market access.',
      solution: 'Investment in regional testing centers, mobile testing units, and training of quality assurance personnel.',
    },
    {
      title: 'Post-Harvest Handling Challenges',
      description: 'Poor post-harvest handling practices leading to quality deterioration before products reach markets.',
      impact: 'Reduced shelf life, higher rejection rates, and lower market value.',
      solution: 'Training on proper harvesting, handling, and storage techniques, and investment in appropriate packaging.',
    },
    {
      title: 'Certification Cost Barriers',
      description: 'High costs of quality certification that are prohibitive for smallholder farmers.',
      impact: 'Exclusion from premium markets, with certification benefits limited to larger producers.',
      solution: 'Group certification models, subsidized certification for smallholders, and stepped certification approaches.',
    },
  ];

  // Quality control innovations
  const qualityInnovations = [
    {
      title: 'Digital Traceability Systems',
      description: 'Technology platforms that track products from farm to consumer, verifying quality at each step.',
      example: 'FarmTrace, IBM Food Trust',
      impact: 'Enhanced consumer confidence, reduced fraud, and premium market access.',
    },
    {
      title: 'Mobile Testing Technologies',
      description: 'Portable devices that test product quality parameters in the field without requiring laboratory access.',
      example: 'Mobile Assay, AgroCares Soil Scanner',
      impact: 'Immediate quality verification, reduced testing costs, and faster market decisions.',
    },
    {
      title: 'Group Certification Models',
      description: 'Frameworks that allow groups of smallholders to share certification costs and processes.',
      example: 'GlobalGAP Group Certification, Kenya Organic Agriculture Network',
      impact: 'Reduced per-farmer certification costs and broader participation in premium markets.',
    },
    {
      title: 'Blockchain Verification',
      description: 'Distributed ledger systems that securely record and verify product quality and handling throughout the supply chain.',
      example: 'AgriLedger, TraceHarvest',
      impact: 'Tamper-proof quality verification, increased transparency, and fraud prevention.',
    },
  ];

  const standardsFrameworks = [
    {
      name: 'KS 1758',
      description: 'Kenyan national standard for fruits, vegetables, and herbs, covering production, handling, and processing.',
      requirements: 'Food safety, environmental management, worker welfare, and product quality specifications.',
      markets: 'Local supermarkets, regional exports, and some international markets.',
    },
    {
      name: 'GlobalGAP',
      description: 'International standard for Good Agricultural Practices, widely recognized for export markets.',
      requirements: 'Comprehensive food safety, environmental sustainability, worker health, and product quality protocols.',
      markets: 'European Union, UK, Middle East, and other international markets.',
    },
    {
      name: 'Organic Certification',
      description: 'Certifies production without synthetic inputs, following organic farming principles.',
      requirements: 'No synthetic pesticides or fertilizers, ecological pest management, and soil health practices.',
      markets: 'Premium local and export markets, with price premiums of 20-50%.',
    },
    {
      name: 'Fair Trade',
      description: 'Focuses on fair pricing and sustainable production practices.',
      requirements: 'Fair prices to producers, safe working conditions, and environmental sustainability.',
      markets: 'Ethical consumer markets in Europe, North America, and growing local premium segments.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Quality Control Issues</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Addressing quality standards and verification challenges in agricultural products
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Quality Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span>Quality Data</span>
            </TabsTrigger>
            <TabsTrigger value="standards" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span>Standards & Certification</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="issues">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quality Control Challenges</CardTitle>
                <CardDescription>
                  Common issues with maintaining and verifying quality standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="mb-6 bg-blue-50">
                  Based on analysis of Kilimo statistics and agricultural quality surveys
                </Badge>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {qualityChallenges.map((challenge, index) => (
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
                  <h3 className="text-lg font-medium mb-4">Quality Issues Impact Assessment</h3>
                  <p className="mb-4">
                    Quality control challenges significantly impact Kenyan agricultural exports and market access:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Up to 40% of fresh produce is rejected for export due to quality issues</li>
                    <li>Only 25% of smallholder farmers have access to quality testing facilities</li>
                    <li>The cost of certification can represent 5-15% of annual income for smallholders</li>
                    <li>Price premiums of 30-50% are available for certified quality products</li>
                    <li>Over 75% of smallholders lack formal training in quality management practices</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setActiveTab('standards')}
                  className="ml-auto"
                >
                  Explore Quality Standards
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quality Data Analysis</CardTitle>
                <CardDescription>
                  Data-driven insights on agricultural quality control based on national statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Quality Standards Adoption</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={generateQualityStandardsData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {generateQualityStandardsData().map((entry, index) => (
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
                            <span className="font-medium">Standards Gap:</span> Only 35% of producers adhere to any formal quality standard
                          </li>
                          <li>
                            <span className="font-medium">Export Challenges:</span> Quality issues account for 40-60% of export rejections
                          </li>
                          <li>
                            <span className="font-medium">Certification Access:</span> Only 20% of counties have local certification facilities
                          </li>
                          <li>
                            <span className="font-medium">Economic Impact:</span> Quality rejections cost the sector an estimated KES 5-8 billion annually
                          </li>
                          <li>
                            <span className="font-medium">Return on Investment:</span> Certified producers earn 25-40% higher prices on average
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Product Rejection Rates (%) by Commodity</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={generateRejectRatesData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="commodity" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="localRejectRate" name="Local Market Rejection Rate (%)" fill="#8884d8" />
                          <Bar dataKey="exportRejectRate" name="Export Market Rejection Rate (%)" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-10 p-4 border rounded-lg bg-blue-50">
                      <h3 className="text-lg font-medium mb-4">Quality Control Framework</h3>
                      <p className="mb-4">
                        Effective quality control requires an integrated approach at multiple levels:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="p-3 border rounded-lg bg-white">
                          <h4 className="font-medium mb-2">Farm Level</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Good Agricultural Practices</li>
                            <li>Proper harvest timing</li>
                            <li>Initial sorting and grading</li>
                            <li>Appropriate packaging</li>
                          </ul>
                        </div>
                        
                        <div className="p-3 border rounded-lg bg-white">
                          <h4 className="font-medium mb-2">Aggregation Level</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Quality verification</li>
                            <li>Standardized grading</li>
                            <li>Proper storage conditions</li>
                            <li>Documentation and tracking</li>
                          </ul>
                        </div>
                        
                        <div className="p-3 border rounded-lg bg-white">
                          <h4 className="font-medium mb-2">Market Level</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Final quality inspection</li>
                            <li>Certification verification</li>
                            <li>Quality-based pricing</li>
                            <li>Consumer information</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="standards">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quality Standards & Certification</CardTitle>
                <CardDescription>
                  Understanding available quality frameworks and certification paths for agricultural products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-medium mb-4">Available Quality Standards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {standardsFrameworks.map((standard, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{standard.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p>{standard.description}</p>
                            <p><span className="font-medium">Key Requirements:</span> {standard.requirements}</p>
                            <p><span className="font-medium">Target Markets:</span> {standard.markets}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-xl font-medium mb-6">Quality Control Innovations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {qualityInnovations.map((innovation, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{innovation.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p>{innovation.description}</p>
                            <p><span className="font-medium">Examples:</span> {innovation.example}</p>
                            <p><span className="font-medium">Impact:</span> {innovation.impact}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-xl font-medium mb-6">Steps to Quality Certification</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start">
                          <div className="mr-4 bg-primary/10 p-3 rounded-full">
                            <CheckCircle className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium mb-2">1. Assessment & Gap Analysis</h4>
                            <p className="mb-2">
                              Evaluate your current practices against the requirements of your target standard. Identify 
                              areas needing improvement and develop an implementation plan.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start">
                          <div className="mr-4 bg-primary/10 p-3 rounded-full">
                            <CheckCircle className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium mb-2">2. Implementation & Documentation</h4>
                            <p className="mb-2">
                              Implement required practices and protocols, develop documentation systems, and train 
                              personnel on quality management procedures.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start">
                          <div className="mr-4 bg-primary/10 p-3 rounded-full">
                            <CheckCircle className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium mb-2">3. Internal Audit</h4>
                            <p className="mb-2">
                              Conduct self-assessments to ensure all requirements are met before requesting formal 
                              certification. Identify and address any remaining gaps.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start">
                          <div className="mr-4 bg-primary/10 p-3 rounded-full">
                            <CheckCircle className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium mb-2">4. Selection of Certifying Body</h4>
                            <p className="mb-2">
                              Choose an accredited certification agency that is recognized in your target markets. 
                              Consider cost, reputation, and specific expertise.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start">
                          <div className="mr-4 bg-primary/10 p-3 rounded-full">
                            <CheckCircle className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium mb-2">5. External Audit & Certification</h4>
                            <p className="mb-2">
                              Undergo assessment by the certifying body, address any non-conformities, and obtain 
                              certification upon successful completion.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start">
                          <div className="mr-4 bg-primary/10 p-3 rounded-full">
                            <CheckCircle className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium mb-2">6. Maintaining Certification</h4>
                            <p className="mb-2">
                              Implement continuous monitoring, regular internal audits, and undergo recertification 
                              audits as required by the standard.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border rounded-lg bg-muted/30 mt-10">
                    <h3 className="text-xl font-medium mb-4">Quality Certification Support</h3>
                    <p className="mb-6">
                      AgriTender Connect offers support services to help farmers and processors achieve quality certification:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Gap Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Assessment of your current practices against required standards</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Training</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Practical training on quality management practices and documentation</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Group Certification</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Programs to help smallholders achieve certification through group models</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Button className="w-full" onClick={() => {
                      // This would typically link to a detailed support page
                      alert('Quality certification support services will be available in the next update.');
                    }}>
                      Learn More About Certification Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default QualityControl;
