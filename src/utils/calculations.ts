import { TeamConfiguration, CustomerMixItem, ProfitabilityCalculation } from "@/types/profitability";

export const calculateProfitability = (
  teamConfig: TeamConfiguration,
  customerMix: CustomerMixItem[]
): ProfitabilityCalculation => {
  // Calculate total revenue
  const totalRevenue = customerMix.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Calculate total effort required
  const totalEffort = customerMix.reduce((sum, item) => sum + (item.effort * item.quantity), 0);

  // Calculate monthly team capacity (180 hours per person per month)
  const monthlyCapacity = teamConfig.teamSize * 180;

  // Calculate blended hourly rate
  const l1Rate = (teamConfig.l1OffshoreRate * teamConfig.offshorePercentage / 100) + 
                 (teamConfig.l1OnshoreRate * (100 - teamConfig.offshorePercentage) / 100);
  const l2Rate = (teamConfig.l2OffshoreRate * teamConfig.offshorePercentage / 100) + 
                 (teamConfig.l2OnshoreRate * (100 - teamConfig.offshorePercentage) / 100);
  const l3Rate = (teamConfig.l3OffshoreRate * teamConfig.offshorePercentage / 100) + 
                 (teamConfig.l3OnshoreRate * (100 - teamConfig.offshorePercentage) / 100);

  const blendedHourlyRate = 
    (l1Rate * teamConfig.l1Distribution / 100) +
    (l2Rate * teamConfig.l2Distribution / 100) +
    (l3Rate * teamConfig.l3Distribution / 100);

  // Calculate team cost (overhead = blended rate × monthly capacity)
  const teamCost = blendedHourlyRate * monthlyCapacity;

  // Calculate utilization
  const utilizationPercentage = (totalEffort / monthlyCapacity) * 100;

  // Calculate profit and margin
  const profit = totalRevenue - teamCost;
  const marginPercentage = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  // Check if over capacity
  const isOverCapacity = totalEffort > monthlyCapacity;

  return {
    totalRevenue,
    totalEffort,
    teamCost,
    monthlyCapacity,
    utilizationPercentage,
    profit,
    marginPercentage,
    isOverCapacity,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};