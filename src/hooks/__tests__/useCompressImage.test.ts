import { renderHook } from "@testing-library/react";
import { useCompressImage } from "../useCompressImage";

// Mock Firebase auth
jest.mock("@/firebase-config", () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn(),
    },
  },
}));

// Mock AppCheckProvider
jest.mock("@/components/basis/AppCheckProvider", () => ({
  useAppCheck: () => ({
    appCheck: "mock-app-check",
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe("useCompressImage", () => {
  let originalAuth: any;
  beforeEach(() => {
    jest.clearAllMocks();
    const { auth } = require("@/firebase-config");
    originalAuth = { ...auth };
    auth.currentUser = {
      getIdToken: jest.fn(),
    };
  });

  afterEach(() => {
    const { auth } = require("@/firebase-config");
    auth.currentUser = originalAuth.currentUser;
  });

  it("should compress image successfully", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const mockBlob = new Blob(["compressed"], { type: "image/jpeg" });
    const mockIdToken = "mock-token";

    const { auth } = require("@/firebase-config");
    auth.currentUser.getIdToken.mockResolvedValue(mockIdToken);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const { result } = renderHook(() => useCompressImage());
    const compress = result.current;

    const resultBlob = await compress(mockFile);

    expect(auth.currentUser.getIdToken).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith("/api/compress-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mockIdToken}`,
      },
      body: expect.any(FormData),
    });
    expect(resultBlob).toBe(mockBlob);
  });

  it("should throw error when user is not authenticated", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

    const { auth } = require("@/firebase-config");
    auth.currentUser = null;

    const { result } = renderHook(() => useCompressImage());
    const compress = result.current;

    await expect(compress(mockFile)).rejects.toThrow("Not authenticated");
  });

  it("should handle HTTP error responses", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const mockIdToken = "mock-token";

    const { auth } = require("@/firebase-config");
    auth.currentUser.getIdToken.mockResolvedValue(mockIdToken);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: "Bad request" }),
    });

    const { result } = renderHook(() => useCompressImage());
    const compress = result.current;

    await expect(compress(mockFile)).rejects.toThrow(
      "Image compression failed: Bad request"
    );
  });

  it("should handle HTTP error responses with message field", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const mockIdToken = "mock-token";

    const { auth } = require("@/firebase-config");
    auth.currentUser.getIdToken.mockResolvedValue(mockIdToken);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: "Internal server error" }),
    });

    const { result } = renderHook(() => useCompressImage());
    const compress = result.current;

    await expect(compress(mockFile)).rejects.toThrow(
      "Image compression failed: Internal server error"
    );
  });

  it("should handle HTTP error responses without error or message fields", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const mockIdToken = "mock-token";

    const { auth } = require("@/firebase-config");
    auth.currentUser.getIdToken.mockResolvedValue(mockIdToken);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => useCompressImage());
    const compress = result.current;

    await expect(compress(mockFile)).rejects.toThrow(
      "Image compression failed: HTTP error! status: 404"
    );
  });

  it("should handle network errors", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const mockIdToken = "mock-token";

    const { auth } = require("@/firebase-config");
    auth.currentUser.getIdToken.mockResolvedValue(mockIdToken);

    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useCompressImage());
    const compress = result.current;

    await expect(compress(mockFile)).rejects.toThrow(
      "Image compression failed: Network error"
    );
  });

  it("should handle unknown errors", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const mockIdToken = "mock-token";

    const { auth } = require("@/firebase-config");
    auth.currentUser.getIdToken.mockResolvedValue(mockIdToken);

    (global.fetch as jest.Mock).mockRejectedValue("String error");

    const { result } = renderHook(() => useCompressImage());
    const compress = result.current;

    await expect(compress(mockFile)).rejects.toThrow(
      "Unknown error occurred during image compression"
    );
  });

  it("should create FormData with correct file", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const mockBlob = new Blob(["compressed"], { type: "image/jpeg" });
    const mockIdToken = "mock-token";

    const { auth } = require("@/firebase-config");
    auth.currentUser.getIdToken.mockResolvedValue(mockIdToken);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const { result } = renderHook(() => useCompressImage());
    const compress = result.current;

    await compress(mockFile);

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const formData = fetchCall[1].body as FormData;

    expect(formData.get("file")).toBe(mockFile);
  });
});
