import {  render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingProvider } from "../../store/contexts/LayoutSetting";
import PromoCodeInputComponent from "../../pages/VoucherPromoCodeManager/PromoCodeInputComponent";
describe("PromoCodeInputComponent", () => {
  test("renders all input fields with placeholders", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <PromoCodeInputComponent />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByPlaceholderText("Name*")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Code*")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("50%")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Units*")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Duration")).toBeInTheDocument();
  });

});
