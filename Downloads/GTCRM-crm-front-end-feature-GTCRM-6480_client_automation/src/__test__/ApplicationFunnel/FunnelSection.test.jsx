import { render, screen } from "@testing-library/react";

import FunnelSection from "../../components/ui/admin-dashboard/FunnelSection";

describe("GIVEN FunnelSection", () => {
  test("should render component", () => {
    render(
      <FunnelSection
        height={30}
        width={100}
        value={10}
        label="Submitted"
      />
    );
    expect(screen.getByText("Submitted")).toBeInTheDocument();
    expect(screen.getByText(10)).toBeInTheDocument();

  });
});
