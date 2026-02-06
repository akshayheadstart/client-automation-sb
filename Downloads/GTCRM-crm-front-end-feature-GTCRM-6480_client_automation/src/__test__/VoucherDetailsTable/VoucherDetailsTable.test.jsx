import React from 'react';
import { render, screen, } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../Redux/store';
import { MemoryRouter } from 'react-router-dom';
import { DashboardDataProvider } from '../../store/contexts/DashboardDataContext';
import { LayoutSettingProvider } from '../../store/contexts/LayoutSetting';
import VoucherDetailsTable from '../../pages/VoucherPromoCodeManager/VoucherDetailsTable';

describe('VoucherDetailsTable component', () => {
  test('renders Voucher Details title', () => {
    render(
    <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
          <LayoutSettingProvider>
          <VoucherDetailsTable />
          </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
      );
    const titleElement = screen.getByText(/Voucher Details/i);
    expect(titleElement).toBeInTheDocument();
  });
  test('renders create voucher button', () => {
    render(
        <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
          <LayoutSettingProvider>
          <VoucherDetailsTable />
          </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
   
    );
    const createButton = screen.getByText(/Create Voucher/i);
    expect(createButton).toBeInTheDocument();
  });

});
