import { useState } from "react";
import { TeamConfigurationPanel } from "@/components/TeamConfigurationPanel";
import { PricingTable } from "@/components/PricingTable";
import { CustomerMixBuilder } from "@/components/CustomerMixBuilder";
import { ProfitabilityDashboard } from "@/components/ProfitabilityDashboard";
import { TeamConfiguration, PricingTier, CustomerMixItem } from "@/types/profitability";
import { calculateProfitability } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Download, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const defaultTeamConfig: TeamConfiguration = {
  teamSize: 6,
  teamMakeup: [
    { level: 'L1', location: 'Offshore' },
    { level: 'L1', location: 'Offshore' },
    { level: 'L2', location: 'Offshore' },
    { level: 'L2', location: 'Onshore' },
    { level: 'L3', location: 'Offshore' },
    { level: 'L3', location: 'Onshore' },
  ],
  l1OffshoreRate: 25,
  l1OnshoreRate: 65,
  l2OffshoreRate: 35,
  l2OnshoreRate: 85,
  l3OffshoreRate: 45,
  l3OnshoreRate: 120,
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
  const [teamConfig, setTeamConfig] = useState<TeamConfiguration>(defaultTeamConfig);
  const [pricing, setPricing] = useState<PricingTier[]>(defaultPricing);
  const [customerMix, setCustomerMix] = useState<CustomerMixItem[]>([]);
  const { toast } = useToast();

  const calculation = calculateProfitability(teamConfig, customerMix);

  const handleExport = () => {
    const data = {
      teamConfiguration: teamConfig,
      pricing,
      customerMix,
      profitability: calculation,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profitability-analysis.json';
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
            <Button onClick={handleExport} variant="outline" className="bg-card/50">
              <Download className="h-4 w-4 mr-2" />
              Export Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Profitability Dashboard - moved to top */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold text-primary">Profitability Analysis</h2>
        </div>
        <ProfitabilityDashboard 
          calculation={calculation} 
          targetMargin={teamConfig.targetMargin} 
        />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <TeamConfigurationPanel 
            configuration={teamConfig} 
            onConfigurationChange={setTeamConfig} 
          />
          <PricingTable 
            pricing={pricing} 
            onPricingChange={setPricing} 
          />
        </div>

        {/* Customer Mix and Results */}
        <div className="space-y-6">
          <CustomerMixBuilder
            pricing={pricing}
            customerMix={customerMix}
            onCustomerMixChange={setCustomerMix}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;