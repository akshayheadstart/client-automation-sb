import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { MemoryRouter } from "react-router-dom";
import LiveStudentDialog from "../../components/LiveStudentDialog/LiveStudentDialog";
import { vi } from "vitest";
describe("LiveStudentDialog component", () => {
  const mockHandleLiveStudentClose = vi.fn();
  const mockLiveApplicantsCount = 5;

  test("Testing show data Modal Component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LiveStudentDialog
              openLiveStudent={true}
              handleLiveStudentClose={mockHandleLiveStudentClose}
              liveApplicantsCount={mockLiveApplicantsCount}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Live Student")).toBeInTheDocument();
  });
});
