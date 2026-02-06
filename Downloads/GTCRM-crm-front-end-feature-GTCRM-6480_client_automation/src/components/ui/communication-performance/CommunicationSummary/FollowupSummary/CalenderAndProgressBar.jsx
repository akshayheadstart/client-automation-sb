import React, { useContext, useEffect, useState } from "react";
import FollowupSummaryDetailsCalendar from "./FollowupSummaryDetailsCalendar";
import FollowupSummaryDetailsProgressBar from "./FollowupSummaryDetailsProgressBar";
import { Card, Divider, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { useGetCounsellorWiseFollowupDetailsQuery } from "../../../../../Redux/Slices/applicationDataApiSlice";
import LeefLottieAnimationLoader from "../../../../shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import { handleSomethingWentWrong } from "../../../../../utils/handleSomethingWentWrong";
import useCommonErrorHandling from "../../../../../hooks/useCommonErrorHandling";
import { DashboradDataContext } from "../../../../../store/contexts/DashboardDataContext";
import { getJsonDateToShowFollowUpReport } from "../../../../../hooks/GetJsonDate";
import dayjs from "dayjs";

function CalenderAndProgressBar() {
  const [singleDateValue, setSingleDateValue] = useState(dayjs());
  const [month, setMonth] = useState(dayjs().month());
  const [year, setYear] = useState(dayjs().year());

  const [selectedCounsellor, setSelectedCounsellor] = useState([]);
  const [appliedCounsellor, setAppliedCounsellor] = useState([]);
  const [selectedHeadCounsellor, setSelectedHeadCounsellor] = useState({});
  const [skipCallCounsellorAPI, setSkipCallCounsellorAPI] = useState(true);

  const [selectedDate, setSelectedDate] = useState(
    () => getJsonDateToShowFollowUpReport(new Date(), new Date()).start_date
  );
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [followupDetails, setFollowupDetails] = useState({});
  const [hideCalendar, setHideCalendar] = useState(false);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const handleError = useCommonErrorHandling();

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const { data, isError, error, isFetching, isSuccess } =
    useGetCounsellorWiseFollowupDetailsQuery({
      collegeId,
      headCounsellorId: selectedHeadCounsellor?.head_counselor_id,
      payload: {
        counsellor_ids: appliedCounsellor,
        date: selectedDate,
      },
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data?.data === "object") {
          setFollowupDetails(data?.data);
        } else {
          throw new Error(
            "Counsellor wise followup details api response has been changed."
          );
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setIsInternalServerError,
          setHide: setHideCalendar,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideCalendar, 5000);
    }
  }, [data, isError, error, isSuccess]);

  useEffect(() => {
    const formattedDate = new Date(dayjs(singleDateValue).format());
    const modifiedDate = getJsonDateToShowFollowUpReport(
      formattedDate,
      formattedDate
    );
    setSelectedDate(modifiedDate.start_date);
  }, [singleDateValue]);

  if (hideCalendar) {
    return null;
  }

  return (
    <Card className="common-box-shadow followup-calender-and-progress-bar-container">
      {isFetching ? (
        <Box sx={{ minHeight: "25vh" }} className="common-not-found-container">
          <LeefLottieAnimationLoader
            height={150}
            width={150}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <>
          {isInternalServerError || isSomethingWentWrong ? (
            <Box
              sx={{ minHeight: "25vh" }}
              className="common-not-found-container"
            >
              <ErrorAndSomethingWentWrong
                isInternalServerError={isInternalServerError}
                isSomethingWentWrong={isSomethingWentWrong}
                containerHeight="20vh"
              />
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid item md={7.2} sm={12} xs={12}>
                <FollowupSummaryDetailsCalendar
                  setSelectedHeadCounsellor={setSelectedHeadCounsellor}
                  skipCallCounsellorAPI={skipCallCounsellorAPI}
                  setSkipCallCounsellorAPI={setSkipCallCounsellorAPI}
                  setSelectedCounsellor={setSelectedCounsellor}
                  selectedCounsellor={selectedCounsellor}
                  setAppliedCounsellor={setAppliedCounsellor}
                  followupDetails={followupDetails}
                  singleDateValue={singleDateValue}
                  setSingleDateValue={setSingleDateValue}
                  month={month}
                  setMonth={setMonth}
                  year={year}
                  setYear={setYear}
                />
              </Grid>
              <Grid item md={0.3}>
                <Box className="calender-and-progress-divider"></Box>
              </Grid>
              <Grid item md={4.5} sm={12} xs={12}>
                <FollowupSummaryDetailsProgressBar
                  setSelectedCounsellor={setSelectedCounsellor}
                  setAppliedCounsellor={setAppliedCounsellor}
                  followupDetails={followupDetails}
                  setSelectedHeadCounsellor={setSelectedHeadCounsellor}
                  selectedHeadCounsellor={selectedHeadCounsellor}
                />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Card>
  );
}

export default CalenderAndProgressBar;
