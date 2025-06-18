import { fireEvent, render, screen } from "@testing-library/react";

import GoogleButton from "../index";

// Mock the theme context
jest.mock("@/theme/theme.css", () => ({
  themeVars: {
    color: {
      common: {
        white: "#FFFFFF",
        black: "#000000",
      },
      background: "#404040",
    },
  },
}));

describe("GoogleButton", () => {
  const mockAction = jest.fn();

  beforeEach(() => {
    mockAction.mockClear();
  });

  it("renders with default label", () => {
    render(<GoogleButton action={mockAction} />);
    expect(screen.getByText("Continuar com o Google")).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    const customLabel = "Custom Label";
    render(<GoogleButton action={mockAction} label={customLabel} />);
    expect(screen.getByText(customLabel)).toBeInTheDocument();
  });

  it("calls action when clicked", () => {
    render(<GoogleButton action={mockAction} />);
    fireEvent.click(screen.getByText("Continuar com o Google"));
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("renders Google logo", () => {
    const mockAction = jest.fn();
    const { container } = render(<GoogleButton action={mockAction} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.tagName.toLowerCase()).toBe("svg");
  });
});
