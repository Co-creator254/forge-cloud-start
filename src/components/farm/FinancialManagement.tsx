
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, FileText, Plus, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Transaction {
  id: string;
  date: string;
  type: 'revenue' | 'expense';
  category: string;
  description: string;
  amount: number;
}

const FinancialManagement: React.FC = () => {
  const [transactions] = useState<Transaction[]>([
    { id: '1', date: '7/28/2023', type: 'expense', category: 'Salaires', description: 'Salaires employés', amount: 2800 },
    { id: '2', date: '7/25/2023', type: 'revenue', category: 'Subventions', description: 'Subvention agricole', amount: 4200 }
  ]);

  const monthlyData = [
    { month: 'Jan', revenus: 7500, depenses: 6800, profit: 700 },
    { month: 'Fév', revenus: 8200, depenses: 7200, profit: 1000 },
    { month: 'Mar', revenus: 8800, depenses: 7500, profit: 1300 },
    { month: 'Avr', revenus: 9500, depenses: 8000, profit: 1500 },
    { month: 'Mai', revenus: 10200, depenses: 8200, profit: 2000 },
    { month: 'Juin', revenus: 11000, depenses: 8500, profit: 2500 },
    { month: 'Juil', revenus: 11800, depenses: 9000, profit: 2800 },
    { month: 'Août', revenus: 12500, depenses: 9200, profit: 3300 },
    { month: 'Sep', revenus: 11500, depenses: 8800, profit: 2700 },
    { month: 'Oct', revenus: 10800, depenses: 8300, profit: 2500 },
    { month: 'Nov', revenus: 9800, depenses: 7800, profit: 2000 },
    { month: 'Déc', revenus: 8900, depenses: 7300, profit: 1600 }
  ];

  const totalRevenue = 8900;
  const totalExpenses = 4720;
  const balance = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion Financière</h2>
          <p className="text-muted-foreground">Suivez vos revenus, dépenses et la rentabilité de votre exploitation agricole</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <FileText className="h-4 w-4 mr-2" />
            Générer un rapport
          </Button>
        </div>
      </div>

      <Tabs defaultValue="apercu" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="apercu">Aperçu général</TabsTrigger>
          <TabsTrigger value="revenus">Revenus</TabsTrigger>
          <TabsTrigger value="depenses">Dépenses</TabsTrigger>
          <TabsTrigger value="previsions">Prévisions</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="apercu" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Revenus</CardTitle>
                <div className="text-sm text-muted-foreground">Total des entrées</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()} €</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Dépenses</CardTitle>
                <div className="text-sm text-muted-foreground">Total des sorties</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()} €</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Solde</CardTitle>
                <div className="text-sm text-muted-foreground">Revenus - Dépenses</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{balance.toLocaleString()} €</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu Mensuel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenus" fill="#22c55e" />
                      <Bar dataKey="depenses" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Transactions Récentes</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Imprimer
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${transaction.type === 'revenue' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">{transaction.date} • {transaction.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'revenue' ? '+' : '-'}{transaction.amount}
                        </span>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenus">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Fonctionnalité en cours de développement
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depenses">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Fonctionnalité en cours de développement
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="previsions">
          <Card>
            <CardHeader>
              <CardTitle>Prévisions Financières</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Fonctionnalité en cours de développement
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Gestion du Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Fonctionnalité en cours de développement
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;
