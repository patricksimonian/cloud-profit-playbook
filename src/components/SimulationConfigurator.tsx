import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnboardingConfiguration, PackageMixItem, OnboardingScheduleItem } from "@/types/simulation";
import { PricingTier } from "@/types/profitability";
import { Calendar, TrendingUp, Users, Settings } from "lucide-react";

interface SimulationConfiguratorProps {
  configuration: OnboardingConfiguration;
  onConfigurationChange: (config: OnboardingConfiguration) => void;
  pricingTiers: PricingTier[];
  onRunSimulation: () => void;
}

export const SimulationConfigurator = ({
  configuration,
  onConfigurationChange,
  pricingTiers,
  onRunSimulation,
}: SimulationConfiguratorProps) => {
  const updateConfig = (field: keyof OnboardingConfiguration, value: any) => {
    onConfigurationChange({
      ...configuration,
      [field]: value,
    });
  };

  const updatePackageMix = (index: number, field: keyof PackageMixItem, value: any) => {
    const newMix = [...configuration.packageMix];
    newMix[index] = { ...newMix[index], [field]: value };
    updateConfig('packageMix', newMix);
  };

  const addPackageMix = () => {
    const availablePackages = pricingTiers.map(p => `${p.tier} ${p.complexity}`);
    const usedPackages = configuration.packageMix.map(m => m.packageType);
    const nextPackage = availablePackages.find(p => !usedPackages.includes(p));
    
    if (nextPackage) {
      updateConfig('packageMix', [
        ...configuration.packageMix,
        { packageType: nextPackage, percentage: 0 }
      ]);
    }
  };

  const removePackageMix = (index: number) => {
    const newMix = configuration.packageMix.filter((_, i) => i !== index);
    updateConfig('packageMix', newMix);
  };

  const updateScheduleItem = (index: number, field: keyof OnboardingScheduleItem, value: any) => {
    const newSchedule = [...configuration.onboardingSchedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    updateConfig('onboardingSchedule', newSchedule);
  };

  const addScheduleItem = () => {
    updateConfig('onboardingSchedule', [
      ...configuration.onboardingSchedule,
      { month: 1, packageType: pricingTiers[0] ? `${pricingTiers[0].tier} ${pricingTiers[0].complexity}` : '', quantity: 1 }
    ]);
  };

  const removeScheduleItem = (index: number) => {
    const newSchedule = configuration.onboardingSchedule.filter((_, i) => i !== index);
    updateConfig('onboardingSchedule', newSchedule);
  };

  const packageTypes = pricingTiers.map(p => `${p.tier} ${p.complexity}`);
  const totalMixPercentage = configuration.packageMix.reduce((sum, item) => sum + item.percentage, 0);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-primary flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Onboarding Timeline Simulation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="simulationMonths">Simulation Period (months)</Label>
            <Input
              id="simulationMonths"
              type="number"
              min="1"
              max="60"
              value={configuration.simulationMonths}
              onChange={(e) => updateConfig("simulationMonths", Number(e.target.value))}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxCapacity">Max Capacity Usage (%)</Label>
            <Input
              id="maxCapacity"
              type="number"
              min="50"
              max="100"
              value={configuration.maxCapacityPercentage}
              onChange={(e) => updateConfig("maxCapacityPercentage", Number(e.target.value))}
              className="bg-background/50"
            />
          </div>
        </div>

        {/* Auto Scale Option */}
        <div className="flex items-center space-x-2">
          <Switch
            id="autoScale"
            checked={configuration.autoScaleTeam}
            onCheckedChange={(checked) => updateConfig("autoScaleTeam", checked)}
          />
          <Label htmlFor="autoScale">Auto-scale team when capacity exceeded</Label>
        </div>

        {/* Onboarding Strategy */}
        <Tabs 
          value={configuration.onboardingType} 
          onValueChange={(value) => updateConfig("onboardingType", value as 'cadence' | 'schedule')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cadence">Cadence-Based</TabsTrigger>
            <TabsTrigger value="schedule">Custom Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="cadence" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cadenceMonths">Onboard every X months</Label>
                <Input
                  id="cadenceMonths"
                  type="number"
                  min="1"
                  value={configuration.cadenceMonths}
                  onChange={(e) => updateConfig("cadenceMonths", Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customersPerCadence">Customers per cadence</Label>
                <Input
                  id="customersPerCadence"
                  type="number"
                  min="1"
                  value={configuration.customersPerCadence}
                  onChange={(e) => updateConfig("customersPerCadence", Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>
            </div>

            {/* Package Mix */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-accent">Package Mix</h4>
                <div className="text-sm text-muted-foreground">
                  Total: {totalMixPercentage}%
                  {totalMixPercentage !== 100 && (
                    <span className="text-destructive ml-1">(!= 100%)</span>
                  )}
                </div>
              </div>
              
              {configuration.packageMix.map((mix, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-background/30 rounded-lg">
                  <Select 
                    value={mix.packageType} 
                    onValueChange={(value) => updatePackageMix(index, 'packageType', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {packageTypes.map(pkg => (
                        <SelectItem key={pkg} value={pkg}>{pkg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={mix.percentage}
                    onChange={(e) => updatePackageMix(index, 'percentage', Number(e.target.value))}
                    className="w-20 bg-background/50"
                    placeholder="%"
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removePackageMix(index)}
                    disabled={configuration.packageMix.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={addPackageMix}
                disabled={configuration.packageMix.length >= packageTypes.length}
                className="w-full"
              >
                Add Package Type
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-accent">Custom Onboarding Schedule</h4>
              
              {configuration.onboardingSchedule.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-background/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Label>Month</Label>
                    <Input
                      type="number"
                      min="1"
                      max={configuration.simulationMonths}
                      value={item.month}
                      onChange={(e) => updateScheduleItem(index, 'month', Number(e.target.value))}
                      className="w-20 bg-background/50"
                    />
                  </div>
                  
                  <Select 
                    value={item.packageType} 
                    onValueChange={(value) => updateScheduleItem(index, 'packageType', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {packageTypes.map(pkg => (
                        <SelectItem key={pkg} value={pkg}>{pkg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center space-x-2">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateScheduleItem(index, 'quantity', Number(e.target.value))}
                      className="w-20 bg-background/50"
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeScheduleItem(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={addScheduleItem}
                className="w-full"
              >
                Add Schedule Item
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Churn Configuration */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enableChurn"
              checked={configuration.enableChurn}
              onCheckedChange={(checked) => updateConfig("enableChurn", checked)}
            />
            <Label htmlFor="enableChurn">Enable Customer Churn</Label>
          </div>

          {configuration.enableChurn && (
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="churnAfterMonths">Churn after (months)</Label>
                <Input
                  id="churnAfterMonths"
                  type="number"
                  min="1"
                  value={configuration.churnAfterMonths}
                  onChange={(e) => updateConfig("churnAfterMonths", Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="churnRate">Churn rate (%/month)</Label>
                <Input
                  id="churnRate"
                  type="number"
                  min="0"
                  max="100"
                  value={configuration.churnRate}
                  onChange={(e) => updateConfig("churnRate", Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Run Simulation Button */}
        <Button 
          onClick={onRunSimulation} 
          className="w-full"
          disabled={configuration.onboardingType === 'cadence' && totalMixPercentage !== 100}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Run Simulation
        </Button>
      </CardContent>
    </Card>
  );
};