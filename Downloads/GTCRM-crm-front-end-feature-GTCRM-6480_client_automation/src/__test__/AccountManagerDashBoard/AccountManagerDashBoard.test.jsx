import React from 'react';
import { render, screen, } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import AccountManagerDashBoard from '../../pages/AccountManagerDashBoard/AccountManagerDashBoard';
import { store } from '../../Redux/store';
import { MemoryRouter } from 'react-router-dom';
import { DashboardDataProvider } from '../../store/contexts/DashboardDataContext';
import { LayoutSettingProvider } from '../../store/contexts/LayoutSetting';

describe('AccountManagerDashBoard', () => {
  test('renders loading animation when fetching data', () => {
    render(
        <Provider store={store}>
        <MemoryRouter>
          <DashboardDataProvider>
            <LayoutSettingProvider>
              <AccountManagerDashBoard />
            </LayoutSettingProvider>
          </DashboardDataProvider>
        </MemoryRouter>
      </Provider>
    );
    const loader = screen.getByTestId('loading-animation-container');
    expect(loader).toBeInTheDocument();
  });
});
