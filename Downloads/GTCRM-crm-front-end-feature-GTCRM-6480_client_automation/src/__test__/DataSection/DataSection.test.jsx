import { render, screen } from "@testing-library/react";

import DataSection from "../../components/shared/DataSection/DataSetion";

describe("GIVEN DataSection", () => {
  test("should render component", () => {
    render(<DataSection title={25} value={45} />);

    expect(screen.getByTestId("data-section")).toBeInTheDocument();
    expect(screen.getByText(25)).toBeInTheDocument();
    expect(screen.getByText(45)).toBeInTheDocument();
  });

  test("WHEN hideDivider true THEN divider should not be rendered", () => {
    render(<DataSection title={25} value={45} hideDivider />);

    expect(screen.queryByTestId("section-divider")).toBeNull();
  });
});
