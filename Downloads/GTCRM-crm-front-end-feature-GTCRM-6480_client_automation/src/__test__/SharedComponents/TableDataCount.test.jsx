import { render, screen } from "@testing-library/react";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";

describe("TableDataCount component test", () => {
  test("Testing CommonPopover Component rendering with the right count", () => {
    /*
            The purpose of this test :  
                1. Testing if the count are showing correctly in the table top or not
        */

    render(
      <TableDataCount
        currentPageShowingCount={25}
        totalCount={100}
        pageNumber={2}
        rowsPerPage={25}
      ></TableDataCount>
    );

    const total = screen.getByText("100");
    const showingStartToEnd = screen.getByText("25-50");

    expect(total).toBeInTheDocument();
    expect(showingStartToEnd).toBeInTheDocument();
  });
});
