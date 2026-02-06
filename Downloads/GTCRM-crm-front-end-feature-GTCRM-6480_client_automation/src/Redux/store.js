import { configureStore } from "@reduxjs/toolkit";
import { tableSlice } from "./Slices/applicationDataApiSlice";
import authReducer from "./Slices/authSlice";
import countryReducer from "./Slices/countrySlice";
import templateReducer from "./Slices/templateSlice";
import { filterOptionData } from "./Slices/filterDataSlice";
import { tokenData } from "./Slices/refreshTokenSlice";
import { selectionProcedureData } from "./Slices/selectionProcedureSlice";
import { manageCourseSlice } from "./Slices/courseDataApiSlice";
import { dataSegmentData } from "./Slices/dataSegmentSlice";
import { telephonyData } from "./Slices/telephonySlice";
import notificationReducer from "./Slices/notificationSlice";
import { adminDashboardSlice } from "./Slices/adminDashboardSlice";
import { mediaGallerySlice } from "./Slices/mediaGallery";
import { clientOnboardingSlice } from "./Slices/clientOnboardingSlice";

export const store = configureStore({
  reducer: {
    country: countryReducer,
    authentication: authReducer,
    template: templateReducer,
    [tableSlice.reducerPath]: tableSlice.reducer,
    [filterOptionData.reducerPath]: filterOptionData.reducer,
    [tokenData.reducerPath]: tokenData.reducer,
    [selectionProcedureData.reducerPath]: selectionProcedureData.reducer,
    [manageCourseSlice.reducerPath]: manageCourseSlice.reducer,
    [mediaGallerySlice.reducerPath]: mediaGallerySlice.reducer,
    [dataSegmentData.reducerPath]: dataSegmentData.reducer,
    [telephonyData.reducerPath]: telephonyData.reducer,
    notificationsData: notificationReducer,
    [adminDashboardSlice.reducerPath]: adminDashboardSlice.reducer,
    [clientOnboardingSlice.reducerPath]: clientOnboardingSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      tableSlice.middleware,
      filterOptionData.middleware,
      tokenData.middleware,
      selectionProcedureData.middleware,
      manageCourseSlice.middleware,
      mediaGallerySlice.middleware,
      dataSegmentData.middleware,
      telephonyData.middleware,
      adminDashboardSlice.middleware,
      clientOnboardingSlice.middleware,
    ]),
});
