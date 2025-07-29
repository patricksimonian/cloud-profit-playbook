import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfitabilityCalculation } from "@/types/profitability";
import { formatCurrency, formatPercentage } from "@/utils/calculations";
import { TrendingUp, TrendingDown, AlertTriangle, Users, DollarSign, Target } from "lucide-react";

interface ProfitabilityDashboardProps {
  calculation: ProfitabilityCalculation;
  targetMargin: number;
}

export const ProfitabilityDashboard = ({ calculation, targetMargin }: ProfitabilityDashboardProps) => {
  const {
    totalRevenue,
    totalEffort,
    teamCost,
    monthlyCapacity,
    utilizationPercentage,
    profit,
    marginPercentage,
    isOverCapacity,
  } = calculation;

  const isMarginHealthy = marginPercentage >= targetMargin;
  const utilizationStatus = utilizationPercentage > 90 ? "high" : utilizationPercentage > 70 ? "medium" : "low";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Revenue Card */}
      <Card className="bg-gradient-to-r from-chart-1/20 to-chart-2/20 border-chart-1/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-chart-1" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-1">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
        </CardContent>
      </Card>

      {/* Cost Card */}
      <Card className="bg-gradient-to-r from-chart-4/20 to-chart-5/20 border-chart-4/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Cost</CardTitle>
          <Users className="h-4 w-4 text-chart-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-4">{formatCurrency(teamCost)}</div>
          <p className="text-xs text-muted-foreground">Monthly operational cost</p>
        </CardContent>
      </Card>

      {/* Profit Card */}
      <Card className={`bg-gradient-to-r ${profit >= 0 ? 'from-success/20 to-chart-3/20 border-success/30' : 'from-destructive/20 to-chart-4/20 border-destructive/30'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit</CardTitle>
          {profit >= 0 ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(profit)}
          </div>
          <p className="text-xs text-muted-foreground">Net profit</p>
        </CardContent>
      </Card>

      {/* Margin Card */}
      <Card className={`bg-gradient-to-r ${isMarginHealthy ? 'from-success/20 to-chart-3/20 border-success/30' : 'from-warning/20 to-chart-4/20 border-warning/30'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Margin</CardTitle>
          <Target className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isMarginHealthy ? 'text-success' : 'text-warning'}`}>
            {formatPercentage(marginPercentage)}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={isMarginHealthy ? "default" : "destructive"} className="text-xs">
              Target: {formatPercentage(targetMargin)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Utilization Card */}
      <Card className={`bg-gradient-to-r ${utilizationStatus === 'high' ? 'from-warning/20 to-chart-4/20 border-warning/30' : 'from-chart-2/20 to-chart-1/20 border-chart-2/30'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilization</CardTitle>
          {isOverCapacity && <AlertTriangle className="h-4 w-4 text-warning" />}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isOverCapacity ? 'text-warning' : 'text-chart-2'}`}>
            {formatPercentage(utilizationPercentage)}
          </div>
          <p className="text-xs text-muted-foreground">
            {totalEffort.toLocaleString()}h / {monthlyCapacity.toLocaleString()}h capacity
          </p>
          {isOverCapacity && (
            <Badge variant="destructive" className="mt-2 text-xs">
              Over Capacity
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Revenue:</span>
            <span className="font-semibold text-chart-1">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Cost:</span>
            <span className="font-semibold text-chart-4">{formatCurrency(teamCost)}</span>
          </div>
          <div className="border-t border-border pt-2">
            <div className="flex justify-between text-sm font-bold">
              <span>Net Profit:</span>
              <span className={profit >= 0 ? 'text-success' : 'text-destructive'}>
                {formatCurrency(profit)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};