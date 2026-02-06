import { fireEvent, render, screen } from "@testing-library/react";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";

describe("Test Sharable Pagination Row Per page component", () => {
  test("row per page component rendering test", () => {
    const { debug } = render(
      <AutoCompletePagination
        rowsPerPage={25}
        rowPerPageOptions={["25", "50", "75"]}
        rowCount={100}
        page={1}
        setPage={1}
        localStorageChangeRowPerPage={`publisherTableRowPerPage`}
        localStorageChangePage={`publisherApplicationSavePageNo`}
        setRowsPerPage={25}
      ></AutoCompletePagination>
    );

    const element = screen.queryByRole("combobox");
    expect(element.value).toBe("25");
  });
});
