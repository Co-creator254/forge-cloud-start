import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Parcel {
  id: string;
  name: string;
  size: number;
  unit: string;
  crop?: string;
  status: string;
  last_harvest?: string;
  next_harvest_date?: string;
  latitude?: number;
  longitude?: number;
  soil_type?: string;
  irrigation_type?: string;
  notes?: string;
}

const LandManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParcel, setSelectedParcel] = useState<Parcel | undefined>();
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    unit: 'acres',
    crop: '',
    status: 'active',
    soil_type: '',
    irrigation_type: '',
    latitude: '',
    longitude: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      loadParcels();
    }
  }, [user]);

  const loadParcels = async () => {
    try {
      const { data, error } = await supabase
        .from('land_parcels')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParcels(data || []);
      if (data && data.length > 0) {
        setSelectedParcel(data[0]);
      }
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
      const parcelData = {
        user_id: user!.id,
        name: formData.name,
        size: parseFloat(formData.size),
        unit: formData.unit,
        crop: formData.crop || null,
        status: formData.status,
        soil_type: formData.soil_type || null,
        irrigation_type: formData.irrigation_type || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        notes: formData.notes || null
      };

      if (editingParcel) {
        const { error } = await supabase
          .from('land_parcels')
          .update(parcelData)
          .eq('id', editingParcel.id);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Parcel updated successfully' });
      } else {
        const { error } = await supabase
          .from('land_parcels')
          .insert(parcelData);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Parcel added successfully' });
      }

      setDialogOpen(false);
      setEditingParcel(null);
      resetForm();
      loadParcels();
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
    if (!confirm('Are you sure you want to delete this parcel?')) return;

    try {
      const { error } = await supabase
        .from('land_parcels')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Success', description: 'Parcel deleted successfully' });
      loadParcels();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (parcel: Parcel) => {
    setEditingParcel(parcel);
    setFormData({
      name: parcel.name,
      size: parcel.size.toString(),
      unit: parcel.unit,
      crop: parcel.crop || '',
      status: parcel.status,
      soil_type: parcel.soil_type || '',
      irrigation_type: parcel.irrigation_type || '',
      latitude: parcel.latitude?.toString() || '',
      longitude: parcel.longitude?.toString() || '',
      notes: parcel.notes || ''
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      size: '',
      unit: 'acres',
      crop: '',
      status: 'active',
      soil_type: '',
      irrigation_type: '',
      latitude: '',
      longitude: '',
      notes: ''
    });
  };

  const filteredParcels = parcels.filter(parcel => 
    parcel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (parcel.crop && parcel.crop.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Default center: Nairobi, Kenya
  const defaultCenter: [number, number] = [-1.2921, 36.8219];
  const mapCenter: [number, number] = selectedParcel?.latitude && selectedParcel?.longitude
    ? [selectedParcel.latitude, selectedParcel.longitude]
    : defaultCenter;

  if (loading && parcels.length === 0) {
    return <div className="p-6">Loading parcels...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Land & Parcel Management</h2>
          <p className="text-muted-foreground">Manage and monitor all your agricultural parcels across Kenya</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            setEditingParcel(null);
            resetForm();
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Parcel
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search parcels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredParcels.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No parcels yet. Click "Add New Parcel" to get started.
              </CardContent>
            </Card>
          ) : (
            filteredParcels.map((parcel) => (
              <Card 
                key={parcel.id} 
                className={`border-l-4 border-l-primary cursor-pointer transition-all hover:shadow-md ${
                  selectedParcel?.id === parcel.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedParcel(parcel)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{parcel.name}</CardTitle>
                      <Badge variant={parcel.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                        {parcel.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleEdit(parcel); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => { e.stopPropagation(); handleDelete(parcel.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{parcel.size} {parcel.unit}</span>
                    </div>
                    {parcel.crop && (
                      <div className="mt-3 p-2 bg-primary/10 rounded">
                        <div className="text-sm font-medium">{parcel.crop}</div>
                        {parcel.next_harvest_date && (
                          <div className="text-xs text-muted-foreground">Next harvest: {parcel.next_harvest_date}</div>
                        )}
                      </div>
                    )}
                    {parcel.latitude && parcel.longitude && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{parcel.latitude.toFixed(4)}, {parcel.longitude.toFixed(4)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Farm Location Map
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Free OpenStreetMap - Click parcels on left to view on map
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] w-full rounded-b-lg overflow-hidden">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  key={selectedParcel?.id || 'default'}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredParcels
                    .filter(p => p.latitude && p.longitude)
                    .map(parcel => (
                      <Marker
                        key={parcel.id}
                        position={[parcel.latitude!, parcel.longitude!]}
                        eventHandlers={{
                          click: () => setSelectedParcel(parcel)
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-bold">{parcel.name}</h3>
                            <p className="text-sm">{parcel.size} {parcel.unit}</p>
                            {parcel.crop && <p className="text-sm text-muted-foreground">{parcel.crop}</p>}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {selectedParcel && (
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Selected Parcel Details</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedParcel.name}</p>
                  <p><span className="font-medium">Size:</span> {selectedParcel.size} {selectedParcel.unit}</p>
                  {selectedParcel.crop && <p><span className="font-medium">Crop:</span> {selectedParcel.crop}</p>}
                  {selectedParcel.soil_type && <p><span className="font-medium">Soil:</span> {selectedParcel.soil_type}</p>}
                  {selectedParcel.irrigation_type && <p><span className="font-medium">Irrigation:</span> {selectedParcel.irrigation_type}</p>}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingParcel ? 'Edit Parcel' : 'Add New Parcel'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Parcel Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., North Field"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="fallow">Fallow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="size">Size*</Label>
                <Input
                  id="size"
                  type="number"
                  step="0.01"
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acres">acres</SelectItem>
                    <SelectItem value="hectares">hectares</SelectItem>
                    <SelectItem value="m²">m²</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="crop">Current Crop</Label>
                <Input
                  id="crop"
                  value={formData.crop}
                  onChange={(e) => setFormData({...formData, crop: e.target.value})}
                  placeholder="e.g., Maize"
                />
              </div>
              <div>
                <Label htmlFor="soil_type">Soil Type</Label>
                <Input
                  id="soil_type"
                  value={formData.soil_type}
                  onChange={(e) => setFormData({...formData, soil_type: e.target.value})}
                  placeholder="e.g., Loamy"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="irrigation_type">Irrigation Type</Label>
              <Input
                id="irrigation_type"
                value={formData.irrigation_type}
                onChange={(e) => setFormData({...formData, irrigation_type: e.target.value})}
                placeholder="e.g., Drip, Sprinkler"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude (for map)</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                  placeholder="e.g., -1.2921"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude (for map)</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                  placeholder="e.g., 36.8219"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional information"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingParcel ? 'Update Parcel' : 'Add Parcel'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandManagement;
