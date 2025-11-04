import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, Droplets, Trash2, Edit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Crop {
  id: string;
  name: string;
  variety?: string;
  area: number;
  area_unit: string;
  current_yield?: number;
  previous_yield?: number;
  yield_unit?: string;
  quality?: string;
  status: string;
}

const CropTracking: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    area: '',
    area_unit: 'm²',
    current_yield: '',
    previous_yield: '',
    yield_unit: 'kg',
    quality: 'Good',
    status: 'growing'
  });

  useEffect(() => {
    if (user) {
      loadCrops();
    }
  }, [user]);

  const loadCrops = async () => {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCrops(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cropData = {
        user_id: user!.id,
        name: formData.name,
        variety: formData.variety || null,
        area: parseFloat(formData.area),
        area_unit: formData.area_unit,
        current_yield: formData.current_yield ? parseFloat(formData.current_yield) : null,
        previous_yield: formData.previous_yield ? parseFloat(formData.previous_yield) : null,
        yield_unit: formData.yield_unit,
        quality: formData.quality,
        status: formData.status
      };

      if (editingCrop) {
        const { error } = await supabase
          .from('crops')
          .update(cropData)
          .eq('id', editingCrop.id);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Crop updated successfully' });
      } else {
        const { error } = await supabase
          .from('crops')
          .insert(cropData);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Crop added successfully' });
      }

      setDialogOpen(false);
      setEditingCrop(null);
      resetForm();
      loadCrops();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this crop?')) return;

    try {
      const { error } = await supabase
        .from('crops')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Success', description: 'Crop deleted successfully' });
      loadCrops();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      variety: crop.variety || '',
      area: crop.area.toString(),
      area_unit: crop.area_unit,
      current_yield: crop.current_yield?.toString() || '',
      previous_yield: crop.previous_yield?.toString() || '',
      yield_unit: crop.yield_unit || 'kg',
      quality: crop.quality || 'Good',
      status: crop.status
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      variety: '',
      area: '',
      area_unit: 'm²',
      current_yield: '',
      previous_yield: '',
      yield_unit: 'kg',
      quality: 'Good',
      status: 'growing'
    });
  };

  const yieldData = crops
    .filter(c => c.current_yield || c.previous_yield)
    .map(crop => ({
      name: crop.name,
      'Current Yield': crop.current_yield || 0,
      'Previous Yield': crop.previous_yield || 0
    }));

  const getQualityColor = (quality?: string) => {
    switch (quality) {
      case 'Excellent': return 'bg-green-500 text-white';
      case 'Good': return 'bg-blue-500 text-white';
      case 'Average': return 'bg-yellow-500 text-white';
      case 'Poor': return 'bg-red-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading && crops.length === 0) {
    return <div className="p-6">Loading crops...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Crop Management & Tracking</h2>
          <p className="text-muted-foreground">Track your crop yields and quality for major Kenyan agricultural products</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            setEditingCrop(null);
            resetForm();
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Crop
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {yieldData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                Yield Tracking for Kenyan Crops
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Monitor yields and quality for major crops grown in Kenya
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yieldData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Current Yield" fill="hsl(var(--primary))" />
                    <Bar dataKey="Previous Yield" fill="hsl(var(--muted))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {crops.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No crops yet. Click "Add New Crop" to get started.
              </CardContent>
            </Card>
          ) : (
            crops.map((crop) => (
              <Card key={crop.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{crop.name}</h3>
                      {crop.variety && <p className="text-sm text-muted-foreground">{crop.variety}</p>}
                      <p className="text-sm text-muted-foreground">Area: {crop.area} {crop.area_unit}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(crop)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(crop.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {crop.current_yield && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Current yield</span>
                        <span className="font-medium">{crop.current_yield} {crop.yield_unit}</span>
                      </div>
                    )}
                    
                    {crop.previous_yield && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Previous yield</span>
                        <span className="text-sm text-muted-foreground">{crop.previous_yield} {crop.yield_unit}</span>
                      </div>
                    )}
                    
                    {crop.quality && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Quality</span>
                        <Badge className={getQualityColor(crop.quality)}>
                          {crop.quality}
                        </Badge>
                      </div>
                    )}

                    {crop.current_yield && crop.previous_yield && crop.previous_yield > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-primary">
                          {((crop.current_yield - crop.previous_yield) / crop.previous_yield * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Crop Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Maize, Coffee"
                  required
                />
              </div>
              <div>
                <Label htmlFor="variety">Variety</Label>
                <Input
                  id="variety"
                  value={formData.variety}
                  onChange={(e) => setFormData({...formData, variety: e.target.value})}
                  placeholder="e.g., H614, Ruiru 11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area">Area*</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.01"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="area_unit">Area Unit</Label>
                <Select value={formData.area_unit} onValueChange={(value) => setFormData({...formData, area_unit: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m²">m²</SelectItem>
                    <SelectItem value="acres">acres</SelectItem>
                    <SelectItem value="hectares">hectares</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current_yield">Current Yield</Label>
                <Input
                  id="current_yield"
                  type="number"
                  step="0.01"
                  value={formData.current_yield}
                  onChange={(e) => setFormData({...formData, current_yield: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="previous_yield">Previous Yield</Label>
                <Input
                  id="previous_yield"
                  type="number"
                  step="0.01"
                  value={formData.previous_yield}
                  onChange={(e) => setFormData({...formData, previous_yield: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="yield_unit">Yield Unit</Label>
                <Input
                  id="yield_unit"
                  value={formData.yield_unit}
                  onChange={(e) => setFormData({...formData, yield_unit: e.target.value})}
                  placeholder="e.g., kg, bags/acre"
                />
              </div>
              <div>
                <Label htmlFor="quality">Quality</Label>
                <Select value={formData.quality} onValueChange={(value) => setFormData({...formData, quality: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="growing">Growing</SelectItem>
                  <SelectItem value="harvesting">Harvesting</SelectItem>
                  <SelectItem value="harvested">Harvested</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingCrop ? 'Update Crop' : 'Add Crop'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CropTracking;
