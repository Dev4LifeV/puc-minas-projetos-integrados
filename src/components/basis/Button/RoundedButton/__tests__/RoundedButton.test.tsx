import { fireEvent, render, screen } from "@testing-library/react";

import { themeVars } from "@/theme/theme.css";
import RoundedButton from "../index";

// Mock the theme context
jest.mock("@/theme/theme.css", () => ({
  themeVars: {
    color: {
      common: {
        white: "#FFFFFF",
        black: "#000000",
      },
      primary: {
        main: "#007AFF",
      },
    },
  },
}));

describe("RoundedButton", () => {
  it("renders children correctly", () => {
    render(<RoundedButton>Click me</RoundedButton>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<RoundedButton onClick={handleClick}>Click me</RoundedButton>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(<RoundedButton className={customClass}>Click me</RoundedButton>);
    expect(screen.getByText("Click me").parentElement).toHaveClass(customClass);
  });

  it("forwards ref correctly", () => {
    const ref = jest.fn();
    render(<RoundedButton ref={ref}>Click me</RoundedButton>);
    expect(ref).toHaveBeenCalled();
  });

  it("applies default buttonColor", () => {
    render(<RoundedButton>Click me</RoundedButton>);
    const button = screen.getByText("Click me").parentElement;
    expect(button).toHaveStyle({
      backgroundColor: themeVars.color.background,
    });
  });

  it("applies custom buttonColor", () => {
    const customColor = "#FF0000";
    render(<RoundedButton buttonColor={customColor}>Click me</RoundedButton>);
    const button = screen.getByText("Click me").parentElement;
    expect(button).toHaveStyle({ backgroundColor: customColor });
  });

  it("forwards additional props to button element", () => {
    render(
      <RoundedButton data-testid="test-button" disabled>
        Click me
      </RoundedButton>
    );
    const button = screen.getByTestId("test-button");
    expect(button).toBeDisabled();
  });
});
