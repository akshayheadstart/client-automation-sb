import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import ManageCommunicationTemplate from "../../pages/TemplateManager/ManageCommunicationTemplate";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("Manage communication template test", () => {
  test("create template button working or not", () => {
    /*
          Purpose  :
               1. Checking that create template button is working or not 
        */
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <ManageCommunicationTemplate />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const createTemplateButton = screen.queryByRole("button", {
      name: "Create Template",
    });
    fireEvent.click(createTemplateButton);

    expect(screen.getByText("Email")).toBeInTheDocument();
  });
});
