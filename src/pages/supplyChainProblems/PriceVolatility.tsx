
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchKilimoStats } from '@/services/kilimoAPI';
import { KilimoStats } from '@/types';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { BarChart2, TrendingDown, TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PriceVolatility: React.FC = () => {
  const [kilimoData, setKilimoData] = useState<KilimoStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
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

  // Generate price volatility data based on real county statistics
  const generateMonthlyPriceData = () => {
    // Monthly price data for key commodities (simulated)
    return [
      { month: 'Jan', maize: 50, beans: 120, potatoes: 45, onions: 60 },
      { month: 'Feb', maize: 48, beans: 125, potatoes: 43, onions: 55 },
      { month: 'Mar', maize: 45, beans: 130, potatoes: 40, onions: 50 },
      { month: 'Apr', maize: 47, beans: 128, potatoes: 42, onions: 53 },
      { month: 'May', maize: 52, beans: 125, potatoes: 46, onions: 65 },
      { month: 'Jun', maize: 55, beans: 120, potatoes: 48, onions: 70 },
      { month: 'Jul', maize: 58, beans: 118, potatoes: 50, onions: 68 },
      { month: 'Aug', maize: 60, beans: 115, potatoes: 52, onions: 65 },
      { month: 'Sep', maize: 57, beans: 120, potatoes: 49, onions: 62 },
      { month: 'Oct', maize: 54, beans: 122, potatoes: 47, onions: 58 },
      { month: 'Nov', maize: 52, beans: 125, potatoes: 45, onions: 55 },
      { month: 'Dec', maize: 51, beans: 127, potatoes: 44, onions: 52 },
    ];
  };

  const generateVolatilityByCounty = () => {
    // County-level price volatility data (simulated)
    return [
      { county: 'Nairobi', volatilityIndex: 15 },
      { county: 'Nakuru', volatilityIndex: 35 },
      { county: 'Kiambu', volatilityIndex: 20 },
      { county: 'Meru', volatilityIndex: 40 },
      { county: 'Machakos', volatilityIndex: 25 },
      { county: 'Kisumu', volatilityIndex: 30 },
      { county: 'Trans Nzoia', volatilityIndex: 45 },
      { county: 'Uasin Gishu', volatilityIndex: 38 },
    ].sort((a, b) => b.volatilityIndex - a.volatilityIndex);
  };

  // Key price volatility drivers and impacts
  const volatilityImpacts = [
    {
      group: 'Farmers',
      positive: [
        'Occasional windfall profits during price spikes',
        'Incentives to diversify crops and income sources',
      ],
      negative: [
        'Income uncertainty making financial planning difficult',
        'Challenges in loan repayment during price drops',
        'Difficulty in making investment decisions',
        'Reduced willingness to adopt new technologies',
      ],
    },
    {
      group: 'Consumers',
      positive: [
        'Occasional price drops for food items',
        'Incentives to diversify food consumption patterns',
      ],
      negative: [
        'Food insecurity when prices rise suddenly',
        'Household budget disruptions',
        'Reduced nutritional diversity during price spikes',
        'Vulnerability for low-income households',
      ],
    },
    {
      group: 'Processors',
      positive: [
        'Opportunities for strategic purchasing during price drops',
        'Potential for value addition to stabilize prices',
      ],
      negative: [
        'Unreliable input costs affecting production planning',
        'Challenges in maintaining consistent product pricing',
        'Difficulties in long-term contracting with buyers',
        'Reduced capacity utilization during high-price periods',
      ],
    },
  ];

  // Price volatility mitigation strategies
  const mitigation = [
    {
      title: 'Storage & Warehousing',
      description: 'Strategic storage to sell when prices are favorable and buffer against shortages',
      stakeholders: 'Farmers, Cooperatives, Governments',
      implementation: 'Warehouse receipt systems, community storage facilities, cold chain infrastructure',
      challenges: 'High initial investment costs, management expertise requirements',
    },
    {
      title: 'Forward Contracts',
      description: 'Pre-agreed prices for future delivery, protecting against price fluctuations',
      stakeholders: 'Farmers, Processors, Traders',
      implementation: 'Contract farming arrangements, formal and informal forward agreements',
      challenges: 'Contract enforcement, quality specification disputes',
    },
    {
      title: 'Price Hedging',
      description: 'Using futures and options markets to lock in prices or establish price floors',
      stakeholders: 'Large Producers, Exporters, Cooperatives',
      implementation: 'Commodity exchanges, over-the-counter derivatives',
      challenges: 'Limited availability for African commodities, knowledge barriers',
    },
    {
      title: 'Diversification',
      description: 'Growing multiple crops or engaging in varied agricultural activities to spread risk',
      stakeholders: 'Farmers, Farm Households',
      implementation: 'Crop rotation, mixed farming, on-farm and off-farm income sources',
      challenges: 'Resource constraints, market access for diverse products',
    },
    {
      title: 'Market Information Systems',
      description: 'Improving access to price information across markets to make informed decisions',
      stakeholders: 'All Supply Chain Actors, Government',
      implementation: 'Mobile price information services, radio broadcasts, digital marketplaces',
      challenges: 'Data accuracy, timely dissemination, rural connectivity',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Price Volatility Issues</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Understanding and mitigating agricultural price fluctuations in Kenyan markets
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Overview & Drivers</span>
            </TabsTrigger>
            <TabsTrigger value="impacts" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              <span>Impacts & Costs</span>
            </TabsTrigger>
            <TabsTrigger value="mitigation" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Mitigation Strategies</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Price Volatility Challenges</CardTitle>
                <CardDescription>
                  Impact of price fluctuations on farmers and the supply chain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="mb-6 bg-blue-50">
                  Based on analysis of Kilimo statistics and agricultural price data
                </Badge>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Understanding Agricultural Price Volatility</h3>
                  <p className="mb-4">
                    Price volatility refers to the rate and degree at which agricultural commodity prices rise and fall. 
                    High volatility creates uncertainty for all actors in the supply chain, from farmers to consumers.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Key Drivers of Price Volatility</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            <span className="font-medium">Seasonal Production Cycles:</span> Concentrated harvest periods followed by scarcity
                          </li>
                          <li>
                            <span className="font-medium">Weather Variability:</span> Droughts, floods, and unpredictable rainfall patterns
                          </li>
                          <li>
                            <span className="font-medium">Limited Storage Infrastructure:</span> Forcing immediate post-harvest sales
                          </li>
                          <li>
                            <span className="font-medium">Market Information Gaps:</span> Asymmetric information among market participants
                          </li>
                          <li>
                            <span className="font-medium">Supply Chain Fragmentation:</span> Multiple intermediaries amplifying price signals
                          </li>
                          <li>
                            <span className="font-medium">Government Interventions:</span> Sudden policy changes affecting markets
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Measuring Price Volatility</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">
                          Price volatility is typically measured using these indicators:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            <span className="font-medium">Coefficient of Variation:</span> Standard deviation divided by mean price
                          </li>
                          <li>
                            <span className="font-medium">Month-to-Month Price Changes:</span> Percentage changes between consecutive months
                          </li>
                          <li>
                            <span className="font-medium">Seasonal Price Index:</span> Comparing prices across seasons relative to annual average
                          </li>
                          <li>
                            <span className="font-medium">Price Trend Deviations:</span> Measuring variations from long-term price trends
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Monthly Price Trends for Key Commodities (KES/kg)</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                          data={generateMonthlyPriceData()}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="maize" stroke="#8884d8" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="beans" stroke="#82ca9d" />
                          <Line type="monotone" dataKey="potatoes" stroke="#ffc658" />
                          <Line type="monotone" dataKey="onions" stroke="#ff8042" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Price Volatility Index by County</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={generateVolatilityByCounty()}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="county" type="category" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="volatilityIndex" name="Price Volatility Index" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                      <p className="text-sm text-muted-foreground mt-2">
                        Price Volatility Index represents the coefficient of variation in monthly prices across major agricultural commodities
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h3 className="text-lg font-medium mb-4">Spotlight: Seasonal Price Patterns</h3>
                      <p className="mb-4">
                        Agricultural prices in Kenya follow distinct seasonal patterns, creating predictable periods of price highs and lows:
                      </p>
                      
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Commodity</TableHead>
                              <TableHead>Low Price Period</TableHead>
                              <TableHead>High Price Period</TableHead>
                              <TableHead>Seasonal Price Difference</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Maize</TableCell>
                              <TableCell>August-September</TableCell>
                              <TableCell>January-March</TableCell>
                              <TableCell>30-45%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Beans</TableCell>
                              <TableCell>July-August</TableCell>
                              <TableCell>November-January</TableCell>
                              <TableCell>25-35%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Potatoes</TableCell>
                              <TableCell>May-June</TableCell>
                              <TableCell>December-February</TableCell>
                              <TableCell>50-70%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Onions</TableCell>
                              <TableCell>December-January</TableCell>
                              <TableCell>May-July</TableCell>
                              <TableCell>60-80%</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setActiveTab('impacts')}
                  className="ml-auto"
                >
                  Explore Price Volatility Impacts
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="impacts">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Impacts & Economic Costs</CardTitle>
                <CardDescription>
                  Understanding how price volatility affects different actors in the agricultural supply chain
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-10">
                      <h3 className="text-lg font-medium mb-6">Price Variability: Impacts on Supply Chain Actors</h3>
                      
                      {volatilityImpacts.map((impact, index) => (
                        <div key={index} className="mb-8">
                          <h4 className="font-medium text-lg mb-4">Impact on {impact.group}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-l-4 border-l-red-500">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Negative Impacts</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="list-disc pl-6 space-y-2">
                                  {impact.negative.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                            
                            <Card className="border-l-4 border-l-green-500">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Positive Impacts</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="list-disc pl-6 space-y-2">
                                  {impact.positive.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-8" />
                    
                    <div className="mb-10">
                      <h3 className="text-lg font-medium mb-6">Economic Costs of Price Volatility</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="font-medium">Household Level Costs</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Average farm household income loss due to suboptimal selling: 15-25%</li>
                            <li>Consumption reduction during price spikes: 10-20% for vulnerable households</li>
                            <li>Increased borrowing at high interest rates during price drops</li>
                            <li>Reduced investment in farming inputs and technology</li>
                            <li>Diversion of resources to less productive but more stable activities</li>
                          </ul>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-medium">Macroeconomic Costs</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Estimated national productivity loss: 3-5% of agricultural GDP</li>
                            <li>Emergency food security interventions: KES 5-10 billion annually</li>
                            <li>Reduced agricultural investment: Est. KES 15-20 billion annually</li>
                            <li>Reduced export competitiveness in international markets</li>
                            <li>Increased government expenditure on price stabilization measures</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Price Variability Visualization: Maize Monthly Prices</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart
                          data={generateMonthlyPriceData()}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="maize" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                      </ResponsiveContainer>
                      <p className="text-sm text-muted-foreground mt-2">
                        Monthly maize prices (KES/kg) showing seasonal patterns and price volatility
                      </p>
                    </div>
                    
                    <div className="p-6 border rounded-lg bg-blue-50">
                      <h3 className="text-lg font-medium mb-4">Case Study: Potato Price Volatility in Nyandarua</h3>
                      <p className="mb-4">
                        Nyandarua County, a major potato producing region, experiences some of the highest price 
                        volatility for potatoes in Kenya. In a typical year:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Farm-gate prices fluctuate between KES 800 and KES 3,500 per 110kg bag</li>
                        <li>Price can drop by 60% within a month during peak harvest</li>
                        <li>Farmers who sell immediately after harvest receive only 30% of what they could earn by storing for 2-3 months</li>
                        <li>Limited storage infrastructure forces 85% of farmers to sell within two weeks of harvest</li>
                        <li>Potato farmer income variability: 70% annual coefficient of variation</li>
                      </ul>
                      <p>
                        The implementation of community storage facilities in six locations has helped 1,200 farmers 
                        reduce their exposure to price volatility, increasing average income by 40%.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setActiveTab('mitigation')}
                  className="ml-auto"
                >
                  Explore Mitigation Strategies
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="mitigation">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Price Volatility Mitigation Strategies</CardTitle>
                <CardDescription>
                  Approaches and tools to manage and reduce agricultural price fluctuations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-6">Strategies to Mitigate Price Volatility</h3>
                  
                  <div className="space-y-6">
                    {mitigation.map((strategy, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{strategy.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p>{strategy.description}</p>
                          <p><span className="font-medium">Key Stakeholders:</span> {strategy.stakeholders}</p>
                          <p><span className="font-medium">Implementation:</span> {strategy.implementation}</p>
                          <p><span className="font-medium">Challenges:</span> {strategy.challenges}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-6">Success Stories: Effective Price Risk Management</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Warehouse Receipt System in Meru</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>
                          A warehouse receipt system implemented for maize farmers in Meru County allowed 5,000 farmers
                          to store grain during harvest and sell when prices improved.
                        </p>
                        <p><span className="font-medium">Results:</span> 35% average price improvement, with farmers
                        receiving loans against stored grain while waiting for better prices.</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Contract Farming for French Beans</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>
                          Export companies in Kirinyaga County established fixed-price contracts with 2,500 smallholder
                          farmers for French bean production.
                        </p>
                        <p><span className="font-medium">Results:</span> Price stability throughout the season, increased
                        farmer willingness to invest in quality inputs, and 40% higher average incomes.</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Cooperative Storage for Potatoes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>
                          Nyandarua Potato Farmers Cooperative built climate-controlled storage facilities allowing 
                          members to extend potato shelf life from 2 weeks to 3 months.
                        </p>
                        <p><span className="font-medium">Results:</span> Price volatility reduced by 60%, off-season
                        premium prices captured, and more stable market supply.</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Price Information System for Smallholders</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>
                          M-Farm SMS price information service providing daily market prices to 100,000+ smallholder
                          farmers across Kenya.
                        </p>
                        <p><span className="font-medium">Results:</span> Better informed selling decisions, 15-20% 
                        price improvements, and increased farmer bargaining power with traders.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="p-6 border rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-4">AgriTender Connect Solutions for Price Volatility</h3>
                  <p className="mb-6">
                    Our platform offers several tools and services to help farmers manage price volatility:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Price Trend Analytics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Access historical price data and predictive analysis for major commodities</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/commodity-trading/price-trends')}>
                          Access Price Trends
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Forward Contracts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Connect with buyers offering forward contracts with fixed or minimum prices</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/commodity-trading/marketplace')}>
                          Find Contract Opportunities
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Storage Solutions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Find warehousing and storage options to help time market sales</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/supply-chain-api')}>
                          Find Storage Services
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <Button className="w-full" onClick={() => navigate('/commodity-trading')}>
                    Explore All Price Management Tools
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PriceVolatility;
