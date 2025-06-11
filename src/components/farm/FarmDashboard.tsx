import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Calendar, TrendingUp, Droplets, Thermometer, Wind, Plus, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FarmerService, type FarmTask, type WeatherAlert, type FarmStats } from '@/services/farmerService';
import { useAuth } from '@/hooks/useAuth';

const FarmDashboard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [farmTasks, setFarmTasks] = useState<FarmTask[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [farmStats, setFarmStats] = useState<FarmStats>({
    monthly_revenue: 0,
    total_area: 0,
    average_yield: 0,
    active_alerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [tasks, stats, alerts] = await Promise.all([
        FarmerService.getFarmTasks(user.id),
        FarmerService.getFarmStats(user.id),
        FarmerService.getWeatherAlerts('Kenya') // Default to Kenya
      ]);

      setFarmTasks(tasks);
      setFarmStats(stats);
      setWeatherAlerts(alerts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    const success = await FarmerService.deleteFarmTask(taskId);
    if (success) {
      setFarmTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive"
      });
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    const task = farmTasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    const success = await FarmerService.updateFarmTask(taskId, { status: newStatus });
    
    if (success) {
      setFarmTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus }
          : task
      ));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Farm Dashboard</h1>
          <p className="text-muted-foreground">Welcome, Farmer | Last sync: {new Date().toLocaleTimeString()}</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">KES {farmStats.monthly_revenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">↗ +6.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cultivated Area</p>
                <p className="text-2xl font-bold">{farmStats.total_area} ha</p>
                <p className="text-xs text-muted-foreground">5 parcels</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Yield</p>
                <p className="text-2xl font-bold">{farmStats.average_yield} t/ha</p>
                <p className="text-xs text-green-600">↗ +5.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold">{farmStats.active_alerts}</p>
                <p className="text-xs text-yellow-600">⚠ Recent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Upcoming Tasks</TabsTrigger>
          <TabsTrigger value="alerts">Weather Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Upcoming Tasks
              </CardTitle>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {farmTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tasks found. Add your first task to get started.
                  </div>
                ) : (
                  farmTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">{task.crop}</Badge>
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
                          {task.status === 'completed' ? '✓ Completed' : 'Mark Complete'}
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Weather Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weatherAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No active weather alerts for your region.
                  </div>
                ) : (
                  weatherAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {alert.type === 'Cyclone' && <Wind className="h-4 w-4 text-red-600" />}
                            {alert.type === 'Rain' && <Droplets className="h-4 w-4 text-blue-600" />}
                            {alert.type === 'Drought' && <Thermometer className="h-4 w-4 text-orange-600" />}
                            <span className="font-medium">{alert.type}</span>
                          </div>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{alert.region}</p>
                      <p className="text-sm">{alert.description}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        Start: {alert.start_date} | End: {alert.end_date}
                      </div>
                    </div>
                  ))
                )}
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
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Revenue chart will be integrated with real data
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crop Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Maize</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded">
                        <div className="w-16 h-2 bg-green-600 rounded"></div>
                      </div>
                      <span className="text-sm">40%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Beans</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded">
                        <div className="w-12 h-2 bg-yellow-600 rounded"></div>
                      </div>
                      <span className="text-sm">30%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Vegetables</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded">
                        <div className="w-8 h-2 bg-orange-600 rounded"></div>
                      </div>
                      <span className="text-sm">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Other</span>
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
