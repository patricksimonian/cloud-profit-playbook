import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PricingTier } from "@/types/profitability";
import { Plus } from "lucide-react";

interface PricingTableProps {
  pricing: PricingTier[];
  onPricingChange: (pricing: PricingTier[]) => void;
}

export const PricingTable = ({ pricing, onPricingChange }: PricingTableProps) => {
  const updatePricing = (index: number, field: keyof PricingTier, value: string | number) => {
    const newPricing = [...pricing];
    newPricing[index] = { ...newPricing[index], [field]: value };
    onPricingChange(newPricing);
  };

  const addPricingTier = () => {
    const newTier: PricingTier = {
      tier: "Custom",
      complexity: "Medium",
      effort: 100,
      price: 15000,
    };
    onPricingChange([...pricing, newTier]);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-primary">Service Pricing Configuration</CardTitle>
        <Button onClick={addPricingTier} size="sm" className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Tier
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 text-accent">Tier</th>
                <th className="text-left p-2 text-accent">Complexity</th>
                <th className="text-left p-2 text-accent">Effort (hrs)</th>
                <th className="text-left p-2 text-accent">Price ($)</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((tier, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="p-2">
                    <Input
                      value={tier.tier}
                      onChange={(e) => updatePricing(index, "tier", e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      value={tier.complexity}
                      onChange={(e) => updatePricing(index, "complexity", e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={tier.effort}
                      onChange={(e) => updatePricing(index, "effort", Number(e.target.value))}
                      className="bg-background/50 border-border/50"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={tier.price}
                      onChange={(e) => updatePricing(index, "price", Number(e.target.value))}
                      className="bg-background/50 border-border/50"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};