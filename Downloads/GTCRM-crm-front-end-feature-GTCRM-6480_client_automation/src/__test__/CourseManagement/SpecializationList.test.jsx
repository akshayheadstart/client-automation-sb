import { render, screen, act, fireEvent } from "@testing-library/react";

import SpecializationList from "../../pages/CourseManagement/SpecializationList";
import { vi } from "vitest";

const mockCourseData = {
  course_specialization: [
    {
      spec_name: "BBA",
      is_activated: true,
    },
  ],
};

describe("GIVEN SpecializationList", () => {
  test("should render component", () => {
    render(
      <SpecializationList
        handleEditBtnClick={vi.fn()}
        courseData={mockCourseData}
      />
    );

    expect(screen.getByText("BBA")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  test("should invoke edit button function on edit icon click", () => {
    const mockEditBtn = vi.fn();
    render(
      <SpecializationList
        handleEditBtnClick={mockEditBtn}
        courseData={mockCourseData}
      />
    );

    const editBtn = screen.getByTestId("editBtn");
    act(() => fireEvent.click(editBtn));

    expect(mockEditBtn).toHaveBeenCalled();
  });
});
