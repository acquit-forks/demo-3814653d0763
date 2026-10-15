export type Line = { amount: number };

// ISO 4217 assigns every currency a minor-unit exponent: the number of decimal
// places its amounts are quoted in (USD: 2, KWD/BHD/TND: 3, JPY/KRW: 0, ...).
// Intl.NumberFormat resolves that exponent from the runtime's ISO 4217 data
// (CLDR/ICU), so every ISO 4217 currency gets its correct number of decimals
// instead of a hardcoded 2.
function currencyFractionDigits(currency: string): number {
  const options = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).resolvedOptions();
  return options.minimumFractionDigits;
}

export function formatTotal(lines: Line[], currency: string): string {
  const sum = lines.reduce((total, line) => total + line.amount, 0);
  return sum.toFixed(currencyFractionDigits(currency));
}
