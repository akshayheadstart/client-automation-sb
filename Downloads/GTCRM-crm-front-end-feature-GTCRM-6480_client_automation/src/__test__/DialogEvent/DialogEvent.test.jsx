import { Provider } from "react-redux";
import DialogEvent from "../../components/EventMappingDialog/DialogEvent";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";

describe("Show List of Data", () => {
  test("Testing show data Modal Component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <DialogEvent
              toggle={true}
              dialogOpen={true}
              handleClose={vi.fn()}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const element = screen.getByTestId("cancelBtnDialog");
    expect(element).toBeInTheDocument();
  });
});
