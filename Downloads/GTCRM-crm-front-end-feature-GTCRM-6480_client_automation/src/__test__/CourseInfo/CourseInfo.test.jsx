import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { TopProvider } from '../../store/contexts/TopContext';
import { store } from '../../Redux/store';
import { DashboardDataProvider } from '../../store/contexts/DashboardDataContext';
import { MemoryRouter } from "react-router";
import CourseInfo from '../../components/userProfile/OfflinePayment/CourseInfo';

describe('CourseInfo Component', () => {
    const defaultProps = {
        studentInfoDetails: {
            courseName: 'Mathematics',
            amount: '5000',
            customApplicationId: 'APP12345'
        }
    };

    test('renders CourseInfo component with provided data', () => {
        render(
            <Provider store={store}>
        <TopProvider>
          <MemoryRouter>
            <DashboardDataProvider>
            <CourseInfo {...defaultProps}/>
            </DashboardDataProvider>
          </MemoryRouter>
        </TopProvider>
      </Provider>
        );

        expect(screen.getByAltText('course name icon')).toBeInTheDocument();
        expect(screen.getByAltText('course fee icon')).toBeInTheDocument();
        expect(screen.getByAltText('application icon')).toBeInTheDocument();

        expect(screen.getByText('Course Name :')).toBeInTheDocument();
        expect(screen.getByText('MATHEMATICS')).toBeInTheDocument();

        expect(screen.getByText('Course Fees :')).toBeInTheDocument();
        expect(screen.getByText('5000')).toBeInTheDocument();

        expect(screen.getByText('Application Id :')).toBeInTheDocument();
        expect(screen.getByText('APP12345')).toBeInTheDocument();
    });
});
