import { render, screen } from "@testing-library/react";
import StudentQueryReport from "../../pages/Dashboard/StudentQueryReport";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import MockTheme from "../MockTheme";

const mockStudentQueryReportData = {
  data: [
    {
      un_resolved: 6,
      open: 0,
      resolved: 0,
      name: "test name 1",
    },
    {
      un_resolved: 199,
      open: 0,
      resolved: 0,
      name: "test name 2",
    },
  ],
  total: 14,
  count: 2,
  pagination: {
    next: "/admin/student_queries/?page_number=2&page_size=5",
    previous: null,
  },
  message: "queries data fetched successfully!",
};

describe("GIVEN StudentQueryReport", () => {
  test("Should render component", () => {
    const props = {
      selectedCounsellor: [],
      setCounsellorID: vi.fn(),
      counsellorList: [],
      hideCounsellorList: false,
      loadingCounselorList: false,
      setSkipCounselorApiCall: vi.fn(),
      setCallAPI: vi.fn(),
      studentQueryDate: {},
      setStudentQueryDate: vi.fn(),

      hideCourseList: false,
      setSkipCourseApiCall: vi.fn(),
      selectedCourseId: [],
      setSelectedCourseId: vi.fn(),
      courseList: [],

      studentQuerySearch: "",
      setStudentQuerySearch: vi.fn(),
      setStudentQueryPageNumber: vi.fn(),
      setStudentQueryPageSize: vi.fn(),
      setAllStudentQueryDataFetch: vi.fn(),

      pageNumber: 1,
      pageSize: 1,
      studentQueryData: mockStudentQueryReportData,
    };
    const container = render(
      <MockTheme>
        <MemoryRouter>
          <StudentQueryReport {...props} />
        </MemoryRouter>
      </MockTheme>
    );
    expect(screen.getByText("test name 1")).toBeInTheDocument();
    expect(screen.getByText("test name 2")).toBeInTheDocument();
  });
});
