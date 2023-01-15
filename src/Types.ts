export type Scalar = bigint | boolean | number | string;

export type ScalarNullable = Scalar | null | undefined;

export const isScalar = (x: unknown): x is Scalar =>
  typeof x === "string" ||
  typeof x === "number" ||
  typeof x === "boolean" ||
  typeof x === "bigint";

export const isScalarNullable = (x: unknown): x is ScalarNullable =>
  x === null || x === undefined || isScalar(x);
