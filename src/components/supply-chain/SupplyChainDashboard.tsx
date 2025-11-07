import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Warehouse
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supplyChainService, type SupplyChainStage } from '@/services/api/supabase/supply-chain.service';
import { toast } from 'sonner';

const SupplyChainDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stages, setStages] = useState<SupplyChainStage[]>([]);
  const [financialSummary, setFinancialSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stagesData, summaryData] = await Promise.all([
        supplyChainService.getStages(user!.id),
        supplyChainService.getFinancialSummary(user!.id)
      ]);
      setStages(stagesData);
      setFinancialSummary(summaryData);
    } catch (error) {
      console.error('Error loading supply chain data:', error);
      toast.error('Failed to load supply chain data');
    } finally {
      setLoading(false);
    }
  };

  const getStageIcon = (stageName: string) => {
    const icons: Record<string, any> = {
      planting: Sprout,
      growth: TrendingUp,
      harvest: Package,
      storage: Warehouse,
      transport: Truck,
      market: Store,
    };
    return icons[stageName] || Package;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      active: Clock,
      completed: CheckCircle,
      delayed: AlertTriangle,
      problem: XCircle,
    };
    return icons[status] || Clock;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'text-blue-500',
      completed: 'text-green-500',
      delayed: 'text-yellow-500',
      problem: 'text-red-500',
    };
    return colors[status] || 'text-gray-500';
  };

  const calculateTotalCost = () => {
    const total = Object.values(financialSummary).reduce((sum: number, val: any) => sum + Number(val || 0), 0);
    return Number(total) || 0;
  };

  const calculateExpectedRevenue = () => {
    const completedStages = stages.filter(s => s.status === 'completed').length;
    const totalCost = calculateTotalCost();
    return Number(totalCost) * (1 + (completedStages * 0.15));
  };

  const calculateProfit = () => {
    return calculateExpectedRevenue() - calculateTotalCost();
  };

  const calculateProfitMargin = () => {
    const revenue = calculateExpectedRevenue();
    if (revenue === 0) return 0;
    return ((calculateProfit() / revenue) * 100).toFixed(1);
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
      {stages.length === 0 ? (
        <Alert>
          <AlertDescription>
            No supply chain data yet. Start tracking your farm production by adding crops and supply chain stages in the Farmer Portal.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Supply Chain Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Stages</CardTitle>
              <CardDescription>Track your production through every stage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stages.map((stage) => {
                const StageIcon = getStageIcon(stage.stage_name);
                const StatusIcon = getStatusIcon(stage.status);

                return (
                  <div key={stage.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <StageIcon className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-semibold capitalize">{stage.stage_name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusIcon className={`h-4 w-4 ${getStatusColor(stage.status)}`} />
                            <span className="text-sm text-muted-foreground capitalize">{stage.status}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{stage.progress}%</Badge>
                    </div>

                    <Progress value={stage.progress} className="h-2" />

                    {stage.issues && stage.issues.length > 0 && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {stage.issues.length} issue(s) detected
                        </AlertDescription>
                      </Alert>
                    )}

                    {stage.start_date && (
                      <div className="text-sm text-muted-foreground">
                        Started: {new Date(stage.start_date).toLocaleDateString()}
                        {stage.end_date && ` • Expected completion: ${new Date(stage.end_date).toLocaleDateString()}`}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KES {calculateTotalCost().toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expected Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KES {calculateExpectedRevenue().toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projected Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  KES {calculateProfit().toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateProfitMargin()}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdown */}
          {Object.keys(financialSummary).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(financialSummary).map(([type, amount]: [string, any]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{type.replace(/_/g, ' ')}</span>
                      <span className="font-semibold">KES {Number(amount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default SupplyChainDashboard;