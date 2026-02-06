import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import FilterOption from "../../pages/Query_Manager/FilterOption";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { TopProvider } from "../../store/contexts/TopContext";

describe("Filter Option Component Test", () => {
  test("Show the content for Filter Option Component", () => {
    render(
      <Provider store={store}>
        <TopProvider>
          <MemoryRouter>
            <DashboardDataProvider>
              <FilterOption></FilterOption>
            </DashboardDataProvider>
          </MemoryRouter>
        </TopProvider>
      </Provider>
    );


    const filterIcon = screen.getByTestId("filter-btn");

    fireEvent.click(filterIcon);
    const text_Filter = screen.queryByText(/Filter/i);
    expect(text_Filter).toBeInTheDocument();

    const input_choose_your_form = screen.getByTestId("choose-your-form");
    expect(input_choose_your_form).toBeInTheDocument();

    const input_payment_status = screen.getByTestId("payment-status");
    expect(input_payment_status).toBeInTheDocument();

    const input_choose_your_preferred_category = screen.getByTestId("choose-your-preferred-category");
    expect(input_choose_your_preferred_category).toBeInTheDocument();

    const input_assigned_to = screen.getByTestId("assigned-to");
    expect(input_assigned_to).toBeInTheDocument();

    const input_select_your_status = screen.getByTestId("select-your-status");
    expect(input_select_your_status).toBeInTheDocument();

    const resetBtn = screen.getByTestId("reset-btn");
    expect(resetBtn).toBeInTheDocument();

    const applyBtn = screen.getByTestId("apply-btn");
    expect(applyBtn).toBeInTheDocument();



  });
});
