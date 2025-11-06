import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Package, Filter, Trash2, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface InventoryItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_value: number;
  minimum_quantity: number;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const InventoryManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    unit_price: '',
    minimum_quantity: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchInventory();
    }
  }, [user]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('farm_inventory')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const quantity = parseFloat(formData.quantity);
      const unit_price = parseFloat(formData.unit_price);
      const total_value = quantity * unit_price;

      const itemData = {
        user_id: user?.id,
        name: formData.name,
        category: formData.category,
        quantity,
        unit: formData.unit,
        unit_price,
        total_value,
        minimum_quantity: parseFloat(formData.minimum_quantity),
        location: formData.location || null,
        notes: formData.notes || null
      };

      if (editingItem) {
        const { error } = await (supabase as any)
          .from('farm_inventory')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Inventory item updated successfully!"
        });
      } else {
        const { error } = await (supabase as any)
          .from('farm_inventory')
          .insert([itemData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Inventory item added successfully!"
        });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({
        name: '',
        category: '',
        quantity: '',
        unit: '',
        unit_price: '',
        minimum_quantity: '',
        location: '',
        notes: ''
      });
      fetchInventory();
    } catch (error) {
      console.error('Error saving inventory:', error);
      toast({
        title: "Error",
        description: "Failed to save inventory item",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      unit: item.unit,
      unit_price: item.unit_price.toString(),
      minimum_quantity: item.minimum_quantity.toString(),
      location: item.location || '',
      notes: item.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await (supabase as any)
        .from('farm_inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory item deleted successfully!"
      });
      fetchInventory();
    } catch (error) {
      console.error('Error deleting inventory:', error);
      toast({
        title: "Error",
        description: "Failed to delete inventory item",
        variant: "destructive"
      });
    }
  };

  const categories = ['All Categories', ...Array.from(new Set(items.map(item => item.category)))];
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = items.filter(item => item.quantity <= item.minimum_quantity);

  const getStatusBadge = (item: InventoryItem) => {
    if (item.quantity <= item.minimum_quantity * 0.5) {
      return <Badge variant="destructive">Critical</Badge>;
    } else if (item.quantity <= item.minimum_quantity) {
      return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory & Stock Management</h2>
          <p className="text-muted-foreground">Manage your farm inventory and track stock levels</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => {
            setEditingItem(null);
            setFormData({
              name: '',
              category: '',
              quantity: '',
              unit: '',
              unit_price: '',
              minimum_quantity: '',
              location: '',
              notes: ''
            });
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Stock Item
        </Button>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts ({lowStockItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{item.name}</span>
                  <div>
                    <span>Current: {item.quantity} {item.unit}</span>
                    <span className="text-muted-foreground ml-2">Min: {item.minimum_quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Management</CardTitle>
          <p className="text-sm text-muted-foreground">Total Items: {items.length} | Total Value: KES {items.reduce((sum, item) => sum + item.total_value, 0).toLocaleString()}</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No inventory items found. Add your first item to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity} {item.unit}</TableCell>
                      <TableCell>KES {item.unit_price.toFixed(2)}</TableCell>
                      <TableCell>KES {item.total_value.toFixed(2)}</TableCell>
                      <TableCell>{item.location || '-'}</TableCell>
                      <TableCell>{getStatusBadge(item)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add'} Inventory Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Item Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category*</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g., Seeds, Fertilizers, Tools"
                  required
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity*</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit*</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  placeholder="e.g., kg, L, bags"
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit_price">Unit Price (KES)*</Label>
                <Input
                  id="unit_price"
                  type="number"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={(e) => setFormData({...formData, unit_price: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="minimum_quantity">Minimum Quantity*</Label>
                <Input
                  id="minimum_quantity"
                  type="number"
                  step="0.01"
                  value={formData.minimum_quantity}
                  onChange={(e) => setFormData({...formData, minimum_quantity: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Storage Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Warehouse A"
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
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                {editingItem ? 'Update' : 'Add'} Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;
