
export interface EquationCoefficients {
  a: number;
  b: number;
  c: number;
}

export interface CalculationResult {
  delta: number;
  x1: number | null;
  x2: number | null;
  isComplex: boolean;
  vertex: { x: number; y: number };
}

export interface GraphPoint {
  x: number;
  y: number;
}
