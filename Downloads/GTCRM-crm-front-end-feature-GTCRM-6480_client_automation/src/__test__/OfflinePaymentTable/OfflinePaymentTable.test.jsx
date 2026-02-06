import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OfflinePaymentTable from "../../components/userProfile/OfflinePayment/OfflinePaymentTable";
import { Provider } from "react-redux";
import { store } from "../../Redux/store";
import { TopProvider } from "../../store/contexts/TopContext";
import { MemoryRouter } from "react-router";
import { DashboardDataProvider } from "../../store/contexts/DashboardDataContext";
import { vi } from "vitest";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";

describe("OfflinePaymentTable", () => {
  it("renders payment data correctly", () => {
    const mockPaymentData = [
      {
        transaction_id: "123",
        payment_id: "456",
        date: "2024-03-12",
        status: "Captured",
        payment_method: "Credit Card",
      },
      {
        transaction_id: "789",
        payment_id: "101112",
        date: "2024-03-13",
        status: "Failed",
        payment_method: "Debit Card",
      },
    ];
    const mockStudentInfoDetails = {
      student_name: "John Doe",
      email: "john.doe@example.com",
      mobile: "1234567890",
      amount: "500",
      applicationId: "12345",
      paymentStatus: "not_captured"
  };
  
  const mockContextValues = {
      studentInfoDetails: mockStudentInfoDetails
  };
    const mockSetClickOnTransactionId = vi.fn();

    render(
      <Provider store={store}>
         <LayoutSettingContext.Provider value={mockContextValues}>
        <TopProvider>
          <MemoryRouter>
            <DashboardDataProvider>
              <OfflinePaymentTable
                paymentData={mockPaymentData}
                setClickOnTransactionId={mockSetClickOnTransactionId}
              />
            </DashboardDataProvider>
          </MemoryRouter>
        </TopProvider>
        </LayoutSettingContext.Provider>
      </Provider>
    );

    expect(screen.getByAltText('add payment Icon')).toBeInTheDocument();
    expect(screen.getByAltText('payment Icon')).toBeInTheDocument();

    expect(screen.getByText('Transaction ID')).toBeInTheDocument();
    expect(screen.getByText('Order ID')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Payment Method')).toBeInTheDocument();

    mockPaymentData.forEach((payment) => {
      expect(screen.getByText(payment.payment_id || '---')).toBeInTheDocument();
      expect(screen.getByText(payment.date || '---')).toBeInTheDocument();
      expect(screen.getByText(payment.status)).toBeInTheDocument();
      expect(screen.getByText(payment.payment_method)).toBeInTheDocument();
    });
  });
});
