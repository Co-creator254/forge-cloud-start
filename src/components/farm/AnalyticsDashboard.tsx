
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, PieChart, TrendingUp, Download, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceIndicator {
  id: string;
  indicator: string;
  currentValue: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
}

const AnalyticsDashboard: React.FC = () => {
  const [indicators] = useState<PerformanceIndicator[]>([
    { id: '1', indicator: 'Rendement Canne à Sucre', currentValue: 75, target: 85, unit: 't/ha', status: 'warning' },
    { id: '2', indicator: 'Qualité Banane Export', currentValue: 88, target: 95, unit: '%', status: 'good' },
    { id: '3', indicator: 'Rentabilité Ananas', currentValue: 70, target: 80, unit: '%', status: 'warning' },
    { id: '4', indicator: 'Certification Bio', currentValue: 25, target: 40, unit: '%', status: 'critical' },
    { id: '5', indicator: 'Innovation Igname', currentValue: 60, target: 75, unit: '%', status: 'warning' }
  ];

  const profitabilityData = [
    { size: 4, profit: 800 },
    { size: 8, profit: 1000 },
    { size: 12, profit: 1200 },
    { size: 16, profit: 1600 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return 'Bon';
      case 'warning': return 'Attention';
      case 'critical': return 'Critique';
      default: return 'Normal';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Statistiques et Analyses</h2>
          <p className="text-muted-foreground">
            Visualisez et analysez les données de votre exploitation en Guadeloupe
          </p>
          <div className="text-sm text-muted-foreground mt-2">
            Modules connectés: parcelles, cultures, finances • Dernière synchro: 6/4/2025, 6:16:31 AM
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart className="h-4 w-4 mr-2" />
            Indicateurs
          </Button>
          <Button variant="outline">
            <PieChart className="h-4 w-4 mr-2" />
            Récoltes
          </Button>
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Détaillé
          </Button>
          <Button variant="outline">
            <BarChart className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alertes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rentabilité par parcelle (€/ha)</CardTitle>
            <p className="text-sm text-muted-foreground">
              Suivez vos performances par rapport à vos objectifs pour les cultures guadeloupéennes
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={profitabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="size" name="Taille" unit=" ha" />
                  <YAxis dataKey="profit" name="Rentabilité" unit=" €/ha" />
                  <Tooltip />
                  <Scatter dataKey="profit" fill="#22c55e" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicateurs de performance agricole en Guadeloupe</CardTitle>
            <p className="text-sm text-muted-foreground">
              Suivez vos performances par rapport à vos objectifs pour les cultures guadeloupéennes
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="bg-green-600 hover:bg-green-700 w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une ligne
              </Button>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicateur</TableHead>
                    <TableHead>Valeur actuelle</TableHead>
                    <TableHead>Objectif</TableHead>
                    <TableHead>Unité</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {indicators.map((indicator) => (
                    <TableRow key={indicator.id}>
                      <TableCell className="font-medium">{indicator.indicator}</TableCell>
                      <TableCell>{indicator.currentValue}</TableCell>
                      <TableCell>{indicator.target}</TableCell>
                      <TableCell>{indicator.unit}</TableCell>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Indicateurs financiers clés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">EBE (EBITDA)</div>
              <div className="text-2xl font-bold">42,500 €</div>
              <div className="text-sm text-green-600">+2% de chiffre d'affaires</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rentabilité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Rentabilité</div>
              <div className="text-2xl font-bold">18%</div>
              <div className="text-sm text-green-600">+2% vs année précédente</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ROI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">ROI</div>
              <div className="text-2xl font-bold">22%</div>
              <div className="text-sm text-green-600">Sur les investissements</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
