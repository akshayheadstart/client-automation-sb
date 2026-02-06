import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import RawDataUploadHistory from "../../pages/Query_Manager/RawDataUploadHistory";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import LeadProcessTable from "../../pages/ApplicationManager/LeadProcess/LeadProcessTable";
import { expect } from "vitest";

describe("LeadProcessedTable Component Test", () => {
  const tableDetails = [
    {
      imported_by: "Admin",
      raw_data_mandatory_field: {
        email: "example@gmail.com",
        mobile_number: 2323232323,
      },
    },
  ];
  test("Show the content for LeadProcessedTable Component", () => {
    /*
           Purpose of this test :
               1. Rendering user LeadProcessedTable component and expecting the heading and details of the table is showing in the UI or not.
               2. If the details is showing as expected, the test case will pass.
       */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <LeadProcessTable
                tableDetails={tableDetails}
                extraTableHeader={[]}
              ></LeadProcessTable>
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Imported By")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("example@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("2323232323")).toBeInTheDocument();
  });
});
