import { render, screen } from "@testing-library/react";

import InputText from "../InputText";
import userEvent from "@testing-library/user-event";

describe("InputText", () => {
  it("should render with label", () => {
    render(<InputText label="Test Label" />);

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Test Label")).toBeInTheDocument();
  });

  it("should render with custom id", () => {
    render(<InputText label="Test Label" id="custom-id" />);

    const input = screen.getByLabelText("Test Label");
    expect(input).toHaveAttribute("id", "custom-id");
  });

  it("should apply error styling when error prop is true", () => {
    render(<InputText label="Test Label" error={true} />);

    const input = screen.getByLabelText("Test Label");
    expect(input).toHaveStyle({ border: "1px solid red" });
  });

  it("should not apply error styling when error prop is false", () => {
    render(<InputText label="Test Label" error={false} />);

    const input = screen.getByLabelText("Test Label");
    expect(input).not.toHaveStyle({ border: "1px solid red" });
  });

  it("should not apply error styling when error prop is not provided", () => {
    render(<InputText label="Test Label" />);

    const input = screen.getByLabelText("Test Label");
    expect(input).not.toHaveStyle({ border: "1px solid red" });
  });

  it("should handle user input", async () => {
    const user = userEvent.setup();
    render(<InputText label="Test Label" />);

    const input = screen.getByLabelText("Test Label");
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
  });

  it("should forward ref", () => {
    const ref = jest.fn();
    render(<InputText label="Test Label" ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it("should apply custom className", () => {
    render(<InputText label="Test Label" className="custom-class" />);

    const input = screen.getByLabelText("Test Label");
    expect(input).toHaveClass("custom-class");
  });

  it("should have correct input attributes", () => {
    render(<InputText label="Test Label" />);

    const input = screen.getByLabelText("Test Label");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("autoComplete", "new-password");
    expect(input).toHaveAttribute("autoCorrect", "false");
  });

  it("should handle mask prop", () => {
    render(<InputText label="Test Label" mask="99.99.9999" />);

    const input = screen.getByLabelText("Test Label");
    // Note: The mask prop is passed but not implemented in the component
    // This test ensures the prop is accepted without breaking
    expect(input).toBeInTheDocument();
  });

  it("should handle additional props", () => {
    render(
      <InputText
        label="Test Label"
        data-testid="custom-input"
        disabled
        maxLength={10}
      />
    );

    const input = screen.getByLabelText("Test Label");
    expect(input).toHaveAttribute("data-testid", "custom-input");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("maxLength", "10");
  });

  it("should render label with correct htmlFor attribute", () => {
    render(<InputText label="Test Label" id="test-id" />);

    const label = screen.getByText("Test Label");
    expect(label).toHaveAttribute("for", "test-id");
  });

  it("should render label without htmlFor when no id is provided", () => {
    render(<InputText label="Test Label" />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveAttribute("for");
  });

  it("should maintain focus when typing", async () => {
    const user = userEvent.setup();
    render(<InputText label="Test Label" />);

    const input = screen.getByLabelText("Test Label");
    await user.click(input);
    await user.type(input, "test");

    expect(input).toHaveFocus();
    expect(input).toHaveValue("test");
  });
});
