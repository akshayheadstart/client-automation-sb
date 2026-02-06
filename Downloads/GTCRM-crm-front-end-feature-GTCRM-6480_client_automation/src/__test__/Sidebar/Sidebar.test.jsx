import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import SidebarV2 from "../../components/navigations/sidebar/SidebarV2";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";
import MockTheme from "../MockTheme";

describe("Sidebar component test", () => {
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
        manage_communication_template: true,
        automation: true,
      },
      setting: {
        setting: { menu: true },
      },
      report_and_analytics: {
        reports: true,
      },
      marketing: {
        marketing: { menu: true },
      },
      automation: {
        automation_beta: true,
        automation_details: true,
      },
      features: {
        features: { menu: true },
      },
    },
  };

  test("click dashboard show the items", () => {
    /*
            The purpose of this test :
              1. in the sidebar there has an option name "Dashboard", 
              2. when user will click on that option then it will expand and "Admin dashboard" (child option) will be visible. 
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <SidebarV2
                  permissions={permissions}
                  open={true}
                  onClose={vi.fn()}
                  fixed={true}
                  width={200}
                />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );

    const sidebarDashboard = screen.queryByTestId("sidebar-dashboard");
    fireEvent.click(sidebarDashboard);
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  test("click Application-forms show the items", () => {
    /*
            The purpose of this test : 
              1. in the sidebar there has an option name "Application Forms", 
              2. when user will click on that option then it will expand and "In-App Call Logs" (child option) will be visible. 
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <SidebarV2
                  permissions={permissions}
                  open={true}
                  onClose={vi.fn()}
                  fixed={true}
                  width={200}
                />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );
    const sidebarApplicationForm = screen.queryByTestId(
      "sidebar-application-forms"
    );
    fireEvent.click(sidebarApplicationForm);
    expect(screen.getByText("In-App Call Logs")).toBeInTheDocument();
  });

  test("click Lead manager show the items", () => {
    /*
            The purpose of this test : 
                1. in the sidebar there has an option name "Lead Manager", 
                2. when user will click on that option then it will expand and "Manage Applications" (child option) will be visible. 
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <SidebarV2
                  permissions={permissions}
                  open={true}
                  onClose={vi.fn()}
                  fixed={true}
                  width={200}
                />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );
    const sidebarLeadManager = screen.queryByTestId("sidebar-lead-manager");
    fireEvent.click(sidebarLeadManager);
    expect(screen.getByText("View All Forms")).toBeInTheDocument();
    expect(screen.getByText(/View All Leads/)).toBeInTheDocument();
  });

  test("click Campaign manager show the items", () => {
    /*
             The purpose of this test : 
                 1. in the sidebar there has an option name "Campaign Manager", 
                 2. when user will click on that option then it will expand and "Campaign Manager" (child option) will be visible. 
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <SidebarV2
                  permissions={permissions}
                  open={true}
                  onClose={vi.fn()}
                  fixed={true}
                  width={200}
                />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );
    const sidebarCampaignManager = screen.queryByTestId(
      "sidebar-campaign-manger"
    );
    expect(screen.getAllByText("Campaign Manager")).toHaveLength(1);
    fireEvent.click(sidebarCampaignManager);
    expect(screen.getAllByText("Campaign Manager")).toHaveLength(2);
  });

  test("click User access control show the items", () => {
    /*
           The purpose of this test : 
               1. in the sidebar there has an option name "User Access Control", 
               2. when user will click on that option then it will expand and "User Manager" (child option) will be visible.
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <SidebarV2
                  permissions={permissions}
                  open={true}
                  onClose={vi.fn()}
                  fixed={true}
                  width={200}
                />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );
    const sidebarUserAccessControl = screen.queryByTestId(
      "sidebar-user-access-control"
    );
    fireEvent.click(sidebarUserAccessControl);
    expect(screen.getByText("User Manager")).toBeInTheDocument();
    expect(screen.getByText("Download Request List")).toBeInTheDocument();
    expect(screen.getByText("Manage Sessions")).toBeInTheDocument();
    expect(screen.getByText("User Manager")).toBeInTheDocument();
    expect(screen.getByText("User Manager")).toBeInTheDocument();
  });

  test("click Form desk show the items", () => {
    /*
           The purpose of this test : 
               1. in the sidebar there has an option name "Form Desk", 
               2. when user will click on that option then it will expand and "Document Listing" (child option) will be visible.
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <SidebarV2
                  permissions={permissions}
                  open={true}
                  onClose={vi.fn()}
                  fixed={true}
                  width={200}
                />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );
    const sidebarFormDesk = screen.queryByTestId("sidebar-form-desk");
    fireEvent.click(sidebarFormDesk);
    expect(screen.getByText("Document Listing")).toBeInTheDocument();
    expect(screen.getByText("Manage Exam")).toBeInTheDocument();
  });

  test("click Query manager show the items", () => {
    /*
             The purpose of this test : 
                 1. in the sidebar there has an option name "Query manager", 
                 2. when user will click on that option then it will expand and "Query manager" (child option) will be visible.
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <SidebarV2
                  permissions={permissions}
                  open={true}
                  onClose={vi.fn()}
                  fixed={true}
                  width={200}
                />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );
    const sidebarQueryManager = screen.queryByTestId("sidebar-query-manager");
    fireEvent.click(sidebarQueryManager);
    expect(
      screen.getByTestId("sidebar-query-manager-item")
    ).toBeInTheDocument();
  });

  test("click Template manager show the items", () => {
    /* 
            The purpose of this test : 
                1. in the sidebar there has an option name "Template Manager", 
                2. when user will click on that option then it will expand and "Create Template" (child option) will be visible.
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <SidebarV2
                  permissions={permissions}
                  open={true}
                  onClose={vi.fn()}
                  fixed={true}
                  width={200}
                />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );
    const sidebarTemplateManager = screen.queryByTestId(
      "sidebar-template-manager"
    );
    fireEvent.click(sidebarTemplateManager);
    expect(screen.getByText(/Create Widget/i)).toBeInTheDocument();
  });

  test("click setting show the items", () => {
    /*
              The purpose of this test : 
                  1. in the sidebar there has an option name "Setting", 
                  2. when user will click on that option then it will expand and "Setting" (child option) will be visible.
        */

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MockTheme>
            <DashboardDataProvider>
              <LayoutSettingProvider>
                <SidebarV2
                  permissions={permissions}
                  open={true}
                  onClose={vi.fn()}
                  fixed={true}
                  width={200}
                />
              </LayoutSettingProvider>
            </DashboardDataProvider>
          </MockTheme>
        </MemoryRouter>
      </Provider>
    );
    const sidebarSetting = screen.queryByTestId("sidebar-setting");
    fireEvent.click(sidebarSetting);
    expect(screen.getByTestId("sidebar-setting-item")).toBeInTheDocument();
  });
});
