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

  // Calculate blended hourly rate based on team makeup
  let totalCost = 0;
  
  teamConfig.teamMakeup.forEach(member => {
    let rate = 0;
    
    if (member.level === 'L1') {
      rate = member.location === 'Offshore' ? teamConfig.l1OffshoreRate : teamConfig.l1OnshoreRate;
    } else if (member.level === 'L2') {
      rate = member.location === 'Offshore' ? teamConfig.l2OffshoreRate : teamConfig.l2OnshoreRate;
    } else if (member.level === 'L3') {
      rate = member.location === 'Offshore' ? teamConfig.l3OffshoreRate : teamConfig.l3OnshoreRate;
    }
    
    totalCost += rate * 180; // 180 hours per person per month
  });
  
  const blendedHourlyRate = teamConfig.teamSize > 0 ? totalCost / monthlyCapacity : 0;

  // Calculate team cost (direct calculation from team makeup)
  const teamCost = totalCost;

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