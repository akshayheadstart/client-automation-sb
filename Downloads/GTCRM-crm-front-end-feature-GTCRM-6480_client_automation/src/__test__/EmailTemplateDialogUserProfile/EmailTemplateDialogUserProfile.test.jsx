import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import EmailTemplateDialogUserProfile from "../../components/EmailTemplateDialogUserProfile/EmailTemplateDialogUserProfile";
import { MemoryRouter } from "react-router-dom";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";

describe("Show List of Data", () => {
  test("Testing show data Modal Component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <EmailTemplateDialogUserProfile
              openEmailTemplate={true}
              handleEmailTemplateClose={vi.fn()}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Email Template")).toBeInTheDocument();
  });
});
