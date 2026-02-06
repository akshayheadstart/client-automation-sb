import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { store } from "../../Redux/store";
import LeadOfflinePaymentDetails from "../../components/userProfile/OfflinePayment/LeadOfflinePaymentDetails";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { TopProvider } from "../../store/contexts/TopContext";
import { vi } from "vitest";
describe("LeadOfflinePaymentDetails", () => {
  it("renders payment details correctly", () => {
    const mockClickOnTransactionId = vi.fn();

    render(
      <Provider store={store}>
        <TopProvider>
          <MemoryRouter>
            <DashboardDataProvider>
              <LeadOfflinePaymentDetails
                setClickOnTransactionId={mockClickOnTransactionId}
              />
            </DashboardDataProvider>
          </MemoryRouter>
        </TopProvider>
      </Provider>
    );
    const invoiceIcon = screen.getByAltText("In Voice Icon");
    expect(invoiceIcon).toBeInTheDocument();
    const arrowInvoiceIcon = screen.getByAltText("arrowInvoice Icon");
    expect(arrowInvoiceIcon).toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });
});
