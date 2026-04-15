export interface NightlyPrice {
  date: Date;
  price: number;
}

export interface PricingResult {
  nights: NightlyPrice[];
  total: number;
}

/**
 * Pure function — no side effects, no I/O.
 * Produces one price entry per night in [checkIn, checkOut).
 */
export function calculateNightlyPrices(
  basePricePerNight: number,
  checkIn: Date,
  checkOut: Date,
): PricingResult {
  const nights: NightlyPrice[] = [];
  const cursor = new Date(checkIn);

  while (cursor < checkOut) {
    nights.push({ date: new Date(cursor), price: basePricePerNight });
    cursor.setDate(cursor.getDate() + 1);
  }

  const total = nights.reduce((sum, n) => sum + n.price, 0);
  return { nights, total };
}
