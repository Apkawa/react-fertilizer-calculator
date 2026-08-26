import CubicSpline from "cubic-spline";

interface SplineConstructor {
  new (x: number[], y: number[]): SplineType;
}

interface SplineType {
  at(x: number): number;
}

export const Spline: SplineConstructor = CubicSpline;
