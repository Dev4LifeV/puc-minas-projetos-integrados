import { act, renderHook } from "@testing-library/react";

import useMediaQuery from "../useMediaQuery";

describe("useMediaQuery", () => {
  let mockMatchMedia: jest.Mock;

  beforeEach(() => {
    mockMatchMedia = jest.fn();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return false initially when media query does not match", () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: "(max-width: 768px)",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

    expect(result.current).toBe(false);
    expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 768px)");
  });

  it("should return true initially when media query matches", () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: "(max-width: 768px)",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

    expect(result.current).toBe(true);
  });

  it("should update state when media query changes", () => {
    const mockAddEventListener = jest.fn();
    const mockRemoveEventListener = jest.fn();

    mockMatchMedia.mockReturnValue({
      matches: false,
      media: "(max-width: 768px)",
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

    expect(result.current).toBe(false);

    // Simulate media query change
    const changeListener = mockAddEventListener.mock.calls[0][1];

    act(() => {
      changeListener();
    });

    expect(result.current).toBe(false); // Should still be false since matches is false
  });

  it("should update state to true when media query starts matching", () => {
    const mockAddEventListener = jest.fn();
    const mockRemoveEventListener = jest.fn();

    // Use a mutable object for the matchMedia return value
    const mediaQueryList = {
      matches: false,
      media: "(max-width: 768px)",
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    };

    mockMatchMedia.mockReturnValue(mediaQueryList);

    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

    expect(result.current).toBe(false);

    // Simulate media query change to true
    const changeListener = mockAddEventListener.mock.calls[0][1];

    // Update the mock to return true
    mediaQueryList.matches = true;

    act(() => {
      changeListener();
    });

    expect(result.current).toBe(true);
  });

  it("should handle different media queries", () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: "(min-width: 1024px)",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));

    expect(result.current).toBe(true);
    expect(mockMatchMedia).toHaveBeenCalledWith("(min-width: 1024px)");
  });

  it("should handle complex media queries", () => {
    const complexQuery = "(max-width: 768px) and (orientation: landscape)";

    mockMatchMedia.mockReturnValue({
      matches: false,
      media: complexQuery,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const { result } = renderHook(() => useMediaQuery(complexQuery));

    expect(result.current).toBe(false);
    expect(mockMatchMedia).toHaveBeenCalledWith(complexQuery);
  });

  it("should re-register listener when query changes", () => {
    const mockAddEventListener = jest.fn();
    const mockRemoveEventListener = jest.fn();

    mockMatchMedia.mockReturnValue({
      matches: false,
      media: "(max-width: 768px)",
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: "(max-width: 768px)" },
    });

    expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 768px)");

    // Change the query
    rerender({ query: "(min-width: 1024px)" });

    expect(mockMatchMedia).toHaveBeenCalledWith("(min-width: 1024px)");
  });

  it("should handle empty query string", () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: "",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const { result } = renderHook(() => useMediaQuery(""));

    expect(result.current).toBe(false);
    expect(mockMatchMedia).toHaveBeenCalledWith("");
  });
});
