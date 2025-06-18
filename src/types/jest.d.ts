import "@testing-library/jest-dom";

declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any> {
      mockImplementation: (implementation: (...args: Y) => T) => Mock<T, Y>;
      mockReturnValue: (value: T) => Mock<T, Y>;
    }
  }
}
