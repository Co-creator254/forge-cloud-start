
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Package, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  status: 'normal' | 'warning' | 'critical';
  minimum: number;
}

const InventoryManagement: React.FC = () => {
  const [items] = useState<InventoryItem[]>([
    { id: '1', name: 'Carburant Diesel', category: 'Carburants', quantity: 350, unit: 'L', unitPrice: 1.8, totalValue: 630, status: 'normal', minimum: 100 },
    { id: '2', name: 'Engrais NPK', category: 'Engrais', quantity: 800, unit: 'kg', unitPrice: 1.2, totalValue: 960, status: 'normal', minimum: 200 },
    { id: '3', name: 'Ficelle pour bottes', category: 'Consommables', quantity: 15, unit: 'rouleau', unitPrice: 25, totalValue: 375, status: 'normal', minimum: 5 },
    { id: '4', name: 'Herbicide Roundup', category: 'Produits phytosanitaires', quantity: 50, unit: 'L', unitPrice: 15, totalValue: 750, status: 'normal', minimum: 20 },
    { id: '5', name: 'Huile moteur', category: 'Lubrifiants', quantity: 25, unit: 'L', unitPrice: 5.2, totalValue: 130, status: 'normal', minimum: 10 },
    { id: '6', name: 'Semences de blé', category: 'Semences', quantity: 500, unit: 'kg', unitPrice: 0.5, totalValue: 250, status: 'normal', minimum: 100 },
    { id: '7', name: 'Semences de maïs', category: 'Semences', quantity: 80, unit: 'kg', unitPrice: 4.5, totalValue: 360, status: 'warning', minimum: 100 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes catégories');

  const categories = ['Toutes catégories', ...Array.from(new Set(items.map(item => item.category)))];
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes catégories' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = items.filter(item => item.quantity <= item.minimum);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical': return <Badge variant="destructive">Critique</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>;
      default: return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Stocks et Récoltes</h2>
          <p className="text-muted-foreground">Gérez votre inventaire et suivez les niveaux de stock de vos cultures guadeloupéennes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un stock
          </Button>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Alertes de stock bas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{item.name}</span>
                  <div>
                    <span>Stock actuel: {item.quantity}</span>
                    <span className="text-muted-foreground ml-2">Minimum: {item.minimum}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Input
          placeholder="Rechercher dans l'inventaire..."
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
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer par date
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des Stocks</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Liste</Button>
              <Button size="sm" variant="outline">Statistiques</Button>
              <Button size="sm" variant="outline">Exporter</Button>
              <Button size="sm" variant="outline">Importer</Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un article
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Gérez votre inventaire et suivez les niveaux de stock</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Valeur totale</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell>{item.unitPrice.toFixed(2)} €</TableCell>
                    <TableCell>{item.totalValue.toFixed(2)} €</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
