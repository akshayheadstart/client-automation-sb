import { screen, render } from "@testing-library/react";
import CreateSegregationForm from "../../pages/ResourceManagement/CreateSegregationForm";
import { vi } from "vitest";

describe("GIVEN CreateSegregationForm", () => {
  test("should render component", () => {
    render(<CreateSegregationForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText("e.g. Eligibility")).toBeInTheDocument();
  });
});
