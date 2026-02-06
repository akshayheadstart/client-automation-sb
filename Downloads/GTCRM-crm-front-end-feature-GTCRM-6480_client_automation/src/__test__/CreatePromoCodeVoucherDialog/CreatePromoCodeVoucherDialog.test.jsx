import React from "react";
import { render, screen } from "@testing-library/react";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import CreatePromoCodeVoucherDialog from "../../pages/VoucherPromoCodeManager/CreatePromoCodeVoucherDialog";
import { Provider } from "react-redux";
import { vi } from "vitest";
describe("CreatePromoCodeVoucherDialog component", () => {
  test("renders with correct initial state", () => {
    const openCreatePromoCodeVoucher = true;
    const handlePromoCodeVoucherClose = vi.fn();
    const value = "PromoCode";
    const setValue = vi.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <CreatePromoCodeVoucherDialog
              openCreatePromoCodeVoucher={openCreatePromoCodeVoucher}
              handlePromoCodeVoucherClose={handlePromoCodeVoucherClose}
              value={value}
              setValue={setValue}
            />
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    const createButton = screen.getByRole("button", { name: /create/i });
    expect(createButton).toBeInTheDocument();
    expect(createButton).toBeDisabled();
  });
});
