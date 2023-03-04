import { isScalar, isScalarNullable } from "@/Types";

describe("Types", () => {
  it("isScalar()", () => {
    expect(isScalar("abc")).toBe(true);
    expect(isScalar(123)).toBe(true);
    expect(isScalar(true)).toBe(true);
    expect(isScalar(1n)).toBe(true);

    expect(isScalar(null)).toBe(false);
    expect(isScalar(undefined)).toBe(false);
  });

  it("isScalarNullable()", () => {
    expect(isScalarNullable(null)).toBe(true);
    expect(isScalarNullable(undefined)).toBe(true);
  });
});
