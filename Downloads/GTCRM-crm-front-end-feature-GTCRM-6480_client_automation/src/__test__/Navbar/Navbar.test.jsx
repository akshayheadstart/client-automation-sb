import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../components/navigations/navbar/Navbar";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import MockTheme from "../MockTheme";

describe("Navbar component test", () => {
    test("profile modal content show", () => {

        /*
           The purpose of this test :
               1. in the navbar there has an icon in the top right corner, 
               2. when user will click on that icon then a modal including content "Add another account", "Settings" will be visible.
        */

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <MockTheme>
                        <DashboardDataProvider>
                            <LayoutSettingProvider>
                                    <Navbar />
                            </LayoutSettingProvider>
                        </DashboardDataProvider>
                    </MockTheme>
                </MemoryRouter>
            </Provider>
        );
        const profileIcon = screen.queryByTestId("profile-icon");
        fireEvent.click(profileIcon);
        expect(screen.getByText(/Add another account/i)).toBeInTheDocument();
        expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    });

    test("Add another account Button click and open a modal to add a account", () => {

        /* 
           The purpose of this test :
              1. in the navbar profile, there will be a button to "Add another account"
              2  when user will click on "Add another account" then a modal having the content "Add Account" should be visible.
        */

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <MockTheme>
                        <DashboardDataProvider>
                            <LayoutSettingProvider>
                                    <Navbar />
                            </LayoutSettingProvider>
                        </DashboardDataProvider>
                    </MockTheme>
                </MemoryRouter>
            </Provider>
        );
        const profileIcon = screen.queryByTestId("profile-icon");
        fireEvent.click(profileIcon);
        expect(screen.getByText(/Add another account/i)).toBeInTheDocument();
        const addAccount = screen.getByText(/Add another account/i);
        fireEvent.click(addAccount);
        expect(screen.getByText(/Add account/i)).toBeInTheDocument();

        const enterUserId = screen.queryByText("Enter user ID");
        const enterPasswordId = screen.queryByText("Enter password");
        const addButton = screen.queryByRole("button", { name: /ADD/i })

        expect(enterUserId).toBeInTheDocument();
        expect(enterPasswordId).toBeInTheDocument();
        expect(addButton).toBeInTheDocument();
    });

    test("Notification modal content show", () => {

        /* 
           The purpose of this test :
              1. In the navbar profile, there will be a notification icon
              2  When user will click on notification icon then a modal having the content Notifications and Mark all as read should be visible.
        */

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <MockTheme>
                        <DashboardDataProvider>
                            <LayoutSettingProvider>
                                    <Navbar />
                            </LayoutSettingProvider>
                        </DashboardDataProvider>
                    </MockTheme>
                </MemoryRouter>
            </Provider>
        );
        const notificationIcon = screen.queryByTestId("notification-icon");
        fireEvent.click(notificationIcon);
        expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
    });
});
