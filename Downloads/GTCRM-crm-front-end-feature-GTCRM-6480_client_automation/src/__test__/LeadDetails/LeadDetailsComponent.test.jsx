import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import LeadDetails from "../../components/userProfile/LeadDetails";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

const userProfileLeadsDetails = {
  lead_details: {
    alternative_mobile: "",
    application_stage: "completed",
    city: "Basar",
    course_name: "BTech in Computer Science and Engineering",
    email: "abid43iiuc@gmail.com",
    mobile: 1775971698,
    name: "Abidur Rahman Chowdhury",
    note: "no answer",
    programing_level: "Under Graduate",
    scholarship: "NA",
    state: "Arunachal Pradesh",
  },
};

describe("Testing lead details component", () => {
  test("Testing LeadDetails component when data is given", () => {
    /*
            Purpose of this test :
                1. Rendering leadDetails component with lead data
                2. Checking if the given data is showing in the UI or not
                3. If data is showing then test will pass if not then it will fail
         */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <LeadDetails userProfileLeadsDetails={userProfileLeadsDetails} />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const leadDetails = screen.queryByText(/merge lead/i);
    const userEmail = screen.queryByText("abid43iiuc@gmail.com");

    expect(leadDetails).toBeInTheDocument();
    expect(userEmail).toBeInTheDocument();
  });

  test("Testing lead details component when internal server error comes", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <LeadDetails leadDetailsInternalServerError={true} />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const internalServerErrorAnimation = screen.queryByTestId(
      "internal-server-error-animation"
    );

    expect(internalServerErrorAnimation).toBeInTheDocument();
  });
});
