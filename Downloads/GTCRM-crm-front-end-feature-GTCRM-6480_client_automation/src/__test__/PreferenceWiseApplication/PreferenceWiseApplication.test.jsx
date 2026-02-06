import React from 'react';
import { render, screen } from '@testing-library/react';
import PreferenceWiseApplication from '../../components/ui/admin-dashboard/PreferenceWiseApplication';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { DashboardDataProvider } from '../../store/contexts/DashboardDataContext';
import { LayoutSettingProvider } from '../../store/contexts/LayoutSetting';
import { vi } from "vitest";
import { store } from '../../Redux/store';
// Mock data and props
const selectedSeason = "2023-2024";
const hideCourseList = false;
const setSkipCourseApiCall = vi.fn();
const isScrolledPreferenceWiseApplication = false;
const apiCallingConditions = {};

describe('PreferenceWiseApplication Component', () => {

    test('renders not found loader when no data is available', () => {
        const emptyCourseDetails = [];
        const emptyCourseListInfo = { isFetching: false };
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DashboardDataProvider>
                        <LayoutSettingProvider>
                            <PreferenceWiseApplication
                                selectedSeason={selectedSeason}
                                hideCourseList={hideCourseList}
                                setSkipCourseApiCall={setSkipCourseApiCall}
                                courseDetails={emptyCourseDetails}
                                courseListInfo={emptyCourseListInfo}
                                isScrolledPreferenceWiseApplication={isScrolledPreferenceWiseApplication}
                                apiCallingConditions={apiCallingConditions}
                            />
                        </LayoutSettingProvider>
                    </DashboardDataProvider>
                </MemoryRouter>
            </Provider>

        );
        expect(screen.getByText(/Preference Wise Performance/i)).toBeInTheDocument();
    });
});
