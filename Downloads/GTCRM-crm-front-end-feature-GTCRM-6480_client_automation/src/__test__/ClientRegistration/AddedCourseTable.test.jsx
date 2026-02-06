import { render, screen } from "@testing-library/react";
import AddedCourseTable from "../../components/shared/ClientRegistration/AddedCourseTable";

describe("Testing added course table component to be rendered", () => {
  let data = [
    {
      courseName: "Bsc",
      courseFees: 2022,
      courseSpecializations: [],
    },
  ];
  test("Testing when this component is in edit mode", () => {
    render(
      <AddedCourseTable
        addedCourseTableFunctions={{
          allCourses: data,
          allSchools: [],
          preferenceAndFeesCalculation: {},
          setPreferenceAndFeesCalculation: () => {},
        }}
      />
    );
    expect(screen.getByText("Added 1 Courses")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
  test("Testing when this component is not in edit mode", () => {
    render(
      <AddedCourseTable
        preview={true}
        addedCourseTableFunctions={{
          allCourses: data,
          allSchools: [],
          preferenceAndFeesCalculation: {},
          setPreferenceAndFeesCalculation: () => {},
        }}
      />
    );
    expect(screen.getByText("Added 1 Courses")).toBeInTheDocument();
    expect(screen.queryByText("Actions")).not.toBeInTheDocument();
  });
});
