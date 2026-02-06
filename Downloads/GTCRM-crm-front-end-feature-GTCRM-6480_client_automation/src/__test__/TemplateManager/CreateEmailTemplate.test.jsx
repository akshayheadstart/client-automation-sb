import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CreateEmailTemplate from "../../pages/TemplateManager/CreateEmailTemplate";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("Test Email Builder Page", () => {
  test("Email builder rendering test", () => {
    /*
          Purpose :
              1. Checking that Email builder Page is rendering or not 
       */
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <CreateEmailTemplate></CreateEmailTemplate>
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/Create Template/i)).toBeInTheDocument();
    expect(screen.getByText(/Whatsapp/i)).toBeInTheDocument();
    expect(screen.getByText(/Sms/i)).toBeInTheDocument();
  });
});
