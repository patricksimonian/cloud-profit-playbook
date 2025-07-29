import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PricingTier, CustomerMixItem } from "@/types/profitability";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface CustomerMixBuilderProps {
  pricing: PricingTier[];
  customerMix: CustomerMixItem[];
  onCustomerMixChange: (mix: CustomerMixItem[]) => void;
}

export const CustomerMixBuilder = ({
  pricing,
  customerMix,
  onCustomerMixChange,
}: CustomerMixBuilderProps) => {
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("");

  const addCustomerMixItem = () => {
    if (!selectedTier || !selectedComplexity) return;

    const pricingItem = pricing.find(
      (p) => p.tier === selectedTier && p.complexity === selectedComplexity
    );
    if (!pricingItem) return;

    const newItem: CustomerMixItem = {
      id: Date.now().toString(),
      tier: selectedTier,
      complexity: selectedComplexity,
      quantity: 1,
      effort: pricingItem.effort,
      price: pricingItem.price,
    };

    onCustomerMixChange([...customerMix, newItem]);
    setSelectedTier("");
    setSelectedComplexity("");
  };

  const updateMixItem = (id: string, field: keyof CustomerMixItem, value: number) => {
    const newMix = customerMix.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onCustomerMixChange(newMix);
  };

  const removeMixItem = (id: string) => {
    onCustomerMixChange(customerMix.filter((item) => item.id !== id));
  };

  const tiers = [...new Set(pricing.map((p) => p.tier))];
  const complexities = selectedTier
    ? [...new Set(pricing.filter((p) => p.tier === selectedTier).map((p) => p.complexity))]
    : [];

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-primary">Customer Mix</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select Tier" />
              </SelectTrigger>
              <SelectContent>
                {tiers.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {tier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select Complexity" />
              </SelectTrigger>
              <SelectContent>
                {complexities.map((complexity) => (
                  <SelectItem key={complexity} value={complexity}>
                    {complexity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addCustomerMixItem} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {customerMix.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-accent">Tier</th>
                  <th className="text-left p-2 text-accent">Complexity</th>
                  <th className="text-left p-2 text-accent">Quantity</th>
                  <th className="text-left p-2 text-accent">Unit Effort</th>
                  <th className="text-left p-2 text-accent">Unit Price</th>
                  <th className="text-left p-2 text-accent">Total Revenue</th>
                  <th className="text-left p-2 text-accent">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customerMix.map((item) => (
                  <tr key={item.id} className="border-b border-border/50">
                    <td className="p-2 text-sm">{item.tier}</td>
                    <td className="p-2 text-sm">{item.complexity}</td>
                    <td className="p-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateMixItem(item.id, "quantity", Number(e.target.value))}
                        className="w-20 bg-background/50 border-border/50"
                      />
                    </td>
                    <td className="p-2 text-sm">{item.effort}h</td>
                    <td className="p-2 text-sm">${item.price.toLocaleString()}</td>
                    <td className="p-2 text-sm font-semibold text-accent">
                      ${(item.price * item.quantity).toLocaleString()}
                    </td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMixItem(item.id)}
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};