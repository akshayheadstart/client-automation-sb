import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import UserMenuListItem from "../../components/ui/User-Access-Conreoll/UserMenuListItem";
// import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";

describe("User Acess Conreoll Unit test", () => {
  test("Testing ListItem rendaring correctlly", () => {
    /*
            The purpose of this test :  
                1. Testing if ListItem component rendaring correctlly
        */
    const nodeDatum = {
      name: "Permissions",
      id: 1,
      permissionName: "clientManagerMenu",
      menu: 1,
      userType: "client_manager",
      __rd3t: {
        id: "f1aab9e8-d445-42b6-8ec3-3816e074e06d",
        depth: 3,
        collapsed: true,
      },
    };

    const allPermission = [
      {
        user_type: "super_admin",
        permission: {
          add_client: true,
          delete_client: true,
          purge_client_data: true,
          add_client_manager: true,
          delete_client_manager: true,
          create_enquiry_form: false,
          update_enquiry_form: false,
          select_verification_type: false,
          add_college_super_admin: true,
          delete_college_super_admin: true,
          add_college_admin: false,
          delete_college_admin: false,
          add_college_head_counselor: false,
          delete_college_head_counselor: false,
          add_college_counselor: false,
          delete_college_counselor: false,
          add_college_publisher_console: false,
          delete_college_publisher_console: false,
        },
        menus: {
          dashboard: {
            admin_dashboard: false,
            traffic_dashboard: false,
            councellor_dashboard: false,
            brench_marking_dashboard: false,
            publisher_dashboard: false,
            trend_analysis: false,
            student_quality_index: false,
          },
          application_form: {
            in_app_call_logs: false,
          },
          lead_manager: {
            manage_applications: false,
            scoring: false,
            user_profile: false,
          },
          campaign_manager: {
            campaign_manager: false,
          },
          user_access_control: {
            user_manager: false,
            download_request_list: false,
            manage_sessions: false,
            user_activity: false,
            client_registration: true,
            create_user: true,
            user_permission: true,
          },
          form_desk: {
            document_listing: false,
            manage_form: false,
            manage_documents: false,
            manage_exams: false,
          },
          application_manager: {
            applications: false,
            manage_applications: false,
            communications_logs: false,
          },
          marketing: {
            marketing: false,
          },
          query_manager: {
            query_manager: false,
          },
          report_and_analytics: {
            reports: false,
          },
          template_manager: {
            create_template: false,
            manage_template: false,
            create_communication_template: false,
            manage_communication_template: false,
            automation: false,
            script_automation: true,
          },
          auth: {
            login: false,
          },
          setting: {
            setting: false,
          },
        },
      },
      {
        user_type: "client_manager",
        permission: {
          add_client: true,
          delete_client: true,
          purge_client_data: false,
          add_client_manager: true,
          delete_client_manager: true,
          create_enquiry_form: true,
          update_enquiry_form: false,
          select_verification_type: true,
          add_college_super_admin: true,
          delete_college_super_admin: true,
          add_college_admin: false,
          delete_college_admin: false,
          add_college_head_counselor: false,
          delete_college_head_counselor: false,
          add_college_counselor: false,
          delete_college_counselor: false,
          add_college_publisher_console: false,
          delete_college_publisher_console: false,
        },
        menus: {
          dashboard: {
            admin_dashboard: true,
            traffic_dashboard: true,
            councellor_dashboard: false,
            brench_marking_dashboard: true,
            publisher_dashboard: false,
            trend_analysis: true,
            student_quality_index: false,
          },
          application_form: {
            in_app_call_logs: false,
          },
          lead_manager: {
            manage_applications: false,
            scoring: false,
            user_profile: true,
          },
          campaign_manager: {
            campaign_manager: true,
          },
          user_access_control: {
            user_manager: true,
            download_request_list: true,
            manage_sessions: true,
            user_activity: true,
            client_registration: true,
            create_user: true,
          },
          form_desk: {
            document_listing: false,
            manage_form: false,
            manage_documents: false,
            manage_exams: false,
          },
          application_manager: {
            applications: false,
            manage_applications: false,
            communications_logs: false,
          },
          marketing: {
            marketing: true,
          },
          query_manager: {
            query_manager: true,
          },
          report_and_analytics: {
            reports: true,
          },
          template_manager: {
            create_template: true,
            manage_template: true,
            create_communication_template: true,
            manage_communication_template: true,
            automation: true,
            script_automation: true,
          },
          auth: {
            login: true,
          },
          setting: {
            setting: true,
          },
        },
      },
      {
        user_type: "college_super_admin",
        permission: {
          add_client: false,
          delete_client: false,
          purge_client_data: false,
          delete_client_manager: false,
          create_enquiry_form: false,
          update_enquiry_form: true,
          select_verification_type: false,
          add_college_super_admin: false,
          add_college_admin: true,
          add_college_counselor: true,
          add_college_head_counselor: true,
          delete_college_super_admin: false,
          delete_college_admin: true,
          delete_college_head_counselor: true,
          delete_college_counselor: true,
          delete_college_publisher_console: true,
          add_college_publisher_console: true,
          add_client_manager: false,
        },
        menus: {
          dashboard: {
            admin_dashboard: true,
            traffic_dashboard: false,
            councellor_dashboard: false,
            brench_marking_dashboard: false,
            publisher_dashboard: false,
            trend_analysis: false,
            student_quality_index: false,
          },
          application_form: {
            in_app_call_logs: true,
          },
          lead_manager: {
            manage_applications: true,
            scoring: false,
            user_profile: true,
          },
          campaign_manager: {
            campaign_manager: true,
          },
          user_access_control: {
            user_manager: true,
            download_request_list: true,
            manage_sessions: true,
            user_activity: true,
            client_registration: false,
            create_user: true,
            user_permission: false,
          },
          form_desk: {
            document_listing: true,
            manage_form: true,
            manage_documents: true,
            manage_exams: true,
          },
          application_manager: {
            applications: true,
            manage_applications: true,
            communications_logs: true,
          },
          marketing: {
            marketing: true,
          },
          query_manager: {
            query_manager: true,
          },
          report_and_analytics: {
            reports: true,
          },
          template_manager: {
            create_template: true,
            manage_template: true,
            create_communication_template: true,
            manage_communication_template: true,
            automation: true,
            script_automation: true,
          },
          auth: {
            login: true,
          },
          setting: {
            setting: true,
          },
        },
      },
      {
        user_type: "college_admin",
        permission: {
          add_client: false,
          delete_client: false,
          purge_client_data: false,
          delete_client_manager: false,
          create_enquiry_form: false,
          update_enquiry_form: false,
          select_verification_type: false,
          add_college_super_admin: false,
          add_college_admin: false,
          add_college_counselor: true,
          add_college_head_counselor: true,
          delete_college_super_admin: false,
          delete_college_admin: false,
          delete_college_head_counselor: true,
          delete_college_counselor: true,
          delete_college_publisher_console: true,
          add_college_publisher_console: true,
          add_client_manager: false,
        },
        menus: {
          dashboard: {
            admin_dashboard: true,
            traffic_dashboard: true,
            councellor_dashboard: false,
            brench_marking_dashboard: true,
            publisher_dashboard: false,
            trend_analysis: true,
            student_quality_index: true,
          },
          application_form: {
            in_app_call_logs: true,
          },
          lead_manager: {
            manage_applications: true,
            scoring: true,
            user_profile: true,
          },
          campaign_manager: {
            campaign_manager: true,
          },
          user_access_control: {
            user_manager: true,
            download_request_list: true,
            manage_sessions: true,
            user_activity: true,
            client_registration: true,
            create_user: true,
          },
          form_desk: {
            document_listing: true,
            manage_form: true,
            manage_documents: true,
            manage_exams: true,
          },
          application_manager: {
            applications: true,
            manage_applications: true,
            communications_logs: true,
          },
          marketing: {
            marketing: true,
          },
          query_manager: {
            query_manager: true,
          },
          report_and_analytics: {
            reports: true,
          },
          template_manager: {
            create_template: true,
            manage_template: true,
            create_communication_template: true,
            manage_communication_template: true,
            automation: true,
            script_automation: true,
          },
          auth: {
            login: true,
          },
          setting: {
            setting: true,
          },
        },
      },
      {
        user_type: "college_head_counselor",
        permission: {
          add_client: false,
          delete_client: false,
          purge_client_data: false,
          delete_client_manager: false,
          create_enquiry_form: false,
          update_enquiry_form: false,
          select_verification_type: false,
          add_college_super_admin: false,
          add_college_admin: false,
          add_college_counselor: true,
          add_college_head_counselor: false,
          delete_college_super_admin: false,
          delete_college_admin: false,
          delete_college_head_counselor: false,
          delete_college_counselor: true,
          delete_college_publisher_console: true,
          add_college_publisher_console: true,
          add_client_manager: false,
        },
        menus: {
          dashboard: {
            admin_dashboard: false,
            traffic_dashboard: false,
            councellor_dashboard: true,
            brench_marking_dashboard: false,
            publisher_dashboard: false,
            trend_analysis: false,
            student_quality_index: false,
          },
          application_form: {
            in_app_call_logs: false,
          },
          lead_manager: {
            manage_applications: true,
            scoring: false,
            user_profile: true,
          },
          campaign_manager: {
            campaign_manager: false,
          },
          user_access_control: {
            user_manager: false,
            download_request_list: false,
            manage_sessions: false,
            user_activity: false,
            client_registration: false,
            create_user: false,
            user_permission: false,
          },
          form_desk: {
            document_listing: false,
            manage_form: false,
            manage_documents: false,
            manage_exams: false,
          },
          application_manager: {
            applications: false,
            manage_applications: false,
            communications_logs: false,
          },
          marketing: {
            marketing: false,
          },
          query_manager: {
            query_manager: false,
          },
          report_and_analytics: {
            reports: false,
          },
          template_manager: {
            create_template: false,
            manage_template: false,
            create_communication_template: false,
            manage_communication_template: false,
            automation: false,
            script_automation: false,
          },
          auth: {
            login: false,
          },
          setting: {
            setting: false,
          },
        },
      },
      {
        user_type: "college_counselor",
        permission: {
          add_client: false,
          delete_client: false,
          purge_client_data: false,
          delete_client_manager: false,
          create_enquiry_form: false,
          update_enquiry_form: false,
          select_verification_type: false,
          add_college_super_admin: false,
          add_college_admin: false,
          add_college_counselor: false,
          add_college_head_counselor: false,
          delete_college_super_admin: false,
          delete_college_admin: false,
          delete_college_head_counselor: false,
          delete_college_counselor: false,
          delete_college_publisher_console: true,
          add_college_publisher_console: true,
          add_client_manager: false,
        },
        menus: {
          dashboard: {
            admin_dashboard: false,
            traffic_dashboard: false,
            councellor_dashboard: true,
            brench_marking_dashboard: false,
            publisher_dashboard: false,
            trend_analysis: false,
            student_quality_index: false,
          },
          application_form: {
            in_app_call_logs: false,
          },
          lead_manager: {
            manage_applications: true,
            scoring: false,
            user_profile: true,
          },
          campaign_manager: {
            campaign_manager: false,
          },
          user_access_control: {
            user_manager: false,
            download_request_list: false,
            manage_sessions: false,
            user_activity: false,
            client_registration: false,
            create_user: false,
            user_permission: false,
          },
          form_desk: {
            document_listing: false,
            manage_form: false,
            manage_documents: false,
            manage_exams: false,
          },
          application_manager: {
            applications: false,
            manage_applications: false,
            communications_logs: false,
          },
          marketing: {
            marketing: false,
          },
          query_manager: {
            query_manager: false,
          },
          report_and_analytics: {
            reports: false,
          },
          template_manager: {
            create_template: false,
            manage_template: false,
            create_communication_template: false,
            manage_communication_template: false,
            automation: false,
            script_automation: false,
          },
          auth: {
            login: false,
          },
          setting: {
            setting: false,
          },
        },
      },
      {
        user_type: "college_publisher_console",
        permission: {
          add_client: false,
          delete_client: false,
          purge_client_data: false,
          delete_client_manager: false,
          create_enquiry_form: false,
          update_enquiry_form: false,
          select_verification_type: false,
          add_college_super_admin: false,
          add_college_admin: false,
          add_college_counselor: false,
          add_college_head_counselor: false,
          delete_college_super_admin: false,
          delete_college_admin: false,
          delete_college_head_counselor: false,
          delete_college_counselor: false,
          delete_college_publisher_console: false,
          add_college_publisher_console: false,
          add_client_manager: false,
        },
        menus: {
          dashboard: {
            admin_dashboard: false,
            traffic_dashboard: false,
            councellor_dashboard: false,
            brench_marking_dashboard: false,
            publisher_dashboard: true,
            trend_analysis: false,
            student_quality_index: false,
          },
          application_form: {
            in_app_call_logs: false,
          },
          lead_manager: {
            manage_applications: false,
            scoring: false,
            user_profile: false,
          },
          campaign_manager: {
            campaign_manager: false,
          },
          user_access_control: {
            user_manager: false,
            download_request_list: false,
            manage_sessions: false,
            user_activity: false,
            client_registration: false,
            create_user: false,
            user_permission: false,
          },
          form_desk: {
            document_listing: false,
            manage_form: false,
            manage_documents: false,
            manage_exams: false,
          },
          application_manager: {
            applications: false,
            manage_applications: false,
            communications_logs: false,
          },
          marketing: {
            marketing: false,
          },
          query_manager: {
            query_manager: false,
          },
          report_and_analytics: {
            reports: false,
          },
          template_manager: {
            create_template: false,
            manage_template: false,
            create_communication_template: false,
            manage_communication_template: false,
            automation: false,
            script_automation: false,
          },
          auth: {
            login: false,
          },
          setting: {
            setting: false,
          },
        },
      },
      {
        user_type: "string",
        permission: {
          add_client: false,
          delete_client: false,
          purge_client_data: false,
        },
        menus: null,
      },
    ];
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <UserMenuListItem
              nodeDatum={nodeDatum}
              allPermission={allPermission}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    const DashBoard = screen.queryByText("dashboard");
    const admin_dashboard = screen.queryByText("admin_dashboard");
    const traffic_dashboard = screen.queryByText("traffic_dashboard");
    const leadManager = screen.queryByText("lead_manager");
    const userAccessControll = screen.queryByText("user_access_control");
    const formDesk = screen.queryByText("form_desk");

    expect(DashBoard).toBeInTheDocument();
    expect(admin_dashboard).toBeInTheDocument();
    expect(traffic_dashboard).toBeInTheDocument();
    expect(leadManager).toBeInTheDocument();
    expect(userAccessControll).toBeInTheDocument();
    expect(formDesk).toBeInTheDocument();
  });
});
