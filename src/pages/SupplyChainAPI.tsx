
import { useState } from "react";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SupplyChainAPI = () => {
  const [activeTab, setActiveTab] = useState("farmers");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("all");
  
  const counties = [
    { value: "all", label: "All Counties" },
    { value: "nairobi", label: "Nairobi" },
    { value: "mombasa", label: "Mombasa" },
    { value: "kisumu", label: "Kisumu" },
    { value: "nakuru", label: "Nakuru" },
    { value: "kiambu", label: "Kiambu" }
  ];

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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Supply Chain API</h1>
        <p className="text-muted-foreground mb-6">Access real-time data on farmers, produce, logistics and markets</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
            <TabsTrigger value="produce">Produce</TabsTrigger>
            <TabsTrigger value="logistics">Logistics</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-4 mt-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select county" />
              </SelectTrigger>
              <SelectContent>
                {counties.map((county) => (
                  <SelectItem key={county.value} value={county.value}>
                    {county.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>Filter</Button>
          </div>
          
          <TabsContent value="farmers" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Farmers API</CardTitle>
                <CardDescription>Access data on registered farmers</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto">
                  {`GET /api/farmers
{
  "farmers": [
    {
      "id": "f123",
      "name": "John Mwangi",
      "county": "Nakuru",
      "contacts": "+2547XXXXXXXX",
      "products": ["maize", "potatoes"],
      "farmSize": "5 acres",
      "certifications": ["organic"]
    },
    ...
  ]
}`}
                </pre>
                <div className="mt-4">
                  <Button variant="outline">View Documentation</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="produce" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Produce API</CardTitle>
                <CardDescription>Access data on available agricultural produce</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto">
                  {`GET /api/produce
{
  "produce": [
    {
      "id": "p456",
      "name": "Maize",
      "category": "Cereal",
      "county": "Nakuru",
      "quantity": 500,
      "unit": "kg",
      "qualityGrade": "A",
      "availableFrom": "2023-05-15",
      "farmer": "John Mwangi",
      "farmerId": "f123"
    },
    ...
  ]
}`}
                </pre>
                <div className="mt-4">
                  <Button variant="outline">View Documentation</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logistics" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Logistics API</CardTitle>
                <CardDescription>Access data on logistics and transport services</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto">
                  {`GET /api/logistics
{
  "transportProviders": [
    {
      "id": "t789",
      "name": "Quick Movers Ltd",
      "serviceType": "transport",
      "counties": ["Nakuru", "Nairobi", "Kiambu"],
      "contactInfo": "info@quickmovers.co.ke",
      "capacity": "Medium",
      "loadCapacity": 2000,
      "rates": "KSH 50/km",
      "hasRefrigeration": true,
      "vehicleType": "Truck"
    },
    ...
  ],
  "warehouses": [
    {
      "id": "w101",
      "name": "SafeStore Warehouse",
      "location": "Industrial Area",
      "county": "Nairobi",
      "capacity": 5000,
      "capacityUnit": "sq ft",
      "goodsTypes": ["cereals", "tubers"],
      "hasRefrigeration": true,
      "hasCertifications": true,
      "contactInfo": "info@safestore.co.ke",
      "rates": "KSH 100/sq ft/month"
    },
    ...
  ]
}`}
                </pre>
                <div className="mt-4">
                  <Button variant="outline">View Documentation</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="markets" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Markets API</CardTitle>
                <CardDescription>Access data on local and regional markets</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto">
                  {`GET /api/markets
{
  "markets": [
    {
      "id": "m202",
      "name": "Wakulima Market",
      "county": "Nairobi",
      "location": "Landhies Road",
      "producePrices": [
        {
          "produceId": "p456",
          "produceName": "Maize",
          "price": 50,
          "unit": "kg",
          "date": "2023-05-14"
        },
        ...
      ],
      "demand": "high",
      "operatingHours": "6am-6pm daily"
    },
    ...
  ]
}`}
                </pre>
                <div className="mt-4">
                  <Button variant="outline">View Documentation</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="forecasts" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Forecasts API</CardTitle>
                <CardDescription>Access forecasts for produce production and demand</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto">
                  {`GET /api/forecasts
{
  "forecasts": [
    {
      "id": "fc303",
      "produceId": "p456",
      "produceName": "Maize",
      "county": "Nakuru",
      "expectedProduction": 1200000,
      "expectedDemand": 900000,
      "unit": "kg",
      "period": "Q3 2023",
      "confidenceLevel": "medium"
    },
    ...
  ]
}`}
                </pre>
                <div className="mt-4">
                  <Button variant="outline">View Documentation</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SupplyChainAPI;
