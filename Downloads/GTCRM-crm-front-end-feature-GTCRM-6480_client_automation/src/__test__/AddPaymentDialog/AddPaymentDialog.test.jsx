import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../Redux/store";
import AddPaymentDialog from "../../components/userProfile/OfflinePayment/AddPaymentDialog";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { TopProvider } from "../../store/contexts/TopContext";

describe("AddPaymentDialog Component", () => {
  test("renders properly", () => {
    render(
      <Provider store={store}>
        <TopProvider>
          <MemoryRouter>
            <DashboardDataProvider>
              <AddPaymentDialog openAddPaymentOffline={true} />
            </DashboardDataProvider>
          </MemoryRouter>
        </TopProvider>
      </Provider>
    );
    expect(screen.getByText("Add Payment")).toBeInTheDocument();
  });

  test("entering text in input fields", () => {
    render(
      <Provider store={store}>
        <TopProvider>
          <MemoryRouter>
            <DashboardDataProvider>
              <AddPaymentDialog openAddPaymentOffline={true} />
            </DashboardDataProvider>
          </MemoryRouter>
        </TopProvider>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("Name*"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Amount*"), {
      target: { value: "100" },
    });
    expect(screen.getByPlaceholderText("Name*").value).toBe("John Doe");
    expect(screen.getByPlaceholderText("Amount*").value).toBe("100");
  });
});
