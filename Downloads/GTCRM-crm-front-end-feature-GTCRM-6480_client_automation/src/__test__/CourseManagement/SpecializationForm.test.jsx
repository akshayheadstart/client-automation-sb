import { render, screen } from "@testing-library/react";

import SpecializationForm from "../../pages/CourseManagement/SpecializationForm";
import { vi } from "vitest";

describe("GIVEN SpecializationForm", () => {
  test("should render component", () => {
    render(<SpecializationForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});
