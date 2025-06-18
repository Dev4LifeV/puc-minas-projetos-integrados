import { cn } from "../classNames";

describe("classNames utility", () => {
  it("should join multiple class names with spaces", () => {
    const result = cn("class1", "class2", "class3");
    expect(result).toBe("class1 class2 class3");
  });

  it("should handle undefined values by filtering them out", () => {
    const result = cn("class1", undefined, "class3", undefined);
    expect(result).toBe("class1 class3");
  });

  it("should return empty string for empty array", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should return empty string for array with only undefined values", () => {
    const result = cn(undefined, undefined);
    expect(result).toBe("");
  });

  it("should handle single class name", () => {
    const result = cn("single-class");
    expect(result).toBe("single-class");
  });

  it("should handle mixed valid and undefined values", () => {
    const result = cn("class1", undefined, "class2", "class3", undefined);
    expect(result).toBe("class1 class2 class3");
  });
});
