import { fireEvent, render, screen } from "@testing-library/react";
import MockTheme from "../MockTheme";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import SidebarV2 from "../../components/navigations/sidebar/SidebarV2";
// Route testing starts from here

// dummy data of api call
const permissions = {
  menus: {
    dashboard: {
      admin_dashboard: { menu: true },
      traffic_dashboard: { menu: true },
      publisher_dashboard: { menu: true },
      counselor_dashboard: { menu: true },
      brench_marking_dashboard: { menu: true },
      trend_analysis: { menu: true },
      student_quality_index: { menu: true },
    },
    communication: {
      in_app_call_logs: { menu: true },
      communication_performance: { menu: true },
    },
    lead_manager: {
      lead_upload: { menu: true },
      scoring: { menu: true },
      manage_leads: { menu: true },
      view_all_forms: { menu: true },
      create_lead: { menu: true },
    },
    campaign_manager: {
      campaign_manager: { menu: true },
      event_mapping: { menu: true },
    },
    user_access_control: {
      user_manager: { menu: true },
      download_request_list: { menu: true },
      manage_sessions: { menu: true },
      user_activity: { menu: true },
      client_registration: { menu: true },
      counsellor_manager: { menu: true },
      create_user: { menu: true },
      user_permission: { menu: true },
    },
    form_desk: {
      document_listing: { menu: true },
      manage_form: { menu: true },
      manage_documents: { menu: true },
      manage_exams: { menu: true },
    },
    application_manager: {
      manage_applications: { menu: true },
      paid_applications: { menu: true },
    },
    query_manager: {
      query_manager: { menu: true },
    },
    template_manager: {
      create_template: { menu: true },
      manage_communication_template: { menu: true },
      automation: true,
    },
    setting: {
      setting: { menu: true },
    },
    report_and_analytics: {
      reports: { menu: true },
    },
    marketing: {
      marketing: { menu: true },
    },
    automation: {
      automation_beta: true,
      automation_details: { menu: true },
    },
    features: {
      features: { menu: true },
    },
  },
};

// This is a common function to render Navbar component
const renderSidebar = (history) => {
  render(
    <Provider store={store}>
      <Router location={history.location.pathname} navigator={history}>
        <DashboardDataProvider>
          <LayoutSettingProvider>
            <MockTheme>
              <SidebarV2
                permissions={permissions}
                open={true}
                fixed={true}
                width={200}
                isActionDisable={false}
              />
            </MockTheme>
          </LayoutSettingProvider>
        </DashboardDataProvider>
      </Router>
    </Provider>
  );
};

describe("Testing all the route of Navigation bar", () => {
  test("Testing admin dashboard route", () => {
    /*
			The purpose of this test :  
				1. in the navbar there has a link name "Admin Dashboard", 
				2. once the user will click on that link he will go to the homepage (/) route
		*/

    const history = createMemoryHistory();
    renderSidebar(history);
    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Dashboard");

    fireEvent.click(mainMenu);

    const adminDashboardLink = screen.queryByRole("link", {
      name: "Admin Dashboard",
    });
    fireEvent.click(adminDashboardLink);
    expect(history.location.pathname).toBe("/");
  });

  test("Testing traffic-dashboard route", () => {
    /*
			The purpose of this test :
				1. in the navbar there has a link name "Traffic Dashboard",
				2. once the user will click on that link he will go to the "/traffic-dashboard" route
		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Dashboard");

    fireEvent.click(mainMenu);

    const trafficDashboardLink = screen.queryByRole("link", {
      name: "Traffic Dashboard",
    });
    fireEvent.click(trafficDashboardLink);
    expect(history.location.pathname).toBe("/traffic-dashboard");
  });

  test("Testing trends analysis route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Trends Analysis",
  				2. once the user will click on that link he will go to the "/trend-analysis" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Dashboard");

    fireEvent.click(mainMenu);

    const trendAnalysisLink = screen.queryByRole("link", {
      name: "Trend Analysis",
    });

    fireEvent.click(trendAnalysisLink);
    expect(history.location.pathname).toBe("/trend-analysis");
  });

  test("Testing Student Quality Index route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Student Quality Index",
  				2. once the user will click on that link he will go to the "/student-quality-index" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Dashboard");
    fireEvent.click(mainMenu);

    const studentQualityIndexLink = screen.queryByRole("link", {
      name: "Student Quality Index",
    });

    fireEvent.click(studentQualityIndexLink);
    expect(history.location.pathname).toBe("/student-quality-index");
  });

  test("Testing Benchmarking Dashboard route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Benchmarking Dashboard",
  				2. once the user will click on that link he will go to the "/benchmarking-dashboard" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Dashboard");
    fireEvent.click(mainMenu);

    const benchMakingDashboardLink = screen.queryByRole("link", {
      name: "Benchmarking Dashboard",
    });
    fireEvent.click(benchMakingDashboardLink);
    expect(history.location.pathname).toBe("/benchmarking-dashboard");
  });

  test("Testing Counsellor Dashboard route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Counsellor Dashboard",
  				2. once the user will click on that link he will go to the "/counselor-dashboard" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Dashboard");
    fireEvent.click(mainMenu);

    const counsellorDashboardLink = screen.queryByRole("link", {
      name: "Counsellor Dashboard",
    });

    fireEvent.click(counsellorDashboardLink);
    expect(history.location.pathname).toBe("/counselor-dashboard");
  });
  test("Testing Publisher Dashboard route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Publisher Dashboard",
  				2. once the user will click on that link he will go to the "/publisher-dashboard" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Dashboard");
    fireEvent.click(mainMenu);

    const counsellorDashboardLink = screen.queryByRole("link", {
      name: "Publisher Dashboard",
    });

    fireEvent.click(counsellorDashboardLink);
    expect(history.location.pathname).toBe("/publisher-dashboard");
  });

  test("Testing Document listing route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Document Listing",
  				2. once the user will click on that link he will go to the "/form-manager" route

  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Form Desk");
    fireEvent.click(mainMenu);

    const documentListingLink = screen.queryByRole("link", {
      name: "Document Listing",
    });

    fireEvent.click(documentListingLink);
    expect(history.location.pathname).toBe("/form-manager");
  });

  test("Testing Manage Forms route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Manage Forms",
  				2. once the user will click on that link he will go to the "/manage-forms" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Form Desk");
    fireEvent.click(mainMenu);

    const manageFormsLink = screen.queryByRole("link", {
      name: "Manage Forms",
    });

    fireEvent.click(manageFormsLink);
    expect(history.location.pathname).toBe("/manage-forms");
  });

  test("Testing Manage Documents route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Manage Documents",
  				2  once the user will click on that link he will go to the "/manage-documents" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Form Desk");
    fireEvent.click(mainMenu);

    const manageDocumentsLink = screen.queryByRole("link", {
      name: "Manage Documents",
    });

    fireEvent.click(manageDocumentsLink);
    expect(history.location.pathname).toBe("/manage-documents");
  });

  test("Testing Manage Exam route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Manage Exam",
  				2. once the user will click on that link he will go to the "/manage-exam" route

  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Form Desk");
    fireEvent.click(mainMenu);

    const manageExamLink = screen.queryByRole("link", {
      name: "Manage Exam",
    });

    fireEvent.click(manageExamLink);
    expect(history.location.pathname).toBe("/manage-exam");
  });

  test("Testing Scoring route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Scoring",
  				2. once the user will click on that link he will go to the "/scoring" route

  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    const mainMenu = screen.getByText("Lead Manager");
    fireEvent.click(mainMenu);

    expect(history.location.pathname).toBe("/");
    const scoringLink = screen.queryByRole("link", {
      name: "Scoring",
    });

    fireEvent.click(scoringLink);
    expect(history.location.pathname).toBe("/scoring");
  });

  test("Testing in app call logs route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "In-App Call Logs",
  				3. once the user will click on that link he will go to the "/in-app-call-logs" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const mainMenu = screen.getByText("Communication");
    fireEvent.click(mainMenu);

    const appCallLogLink = screen.queryByRole("link", {
      name: "In-App Call Logs",
    });
    fireEvent.click(appCallLogLink);
    expect(history.location.pathname).toBe("/in-app-call-logs");
  });
  test("Testing Communication performance route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "In-App Call Logs",
  				3. once the user will click on that link he will go to the "/communicationPerformance" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const mainMenu = screen.getByText("Communication");
    fireEvent.click(mainMenu);

    const appCallLogLink = screen.queryByRole("link", {
      name: "Communication Performance",
    });
    fireEvent.click(appCallLogLink);
    expect(history.location.pathname).toBe("/communicationPerformance");
  });

  test("Testing Campaign Manager route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "Campaign manager",
  				3. once the user will click on that link he will go to the "/campaign-manager" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Campaign Manager");
    fireEvent.click(mainMenu);

    const linkItem = screen.queryByRole("link", { name: /Campaign manager/i });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/campaign-manager");
  });

  test("Testing Event mapping route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "Campaign manager",
  				3. once the user will click on that link he will go to the "/event-mapping" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Campaign Manager");
    fireEvent.click(mainMenu);

    const linkItem = screen.queryByRole("link", { name: /Event Mapping/i });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/event-mapping");
  });

  test("Testing User Manager route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "User manager",
  				3. once the user will click on that link he will go to the "/users/user-manager" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("User Access Control");
    fireEvent.click(mainMenu);

    const linkItem = screen.queryByRole("link", { name: /user manager/i });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/users/user-manager");
  });

  test("Testing download request list route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "Download request list",
  				3. once the user will click on that link he will go to the "/reports/download-request-list" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const mainMenu = screen.getByText("User Access Control");
    fireEvent.click(mainMenu);
    const linkItem = screen.queryByRole("link", {
      name: /download request list/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/reports/download-request-list");
  });

  test("Testing manage sessions route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "Manage sessions",
  				3. once the user will click on that link he will go to the "/users/manage-sessions" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const mainMenu = screen.getByText("User Access Control");
    fireEvent.click(mainMenu);
    const linkItem = screen.queryByRole("link", {
      name: /manage sessions/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/users/manage-sessions");
  });

  test("Testing user activity route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "Users activity",
  				3. once the user will click on that link he will go to the "/users/activity" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const mainMenu = screen.getByText("User Access Control");
    fireEvent.click(mainMenu);
    const linkItem = screen.queryByRole("link", {
      name: /users activity/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/users/activity");
  });

  test("Testing client registration route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "Client registration",
  				3. once the user will click on that link he will go to the "/client-registration" route
  		 */

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const mainMenu = screen.getByText("User Access Control");
    fireEvent.click(mainMenu);
    const linkItem = screen.queryByRole("link", {
      name: /client registration/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/client-registration");
  });
  test("Testing Create user route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "Create user",
  				3. once the user will click on that link he will go to the "/create-user" route
  		 */

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const mainMenu = screen.getByText("User Access Control");
    fireEvent.click(mainMenu);
    const linkItem = screen.queryByRole("link", {
      name: /Create User/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/create-user");
  });

  test("Testing User Permissions route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "User Permissions",
  				3. once the user will click on that link he will go to the "/user-permission" route
  		 */

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const mainMenu = screen.getByText("User Access Control");
    fireEvent.click(mainMenu);
    const linkItem = screen.queryByRole("link", {
      name: /User Permissions/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/user-permission");
  });
  test("Testing Features route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "Features",
  				3. once the user will click on that link he will go to the "/features" route
  		 */

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const mainMenu = screen.getByText("User Access Control");
    fireEvent.click(mainMenu);
    const linkItem = screen.queryByRole("link", {
      name: /Features/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/features");
  });

  test("Testing marketing route", () => {
    /*
  		The purpose of this test :
  			1. in the navbar there has a link name "Others",
  			2. once user will hover here then there will open a dialog with containing a link name "Marketing",
  			3. once the user will click on that link he will go to the "/marketing" route

  	 */

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Marketing");
    fireEvent.click(mainMenu);
    const linkItem = screen.queryByRole("link", {
      name: /marketing/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/marketing");
  });

  test("Testing applications route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "Applications",
  				3. once the user will click on that link he will go to the "/applications" route
  		 */

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const mainMenu = screen.getByText("Application Manager");
    fireEvent.click(mainMenu);

    const linkItem = screen.queryByRole("link", {
      name: "Paid Applications",
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/paid-applications");
  });

  test("Testing manage applications route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "Manage applications",
  				3. once the user will click on that link he will go to the "/application-manager" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const mainMenu = screen.getByText("Application Manager");
    fireEvent.click(mainMenu);
    const linkItem = screen.queryByRole("link", {
      name: /view all applications/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/application-manager");
  });

  test("Testing query manager route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others",
  				2. once user will hover here then there will open a dialog with containing a link name "Query manager",
  				3. once the user will click on that link he will go to the "/query-manager" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const queryManager = screen.queryByText("Query manager");
    fireEvent.click(queryManager);
    const linkItem = screen.queryByRole("link", {
      name: /Query manager/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/query-manager");
  });

  test("Testing reports route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others"
  				2. once user will hover here then there will open a dialog with containing a link name "Reports", 3. once the user will click on that link he will go to the "/reports" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const reports = screen.queryByText("Reports & Analytics");
    fireEvent.click(reports);
    const linkItem = screen.queryByRole("link", {
      name: /Reports/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/reports-analytics");
  });

  test("Testing create template route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others"
  				2. once user will hover here then there will open a dialog with containing a link name "Create widget".
  				3 once the user will click on that link he will go to the "/widget" route
  		 */

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const templateManager = screen.queryByText("Template Manager");
    fireEvent.click(templateManager);
    const linkItem = screen.queryByRole("link", {
      name: /create widget/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/widget");
  });

  test("Testing manage communication template route", () => {
    /*
  			The purpose of this test :
  				1. in the navbar there has a link name "Others"
  				2. once user will hover here then there will open a dialog with containing a link name "Manage communication template"
  				3 once the user will click on that link he will go to the "/manage-communication-template" route
  		*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const templateManager = screen.queryByText("Template Manager");
    fireEvent.click(templateManager);
    const linkItem = screen.queryByRole("link", {
      name: /Template Manager/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/manage-communication-template");
  });

  test("Testing automation route", () => {
    /*
  			The purpose of this test :
  				 1. in the navbar there has a link name "Others"
  				 2. once user will hover here then there will open a dialog with containing a link name "Automation".
  				 3. once the user will click on that link he will go to the "/automation" route
  		*/
    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const automation = screen.queryByText("Automation");
    fireEvent.click(automation);
    const linkItem = screen.queryByRole("link", {
      name: /automation manager/i,
    });
    fireEvent.click(linkItem);
    expect(history.location.pathname).toBe("/automation-manager");
  });

  test("Testing /users/user-manager route", () => {
    /*
		Purpose of this test :
			1. Rendering QuicSnapshot component where there has a link name college user
			2. Checking One usr click on that link he will go to /users/user-manager route
	*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");
    const accessControl = screen.queryByText("User Access Control");
    fireEvent.click(accessControl);
    const linkItem = screen.queryByRole("link", {
      name: /user manager/i,
    });
    fireEvent.click(linkItem);

    expect(history.location.pathname).toBe("/users/user-manager");
  });

  test("Testing settings route", () => {
    /*
  		The purpose of this test :
  			1. In the sidebar component there has a option name "Setting"
  			2. Once user will click on the report and analytics then it will expand and another option with the name "setting" will open.
  			3. Then if user click on that "reports" option he will go to the "/settings" route
  	*/

    const history = createMemoryHistory();
    renderSidebar(history);

    expect(history.location.pathname).toBe("/");

    const settingsLink = screen.queryByTestId("sidebar-setting");

    fireEvent.click(settingsLink);
    const setting = screen.queryAllByText("Setting");
    fireEvent.click(setting[1]);

    expect(history.location.pathname).toBe("/settings");
  });
});
// Route testing ends here
