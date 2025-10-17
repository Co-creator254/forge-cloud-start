import { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, QrCode, MapPin, Calendar, TrendingUp, Plus, Search, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Batch {
  id: string;
  batch_id: string;
  farmer_id: string;
  product_type: string;
  quantity: number;
  unit: string;
  origin: string;
  destination?: string;
  harvest_date?: string;
  status: string;
  qr_code?: string;
  events: any[];
  quality_checkpoints: any[];
  certifications: string[];
  created_at: string;
}

const BatchTracking = () => {
  const { toast } = useToast();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to view your batches.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('batch_tracking')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBatches(data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
      toast({
        title: "Error",
        description: "Failed to load batch tracking data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBatches = batches.filter(batch =>
    batch.batch_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.product_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      harvested: 'bg-green-500',
      in_transit: 'bg-blue-500',
      at_processor: 'bg-yellow-500',
      processed: 'bg-purple-500',
      at_warehouse: 'bg-orange-500',
      in_export: 'bg-cyan-500',
      delivered: 'bg-emerald-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

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
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <QrCode className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Batch Tracking & Traceability</h1>
              <p className="text-xl mb-8">
                Track your produce from farm to market with complete transparency
              </p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Batch
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Create New Batch</DialogTitle>
                    <DialogDescription>
                      Register a new batch for tracking and traceability
                    </DialogDescription>
                  </DialogHeader>
                  <div className="text-muted-foreground py-8 text-center">
                    <p>Batch creation form would go here</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        <div className="container px-4 py-12">
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">{batches.length}</div>
                <p className="text-sm text-muted-foreground">Total Batches</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">
                  {batches.filter(b => b.status === 'in_transit' || b.status === 'at_processor').length}
                </div>
                <p className="text-sm text-muted-foreground">In Transit</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">
                  {batches.filter(b => b.status === 'delivered').length}
                </div>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <QrCode className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">
                  {batches.filter(b => b.qr_code).length}
                </div>
                <p className="text-sm text-muted-foreground">With QR Codes</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by batch ID or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Batches List */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Card key={n} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBatches.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No batches found</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first batch to start tracking your produce.
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Batch
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBatches.map((batch) => (
                <Card key={batch.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-mono">{batch.batch_id}</CardTitle>
                        <CardDescription>{batch.product_type}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(batch.status)}>
                        {getStatusLabel(batch.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>{batch.quantity.toLocaleString()} {batch.unit}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{batch.origin}</span>
                    </div>
                    
                    {batch.harvest_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>Harvested: {new Date(batch.harvest_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {batch.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {batch.certifications.map((cert, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="pt-3 border-t">
                      <div className="text-xs text-muted-foreground mb-2">
                        {batch.events.length} events • {batch.quality_checkpoints.length} checkpoints
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedBatch(batch)}
                        >
                          View Journey
                        </Button>
                        {batch.qr_code && (
                          <Button size="sm" variant="secondary">
                            <QrCode className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* How It Works */}
          <section className="mt-16 bg-muted/30 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">How Batch Tracking Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete transparency from farm to consumer
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Register Batch</h3>
                <p className="text-muted-foreground text-sm">Create unique batch ID at harvest</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Track Movement</h3>
                <p className="text-muted-foreground text-sm">Record each step in supply chain</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Quality Control</h3>
                <p className="text-muted-foreground text-sm">Document quality checkpoints</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Share Information</h3>
                <p className="text-muted-foreground text-sm">Buyers scan QR to view history</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default BatchTracking;