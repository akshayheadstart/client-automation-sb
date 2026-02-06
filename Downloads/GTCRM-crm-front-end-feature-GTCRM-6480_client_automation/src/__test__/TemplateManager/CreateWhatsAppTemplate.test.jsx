import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CreateWhatsAppTemplate from "../../pages/TemplateManager/CreateWhatsAppTemplate";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import { vi } from "vitest";
describe("CreateWhatsAppTemplate component test", () => {
  test("Testing CreateWhatsAppTemplate rendering", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <CreateWhatsAppTemplate />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const subTitle1 = screen.queryByText("Create Template");
    const emailTab = screen.queryByText("Email");
    const smsTab = screen.queryByText("Sms");
    const whatsappTab = screen.queryByText("WhatsApp");

    expect(subTitle1).toBeInTheDocument();
    expect(emailTab).toBeInTheDocument();
    expect(smsTab).toBeInTheDocument();
    expect(whatsappTab).toBeInTheDocument();
  });
});
