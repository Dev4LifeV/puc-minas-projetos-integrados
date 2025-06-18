import { BaseModel } from "../baseModel";

describe("BaseModel interface", () => {
  it("should be properly defined with required properties", () => {
    // This test ensures the interface is properly defined
    const mockModel: BaseModel = {
      id: "test-id",
      toJson: () => ({ id: "test-id", name: "Test" }),
    };

    expect(mockModel.id).toBe("test-id");
    expect(typeof mockModel.toJson).toBe("function");
    expect(mockModel.toJson()).toEqual({ id: "test-id", name: "Test" });
  });

  it("should allow implementation with different data structures", () => {
    const mockModel: BaseModel = {
      id: "product-1",
      toJson: () => ({
        id: "product-1",
        name: "Product Name",
        price: 10.99,
        category: "Electronics",
      }),
    };

    const jsonResult = mockModel.toJson();

    expect(jsonResult).toEqual({
      id: "product-1",
      name: "Product Name",
      price: 10.99,
      category: "Electronics",
    });
  });
});
