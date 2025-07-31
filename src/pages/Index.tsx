import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamConfigurationPanel } from "@/components/TeamConfigurationPanel";
import { CustomerMixBuilder } from "@/components/CustomerMixBuilder";
import { PricingTable } from "@/components/PricingTable";
import { ProfitabilityDashboard } from "@/components/ProfitabilityDashboard";
import { SimulationConfigurator } from "@/components/SimulationConfigurator";
import { SimulationResults } from "@/components/SimulationResults";
import {
  TeamConfiguration,
  CustomerMixItem,
  PricingTier,
} from "@/types/profitability";
import { OnboardingConfiguration, SimulationResult } from "@/types/simulation";
import { calculateProfitability } from "@/utils/calculations";
import { runSimulation } from "@/utils/simulation";
import { Button } from "@/components/ui/button";
import { Download, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const defaultTeamConfig: TeamConfiguration = {
  teamSize: 6,
  teamMakeup: [
    { level: "L1", location: "Offshore" },
    { level: "L1", location: "Offshore" },
    { level: "L2", location: "Offshore" },
    { level: "L2", location: "Onshore" },
    { level: "L3", location: "Offshore" },
    { level: "L3", location: "Onshore" },
  ],
  l1OffshoreRate: 55,
  l1OnshoreRate: 143,
  l2OffshoreRate: 77,
  l2OnshoreRate: 196,
  l3OffshoreRate: 45,
  l3OnshoreRate: 131,
  targetMargin: 15,
};

const defaultPricing: PricingTier[] = [
  { tier: "Bronze", complexity: "Small", effort: 80, price: 14079 },
  { tier: "Bronze", complexity: "Medium", effort: 120, price: 21118 },
  { tier: "Bronze", complexity: "Large", effort: 160, price: 28158 },
  { tier: "Silver", complexity: "Small", effort: 120, price: 21118 },
  { tier: "Silver", complexity: "Medium", effort: 180, price: 31695 },
  { tier: "Silver", complexity: "Large", effort: 240, price: 42073 },
  { tier: "Gold", complexity: "Small", effort: 160, price: 28158 },
  { tier: "Gold", complexity: "Medium", effort: 240, price: 42073 },
  { tier: "Gold", complexity: "Large", effort: 320, price: 56080 },
];

const Index = () => {
  const [teamConfig, setTeamConfig] =
    useState<TeamConfiguration>(defaultTeamConfig);
  const [pricing, setPricing] = useState<PricingTier[]>(defaultPricing);
  const [customerMix, setCustomerMix] = useState<CustomerMixItem[]>([]);
  const { toast } = useToast();

  // Simulation state
  const [simulationConfig, setSimulationConfig] =
    useState<OnboardingConfiguration>({
      simulationMonths: 24,
      onboardingType: "cadence",
      cadenceMonths: 3,
      customersPerCadence: 2,
      packageMix: [
        { packageType: "Bronze Small", percentage: 50 },
        { packageType: "Silver Medium", percentage: 30 },
        { packageType: "Gold Large", percentage: 20 },
      ],
      onboardingSchedule: [],
      enableChurn: false,
      churnAfterMonths: 12,
      churnRate: 5,
      maxCapacityPercentage: 90,
      autoScaleTeam: false,
    });

  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);

  const handleRunSimulation = () => {
    const result = runSimulation(simulationConfig, teamConfig, pricing);
    setSimulationResult(result);
  };

  const calculation = calculateProfitability(teamConfig, customerMix);

  const handleExport = () => {
    const data = {
      teamConfiguration: teamConfig,
      pricing,
      customerMix,
      profitability: calculation,
      simulation: simulationResult,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profitability-analysis.json";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Profitability analysis exported successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Cloud Operations Profitability Simulator
            </h1>
            <p className="text-muted-foreground mt-2">
              Optimize your managed services pricing and team configuration
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleExport}
              variant="outline"
              className="bg-card/50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="profitability" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="team">Team Config</TabsTrigger>
          <TabsTrigger value="customer-mix">Customer Mix</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="profitability" className="space-y-6">
          <ProfitabilityDashboard
            calculation={calculation}
            targetMargin={teamConfig.targetMargin}
          />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <TeamConfigurationPanel
            configuration={teamConfig}
            onConfigurationChange={setTeamConfig}
          />
        </TabsContent>

        <TabsContent value="customer-mix" className="space-y-6">
          <CustomerMixBuilder
            pricing={pricing}
            customerMix={customerMix}
            onCustomerMixChange={setCustomerMix}
          />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <PricingTable pricing={pricing} onPricingChange={setPricing} />
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <SimulationConfigurator
            configuration={simulationConfig}
            onConfigurationChange={setSimulationConfig}
            pricingTiers={pricing}
            onRunSimulation={handleRunSimulation}
          />
          {simulationResult && <SimulationResults result={simulationResult} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
