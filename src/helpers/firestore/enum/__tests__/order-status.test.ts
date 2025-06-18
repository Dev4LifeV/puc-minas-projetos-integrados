import { OrderStatus } from "../order-status";

describe("OrderStatus enum", () => {
  it("should have all expected order status values", () => {
    expect(OrderStatus.new).toBe("Novo Pedido");
    expect(OrderStatus.picking).toBe("Em Separação");
    expect(OrderStatus.sent).toBe("Pedido Enviado");
    expect(OrderStatus.delivered).toBe("Entregue");
  });

  it("should have correct number of statuses", () => {
    const statusValues = Object.values(OrderStatus);
    expect(statusValues).toHaveLength(4);
  });

  it("should have unique values", () => {
    const statusValues = Object.values(OrderStatus);
    const uniqueValues = new Set(statusValues);
    expect(uniqueValues.size).toBe(statusValues.length);
  });

  it("should be accessible by key", () => {
    expect(OrderStatus["new"]).toBe("Novo Pedido");
    expect(OrderStatus["picking"]).toBe("Em Separação");
    expect(OrderStatus["sent"]).toBe("Pedido Enviado");
    expect(OrderStatus["delivered"]).toBe("Entregue");
  });

  it("should handle special characters correctly", () => {
    expect(OrderStatus.picking).toBe("Em Separação");
    expect(OrderStatus.sent).toBe("Pedido Enviado");
  });

  it("should be iterable", () => {
    const statuses = Object.values(OrderStatus);
    expect(Array.isArray(statuses)).toBe(true);
    expect(statuses.length).toBeGreaterThan(0);
  });

  it("should contain expected status types", () => {
    const statuses = Object.values(OrderStatus);

    expect(statuses).toContain("Novo Pedido");
    expect(statuses).toContain("Em Separação");
    expect(statuses).toContain("Pedido Enviado");
    expect(statuses).toContain("Entregue");
  });

  it("should represent a logical order flow", () => {
    // Test that the enum represents a logical order progression
    const statusFlow = [
      OrderStatus.new,
      OrderStatus.picking,
      OrderStatus.sent,
      OrderStatus.delivered,
    ];

    expect(statusFlow).toEqual([
      "Novo Pedido",
      "Em Separação",
      "Pedido Enviado",
      "Entregue",
    ]);
  });
});
