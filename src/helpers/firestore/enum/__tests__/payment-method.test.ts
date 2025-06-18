import { PaymentMethod } from "../payment-method";

describe("PaymentMethod enum", () => {
  it("should have all expected payment method values", () => {
    expect(PaymentMethod.pix).toBe("PIX");
    expect(PaymentMethod.creditCard).toBe("Cartão de Crédito");
    expect(PaymentMethod.cash).toBe("Dinheiro");
  });

  it("should have correct number of payment methods", () => {
    const methodValues = Object.values(PaymentMethod);
    expect(methodValues).toHaveLength(3);
  });

  it("should have unique values", () => {
    const methodValues = Object.values(PaymentMethod);
    const uniqueValues = new Set(methodValues);
    expect(uniqueValues.size).toBe(methodValues.length);
  });

  it("should be accessible by key", () => {
    expect(PaymentMethod["pix"]).toBe("PIX");
    expect(PaymentMethod["creditCard"]).toBe("Cartão de Crédito");
    expect(PaymentMethod["cash"]).toBe("Dinheiro");
  });

  it("should handle special characters correctly", () => {
    expect(PaymentMethod.creditCard).toBe("Cartão de Crédito");
  });

  it("should be iterable", () => {
    const methods = Object.values(PaymentMethod);
    expect(Array.isArray(methods)).toBe(true);
    expect(methods.length).toBeGreaterThan(0);
  });

  it("should contain expected payment method types", () => {
    const methods = Object.values(PaymentMethod);

    expect(methods).toContain("PIX");
    expect(methods).toContain("Cartão de Crédito");
    expect(methods).toContain("Dinheiro");
  });

  it("should represent common payment methods", () => {
    // Test that the enum represents common payment methods
    const paymentMethods = [
      PaymentMethod.pix,
      PaymentMethod.creditCard,
      PaymentMethod.cash,
    ];

    expect(paymentMethods).toEqual(["PIX", "Cartão de Crédito", "Dinheiro"]);
  });

  it("should handle uppercase values correctly", () => {
    expect(PaymentMethod.pix).toBe("PIX");
  });
});
