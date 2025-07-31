import {
  OnboardingConfiguration,
  CustomerInstance,
  MonthlySimulationResult,
  SimulationResult,
} from "@/types/simulation";
import { TeamConfiguration, PricingTier } from "@/types/profitability";

export const runSimulation = (
  config: OnboardingConfiguration,
  teamConfig: TeamConfiguration,
  pricingTiers: PricingTier[]
): SimulationResult => {
  console.log("sim running");
  const customers: CustomerInstance[] = [];
  const monthlyResults: MonthlySimulationResult[] = [];
  let cumulativeProfit = 0;
  let breakevenMonth: number | undefined;
  let autoScaleTriggered = false;
  let currentTeamSize = teamConfig.teamSize;

  // Calculate hourly rate and monthly capacity max 180 hours per month
  const hoursPerPersonPerMonth = 180;
  let monthlyCapacity = currentTeamSize * hoursPerPersonPerMonth;

  // Calculate team cost per month
  const calculateMonthlyCost = (teamSize: number) => {
    let totalCost = 0;
    for (let i = 0; i < teamSize; i++) {
      const memberIndex = i % teamConfig.teamMakeup.length;
      const member = teamConfig.teamMakeup[memberIndex];
      console.log("checking member", member);
      let rate = 0;
      if (member.level === "L1") {
        rate =
          member.location === "Offshore"
            ? teamConfig.l1OffshoreRate
            : teamConfig.l1OnshoreRate;
      } else if (member.level === "L2") {
        rate =
          member.location === "Offshore"
            ? teamConfig.l2OffshoreRate
            : teamConfig.l2OnshoreRate;
      } else if (member.level === "L3") {
        rate =
          member.location === "Offshore"
            ? teamConfig.l3OffshoreRate
            : teamConfig.l3OnshoreRate;
      }

      totalCost += rate * hoursPerPersonPerMonth;
    }
    return totalCost;
  };

  for (let month = 1; month <= config.simulationMonths; month++) {
    let customersOnboarded = 0;
    let customersChurned = 0;

    // Handle customer onboarding
    const shouldOnboard =
      config.onboardingType === "cadence"
        ? month % config.cadenceMonths === 0
        : config.onboardingSchedule.some((item) => item.month === month);

    if (shouldOnboard) {
      let newCustomers: CustomerInstance[] = [];

      if (config.onboardingType === "cadence") {
        // Cadence-based onboarding
        for (let i = 0; i < config.customersPerCadence; i++) {
          // Select package deterministically based on mix percentages
          let selectedPackage = "";
          let customerIndex = (month - 1) * config.customersPerCadence + i;
          let selector = customerIndex % 100;
          let cumulative = 0;

          for (const mixItem of config.packageMix) {
            cumulative += mixItem.percentage;
            if (selector < cumulative) {
              selectedPackage = mixItem.packageType;
              break;
            }
          }

          const pricing = pricingTiers.find(
            (p) => `${p.tier} ${p.complexity}` === selectedPackage
          );
          if (pricing) {
            newCustomers.push({
              id: `customer-${month}-${i}`,
              packageType: selectedPackage,
              onboardedMonth: month,
              monthlyRevenue: pricing.price,
              monthlyEffort: pricing.effort,
            });
          }
        }
      } else {
        // Schedule-based onboarding
        const scheduleItems = config.onboardingSchedule.filter(
          (item) => item.month === month
        );
        scheduleItems.forEach((item, index) => {
          const pricing = pricingTiers.find(
            (p) => `${p.tier} ${p.complexity}` === item.packageType
          );
          if (pricing) {
            for (let i = 0; i < item.quantity; i++) {
              newCustomers.push({
                id: `customer-${month}-${index}-${i}`,
                packageType: item.packageType,
                onboardedMonth: month,
                monthlyRevenue: pricing.price,
                monthlyEffort: pricing.effort,
              });
            }
          }
        });
      }

      // Check capacity before onboarding
      const currentEffort = customers
        .filter((c) => !c.churnMonth || c.churnMonth >= month)
        .reduce((sum, c) => sum + c.monthlyEffort, 0);

      const newEffort = newCustomers.reduce(
        (sum, c) => sum + c.monthlyEffort,
        0
      );
      const totalEffortAfterOnboarding = currentEffort + newEffort;
      const capacityAfterOnboarding =
        (totalEffortAfterOnboarding / monthlyCapacity) * 100;

      if (capacityAfterOnboarding <= config.maxCapacityPercentage) {
        // Can onboard all customers
        customers.push(...newCustomers);
        customersOnboarded = newCustomers.length;
      } else if (config.autoScaleTeam) {
        // Auto-scale team
        const requiredCapacity = totalEffortAfterOnboarding;
        const requiredTeamSize = Math.ceil(
          requiredCapacity / hoursPerPersonPerMonth
        );
        currentTeamSize = requiredTeamSize;
        monthlyCapacity = currentTeamSize * hoursPerPersonPerMonth;
        customers.push(...newCustomers);
        customersOnboarded = newCustomers.length;
        autoScaleTriggered = true;
      } else {
        // Partial onboarding up to capacity limit
        const availableCapacity =
          (monthlyCapacity * config.maxCapacityPercentage) / 100 -
          currentEffort;
        let partialCustomers: CustomerInstance[] = [];
        let usedCapacity = 0;

        for (const customer of newCustomers) {
          if (usedCapacity + customer.monthlyEffort <= availableCapacity) {
            partialCustomers.push(customer);
            usedCapacity += customer.monthlyEffort;
          } else {
            break;
          }
        }

        customers.push(...partialCustomers);
        customersOnboarded = partialCustomers.length;
      }
    }

    // Handle customer churn
    if (config.enableChurn) {
      const eligibleCustomers = customers.filter(
        (c) =>
          !c.churnMonth && month - c.onboardedMonth >= config.churnAfterMonths
      );

      // Deterministic churn: churn a fixed percentage each month
      const customersToChurnCount = Math.floor(
        (eligibleCustomers.length * config.churnRate) / 100
      );
      const customersToChurn = eligibleCustomers.slice(
        0,
        customersToChurnCount
      );

      customersToChurn.forEach((customer) => {
        customer.churnMonth = month;
        customersChurned++;
      });
    }

    // Calculate monthly metrics
    const activeCustomers = customers.filter(
      (c) => !c.churnMonth || c.churnMonth >= month
    );
    const totalRevenue = activeCustomers.reduce(
      (sum, c) => sum + c.monthlyRevenue,
      0
    );
    const totalEffort = activeCustomers.reduce(
      (sum, c) => sum + c.monthlyEffort,
      0
    );
    const teamCost = calculateMonthlyCost(currentTeamSize);
    console.log("team cost!", teamCost);
    const profit = totalRevenue - teamCost;
    cumulativeProfit += profit;

    // Check for breakeven
    if (cumulativeProfit >= 0 && !breakevenMonth) {
      breakevenMonth = month;
    }

    const capacityUsedPercentage = (totalEffort / monthlyCapacity) * 100;
    const isOverCapacity =
      capacityUsedPercentage > config.maxCapacityPercentage;

    monthlyResults.push({
      month,
      customersOnboarded,
      customersChurned,
      activeCustomers: activeCustomers.length,
      totalRevenue,
      totalEffort,
      teamCost,
      profit,
      cumulativeProfit,
      capacityUsedPercentage,
      isOverCapacity,
      teamSize: currentTeamSize,
    });
  }

  return {
    monthlyResults,
    breakevenMonth,
    totalCustomersOnboarded: customers.length,
    totalCustomersChurned: customers.filter((c) => c.churnMonth).length,
    finalProfit: cumulativeProfit,
    maxCapacityReached: Math.max(
      ...monthlyResults.map((r) => r.capacityUsedPercentage)
    ),
    autoScaleTriggered,
  };
};
