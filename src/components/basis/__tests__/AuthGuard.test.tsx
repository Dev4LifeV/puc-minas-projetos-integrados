import { act, render, screen } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";

import { useNetworkState } from "@uidotdev/usehooks";
import { User } from "firebase/auth";
import AuthGuard from "../AuthGuard";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock AuthGuardProvider and useAuthGuard
jest.mock("../AuthGuardProvider", () => ({
  AuthGuardProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuthGuard: () => ({
    currentUser: null,
    setCurrentUser: jest.fn(),
  }),
}));

// Mock useNetworkState
jest.mock("@uidotdev/usehooks", () => ({
  useNetworkState: jest.fn(),
}));

// Mock theme
jest.mock("@/theme/theme.css", () => ({
  themeVars: {
    color: {
      common: {
        white: "#FFFFFF",
        black: "#000000",
      },
    },
  },
}));

// Mock firebase auth
const mockUnsubscribe = jest.fn();
jest.mock("@/firebase-config", () => ({
  auth: {
    onAuthStateChanged: jest.fn(() => mockUnsubscribe),
    beforeAuthStateChanged: jest.fn(),
    currentUser: null,
  },
}));

// Mock useFirebase
jest.mock("@/helpers/firestore/hooks/useFirebase", () => ({
  __esModule: true,
  default: () => ({
    getBy: jest.fn(),
  }),
}));

describe("AuthGuard", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue("/");
    (useNetworkState as jest.Mock).mockReturnValue({ online: true });
    // Reset mockUnsubscribe for each test
    mockUnsubscribe.mockClear();
  });

  it("renders children when user is online", () => {
    render(
      <AuthGuard>
        <div>Test Content</div>
      </AuthGuard>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("shows offline message when user is not online", () => {
    (useNetworkState as jest.Mock).mockReturnValue({ online: false });
    render(
      <AuthGuard>
        <div>Test Content</div>
      </AuthGuard>
    );
    expect(
      screen.getByText(
        "Você está sem internet. Por favor, verifique sua conexão e tente novamente."
      )
    ).toBeInTheDocument();
  });

  it("redirects to home when user is authenticated and on login page", async () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    const mockUser = { uid: "123" } as User;
    const { auth } = require("@/firebase-config");
    (auth.onAuthStateChanged as jest.Mock).mockImplementation((cb: any) => {
      cb(mockUser);
      return mockUnsubscribe;
    });
    await act(async () => {
      render(
        <AuthGuard>
          <div>Test Content</div>
        </AuthGuard>
      );
    });
    expect(mockRouter.push).toHaveBeenCalledWith("/home");
  });

  it("redirects to login when user is not authenticated and not on login page", async () => {
    (usePathname as jest.Mock).mockReturnValue("/home");
    const { auth } = require("@/firebase-config");
    (auth.onAuthStateChanged as jest.Mock).mockImplementation((cb: any) => {
      cb(null);
      return mockUnsubscribe;
    });
    await act(async () => {
      render(
        <AuthGuard>
          <div>Test Content</div>
        </AuthGuard>
      );
    });
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("sets current user when user is authenticated", async () => {
    const mockUser = { uid: "123" } as User;
    const { auth } = require("@/firebase-config");
    (auth.onAuthStateChanged as jest.Mock).mockImplementation((cb: any) => {
      cb(mockUser);
      return mockUnsubscribe;
    });
    await act(async () => {
      render(
        <AuthGuard>
          <div>Test Content</div>
        </AuthGuard>
      );
    });
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("cleans up auth state listener on unmount", () => {
    const { auth } = require("@/firebase-config");
    (auth.onAuthStateChanged as jest.Mock).mockReturnValue(mockUnsubscribe);
    const { unmount } = render(
      <AuthGuard>
        <div>Test Content</div>
      </AuthGuard>
    );
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
