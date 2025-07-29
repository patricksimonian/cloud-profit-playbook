export interface PricingTier {
  tier: string;
  complexity: string;
  effort: number;
  price: number;
}

export interface TeamConfiguration {
  teamSize: number;
  l1OffshoreRate: number;
  l1OnshoreRate: number;
  l2OffshoreRate: number;
  l2OnshoreRate: number;
  l3OffshoreRate: number;
  l3OnshoreRate: number;
  l1Distribution: number; // percentage
  l2Distribution: number; // percentage
  l3Distribution: number; // percentage
  offshorePercentage: number; // percentage
  targetMargin: number; // percentage
}

export interface CustomerMixItem {
  id: string;
  tier: string;
  complexity: string;
  quantity: number;
  effort: number;
  price: number;
}

export interface ProfitabilityCalculation {
  totalRevenue: number;
  totalEffort: number;
  teamCost: number;
  monthlyCapacity: number;
  utilizationPercentage: number;
  profit: number;
  marginPercentage: number;
  isOverCapacity: boolean;
}