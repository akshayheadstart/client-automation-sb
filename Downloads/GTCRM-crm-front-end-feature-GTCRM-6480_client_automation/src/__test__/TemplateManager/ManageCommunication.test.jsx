import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import ManageCommunicationTemplate from "../../pages/TemplateManager/ManageCommunicationTemplate";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("Manage communication template test", () => {
  test("rendering manage communication template", () => {
    /*
           Purpose :
               1. Checking that manage communication template component is rendering or not 
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
    expect(screen.getByText("Communication Template")).toBeInTheDocument();
    expect(screen.getByText("Total 0 Records")).toBeInTheDocument();
  });
  test("create template button working or not", () => {
    /*
          Purpose  :
               1. Checking that create template button is working or not 
        */
    const { debug } = render(
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

    const createTemplateButton = screen.queryByText("Create Template");
    expect(createTemplateButton).toBeInTheDocument();
  });
});
