import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  DollarSign,
  Package,
  Building,
  Car,
  Thermometer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Advertisement {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  discount?: string;
  image_url?: string;
  link_url?: string;
  status: 'active' | 'inactive' | 'pending';
  placement: 'marketplace' | 'city-markets' | 'route-maps' | 'demand-hotspot' | 'all';
  created_at: string;
  expires_at?: string;
}

const AdvertManagement: React.FC = () => {
  const [adverts, setAdverts] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingAdvert, setEditingAdvert] = useState<Advertisement | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    image_url: '',
    link_url: '',
    placement: 'marketplace' as const,
    status: 'active' as const,
    expires_at: ''
  });

  useEffect(() => {
    fetchAdverts();
  }, []);

  const fetchAdverts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdverts(data || []);
    } catch (error) {
      console.error('Error fetching adverts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load advertisements',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAdvert) {
        const { error } = await supabase
          .from('advertisements')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAdvert.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Advertisement updated successfully' });
      } else {
        const { error } = await supabase
          .from('advertisements')
          .insert({
            ...formData,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
        toast({ title: 'Success', description: 'Advertisement created successfully' });
      }

      setShowDialog(false);
      setEditingAdvert(null);
      resetForm();
      fetchAdverts();
    } catch (error) {
      console.error('Error saving advert:', error);
      toast({
        title: 'Error',
        description: 'Failed to save advertisement',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;

    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Success', description: 'Advertisement deleted successfully' });
      fetchAdverts();
    } catch (error) {
      console.error('Error deleting advert:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete advertisement',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      discount: '',
      image_url: '',
      link_url: '',
      placement: 'marketplace',
      status: 'active',
      expires_at: ''
    });
  };

  const openEditDialog = (advert: Advertisement) => {
    setEditingAdvert(advert);
    setFormData({
      title: advert.title,
      description: advert.description,
      category: advert.category,
      price: advert.price,
      discount: advert.discount || '',
      image_url: advert.image_url || '',
      link_url: advert.link_url || '',
      placement: advert.placement,
      status: advert.status,
      expires_at: advert.expires_at || ''
    });
    setShowDialog(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'seeds': return <Package className="h-4 w-4" />;
      case 'equipment': return <Car className="h-4 w-4" />;
      case 'storage': return <Building className="h-4 w-4" />;
      case 'services': return <Thermometer className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getPlacementColor = (placement: string) => {
    switch (placement) {
      case 'marketplace': return 'bg-blue-100 text-blue-800';
      case 'city-markets': return 'bg-green-100 text-green-800';
      case 'route-maps': return 'bg-orange-100 text-orange-800';
      case 'demand-hotspot': return 'bg-purple-100 text-purple-800';
      case 'all': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading advertisements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advertisement Management</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingAdvert(null); resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Advertisement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAdvert ? 'Edit Advertisement' : 'Create New Advertisement'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Premium Seeds Sale"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seeds">Seeds & Inputs</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="storage">Storage</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="produce">Produce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your advertisement..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="e.g., KSh 450/kg"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    id="discount"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    placeholder="e.g., 20% OFF"
                  />
                </div>
                <div>
                  <Label htmlFor="expires_at">Expires At</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="placement">Placement *</Label>
                  <Select value={formData.placement} onValueChange={(value: any) => setFormData({...formData, placement: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select placement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketplace">Marketplace</SelectItem>
                      <SelectItem value="city-markets">City Markets</SelectItem>
                      <SelectItem value="route-maps">Route Maps</SelectItem>
                      <SelectItem value="demand-hotspot">Demand Hotspot</SelectItem>
                      <SelectItem value="all">All Pages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="link_url">Link URL</Label>
                  <Input
                    id="link_url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                    placeholder="https://example.com/offer"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingAdvert ? 'Update Advertisement' : 'Create Advertisement'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {adverts.map((advert) => (
          <Card key={advert.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(advert.category)}
                      <h3 className="text-lg font-semibold">{advert.title}</h3>
                    </div>
                    <Badge className={getPlacementColor(advert.placement)}>
                      {advert.placement.replace('-', ' ')}
                    </Badge>
                    <Badge className={getStatusColor(advert.status)}>
                      {advert.status}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{advert.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">{advert.price}</span>
                    </div>
                    {advert.discount && (
                      <span className="text-green-600 font-medium">{advert.discount}</span>
                    )}
                    {advert.expires_at && (
                      <span className="text-gray-500">
                        Expires: {new Date(advert.expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(advert)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(advert.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {adverts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No advertisements yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating your first advertisement to promote agricultural products and services.
            </p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Advertisement
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvertManagement;
