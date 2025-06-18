import { fireEvent, render, screen } from "@testing-library/react";

import InputText from "../InputText";

describe("InputText", () => {
  const defaultProps = {
    label: "Test Input",
    id: "test-input",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with label", () => {
    render(<InputText {...defaultProps} />);
    expect(screen.getByLabelText("Test Input")).toBeInTheDocument();
  });

  it("renders with placeholder matching label", () => {
    render(<InputText {...defaultProps} />);
    expect(screen.getByPlaceholderText("Test Input")).toBeInTheDocument();
  });

  it("applies error styling when error prop is true", () => {
    render(<InputText {...defaultProps} error={true} />);
    const input = screen.getByLabelText("Test Input");
    expect(input).toHaveStyle({ border: "1px solid red" });
  });

  it("does not apply error styling when error prop is false", () => {
    render(<InputText {...defaultProps} error={false} />);
    const input = screen.getByLabelText("Test Input");
    expect(input).not.toHaveStyle({ border: "1px solid red" });
  });

  it("forwards ref correctly", () => {
    const ref = jest.fn();
    render(<InputText {...defaultProps} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it("handles input changes", () => {
    const handleChange = jest.fn();
    render(<InputText {...defaultProps} onChange={handleChange} />);
    const input = screen.getByLabelText("Test Input");
    fireEvent.change(input, { target: { value: "test value" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(<InputText {...defaultProps} className={customClass} />);
    const input = screen.getByLabelText("Test Input");
    expect(input.className).toContain(customClass);
  });

  it("forwards additional props to input element", () => {
    render(
      <InputText {...defaultProps} data-testid="test-input" disabled required />
    );
    const input = screen.getByTestId("test-input");
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
  });

  it("sets correct input attributes", () => {
    render(<InputText {...defaultProps} />);
    const input = screen.getByLabelText("Test Input");
    expect(input).toHaveAttribute("autoComplete", "new-password");
    expect(input).toHaveAttribute("autoCorrect", "false");
    expect(input).toHaveAttribute("type", "text");
  });
});
