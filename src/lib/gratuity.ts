export type ContractType = 'limited' | 'unlimited';
export type Reason = 'resignation' | 'termination';

export interface GratuityInput {
  monthlySalary: number;
  joinDate: Date;
  lastWorkingDate: Date;
  contractType: ContractType;
  reason: Reason;
  unpaidLeaveDays: number;
}

export interface GratuityBreakdown {
  eligible: boolean;
  dailyWage: number;
  serviceMonths: number;
  serviceYearsDisplay: string;
  tier1Months: number;
  tier1Days: number;
  tier1Amount: number;   // pre-scaling, for transparent display
  tier2Months: number;
  tier2Days: number;
  tier2Amount: number;   // pre-scaling, for transparent display
  baseAmount: number;    // tier1 + tier2, pre-scaling
  multiplier: number;    // 1 | 2/3 | 1/3
  scalingLabel: string | null;
  scaledAmount: number;  // baseAmount × multiplier
  capAmount: number;     // 24 × monthlySalary
  capApplied: boolean;
  total: number;
}

/**
 * Computes calendar months between two dates plus fractional days,
 * then subtracts unpaid leave (in months).
 *
 * UAE law uses the full calendar period; unpaid leave days are excluded
 * per Article 51.
 */
function serviceMonths(joinDate: Date, lastDate: Date, unpaidLeaveDays: number): number {
  let y = lastDate.getFullYear() - joinDate.getFullYear();
  let m = lastDate.getMonth() - joinDate.getMonth();
  let d = lastDate.getDate() - joinDate.getDate();

  if (d < 0) {
    m -= 1;
    const prevMonthDays = new Date(lastDate.getFullYear(), lastDate.getMonth(), 0).getDate();
    d += prevMonthDays;
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }

  return y * 12 + m + d / 30 - unpaidLeaveDays / 30;
}

function formatService(months: number): string {
  const total = Math.max(0, months);
  const yrs = Math.floor(total / 12);
  const mos = Math.floor(total % 12);
  const days = Math.round((total % 1) * 30);

  const parts: string[] = [];
  if (yrs > 0) parts.push(`${yrs} year${yrs !== 1 ? 's' : ''}`);
  if (mos > 0) parts.push(`${mos} month${mos !== 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  return parts.join(' ') || '0 days';
}

/**
 * Calculates UAE end-of-service gratuity per Federal Decree-Law No. 33 of 2021, Article 51.
 *
 * Formula:
 *   dailyWage = monthlySalary / 30
 *   tier1 = 21 days/year for up to 5 years   → 21 × min(months,60) / 12 days
 *   tier2 = 30 days/year beyond 5 years       → 30 × max(0, months−60) / 12 days
 *   gratuity = dailyWage × (tier1days + tier2days)
 *   cap = 24 × monthlySalary
 *
 * Legacy unlimited contract resignation uses a sliding multiplier on the full amount:
 *   < 3 years: × 1/3   |   3–5 years: × 2/3   |   5+ years: × 1
 */
export function calculateGratuity(input: GratuityInput): GratuityBreakdown {
  const { monthlySalary, joinDate, lastWorkingDate, contractType, reason, unpaidLeaveDays } = input;

  const dailyWage = monthlySalary / 30;
  const svcMonths = serviceMonths(joinDate, lastWorkingDate, unpaidLeaveDays);

  const zero: GratuityBreakdown = {
    eligible: false,
    dailyWage,
    serviceMonths: svcMonths,
    serviceYearsDisplay: formatService(svcMonths),
    tier1Months: 0,
    tier1Days: 0,
    tier1Amount: 0,
    tier2Months: 0,
    tier2Days: 0,
    tier2Amount: 0,
    baseAmount: 0,
    multiplier: 1,
    scalingLabel: null,
    scaledAmount: 0,
    capAmount: monthlySalary * 24,
    capApplied: false,
    total: 0,
  };

  if (svcMonths < 12) return zero;

  const tier1Months = Math.min(svcMonths, 60);
  const tier2Months = Math.max(0, svcMonths - 60);

  const tier1Days = (21 * tier1Months) / 12;
  const tier2Days = (30 * tier2Months) / 12;

  const tier1Amount = dailyWage * tier1Days;
  const tier2Amount = dailyWage * tier2Days;
  const baseAmount = tier1Amount + tier2Amount;

  // Unlimited contract resignation scaling
  let multiplier = 1;
  let scalingLabel: string | null = null;

  if (contractType === 'unlimited' && reason === 'resignation') {
    if (svcMonths < 36) {
      multiplier = 1 / 3;
      scalingLabel = '⅓ of full amount, resigned after 1-3 years (legacy unlimited contract)';
    } else if (svcMonths < 60) {
      multiplier = 2 / 3;
      scalingLabel = '⅔ of full amount, resigned after 3-5 years (legacy unlimited contract)';
    } else {
      scalingLabel = 'Full amount, resigned after 5+ years (legacy unlimited contract)';
    }
  }

  const scaledAmount = baseAmount * multiplier;
  const capAmount = monthlySalary * 24;
  const capApplied = scaledAmount > capAmount;
  const total = capApplied ? capAmount : scaledAmount;

  return {
    eligible: true,
    dailyWage,
    serviceMonths: svcMonths,
    serviceYearsDisplay: formatService(svcMonths),
    tier1Months,
    tier1Days,
    tier1Amount,
    tier2Months,
    tier2Days,
    tier2Amount,
    baseAmount,
    multiplier,
    scalingLabel,
    scaledAmount,
    capAmount,
    capApplied,
    total,
  };
}
