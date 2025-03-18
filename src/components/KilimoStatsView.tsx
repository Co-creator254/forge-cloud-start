
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { KilimoStats } from '@/types';
import { fetchKilimoStats, transformKilimoDataForCharts, getKilimoCategories, getKilimoCounties } from '@/services/kilimoIntegration';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const KilimoStatsView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<KilimoStats[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [counties, setCounties] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [groupBy, setGroupBy] = useState<'year' | 'county' | 'category'>('category');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchKilimoStats();
        setStats(data);
        
        const uniqueCategories = getKilimoCategories(data);
        const uniqueCounties = getKilimoCounties(data);
        
        setCategories(uniqueCategories);
        setCounties(uniqueCounties);
        
        if (uniqueCategories.length > 0 && !selectedCategory) {
          setSelectedCategory(uniqueCategories[0]);
        }
        
        if (uniqueCounties.length > 0 && !selectedCounty) {
          setSelectedCounty(uniqueCounties[0]);
        }
      } catch (error) {
        console.error("Error loading Kilimo stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filter data based on selections
  const filteredData = stats.filter(stat => {
    const matchesCategory = !selectedCategory || stat.category === selectedCategory;
    const matchesCounty = !selectedCounty || stat.county === selectedCounty;
    const matchesYear = !selectedYear || stat.year.toString() === selectedYear;
    
    return matchesCategory && matchesCounty && matchesYear;
  });

  // Transform data for visualization based on groupBy
  const prepareChartData = () => {
    if (filteredData.length === 0) return [];
    
    const grouped = transformKilimoDataForCharts(filteredData, groupBy);
    
    return Object.keys(grouped).map(key => {
      const items = grouped[key];
      const sum = items.reduce((acc, curr) => acc + curr.value, 0);
      const avg = sum / items.length;
      
      return {
        name: key,
        value: avg,
        count: items.length,
        originalData: items,
      };
    });
  };

  const chartData = prepareChartData();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kilimo Statistics Explorer</CardTitle>
        <CardDescription>
          Explore agricultural statistics from statistics.kilimo.go.ke
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">County</label>
                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Counties</SelectItem>
                    {counties.map(county => (
                      <SelectItem key={county} value={county}>{county}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Group By</label>
                <Select value={groupBy} onValueChange={(val: 'year' | 'county' | 'category') => setGroupBy(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Group by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="county">County</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mb-6">
              <Tabs value={chartType} onValueChange={(val: 'bar' | 'line' | 'pie') => setChartType(val)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                  <TabsTrigger value="line">Line Chart</TabsTrigger>
                  <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bar" className="pt-4">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Average Value" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="line" className="pt-4">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" name="Average Value" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="pie" className="pt-4">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Data Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold">{stats.length}</div>
                    <div className="text-sm text-muted-foreground">Total Records</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold">{categories.length}</div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold">{counties.length}</div>
                    <div className="text-sm text-muted-foreground">Counties</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default KilimoStatsView;
