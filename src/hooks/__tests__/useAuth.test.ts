import { auth, googleProvider } from "@/firebase-config";
import { act, renderHook } from "@testing-library/react";
import { signInWithPopup, signOut } from "firebase/auth";

import useAuth from "../useAuth";

// Mock firebase auth
jest.mock("@/firebase-config", () => ({
  auth: {
    currentUser: null,
  },
  googleProvider: {},
}));

// Mock firebase/auth functions
jest.mock("firebase/auth", () => ({
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
}));

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  it("handles sign out successfully", async () => {
    const { result } = renderHook(() => useAuth());
    (signOut as jest.Mock).mockResolvedValueOnce(undefined);

    await act(async () => {
      await result.current.handleSignOut();
    });

    expect(signOut).toHaveBeenCalledWith(auth);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("handles sign out error", async () => {
    const { result } = renderHook(() => useAuth());
    const error = new Error("Sign out failed");
    (signOut as jest.Mock).mockRejectedValueOnce(error);

    await act(async () => {
      await result.current.handleSignOut();
    });

    expect(signOut).toHaveBeenCalledWith(auth);
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it("handles login successfully", async () => {
    const { result } = renderHook(() => useAuth());
    const mockUser = { uid: "123" };
    (signInWithPopup as jest.Mock).mockResolvedValueOnce({ user: mockUser });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(signInWithPopup).toHaveBeenCalledWith(auth, googleProvider);
    expect(console.log).toHaveBeenCalledWith(
      "Sign in with popup successful:",
      mockUser.uid
    );
    expect(console.error).not.toHaveBeenCalled();
  });

  it("handles login error", async () => {
    const { result } = renderHook(() => useAuth());
    const error = new Error("Login failed");
    (signInWithPopup as jest.Mock).mockRejectedValueOnce(error);

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(signInWithPopup).toHaveBeenCalledWith(auth, googleProvider);
    expect(console.error).toHaveBeenCalledWith(
      "Sign in with popup error:",
      error
    );
  });
});
