import { render, screen } from "@testing-library/react";
import CounsellorPerformanceReport from "../../components/ui/admin-dashboard/CounsellorPerformanceReport";

const counsellorPerformanceData = [
  {
    conversation_rate: "0.00",
    counselor_name: "Testing",
    form_initialize: 2,
    fresh_lead: 45,
    interested_lead: 0,
    paid_application: 0,
    pending_followup: 1,
    query_pending: 0,
    total_assigned: 355,
  },
];

describe("Testing counsellorPerformanceReport component", () => {
  test("CounsellorPerformanceReport component test when data is found", () => {
    /*
            Purpose of this test :
                1. Rendering by giving counsellorPerformance data in props
                2. Expecting provided counsellor name to be in the document
        */

    render(
      <CounsellorPerformanceReport
        counsellorPerformanceData={counsellorPerformanceData}
      />
    );

    expect(
      screen.getByText("Counsellor Performance Report")
    ).toBeInTheDocument();
    expect(screen.getByText("Select Counselor")).toBeInTheDocument();
    expect(screen.getByText("Date Range")).toBeInTheDocument();
  });

  test("CounsellorPerformanceReport component test when data is not found", () => {
    /*
            Purpose of this test :
                1. Rendering without giving counsellorPerformance data in props
                2. Expecting not found animation to be in the document
        */

    render(<CounsellorPerformanceReport counsellorPerformanceData={[]} />);

    const notFoundAnimation = screen.queryByTestId("not-found-animation");

    expect(notFoundAnimation).toBeInTheDocument();
  });
});
