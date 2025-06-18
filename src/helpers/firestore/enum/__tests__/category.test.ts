import { Category } from "../category";

describe("Category enum", () => {
  it("should have all expected category values", () => {
    expect(Category.Cervejas).toBe("Cervejas");
    expect(Category.Churrasco).toBe("Churrasco");
    expect(Category.Destilados).toBe("Destilados");
    expect(Category.Frios_e_Congelados).toBe("Frios e Congelados");
    expect(Category.Gelo).toBe("Gelo");
    expect(Category.Higiene).toBe("Higiene");
    expect(Category.Limpeza).toBe("Limpeza");
    expect(Category.Mercearia).toBe("Mercearia");
    expect(Category.Promocoes).toBe("Promoções");
    expect(Category.Refrigerantes).toBe("Refrigerantes");
    expect(Category.Vinhos).toBe("Vinhos");
  });

  it("should have correct number of categories", () => {
    const categoryValues = Object.values(Category);
    expect(categoryValues).toHaveLength(11);
  });

  it("should have unique values", () => {
    const categoryValues = Object.values(Category);
    const uniqueValues = new Set(categoryValues);
    expect(uniqueValues.size).toBe(categoryValues.length);
  });

  it("should be accessible by key", () => {
    expect(Category["Cervejas"]).toBe("Cervejas");
    expect(Category["Churrasco"]).toBe("Churrasco");
    expect(Category["Destilados"]).toBe("Destilados");
  });

  it("should handle special characters correctly", () => {
    expect(Category.Frios_e_Congelados).toBe("Frios e Congelados");
    expect(Category.Promocoes).toBe("Promoções");
  });

  it("should be iterable", () => {
    const categories = Object.values(Category);
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should contain expected category types", () => {
    const categories = Object.values(Category);

    expect(categories).toContain("Cervejas");
    expect(categories).toContain("Churrasco");
    expect(categories).toContain("Destilados");
    expect(categories).toContain("Frios e Congelados");
    expect(categories).toContain("Gelo");
    expect(categories).toContain("Higiene");
    expect(categories).toContain("Limpeza");
    expect(categories).toContain("Mercearia");
    expect(categories).toContain("Promoções");
    expect(categories).toContain("Refrigerantes");
    expect(categories).toContain("Vinhos");
  });
});
