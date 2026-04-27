import type {
  CourtBill,
  ShuttlecockBill,
  DinnerBill,
  Bill,
  BillSplitResult,
  ValidationResult,
} from './types';

/**
 * Calculate equal split for a court bill.
 * Each participant's share = totalCost / participants.length, rounded to 2 decimals.
 * The payer is excluded from the owes list.
 */
export function calculateCourtSplit(bill: CourtBill): BillSplitResult {
  const share = Math.round((bill.totalCost / bill.participants.length) * 100) / 100;

  const shares = bill.participants
    .filter((name) => name !== bill.payer)
    .map((name) => ({ name, owes: share }));

  return {
    shares,
    totalPerPerson: share,
  };
}

/**
 * Calculate equal split for a shuttlecock bill.
 * Each participant's share = totalCost / participants.length, rounded to 2 decimals.
 * The payer is excluded from the owes list.
 */
export function calculateShuttlecockSplit(bill: ShuttlecockBill): BillSplitResult {
  const share = Math.round((bill.totalCost / bill.participants.length) * 100) / 100;

  const shares = bill.participants
    .filter((name) => name !== bill.payer)
    .map((name) => ({ name, owes: share }));

  return {
    shares,
    totalPerPerson: share,
  };
}

/**
 * Calculate proportional split for a dinner bill.
 * Service charge (10%) is applied first, then VAT (7%).
 * Each participant's share is proportional to their itemCost relative to the subtotal.
 * The payer is excluded from the owes list.
 */
export function calculateDinnerSplit(bill: DinnerBill): BillSplitResult {
  const subtotal = bill.participants.reduce((sum, p) => sum + p.itemCost, 0);

  let serviceChargeAmount = 0;
  let vatAmount = 0;
  let grandTotal = subtotal;

  if (bill.applyServiceCharge) {
    serviceChargeAmount = subtotal * 0.10;
    grandTotal = subtotal + serviceChargeAmount;
  }

  if (bill.applyVAT) {
    vatAmount = grandTotal * 0.07;
    grandTotal = grandTotal + vatAmount;
  }

  const shares = bill.participants
    .filter((p) => p.name !== bill.payer)
    .map((p) => {
      const proportion = subtotal > 0 ? p.itemCost / subtotal : 0;
      const owes = Math.round(proportion * grandTotal * 100) / 100;
      return { name: p.name, owes };
    });

  return {
    shares,
    subtotal,
    serviceChargeAmount: Math.round(serviceChargeAmount * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}


/**
 * Validate a bill before calculation.
 * - Court/Shuttlecock: min 2 participants, positive totalCost
 * - Dinner: min 1 participant, non-negative item costs
 */
export function validateBill(bill: Bill): ValidationResult {
  const errors: string[] = [];

  if (!bill.payer || bill.payer.trim() === '') {
    errors.push('Payer name is required.');
  }

  if (bill.type === 'court' || bill.type === 'shuttlecock') {
    if (bill.participants.length < 2) {
      errors.push('At least 2 participants are required.');
    }
    if (bill.totalCost <= 0) {
      errors.push('Total cost must be a positive amount.');
    }
  }

  if (bill.type === 'dinner') {
    if (bill.participants.length < 1) {
      errors.push('At least 1 participant is required.');
    }
    for (const p of bill.participants) {
      if (p.itemCost < 0) {
        errors.push(`Item cost for ${p.name} must be a non-negative amount.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
