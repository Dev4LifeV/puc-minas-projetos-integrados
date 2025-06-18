import { render, screen } from "@testing-library/react";

import Card from "../index";
import { IconType } from "@/utils/IconType";
import userEvent from "@testing-library/user-event";

// Mock the Typography component to avoid theme dependency issues
jest.mock("@/components/basis/Typography", () => ({
  Typography: {
    TitleRegular: ({ children }: { children: React.ReactNode }) => (
      <span data-testid="typography-title">{children}</span>
    ),
  },
}));

// Mock the Icon component with correct IconType interface
const MockIcon: IconType = (props) => (
  <div data-testid="mock-icon" style={{ fontSize: props.fontSize || 36 }}>
    Icon
  </div>
);

describe("Card", () => {
  const defaultProps = {
    label: "Test Card",
    Icon: MockIcon,
  };

  it("should render with label and icon", () => {
    render(<Card {...defaultProps} />);

    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("should render icon with correct fontSize", () => {
    render(<Card {...defaultProps} />);

    const icon = screen.getByTestId("mock-icon");
    expect(icon).toHaveStyle({ fontSize: 36 });
  });

  it("should render as a link with default href", () => {
    render(<Card {...defaultProps} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "#");
  });

  it("should render as a link with custom href", () => {
    render(<Card {...defaultProps} href="/custom-path" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/custom-path");
  });

  it("should apply custom shadow style", () => {
    const customShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    render(<Card {...defaultProps} shadow={customShadow} />);

    const link = screen.getByRole("link");
    expect(link).toHaveStyle({ boxShadow: customShadow });
  });

  it("should not apply shadow when shadow prop is not provided", () => {
    render(<Card {...defaultProps} />);

    const link = screen.getByRole("link");
    expect(link).toHaveStyle({ boxShadow: undefined });
  });

  it("should handle click events", async () => {
    const user = userEvent.setup();
    render(<Card {...defaultProps} href="/test-path" />);

    const link = screen.getByRole("link");
    await user.click(link);

    // The link should be clickable (Next.js Link handles navigation)
    expect(link).toBeInTheDocument();
  });

  it("should render with different labels", () => {
    const { rerender } = render(<Card {...defaultProps} />);
    expect(screen.getByText("Test Card")).toBeInTheDocument();

    rerender(<Card {...defaultProps} label="Different Label" />);
    expect(screen.getByText("Different Label")).toBeInTheDocument();
  });

  it("should render with empty label", () => {
    render(<Card {...defaultProps} label="" />);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    // The Typography component should handle empty text gracefully
  });

  it("should render with special characters in label", () => {
    render(
      <Card {...defaultProps} label="Card with émojis 🚀 and symbols @#$%" />
    );

    expect(
      screen.getByText("Card with émojis 🚀 and symbols @#$%")
    ).toBeInTheDocument();
  });

  it("should have correct structure with icon and label", () => {
    render(<Card {...defaultProps} />);

    const link = screen.getByRole("link");
    const icon = screen.getByTestId("mock-icon");
    const label = screen.getByText("Test Card");

    expect(link).toContainElement(icon);
    expect(link).toContainElement(label);
  });

  it("should handle undefined href gracefully", () => {
    render(<Card {...defaultProps} href={undefined} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "#");
  });

  it("should handle null href gracefully", () => {
    render(<Card {...defaultProps} href={null as any} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "#");
  });

  it("should handle empty string href", () => {
    render(<Card {...defaultProps} href="" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "#");
  });
});
