import { render, screen } from "@testing-library/react";

import FunnelDesignV2 from "../../components/ui/admin-dashboard/FunnelDesign";

describe("Given FunnelDesignV2", () => {
  test("should render component", () => {
    const mockFunnelData = {
      total_leads: 20,
      verified_leads: 10,
      paid_applications: 0,
      submitted_applications: 0,
      enrollments: 0,
      verified_leads_perc: 50,
      verified_paid_app_perc: 20,
      submitted_paid_app_perc: 0,
      submitted_enrolments_perc: 0,
    };

    render(<FunnelDesignV2 funnelData={mockFunnelData} />);

    expect(screen.getByText("Leads")).toBeInTheDocument();
    expect(screen.getByText(20)).toBeInTheDocument();
  });
});
