/**
 * Unit conversion engine. Each unit exposes `toBase` / `fromBase`, which lets
 * temperature (a linear-with-offset scale) share the same interface as the
 * purely multiplicative categories.
 */
export interface Unit {
  id: string;
  name: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

export interface Category {
  id: string;
  name: string;
  units: Unit[];
}

/** Multiplicative units: `base = value * factor`. */
const linear = (factor: number): Pick<Unit, 'toBase' | 'fromBase'> => ({
  toBase: (v: number) => v * factor,
  fromBase: (v: number) => v / factor,
});

export const CATEGORIES: Category[] = [
  {
    id: 'length',
    name: 'Length',
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', ...linear(1) },
      { id: 'km', name: 'Kilometer', symbol: 'km', ...linear(1000) },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', ...linear(0.01) },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', ...linear(0.001) },
      { id: 'mi', name: 'Mile', symbol: 'mi', ...linear(1609.344) },
      { id: 'yd', name: 'Yard', symbol: 'yd', ...linear(0.9144) },
      { id: 'ft', name: 'Foot', symbol: 'ft', ...linear(0.3048) },
      { id: 'in', name: 'Inch', symbol: 'in', ...linear(0.0254) },
    ],
  },
  {
    id: 'weight',
    name: 'Weight',
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', ...linear(1) },
      { id: 'g', name: 'Gram', symbol: 'g', ...linear(0.001) },
      { id: 'mg', name: 'Milligram', symbol: 'mg', ...linear(1e-6) },
      { id: 't', name: 'Metric ton', symbol: 't', ...linear(1000) },
      { id: 'lb', name: 'Pound', symbol: 'lb', ...linear(0.45359237) },
      { id: 'oz', name: 'Ounce', symbol: 'oz', ...linear(0.028349523125) },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    units: [
      { id: 'l', name: 'Liter', symbol: 'L', ...linear(1) },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', ...linear(0.001) },
      { id: 'gal', name: 'Gallon (US)', symbol: 'gal', ...linear(3.785411784) },
      { id: 'qt', name: 'Quart', symbol: 'qt', ...linear(0.946352946) },
      { id: 'pt', name: 'Pint', symbol: 'pt', ...linear(0.473176473) },
      { id: 'cup', name: 'Cup', symbol: 'cup', ...linear(0.2365882365) },
      { id: 'floz', name: 'Fluid ounce', symbol: 'fl oz', ...linear(0.0295735295625) },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    units: [
      { id: 'm2', name: 'Square meter', symbol: 'm²', ...linear(1) },
      { id: 'km2', name: 'Square kilometer', symbol: 'km²', ...linear(1e6) },
      { id: 'ha', name: 'Hectare', symbol: 'ha', ...linear(10000) },
      { id: 'acre', name: 'Acre', symbol: 'acre', ...linear(4046.8564224) },
      { id: 'ft2', name: 'Square foot', symbol: 'ft²', ...linear(0.09290304) },
      { id: 'in2', name: 'Square inch', symbol: 'in²', ...linear(0.00064516) },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    units: [
      { id: 'ms', name: 'Meters/second', symbol: 'm/s', ...linear(1) },
      { id: 'kmh', name: 'Kilometers/hour', symbol: 'km/h', ...linear(1 / 3.6) },
      { id: 'mph', name: 'Miles/hour', symbol: 'mph', ...linear(0.44704) },
      { id: 'kn', name: 'Knot', symbol: 'kn', ...linear(0.514444) },
      { id: 'fts', name: 'Feet/second', symbol: 'ft/s', ...linear(0.3048) },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    units: [
      { id: 's', name: 'Second', symbol: 's', ...linear(1) },
      { id: 'min', name: 'Minute', symbol: 'min', ...linear(60) },
      { id: 'h', name: 'Hour', symbol: 'h', ...linear(3600) },
      { id: 'd', name: 'Day', symbol: 'd', ...linear(86400) },
      { id: 'w', name: 'Week', symbol: 'wk', ...linear(604800) },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', ...linear(0.001) },
    ],
  },
];

export function convert(value: number, from: Unit, to: Unit): number {
  return to.fromBase(from.toBase(value));
}

/** Compact number formatting: up to 8 significant digits, no trailing zeros. */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e12 || abs < 1e-6) return n.toExponential(4);
  return String(parseFloat(n.toPrecision(8)));
}
