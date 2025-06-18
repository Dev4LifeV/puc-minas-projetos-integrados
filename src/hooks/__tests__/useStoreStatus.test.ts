import { act, renderHook } from "@testing-library/react";
import useStoreStatus, { StoreStatus } from "../useStoreStatus";

import { Collections } from "@/helpers/firestore/collections";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";

// Mock useFirebase hook
jest.mock("@/helpers/firestore/hooks/useFirebase");

describe("useStoreStatus", () => {
  const mockSet = jest.fn();
  const mockGetBy = jest.fn();
  const mockGetRealtime = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFirebase as jest.Mock).mockReturnValue({
      set: mockSet,
      getBy: mockGetBy,
      getRealtime: mockGetRealtime,
    });
  });

  it("initializes with default values", () => {
    const { result } = renderHook(() => useStoreStatus());

    expect(result.current.storeStatus).toBeUndefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("changes store status successfully", async () => {
    const { result } = renderHook(() => useStoreStatus());
    const newStatus = new StoreStatus("storeStatus", true);

    mockSet.mockImplementation(({ onSuccess }) => {
      onSuccess();
    });

    await act(async () => {
      await result.current.changeStoreStatus(newStatus);
    });

    expect(mockSet).toHaveBeenCalledWith({
      collection: Collections.Status_Loja,
      body: newStatus,
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
    expect(result.current.storeStatus).toEqual(newStatus);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("handles error when changing store status", async () => {
    const { result } = renderHook(() => useStoreStatus());
    const newStatus = new StoreStatus("storeStatus", true);

    mockSet.mockImplementation(({ onError }) => {
      onError();
    });

    await act(async () => {
      await result.current.changeStoreStatus(newStatus);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.loading).toBe(false);
  });

  it("gets store status successfully", async () => {
    const { result } = renderHook(() => useStoreStatus());
    const existingStatus = new StoreStatus("storeStatus", true);

    mockGetBy.mockImplementation(({ onData }) => {
      onData(existingStatus);
    });

    await act(async () => {
      await result.current.getStoreStatus();
    });

    expect(mockGetBy).toHaveBeenCalledWith({
      collection: Collections.Status_Loja,
      id: "storeStatus",
      transformer: expect.any(Function),
      onData: expect.any(Function),
      onError: expect.any(Function),
    });
    expect(result.current.storeStatus).toEqual(existingStatus);
    expect(result.current.loading).toBe(false);
  });

  it("creates initial status when none exists", async () => {
    const { result } = renderHook(() => useStoreStatus());

    mockGetBy.mockImplementation(({ onData }) => {
      onData(null);
    });

    mockSet.mockImplementation(({ onSuccess }) => {
      onSuccess();
    });

    await act(async () => {
      await result.current.getStoreStatus();
    });

    expect(mockSet).toHaveBeenCalled();
    expect(result.current.storeStatus).toBeDefined();
    expect(result.current.loading).toBe(false);
  });

  it("listens to store status changes", () => {
    const { result } = renderHook(() => useStoreStatus());
    const newStatus = new StoreStatus("storeStatus", true);

    mockGetRealtime.mockImplementation(({ onData }) => {
      onData({ id: "storeStatus", storeStatus: true });
    });

    act(() => {
      result.current.listenToStoreStatus();
    });

    expect(mockGetRealtime).toHaveBeenCalledWith({
      collection: Collections.Status_Loja,
      onData: expect.any(Function),
      onError: expect.any(Function),
    });
    expect(result.current.storeStatus).toEqual(newStatus);
  });

  it("handles error when listening to store status", () => {
    const { result } = renderHook(() => useStoreStatus());

    mockGetRealtime.mockImplementation(({ onError }) => {
      onError();
    });

    act(() => {
      result.current.listenToStoreStatus();
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.loading).toBe(false);
  });
});
