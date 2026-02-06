import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { TopProvider } from '../../store/contexts/TopContext';
import { store } from '../../Redux/store';
import { MemoryRouter } from 'react-router-dom';
import { DashboardDataProvider } from '../../store/contexts/DashboardDataContext';
import RPayOfflinePaymentDialog from '../../components/userProfile/OfflinePayment/RPayOfflinePaymentDialog';
import { LayoutSettingContext } from '../../store/contexts/LayoutSetting';

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
describe('RPayOfflinePaymentDialog Component', () => {
    test('renders RPayOfflinePaymentDialog component', () => {
        render(
            <Provider store={store}>
                <LayoutSettingContext.Provider value={mockContextValues}>
            <TopProvider>
              <MemoryRouter>
                <DashboardDataProvider>
                <RPayOfflinePaymentDialog
                            rPayDialogOpen={true}
                            handleRPayDialogClose={jest.fn()}
                            studentId="student123"
                        />
                </DashboardDataProvider>
              </MemoryRouter>
            </TopProvider>
            </LayoutSettingContext.Provider>
          </Provider>
        );

        expect(screen.getByText("Complete Your payment")).toBeInTheDocument();
        expect(screen.getByText("Course Name :")).toBeInTheDocument();
        expect(screen.getByText("Course Fees :")).toBeInTheDocument();
        expect(screen.getByText("Application Id :")).toBeInTheDocument();
    });

});
