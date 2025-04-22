
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  BarChart3, 
  Bug, 
  FileText, 
  Lightbulb, 
  MapPin, 
  MessageSquare, 
  Settings 
} from 'lucide-react';
import { 
  mockSentimentClusters, 
  mockDiseaseMapMarkers, 
  mockSentimentInsights 
} from '@/features/ai-assistant/mockData/sentimentData';

const SentimentInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  const renderAlerts = () => {
    const filteredAlerts = mockSentimentClusters.filter(cluster => 
      cluster.isAlert &&
      (!selectedCrop || cluster.topic.toLowerCase().includes(selectedCrop.toLowerCase())) &&
      (!selectedLocation || cluster.counties.some(c => c.toLowerCase().includes(selectedLocation.toLowerCase())))
    );
    
    if (filteredAlerts.length === 0) {
      return (
        <div className="p-6 text-center">
          <div className="mb-4 text-muted-foreground">
            <AlertTriangle className="mx-auto h-12 w-12 opacity-50" />
          </div>
          <h3 className="text-lg font-medium">No alerts found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            There are no current alerts matching your criteria.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredAlerts.map(alert => (
          <Alert key={alert.id} variant={alert.sentiment === 'negative' ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{alert.topic}</AlertTitle>
            <AlertDescription>
              <div className="mt-2">
                <p>Reported in: {alert.counties.join(', ')}</p>
                <p>Confidence Score: {(alert.confidenceScore * 100).toFixed(0)}%</p>
                <p>Reports: {alert.reportCount}</p>
                <p>Keywords: {alert.keywords.join(', ')}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                View Details
              </Button>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    );
  };
  
  const renderDiseaseMap = () => {
    const filteredMarkers = mockDiseaseMapMarkers.filter(marker => 
      (!selectedCrop || marker.cropAffected.toLowerCase().includes(selectedCrop.toLowerCase())) &&
      (!selectedLocation || marker.location.toLowerCase().includes(selectedLocation.toLowerCase()))
    );
    
    return (
      <div>
        <div className="relative h-[300px] w-full border rounded-md bg-muted/20 flex items-center justify-center mb-4">
          <p className="text-muted-foreground">Disease Map Visualization</p>
          {filteredMarkers.map(marker => (
            <div 
              key={marker.id}
              className={`absolute w-4 h-4 rounded-full flex items-center justify-center
                ${marker.severity === 'high' ? 'bg-red-500' : 
                  marker.severity === 'medium' ? 'bg-orange-400' : 'bg-yellow-300'}`}
              style={{ 
                top: `${50 + (marker.latitude * 100)}%`, 
                left: `${50 + (marker.longitude * 2)}%` 
              }}
              title={`${marker.diseaseName} affecting ${marker.cropAffected} in ${marker.location}`}
            >
              <MapPin className="h-3 w-3 text-white" />
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          {filteredMarkers.map(marker => (
            <Card key={marker.id}>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">{marker.diseaseName}</CardTitle>
                <CardDescription>{marker.location}</CardDescription>
              </CardHeader>
              <CardContent className="py-0">
                <div className="text-xs space-y-1">
                  <p>Affecting: {marker.cropAffected}</p>
                  <p>Severity: {marker.severity}</p>
                  <p>Reports: {marker.reportCount}</p>
                  <p className="text-amber-600">{marker.spreadPrediction}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  const renderInsights = () => {
    const filteredInsights = mockSentimentInsights.filter(insight => 
      (!selectedCrop || insight.affectedCrops.some(c => c.toLowerCase().includes(selectedCrop.toLowerCase()))) &&
      (!selectedLocation || insight.affectedCounties.some(c => c.toLowerCase().includes(selectedLocation.toLowerCase())))
    );
    
    if (filteredInsights.length === 0) {
      return (
        <div className="p-6 text-center">
          <div className="mb-4 text-muted-foreground">
            <Lightbulb className="mx-auto h-12 w-12 opacity-50" />
          </div>
          <h3 className="text-lg font-medium">No insights found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            There are no insights matching your criteria.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredInsights.map(insight => (
          <Card key={insight.id}>
            <CardHeader>
              <CardTitle>{insight.topic}</CardTitle>
              <CardDescription>
                Confidence: {(insight.confidenceScore * 100).toFixed(0)}% • 
                Reports: {insight.sourceReportCount} • 
                Generated: {new Date(insight.generatedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{insight.insight}</p>
              <div className="bg-muted p-3 rounded-md">
                <h4 className="font-medium mb-2">Actionable Advice:</h4>
                <p>{insight.actionableAdvice}</p>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Affected:</span> {insight.affectedCrops.join(', ')} in {insight.affectedCounties.join(', ')}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Collective Intelligence Insights</CardTitle>
        <CardDescription>
          Sentiment-based analysis from farmer reports and community feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="crop">Crop</Label>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger id="crop">
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Crops</SelectItem>
                <SelectItem value="maize">Maize</SelectItem>
                <SelectItem value="potato">Potato</SelectItem>
                <SelectItem value="tomato">Tomato</SelectItem>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                <SelectItem value="nakuru">Nakuru</SelectItem>
                <SelectItem value="kisumu">Kisumu</SelectItem>
                <SelectItem value="kiambu">Kiambu</SelectItem>
                <SelectItem value="machakos">Machakos</SelectItem>
                <SelectItem value="uasin gishu">Uasin Gishu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="alerts" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="diseases" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              <span className="hidden sm:inline">Disease Map</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts">
            {renderAlerts()}
          </TabsContent>
          
          <TabsContent value="diseases">
            {renderDiseaseMap()}
          </TabsContent>
          
          <TabsContent value="insights">
            {renderInsights()}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 text-sm text-muted-foreground flex justify-between">
        <div>Based on sentiment analysis of community reports</div>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SentimentInsights;
