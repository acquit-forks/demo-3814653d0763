export type Line = { amount: number };

// ISO 4217 defines a minor unit (number of decimal digits) for every currency:
// 0 for JPY/KRW, 2 for USD/EUR, 3 for KWD/BHD/OMR/TND/JOD/IQD/LYD, 4 for CLF.
// Read it from Intl's currency data instead of hardcoding a digits-per-currency table.
function minorUnitDigits(currency: string): number {
  const options = new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions();
  return options.maximumFractionDigits;
}

export function formatTotal(lines: Line[], currency: string): string {
  const sum = lines.reduce((total, line) => total + line.amount, 0);
  const digits = minorUnitDigits(currency);
  // Round to the currency's minor unit (half away from zero, the convention for
  // money) and render without grouping so the output matches plain decimals.
  return new Intl.NumberFormat('en', {
    style: 'decimal',
    useGrouping: false,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    roundingMode: 'halfExpand',
  }).format(sum);
}
