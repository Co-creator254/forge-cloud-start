
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, Droplets } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Crop {
  id: string;
  name: string;
  currentYield: number;
  previousYield: number;
  unit: string;
  quality: string;
  surface: number;
}

const CropTracking: React.FC = () => {
  const [crops] = useState<Crop[]>([
    { id: '1', name: 'Canne à Sucre', currentYield: 85, previousYield: 75, unit: 't/ha', quality: 'Bonne', surface: 12500 },
    { id: '2', name: 'Banane', currentYield: 32, previousYield: 30, unit: 't/ha', quality: 'Excellente', surface: 2300 },
    { id: '3', name: 'Ananas', currentYield: 45, previousYield: 48, unit: 't/ha', quality: 'Bonne', surface: 350 },
    { id: '4', name: 'Igname', currentYield: 18, previousYield: 15, unit: 't/ha', quality: 'Moyenne', surface: 420 },
    { id: '5', name: 'Madère', currentYield: 22, previousYield: 20, unit: 't/ha', quality: 'Bonne', surface: 180 }
  ]);

  const yieldData = crops.map(crop => ({
    name: crop.name,
    'Rendement actuel': crop.currentYield,
    'Rendement précédent': crop.previousYield
  }));

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Excellente': return 'bg-green-100 text-green-800';
      case 'Bonne': return 'bg-blue-100 text-blue-800';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Cultures</h2>
          <p className="text-muted-foreground">Gérez vos cultures tropicales et suivez leur rendement</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une ligne
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Suivi des Récoltes en Guadeloupe
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Suivez les rendements et la qualité des récoltes pour les principales cultures guadeloupéennes
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
                  <Bar dataKey="Rendement actuel" fill="#22c55e" />
                  <Bar dataKey="Rendement précédent" fill="#7c2d12" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {crops.map((crop) => (
            <Card key={crop.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{crop.name}</h3>
                    <p className="text-sm text-muted-foreground">Surface: {crop.surface} m²</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rendement actuel</span>
                    <span className="font-medium">{crop.currentYield} {crop.unit}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rendement précédent</span>
                    <span className="text-sm text-muted-foreground">{crop.previousYield} {crop.unit}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Qualité</span>
                    <Badge className={getQualityColor(crop.quality)}>
                      {crop.quality}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">
                      +{((crop.currentYield - crop.previousYield) / crop.previousYield * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropTracking;
