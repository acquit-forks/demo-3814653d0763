export type Line = { amount: number };

// Minor-unit exponents defined by ISO 4217 for every active currency whose
// exponent is not the default of 2. ISO 4217 §3.2.2 defines the "minor unit"
// as the number of digits after the decimal separator, and assigns each
// currency an exponent of 0, 2 (default), 3 or 4. Currencies not listed here
// have exponent 2 under the standard.
const ISO4217_MINOR_UNITS: Record<string, number> = {
  // Exponent 0
  BIF: 0,
  CLP: 0,
  DJF: 0,
  GNF: 0,
  ISK: 0,
  JPY: 0,
  KMF: 0,
  KRW: 0,
  PYG: 0,
  RWF: 0,
  UGX: 0,
  UYI: 0,
  VND: 0,
  VUV: 0,
  XAF: 0,
  XOF: 0,
  XPF: 0,
  // Exponent 3
  BHD: 3,
  IQD: 3,
  JOD: 3,
  KWD: 3,
  LYD: 3,
  OMR: 3,
  TND: 3,
  // Exponent 4
  CLF: 4,
  UYW: 4,
};

// Number of decimal places defined by ISO 4217 for a currency code.
// Codes not defined by the standard fall back to the default exponent of 2.
export function minorUnitsFor(currency: string): number {
  return ISO4217_MINOR_UNITS[currency.toUpperCase()] ?? 2;
}

// Round half away from zero, the convention for monetary rounding.
// Math.round alone rounds half towards +infinity, which is wrong for negatives.
function roundHalfAwayFromZero(value: number): number {
  return value < 0 ? -Math.round(-value) : Math.round(value);
}

export function formatTotal(lines: Line[], currency: string): string {
  const units = minorUnitsFor(currency);
  const scale = 10 ** units;
  const sum = lines.reduce((total, line) => total + line.amount, 0);
  // Convert the summed amount to integer minor units (rounding once, after
  // the sum) so binary floating point drift cannot shift the total, then
  // render with exactly the ISO 4217 minor-unit digits.
  const minor = roundHalfAwayFromZero(sum * scale);
  return (minor / scale).toFixed(units);
}
