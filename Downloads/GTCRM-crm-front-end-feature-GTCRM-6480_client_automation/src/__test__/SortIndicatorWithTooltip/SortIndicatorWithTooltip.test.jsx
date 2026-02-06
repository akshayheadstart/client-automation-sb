import { render, screen } from "@testing-library/react";
import SortIndicatorWithTooltip from "../../components/shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";

describe("GIVEN SortIndicatorWithTooltip", () => {
  test("should render component", () => {
    render(<SortIndicatorWithTooltip sortType={"asc"} />);
    expect(screen.getByTestId("upArrow")).toBeInTheDocument();
    expect(screen.getByTestId("downArrow")).toBeInTheDocument();
  });
});
