
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Calendar, TrendingUp, Droplets, Thermometer, Wind, Plus, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FarmTask {
  id: string;
  title: string;
  culture: string;
  date: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  status: 'pending' | 'completed';
  description: string;
}

interface WeatherAlert {
  id: string;
  type: 'Cyclone' | 'Pluie' | 'Sécheresse';
  region: string;
  severity: 'critique' | 'modérée' | 'faible';
  description: string;
  startDate: string;
  endDate: string;
}

interface FarmStats {
  monthlyRevenue: number;
  totalArea: number;
  averageYield: number;
  activeAlerts: number;
}

const FarmDashboard: React.FC = () => {
  const { toast } = useToast();
  const [farmTasks, setFarmTasks] = useState<FarmTask[]>([
    {
      id: '1',
      title: 'Fertilisation de la canne',
      culture: 'Canne à Sucre',
      date: '2023-09-25',
      priority: 'Haute',
      status: 'pending',
      description: 'Appliquer l\'engrais NPK sur les parcelles A et B'
    },
    {
      id: '2',
      title: 'Traitement contre la cercosporiose',
      culture: 'Banane',
      date: '2023-09-28',
      priority: 'Moyenne',
      status: 'pending',
      description: 'Pulvériser fongicide préventif'
    },
    {
      id: '3',
      title: 'Inspection croissance ananas',
      culture: 'Ananas',
      date: '2023-09-30',
      priority: 'Basse',
      status: 'completed',
      description: 'Vérifier la croissance et détecter les maladies'
    }
  ]);

  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([
    {
      id: '1',
      type: 'Cyclone',
      region: 'Toute la Guadeloupe',
      severity: 'critique',
      description: 'Cyclone tropical de catégorie 2 en approche',
      startDate: '2023-09-30',
      endDate: '2023-10-02'
    },
    {
      id: '2',
      type: 'Pluie',
      region: 'Basse-Terre',
      severity: 'modérée',
      description: 'Fortes précipitations attendues',
      startDate: '2023-09-20',
      endDate: '2023-09-24'
    }
  ]);

  const [farmStats] = useState<FarmStats>({
    monthlyRevenue: 15450,
    totalArea: 35,
    averageYield: 75,
    activeAlerts: 3
  });

  const deleteTask = (taskId: string) => {
    setFarmTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Tâche supprimée",
      description: "La tâche a été supprimée avec succès.",
    });
  };

  const toggleTaskStatus = (taskId: string) => {
    setFarmTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
        : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute': return 'bg-red-100 text-red-800 border-red-200';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Basse': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critique': return 'bg-red-100 text-red-800 border-red-200';
      case 'modérée': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'faible': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord Agricole</h1>
          <p className="text-muted-foreground">Bienvenue, Exploitant | Dernière synchronisation: {new Date().toLocaleTimeString()}</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenu mensuel</p>
                <p className="text-2xl font-bold">{farmStats.monthlyRevenue.toLocaleString()} €</p>
                <p className="text-xs text-green-600">↗ +6.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Superficie cultivée</p>
                <p className="text-2xl font-bold">{farmStats.totalArea} ha</p>
                <p className="text-xs text-muted-foreground">5 parcelles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rendement moyen</p>
                <p className="text-2xl font-bold">{farmStats.averageYield} t/ha</p>
                <p className="text-xs text-green-600">↗ +5.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertes</p>
                <p className="text-2xl font-bold">{farmStats.activeAlerts}</p>
                <p className="text-xs text-yellow-600">⚠ Récentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tâches à venir</TabsTrigger>
          <TabsTrigger value="alerts">Alertes Météo</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Tâches à venir
              </CardTitle>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une tâche
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {farmTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">{task.culture}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      <p className="text-xs text-muted-foreground">Date: {task.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={task.status === 'completed' ? 'default' : 'outline'}
                        onClick={() => toggleTaskStatus(task.id)}
                      >
                        {task.status === 'completed' ? '✓ Terminé' : 'Marquer terminé'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Alertes Météorologiques
              </CardTitle>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une alerte
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weatherAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {alert.type === 'Cyclone' && <Wind className="h-4 w-4 text-red-600" />}
                          {alert.type === 'Pluie' && <Droplets className="h-4 w-4 text-blue-600" />}
                          {alert.type === 'Sécheresse' && <Thermometer className="h-4 w-4 text-orange-600" />}
                          <span className="font-medium">{alert.type}</span>
                        </div>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        Voir détails
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{alert.region}</p>
                    <p className="text-sm">{alert.description}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      Début: {alert.startDate} | Fin: {alert.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Revenu Mensuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Graphique des revenus (Recharts sera intégré)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Cultures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Canne à Sucre</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded">
                        <div className="w-16 h-2 bg-green-600 rounded"></div>
                      </div>
                      <span className="text-sm">40%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Banane</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded">
                        <div className="w-12 h-2 bg-yellow-600 rounded"></div>
                      </div>
                      <span className="text-sm">30%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ananas</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded">
                        <div className="w-8 h-2 bg-orange-600 rounded"></div>
                      </div>
                      <span className="text-sm">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Autres</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded">
                        <div className="w-4 h-2 bg-blue-600 rounded"></div>
                      </div>
                      <span className="text-sm">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmDashboard;
