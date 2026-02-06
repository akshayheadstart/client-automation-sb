import { render, screen } from "@testing-library/react";

import CourseList from "../../pages/CourseManagement/CourseList";

const mockCourses = [
  {
    _id: "123",
    course_name: "BBA",
    course_description: "Bachelor in Business Administration",
    duration: "6 Years Years",
    fees: "Rs.100000.0/-",
    is_activated: true,
    is_pg: false,
    banner_image_url: "",
    course_specialization: [],
    college_id: "789",
  },
];

describe("GIVEN CourseList", () => {
  test("should render component", () => {
    render(
      <CourseList
        courses={mockCourses}
        selectedCourse="123"
      />
    );

    expect(screen.getByText("BBA")).toBeInTheDocument();
    expect(screen.getByText("Add Course")).toBeInTheDocument();
  });
});
