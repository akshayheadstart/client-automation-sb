import React from "react";
// import { render, fireEvent } from "vitest";
import FormField from "../../components/shared/forms/FormField";
import { render } from "@testing-library/react";
import { expect, vi } from "vitest";

describe("FormField", () => {
  it("renders correctly", () => {
    const { getByLabelText } = render(
      <FormField label="Username" placeholder="Enter your username" />
    );

    expect(getByLabelText("Username")).toBeInTheDocument();
  });

  it("updates value correctly", () => {
    const handleChange = vi.fn();
    const { getByLabelText } = render(
      <FormField label="Username" value="UserName" onChange={handleChange} />
    );
    const input = getByLabelText("Username");
    expect(input.value).toBe("UserName");
  });

  it("disables input when disabled prop is true", () => {
    const { getByLabelText } = render(<FormField label="Username" disabled />);
    const input = getByLabelText("Username");

    expect(input).toBeDisabled();
  });

  it("displays error state correctly", () => {
    const { getByLabelText, container } = render(
      <FormField label="Username" error={true} />
    );
    const errorText = container.querySelector(".form-field .Mui-error");
    expect(errorText).toBeInTheDocument();
  });
});
