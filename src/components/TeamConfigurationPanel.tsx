import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TeamConfiguration } from "@/types/profitability";

interface TeamConfigurationPanelProps {
  configuration: TeamConfiguration;
  onConfigurationChange: (config: TeamConfiguration) => void;
}

export const TeamConfigurationPanel = ({
  configuration,
  onConfigurationChange,
}: TeamConfigurationPanelProps) => {
  const updateConfig = (field: keyof TeamConfiguration, value: number) => {
    onConfigurationChange({
      ...configuration,
      [field]: value,
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-primary">Team Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="teamSize">Team Size</Label>
          <Input
            id="teamSize"
            type="number"
            value={configuration.teamSize}
            onChange={(e) => updateConfig("teamSize", Number(e.target.value))}
            className="bg-background/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-accent">Offshore Rates ($/hour)</h4>
            <div className="space-y-2">
              <Label htmlFor="l1Offshore">L1 Offshore</Label>
              <Input
                id="l1Offshore"
                type="number"
                value={configuration.l1OffshoreRate}
                onChange={(e) => updateConfig("l1OffshoreRate", Number(e.target.value))}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="l2Offshore">L2 Offshore</Label>
              <Input
                id="l2Offshore"
                type="number"
                value={configuration.l2OffshoreRate}
                onChange={(e) => updateConfig("l2OffshoreRate", Number(e.target.value))}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="l3Offshore">L3 Offshore</Label>
              <Input
                id="l3Offshore"
                type="number"
                value={configuration.l3OffshoreRate}
                onChange={(e) => updateConfig("l3OffshoreRate", Number(e.target.value))}
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-accent">Onshore Rates ($/hour)</h4>
            <div className="space-y-2">
              <Label htmlFor="l1Onshore">L1 Onshore</Label>
              <Input
                id="l1Onshore"
                type="number"
                value={configuration.l1OnshoreRate}
                onChange={(e) => updateConfig("l1OnshoreRate", Number(e.target.value))}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="l2Onshore">L2 Onshore</Label>
              <Input
                id="l2Onshore"
                type="number"
                value={configuration.l2OnshoreRate}
                onChange={(e) => updateConfig("l2OnshoreRate", Number(e.target.value))}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="l3Onshore">L3 Onshore</Label>
              <Input
                id="l3Onshore"
                type="number"
                value={configuration.l3OnshoreRate}
                onChange={(e) => updateConfig("l3OnshoreRate", Number(e.target.value))}
                className="bg-background/50"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-accent">Team Distribution (%)</h4>
            <div className="space-y-2">
              <Label htmlFor="l1Distribution">L1 Distribution</Label>
              <Input
                id="l1Distribution"
                type="number"
                min="0"
                max="100"
                value={configuration.l1Distribution}
                onChange={(e) => updateConfig("l1Distribution", Number(e.target.value))}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="l2Distribution">L2 Distribution</Label>
              <Input
                id="l2Distribution"
                type="number"
                min="0"
                max="100"
                value={configuration.l2Distribution}
                onChange={(e) => updateConfig("l2Distribution", Number(e.target.value))}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="l3Distribution">L3 Distribution</Label>
              <Input
                id="l3Distribution"
                type="number"
                min="0"
                max="100"
                value={configuration.l3Distribution}
                onChange={(e) => updateConfig("l3Distribution", Number(e.target.value))}
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-accent">Business Targets</h4>
            <div className="space-y-2">
              <Label htmlFor="offshorePercentage">Offshore %</Label>
              <Input
                id="offshorePercentage"
                type="number"
                min="0"
                max="100"
                value={configuration.offshorePercentage}
                onChange={(e) => updateConfig("offshorePercentage", Number(e.target.value))}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetMargin">Target Margin %</Label>
              <Input
                id="targetMargin"
                type="number"
                min="0"
                max="100"
                value={configuration.targetMargin}
                onChange={(e) => updateConfig("targetMargin", Number(e.target.value))}
                className="bg-background/50"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};