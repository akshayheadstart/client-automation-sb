import { fireEvent, render, screen } from "@testing-library/react";
import FilterSelectPicker from "../../components/shared/filters/FilterSelectPicker";
import { reportPaymentFilter } from "../../constants/LeadStageList";
import { vi } from "vitest";

describe("Testing filterSelectPicker component", () => {
  /*
        Purpose of this test :
            1. Rendering component with giving picker data and picker value
            2. After clicking on the picker value expecting that all of the given picker options are showing in the UI or not.
            3. If all of them are showing that the test will pass if not then it will fail.
    */
  test("testing by passing picker data and value", () => {
    render(
      <FilterSelectPicker
        setSelectedPicker={() => vi.fn()}
        pickerData={reportPaymentFilter}
        pickerValue="Successful"
      />
    );
    const selectedValue = screen.queryByText(/successful/i);
    fireEvent.click(selectedValue);

    const successFilterOption = screen.queryAllByText(/successful/i);
    const failedFilterOption = screen.queryByText(/failed/i);
    const progressFilterOption = screen.queryByText(/in progress/i);

    expect(successFilterOption.length).toBe(2);
    expect(failedFilterOption).toBeInTheDocument();
    expect(progressFilterOption).toBeInTheDocument();
  });
});
