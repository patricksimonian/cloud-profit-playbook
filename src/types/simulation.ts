export interface PackageMixItem {
  packageType: string;
  percentage: number;
}

export interface OnboardingScheduleItem {
  month: number;
  packageType: string;
  quantity: number;
}

export interface OnboardingConfiguration {
  simulationMonths: number;
  onboardingType: 'cadence' | 'schedule';
  
  // Cadence-based configuration
  cadenceMonths: number; // Onboard every X months
  customersPerCadence: number;
  packageMix: PackageMixItem[];
  
  // Schedule-based configuration
  onboardingSchedule: OnboardingScheduleItem[];
  
  // Churn configuration
  enableChurn: boolean;
  churnAfterMonths: number;
  churnRate: number; // percentage
  
  // Capacity limits
  maxCapacityPercentage: number; // e.g., 90%
  autoScaleTeam: boolean;
}

export interface CustomerInstance {
  id: string;
  packageType: string;
  onboardedMonth: number;
  churnMonth?: number;
  monthlyRevenue: number;
  monthlyEffort: number;
}

export interface MonthlySimulationResult {
  month: number;
  customersOnboarded: number;
  customersChurned: number;
  activeCustomers: number;
  totalRevenue: number;
  totalEffort: number;
  teamCost: number;
  profit: number;
  cumulativeProfit: number;
  capacityUsedPercentage: number;
  isOverCapacity: boolean;
  teamSize: number;
}

export interface SimulationResult {
  monthlyResults: MonthlySimulationResult[];
  breakevenMonth?: number;
  totalCustomersOnboarded: number;
  totalCustomersChurned: number;
  finalProfit: number;
  maxCapacityReached: number;
  autoScaleTriggered: boolean;
}