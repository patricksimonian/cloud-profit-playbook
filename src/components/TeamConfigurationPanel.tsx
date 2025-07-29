import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TeamConfiguration, TeamMember } from "@/types/profitability";
import { AlertTriangle, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TeamConfigurationPanelProps {
  configuration: TeamConfiguration;
  onConfigurationChange: (config: TeamConfiguration) => void;
}

export const TeamConfigurationPanel = ({
  configuration,
  onConfigurationChange,
}: TeamConfigurationPanelProps) => {
  const updateConfig = (field: keyof TeamConfiguration, value: number) => {
    if (field === 'teamSize') {
      // When team size changes, adjust team makeup to match
      const newTeamMakeup: TeamMember[] = [];
      const currentMakeup = configuration.teamMakeup || [];
      
      // Keep existing members up to new size
      for (let i = 0; i < value; i++) {
        if (i < currentMakeup.length) {
          newTeamMakeup.push(currentMakeup[i]);
        } else {
          // Add default new members
          newTeamMakeup.push({ level: 'L1', location: 'Offshore' });
        }
      }
      
      onConfigurationChange({
        ...configuration,
        [field]: value,
        teamMakeup: newTeamMakeup,
      });
    } else {
      onConfigurationChange({
        ...configuration,
        [field]: value,
      });
    }
  };

  const updateTeamMember = (index: number, member: TeamMember) => {
    const newTeamMakeup = [...configuration.teamMakeup];
    newTeamMakeup[index] = member;
    
    onConfigurationChange({
      ...configuration,
      teamMakeup: newTeamMakeup,
    });
  };

  // Validation: Check if we have at least 1 of each level
  const validateTeamMakeup = () => {
    const hasL1 = configuration.teamMakeup.some(m => m.level === 'L1');
    const hasL2 = configuration.teamMakeup.some(m => m.level === 'L2');
    const hasL3 = configuration.teamMakeup.some(m => m.level === 'L3');
    return { hasL1, hasL2, hasL3, isValid: hasL1 && hasL2 && hasL3 };
  };

  const validation = validateTeamMakeup();

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-primary flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Team Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="teamSize">Team Size</Label>
          <Input
            id="teamSize"
            type="number"
            min="3"
            value={configuration.teamSize}
            onChange={(e) => updateConfig("teamSize", Number(e.target.value))}
            className="bg-background/50"
          />
        </div>

        {!validation.isValid && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Team must have at least 1 member of each level (L1, L2, L3).
              Missing: {!validation.hasL1 && 'L1 '}{!validation.hasL2 && 'L2 '}{!validation.hasL3 && 'L3'}
            </AlertDescription>
          </Alert>
        )}

        {/* Team Makeup */}
        <div className="space-y-4">
          <h4 className="font-semibold text-accent">Team Makeup</h4>
          <div className="grid gap-3">
            {configuration.teamMakeup.map((member, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-background/30 rounded-lg">
                <span className="text-sm font-medium min-w-[80px]">Member {index + 1}</span>
                
                <Select 
                  value={member.level} 
                  onValueChange={(value) => updateTeamMember(index, { ...member, level: value as 'L1' | 'L2' | 'L3' })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L1">L1</SelectItem>
                    <SelectItem value="L2">L2</SelectItem>
                    <SelectItem value="L3">L3</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={member.location} 
                  onValueChange={(value) => updateTeamMember(index, { ...member, location: value as 'Offshore' | 'Onshore' })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Offshore">Offshore</SelectItem>
                    <SelectItem value="Onshore">Onshore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Rates */}
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

        {/* Target Margin */}
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
      </CardContent>
    </Card>
  );
};
