import { Category } from "../category";
import { Product } from "../product";

describe("Product model", () => {
  let mockCategory: Category;

  beforeEach(() => {
    mockCategory = new Category("cat-1", "Electronics");
  });

  it("should create a product with all required properties", () => {
    const product = new Product(
      "prod-1",
      "Test Product",
      29.99,
      mockCategory,
      10
    );

    expect(product.id).toBe("prod-1");
    expect(product.description).toBe("Test Product");
    expect(product.value).toBe(29.99);
    expect(product.category).toBe(mockCategory);
    expect(product.inventory).toBe(10);
  });

  it("should create a product with optional image", () => {
    const product = new Product(
      "prod-2",
      "Product with Image",
      19.99,
      mockCategory,
      5,
      "https://example.com/image.jpg"
    );

    expect(product.image).toBe("https://example.com/image.jpg");
  });

  it("should return correct JSON representation without image", () => {
    const product = new Product(
      "prod-3",
      "No Image Product",
      15.5,
      mockCategory,
      20
    );

    const jsonResult = product.toJson();

    expect(jsonResult).toEqual({
      id: "prod-3",
      category: mockCategory.toJson(),
      description: "No Image Product",
      value: 15.5,
      inventory: 20,
    });
  });

  it("should return correct JSON representation with image", () => {
    const product = new Product(
      "prod-4",
      "Image Product",
      25.0,
      mockCategory,
      8,
      "https://example.com/product.jpg"
    );

    const jsonResult = product.toJson();

    expect(jsonResult).toEqual({
      id: "prod-4",
      category: mockCategory.toJson(),
      description: "Image Product",
      image: "https://example.com/product.jpg",
      value: 25.0,
      inventory: 8,
    });
  });

  it("should allow inventory updates", () => {
    const product = new Product(
      "prod-5",
      "Updateable Product",
      12.99,
      mockCategory,
      15
    );

    expect(product.inventory).toBe(15);

    product.inventory = 25;
    expect(product.inventory).toBe(25);

    product.inventory = 0;
    expect(product.inventory).toBe(0);
  });

  it("should handle decimal values correctly", () => {
    const product = new Product(
      "prod-6",
      "Decimal Product",
      9.99,
      mockCategory,
      3
    );

    expect(product.value).toBe(9.99);
    expect(product.toJson().value).toBe(9.99);
  });

  it("should handle zero values", () => {
    const product = new Product("prod-7", "Zero Product", 0, mockCategory, 0);

    expect(product.value).toBe(0);
    expect(product.inventory).toBe(0);
    expect(product.toJson().value).toBe(0);
    expect(product.toJson().inventory).toBe(0);
  });

  it("should handle large numbers", () => {
    const product = new Product(
      "prod-8",
      "Large Number Product",
      999999.99,
      mockCategory,
      999999
    );

    expect(product.value).toBe(999999.99);
    expect(product.inventory).toBe(999999);
  });

  it("should handle special characters in description", () => {
    const product = new Product(
      "prod-9",
      "Product with émojis 🚀 and symbols @#$%",
      45.0,
      mockCategory,
      12
    );

    expect(product.description).toBe("Product with émojis 🚀 and symbols @#$%");
    expect(product.toJson().description).toBe(
      "Product with émojis 🚀 and symbols @#$%"
    );
  });

  it("should handle empty description", () => {
    const product = new Product("prod-10", "", 10.0, mockCategory, 5);

    expect(product.description).toBe("");
    expect(product.toJson().description).toBe("");
  });

  it("should maintain category reference integrity", () => {
    const category1 = new Category("cat-2", "Books");
    const category2 = new Category("cat-3", "Sports");

    const product1 = new Product(
      "prod-11",
      "Book Product",
      20.0,
      category1,
      10
    );
    const product2 = new Product(
      "prod-12",
      "Sport Product",
      30.0,
      category2,
      15
    );

    expect(product1.category).toBe(category1);
    expect(product2.category).toBe(category2);
    expect(product1.category.name).toBe("Books");
    expect(product2.category.name).toBe("Sports");
  });
});
