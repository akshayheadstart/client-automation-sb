import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import PromoCodeDetailsTable from "../../pages/VoucherPromoCodeManager/PromoCodeDetailsTable";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import { vi } from "vitest";

describe("PromoCodeDetailsTable", () => {
  test("renders promo code details table with data", () => {
    const handlePromoCodeVoucherOpen = vi.fn();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <PromoCodeDetailsTable
                handlePromoCodeVoucherOpen={handlePromoCodeVoucherOpen}
              />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("PromoCode Details")).toBeInTheDocument();
    expect(screen.getByText("Create PromoCode")).toBeInTheDocument();
    expect(screen.getByText("Program Name")).toBeInTheDocument();
  });
});
