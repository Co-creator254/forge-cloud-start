import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  Store,
  Sprout,
  Warehouse,
  Plus,
  Eye,
  ArrowRight,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supplyChainService, type Batch, type BatchQCSummary, type SupplyChainQualityControl } from '@/services/api/supabase/supply-chain.service';
import { toast } from 'sonner';

interface SupplyChainStage {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  status: 'completed' | 'in_progress' | 'problem' | 'pending';
  progress: number;
  description: string;
  issues?: string[];
  estimatedTime?: string;
  actualTime?: string;
  location?: string;
  responsible?: string;
}

const SupplyChainDashboard: React.FC = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [issues, setIssues] = useState<SupplyChainQualityControl[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [batchesData, summaryData, issuesData] = await Promise.all([
        supplyChainService.getBatches(),
        supplyChainService.getDashboardSummary(),
        supplyChainService.getQualityControlIssues()
      ]);
      setBatches(batchesData);
      setIssues(issuesData);
      setDashboardSummary(summaryData);
      
      // Auto-select first batch if available
      if (batchesData.length > 0) {
        setSelectedBatch(batchesData[0]);
      }
    } catch (error) {
      console.error('Error loading supply chain data:', error);
      toast.error('Failed to load supply chain data');
    } finally {
      setLoading(false);
    }
  };

  const getSupplyChainStages = (batch: Batch): SupplyChainStage[] => {
    const now = new Date();
    const createdDate = new Date(batch.created_at);
    const daysSinceCreation = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Simulate supply chain progression based on age and quality checks
    const stages: SupplyChainStage[] = [
      {
        id: 'planting',
        name: 'Planting & Sowing',
        icon: Sprout,
        status: daysSinceCreation >= 0 ? 'completed' : 'pending',
        progress: daysSinceCreation >= 0 ? 100 : 0,
        description: 'Initial planting and crop establishment',
        estimatedTime: 'Day 0-30',
        actualTime: daysSinceCreation >= 0 ? 'Day 0-25' : undefined,
        location: batch.location?.name || 'Farm Field A',
        responsible: 'Farm Manager'
      },
      {
        id: 'growth',
        name: 'Growth & Monitoring',
        icon: TrendingUp,
        status: daysSinceCreation >= 15 ? 'completed' : daysSinceCreation >= 5 ? 'in_progress' : 'pending',
        progress: Math.min(100, Math.max(0, (daysSinceCreation - 5) * 5)),
        description: 'Crop growth monitoring and maintenance',
        estimatedTime: 'Day 30-90',
        actualTime: daysSinceCreation >= 15 ? 'Day 25-85' : undefined,
        location: batch.location?.name || 'Farm Field A',
        responsible: 'Agronomist'
      },
      {
        id: 'harvest',
        name: 'Harvesting',
        icon: Package,
        status: daysSinceCreation >= 30 ? 'completed' : daysSinceCreation >= 20 ? 'in_progress' : 'pending',
        progress: Math.min(100, Math.max(0, (daysSinceCreation - 20) * 10)),
        description: 'Harvesting and initial processing',
        estimatedTime: 'Day 90-100',
        actualTime: daysSinceCreation >= 30 ? 'Day 85-95' : undefined,
        location: 'Processing Facility',
        responsible: 'Harvest Team'
      },
      {
        id: 'storage',
        name: 'Storage & Warehousing',
        icon: Warehouse,
        status: daysSinceCreation >= 35 ? 'completed' : daysSinceCreation >= 30 ? 'in_progress' : 'pending',
        progress: Math.min(100, Math.max(0, (daysSinceCreation - 30) * 20)),
        description: 'Storage and inventory management',
        estimatedTime: 'Day 100-110',
        actualTime: daysSinceCreation >= 35 ? 'Day 95-105' : undefined,
        location: 'Central Warehouse',
        responsible: 'Warehouse Manager'
      },
      {
        id: 'transport',
        name: 'Transportation',
        icon: Truck,
        status: daysSinceCreation >= 40 ? 'completed' : daysSinceCreation >= 35 ? 'in_progress' : 'pending',
        progress: Math.min(100, Math.max(0, (daysSinceCreation - 35) * 20)),
        description: 'Transportation to distribution centers',
        estimatedTime: 'Day 110-120',
        actualTime: daysSinceCreation >= 40 ? 'Day 105-115' : undefined,
        location: 'In Transit',
        responsible: 'Logistics Coordinator'
      },
      {
        id: 'market',
        name: 'Market Distribution',
        icon: Store,
        status: daysSinceCreation >= 45 ? 'completed' : daysSinceCreation >= 40 ? 'in_progress' : 'pending',
        progress: Math.min(100, Math.max(0, (daysSinceCreation - 40) * 20)),
        description: 'Final delivery to markets/customers',
        estimatedTime: 'Day 120-130',
        actualTime: daysSinceCreation >= 45 ? 'Day 115-125' : undefined,
        location: 'Market Centers',
        responsible: 'Sales Team'
      }
    ];

    // Add issues to stages based on quality control problems
    const batchIssues = issues.filter(issue => issue.batch_id === batch.id);
    stages.forEach(stage => {
      const stageIssues = batchIssues.filter(issue => 
        issue.details?.stage === stage.name || 
        issue.severity === 'high'
      );
      if (stageIssues.length > 0) {
        stage.status = 'problem';
        stage.issues = stageIssues.map(issue => issue.details?.description || 'Quality issue detected');
      }
    });

    return stages;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: Clock,
      completed: CheckCircle,
      in_progress: TrendingUp,
      problem: AlertTriangle,
    };
    return icons[status] || Clock;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-gray-500',
      completed: 'text-green-500',
      in_progress: 'text-blue-500',
      problem: 'text-red-500',
    };
    return colors[status] || 'text-gray-500';
  };

  const getOverallChainStatus = (stages: SupplyChainStage[]) => {
    const completedStages = stages.filter(s => s.status === 'completed').length;
    const problemStages = stages.filter(s => s.status === 'problem').length;
    const totalProgress = stages.reduce((sum, s) => sum + s.progress, 0) / stages.length;
    
    if (problemStages > 0) return { status: 'problem', color: 'text-red-500', message: `${problemStages} stage(s) have issues` };
    if (completedStages === stages.length) return { status: 'completed', color: 'text-green-500', message: 'Supply chain complete' };
    if (totalProgress >= 50) return { status: 'in_progress', color: 'text-blue-500', message: `${completedStages}/${stages.length} stages completed` };
    return { status: 'early', color: 'text-yellow-500', message: 'Early stages' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert>
        <AlertDescription>Please log in to view your supply chain dashboard.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Supply Chain Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardSummary.totalBatches}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardSummary.totalQuantity.toLocaleString()} units total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chain Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedBatch ? Math.round(getSupplyChainStages(selectedBatch).reduce((sum, s) => sum + s.progress, 0) / getSupplyChainStages(selectedBatch).length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Average stage completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dashboardSummary.openIssues}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardSummary.highSeverityIssues} high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardSummary.passedChecks + dashboardSummary.failedChecks > 0 
                ? Math.round((dashboardSummary.passedChecks / (dashboardSummary.passedChecks + dashboardSummary.failedChecks)) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Pass rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Batch Selection */}
      {batches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Batch for Chain View</CardTitle>
            <CardDescription>Choose a batch to view its complete supply chain journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {batches.map((batch) => {
                const stages = getSupplyChainStages(batch);
                const overallStatus = getOverallChainStatus(stages);
                
                return (
                  <div
                    key={batch.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedBatch?.id === batch.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedBatch(batch)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">
                        {batch.product?.name || 'Unknown Product'}
                      </h4>
                      <Badge variant="outline" className={overallStatus.color}>
                        {overallStatus.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Lot: {batch.lot_number || 'N/A'} • {batch.quantity.toLocaleString()} units
                    </div>
                    <Progress value={Math.round(stages.reduce((sum, s) => sum + s.progress, 0) / stages.length)} className="h-1" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {overallStatus.message}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Supply Chain View */}
      {selectedBatch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Supply Chain Journey
              <Badge variant="outline">
                {selectedBatch.product?.name} - Lot {selectedBatch.lot_number || 'N/A'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Complete end-to-end supply chain flow with problem identification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {getSupplyChainStages(selectedBatch).map((stage, index) => {
                const StageIcon = stage.icon;
                const StatusIcon = getStatusIcon(stage.status);
                const isLast = index === getSupplyChainStages(selectedBatch).length - 1;
                
                return (
                  <div key={stage.id} className="relative">
                    {/* Connection Line */}
                    {!isLast && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
                    )}
                    
                    <div className="flex gap-4">
                      {/* Stage Icon and Status */}
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          stage.status === 'completed' ? 'bg-green-100' :
                          stage.status === 'in_progress' ? 'bg-blue-100' :
                          stage.status === 'problem' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          <StageIcon className={`h-6 w-6 ${getStatusColor(stage.status)}`} />
                        </div>
                        <StatusIcon className={`h-4 w-4 mt-2 ${getStatusColor(stage.status)}`} />
                      </div>
                      
                      {/* Stage Details */}
                      <div className="flex-1 min-w-0">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{stage.name}</h3>
                              <p className="text-sm text-muted-foreground">{stage.description}</p>
                            </div>
                            <Badge variant="outline" className={getStatusColor(stage.status)}>
                              {stage.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{stage.progress}%</span>
                            </div>
                            <Progress value={stage.progress} className="h-2" />
                          </div>
                          
                          {/* Stage Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {stage.estimatedTime}
                                {stage.actualTime && ` → ${stage.actualTime}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{stage.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{stage.responsible}</span>
                            </div>
                          </div>
                          
                          {/* Issues */}
                          {stage.issues && stage.issues.length > 0 && (
                            <Alert variant="destructive" className="mt-3">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <div className="font-semibold mb-1">Issues Detected:</div>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {stage.issues.map((issue, i) => (
                                    <li key={i}>{issue}</li>
                                  ))}
                                </ul>
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          {/* Actions */}
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {stage.status === 'problem' && (
                              <Button variant="outline" size="sm">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Resolve Issue
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Batches State */}
      {batches.length === 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No batches found. Create your first batch to start tracking your complete supply chain journey.
          </AlertDescription>
          <Button className="mt-4" onClick={() => toast.info('Batch creation form coming soon!')}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Batch
          </Button>
        </Alert>
      )}
    </div>
  );
};

export default SupplyChainDashboard;