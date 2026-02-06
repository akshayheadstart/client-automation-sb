import { render, screen } from "@testing-library/react";

import AddCourseForm from "../../pages/CourseManagement/AddCourseForm";
import { vi } from "vitest";

describe("GIVEN AddCourseForm", () => {
  test("should render component", () => {
    render(
      <AddCourseForm isEditMode={false} onSubmit={vi.fn()} onCancel={vi.fn()} />
    );

    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("PG")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter course name")
    ).toBeInTheDocument();
  });
});
