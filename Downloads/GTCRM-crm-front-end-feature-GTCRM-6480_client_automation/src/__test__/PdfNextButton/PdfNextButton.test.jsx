import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { TopProvider } from '../../store/contexts/TopContext';
import { store } from '../../Redux/store';
import { MemoryRouter } from 'react-router-dom';
import { DashboardDataProvider } from '../../store/contexts/DashboardDataContext';
import PdfNextButton from '../../components/PdfNextButton/PdfNextButton';


describe('PdfNextButton Component', () => {
    const defaultProps = {
        onclick: jest.fn(),
        startIcon: <span>StartIcon</span>,
        disabled: false,
        endIcon: <span>EndIcon</span>
    };

    test('renders PdfNextButton component', () => {
        render(
            <Provider store={store}>
            <TopProvider>
              <MemoryRouter>
                <DashboardDataProvider>
                <PdfNextButton {...defaultProps} />
                </DashboardDataProvider>
              </MemoryRouter>
            </TopProvider>
          </Provider>
        );

        const button = screen.getByTestId('button-back-items');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('invoice-pdf-button-design');
        expect(button).not.toBeDisabled();
        expect(screen.getByText('StartIcon')).toBeInTheDocument();
        expect(screen.getByText('EndIcon')).toBeInTheDocument();
    });
});
