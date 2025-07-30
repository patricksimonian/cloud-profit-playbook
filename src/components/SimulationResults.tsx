import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationResult } from "@/types/simulation";
import { formatCurrency, formatPercentage } from "@/utils/calculations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ReferenceLine } from "recharts";
import { TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react";

interface SimulationResultsProps {
  result: SimulationResult;
}

export const SimulationResults = ({ result }: SimulationResultsProps) => {
  const { monthlyResults, breakevenMonth, finalProfit, maxCapacityReached, autoScaleTriggered } = result;

  // Prepare chart data
  const chartData = monthlyResults.map(month => ({
    month: month.month,
    cumulativeProfit: month.cumulativeProfit,
    monthlyProfit: month.profit,
    revenue: month.totalRevenue,
    teamCost: month.teamCost,
    capacityUsed: month.capacityUsedPercentage,
    activeCustomers: month.activeCustomers,
    teamSize: month.teamSize,
  }));

  const maxProfit = Math.max(...monthlyResults.map(m => m.cumulativeProfit));
  const minProfit = Math.min(...monthlyResults.map(m => m.cumulativeProfit));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Final Profit</p>
                <p className={`text-2xl font-bold ${finalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(finalProfit)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Breakeven Month</p>
                <p className="text-2xl font-bold text-primary">
                  {breakevenMonth ? `Month ${breakevenMonth}` : 'Not reached'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold text-primary">
                  {result.totalCustomersOnboarded}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Max Capacity</p>
                <p className={`text-2xl font-bold ${maxCapacityReached > 90 ? 'text-red-600' : 'text-primary'}`}>
                  {formatPercentage(maxCapacityReached)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {autoScaleTriggered && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800">
                <strong>Auto-scale triggered:</strong> Team size was automatically increased to meet capacity requirements.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cumulative Profit Chart */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-primary">Cumulative Profit Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Cumulative Profit']}
                labelFormatter={(label) => `Month ${label}`}
              />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
              {breakevenMonth && (
                <ReferenceLine 
                  x={breakevenMonth} 
                  stroke="hsl(var(--primary))" 
                  strokeDasharray="4 4"
                  label="Breakeven"
                />
              )}
              <Line 
                type="monotone" 
                dataKey="cumulativeProfit" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Revenue vs Cost */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-primary">Monthly Revenue vs Team Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name === 'revenue' ? 'Revenue' : 'Team Cost'
                ]}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
              <Bar dataKey="teamCost" fill="hsl(var(--destructive))" name="Team Cost" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Capacity Utilization */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-primary">Team Capacity Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Capacity Used']}
                labelFormatter={(label) => `Month ${label}`}
              />
              <ReferenceLine y={90} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label="90% Limit" />
              <Line 
                type="monotone" 
                dataKey="capacityUsed" 
                stroke="hsl(var(--accent))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer Growth */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-primary">Active Customers & Team Size</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                yAxisId="customers"
                orientation="left"
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Customers', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="team"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Team Size', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  value, 
                  name === 'activeCustomers' ? 'Active Customers' : 'Team Size'
                ]}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Legend />
              <Line 
                yAxisId="customers"
                type="monotone" 
                dataKey="activeCustomers" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Active Customers"
              />
              <Line 
                yAxisId="team"
                type="monotone" 
                dataKey="teamSize" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                name="Team Size"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};