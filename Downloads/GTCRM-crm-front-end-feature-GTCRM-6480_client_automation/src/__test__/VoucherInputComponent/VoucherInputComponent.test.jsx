import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import VoucherInputComponent from "../../pages/VoucherPromoCodeManager/VoucherInputComponent";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";

describe("VoucherInputComponent", () => {
  test("renders all input fields with placeholders", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <VoucherInputComponent />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByPlaceholderText("Name*")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Quantity*")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Cost per Voucher*")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Duration*")).toBeInTheDocument();
  });

});
