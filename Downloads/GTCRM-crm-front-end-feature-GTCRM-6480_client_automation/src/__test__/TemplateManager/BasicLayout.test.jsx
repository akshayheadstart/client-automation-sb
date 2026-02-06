import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Masonaries from "../../components/ui/template-manager/Masonaries";
import BasicLayout from "../../pages/TemplateManager/BasicLayout";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("Test Basic Layout Page", () => {
  test("Basic Layout Tabs layout check", () => {
    /*
           Purpose :
               1. Checking that Basic Layout Tabs are working or not 
        */
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <BasicLayout></BasicLayout>
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const allTemplatesTab = screen.queryByTestId("all-template-tab");
    const yourTemplatesTab = screen.queryByTestId("your-template-tab");
    const draftTemplatesBTab = screen.queryByTestId("draft-template-tab");

    fireEvent.click(allTemplatesTab);
    expect(allTemplatesTab).toHaveAttribute("tabindex", "0");
    expect(yourTemplatesTab).toHaveAttribute("tabindex", "-1");
    expect(draftTemplatesBTab).toHaveAttribute("tabindex", "-1");

    fireEvent.click(yourTemplatesTab);
    expect(allTemplatesTab).toHaveAttribute("tabindex", "-1");
    expect(yourTemplatesTab).toHaveAttribute("tabindex", "0");
    expect(draftTemplatesBTab).toHaveAttribute("tabindex", "-1");

    fireEvent.click(draftTemplatesBTab);
    expect(allTemplatesTab).toHaveAttribute("tabindex", "-1");
    expect(yourTemplatesTab).toHaveAttribute("tabindex", "-1");
    expect(draftTemplatesBTab).toHaveAttribute("tabindex", "0");
  });

  test("Basic Layout, masonaries section rendering check", () => {
    /*
           Purpose :
               1. Checking that Basic Layout masonaries section is working or not 
        */
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <Masonaries
              internalServerError={false}
              hideTemplates={false}
              somethingWentWrong={false}
              loading={false}
              allTemplate={[""]}
              handleOpenDeleteModal={() => {}}
              setSubjectOfEmail={undefined}
            ></Masonaries>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const templateScreen = screen.queryByTestId("massonaries-per-div");
    fireEvent.mouseOver(templateScreen);
    expect(
      screen.getByRole("button", { name: "Delete Template" })
    ).toBeInTheDocument();
  });
});
