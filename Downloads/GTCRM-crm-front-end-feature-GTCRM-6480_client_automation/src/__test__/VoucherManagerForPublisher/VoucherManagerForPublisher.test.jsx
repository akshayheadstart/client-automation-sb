import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import VoucherManagerForPublisher from "../../pages/VoucherManager/VoucherManagerForPublisher";
import VoucherTable from "../../pages/VoucherPromoCodeManager/VoucherTable";
import { expect } from "vitest";

describe("VoucherManagerForPublisher component", () => {
  test("opens voucher drawer when a voucher is clicked", () => {
    const details = [{ name: "Mohib", assign_to: "Viru" }];
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <VoucherTable voucherData={details} />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const voucherNameButton = screen.getByText("Mohib");
    expect(voucherNameButton).toBeInTheDocument();
    expect(screen.getByText("Viru")).toBeInTheDocument();
  });
  test("closes voucher drawer when close button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <VoucherManagerForPublisher />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Voucher Details")).toBeInTheDocument();
    expect(screen.getByText("Program Name")).toBeInTheDocument();
  });
});
