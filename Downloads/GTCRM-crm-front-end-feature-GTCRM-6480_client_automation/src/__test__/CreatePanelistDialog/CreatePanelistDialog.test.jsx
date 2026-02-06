import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { store } from "../../Redux/store";
import CreatePanelistDialog from "../../components/CreatePanelistDialog/CreatePanelistDialog";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";

describe("Show List of Data", () => {
  test("Testing show data Modal Component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <CreatePanelistDialog
              openCreateDialog={true}
              handleClose={vi.fn()}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("Create Panelist")).toBeInTheDocument();
    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });
});
