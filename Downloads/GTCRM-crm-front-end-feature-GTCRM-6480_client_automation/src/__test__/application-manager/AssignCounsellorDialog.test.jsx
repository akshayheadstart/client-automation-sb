import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import AssignCounsellorDialog from "../../components/ui/application-manager/AssignCounsellorDialog";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";

const apiResponseStatusProps = {
  apiResponseStatusMessage: vi.fn(),
  openAlertMessage: vi.fn(),
  setAlertType: vi.fn(),
};

describe("AsignCounsellorDialog component render", () => {
  test("Testing AsignCounsellorDialog rendaring", () => {
    /*
            The purpose of this test :  
                1. Testing if AsignCounsellorDialog component render properly
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <AssignCounsellorDialog
              apiResponseStatusProps={apiResponseStatusProps}
              openDialogs={true}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const title = screen.queryByText("Change Counsellor");
    const selectCouncellor = screen.queryByText("Select Counselor *");
    const saveButton = screen.queryByRole("button", { name: "Save" });

    expect(title).toBeInTheDocument();
    expect(selectCouncellor).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });
});
