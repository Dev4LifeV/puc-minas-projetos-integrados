import { Category } from "../category";

describe("Category model", () => {
  it("should create a category with id and name", () => {
    const category = new Category("cat-1", "Electronics");

    expect(category.id).toBe("cat-1");
    expect(category.name).toBe("Electronics");
  });

  it("should return correct JSON representation", () => {
    const category = new Category("cat-2", "Books");

    const jsonResult = category.toJson();

    expect(jsonResult).toEqual({
      id: "cat-2",
      name: "Books",
    });
  });

  it("should handle different category names", () => {
    const category1 = new Category("cat-3", "Sports & Outdoors");
    const category2 = new Category("cat-4", "Home & Garden");

    expect(category1.name).toBe("Sports & Outdoors");
    expect(category2.name).toBe("Home & Garden");
  });

  it("should handle empty name", () => {
    const category = new Category("cat-5", "");

    expect(category.name).toBe("");
    expect(category.toJson()).toEqual({
      id: "cat-5",
      name: "",
    });
  });

  it("should handle special characters in name", () => {
    const category = new Category("cat-6", "Café & Restaurants");

    expect(category.name).toBe("Café & Restaurants");
    expect(category.toJson()).toEqual({
      id: "cat-6",
      name: "Café & Restaurants",
    });
  });
});
