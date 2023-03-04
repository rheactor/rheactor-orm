type Scalar = bigint | boolean | number | string;
export type ScalarNullable = Scalar | null | undefined;
export declare const isScalar: (x: unknown) => x is Scalar;
export declare const isScalarNullable: (x: unknown) => x is ScalarNullable;
export {};
