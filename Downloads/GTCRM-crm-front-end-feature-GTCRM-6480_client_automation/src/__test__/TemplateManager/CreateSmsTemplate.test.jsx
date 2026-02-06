import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import CreateSmsTemplate from "../../pages/TemplateManager/CreateSmsTemplate";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("CreateSmsTemplate component test", () => {
  test("Testing CreateSmsTemplate rendaring", () => {
    /*
        The purpose of this test :  
            1. In the ManageCommunicationTemplates component there is a button 'Create Templates' > 'SMS', 
            2. if user click on the sms button CreateSmsTemplates component will render having the text "Create SMS Template".
    */

    const { debug } = render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <CreateSmsTemplate currentTab={2} />
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
