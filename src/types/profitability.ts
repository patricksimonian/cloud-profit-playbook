export interface PricingTier {
  tier: string;
  complexity: string;
  effort: number;
  price: number;
}

export interface TeamMember {
  level: 'L1' | 'L2' | 'L3';
  location: 'Offshore' | 'Onshore';
}

export interface TeamConfiguration {
  teamSize: number;
  teamMakeup: TeamMember[];
  l1OffshoreRate: number;
  l1OnshoreRate: number;
  l2OffshoreRate: number;
  l2OnshoreRate: number;
  l3OffshoreRate: number;
  l3OnshoreRate: number;
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