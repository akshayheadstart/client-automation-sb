import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { MemoryRouter } from "react-router-dom";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import VoucherDrawerCard from "../../pages/VoucherPromoCodeManager/VoucherDrawerCard";
import { expect } from "vitest";

describe("VoucherDrawerCard component", () => {
  test("renders voucher codes and details", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <VoucherDrawerCard />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const voucherCodes = screen.getByTestId("voucher-loader");
    expect(voucherCodes).toBeInTheDocument();
  });
});
