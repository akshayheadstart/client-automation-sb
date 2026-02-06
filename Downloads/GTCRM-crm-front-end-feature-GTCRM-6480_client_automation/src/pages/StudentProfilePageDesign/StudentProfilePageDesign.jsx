/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card } from "@mui/material";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import StudentProfilePage from "../../components/shared/StudentProfilePage/StudentProfilePage";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/StudentProfilePageDesign.css";
import "../../styles/sharedStyles.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useLocation } from "react-router-dom";
import { useUpdateStudentInterviewStatusMutation } from "../../Redux/Slices/filterDataSlice";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { customFetch } from "../StudentTotalQueries/helperFunction";
const StudentProfilePageDesign = () => {
  const role = "Moderator";
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [
    getStudentInfoInternalServerError,
    setGetStudentInfoInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInGetStudentInfo,
    setSomethingWentWrongInGetStudentInfo,
  ] = useState(false);
  const [studentInfo, setStudentInfo] = useState({});
  const { state } = useLocation();
  if (!state) {
    window.history.back();
  }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_API_BASE_URL
    }/planner/student_profile/?interview_list_id=${
      state?.interviewListId
    }&application_id=${state?.application_id}&college_id=${collegeId}`;
    customFetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else if (result) {
          try {
            if (typeof result === "object" && result !== null) {
              setStudentInfo(result);
            } else {
              throw new Error("Get Student info API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInGetStudentInfo,
              "",
              10000
            );
          }
        }
      })
      .catch(() => {
        handleInternalServerError(
          setGetStudentInfoInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  const [
    somethingWentWrongInUpdateStatus,
    setSomethingWentWrongInUpdateStatus,
  ] = useState(false);
  const [updateStatusInternalServerError, setUpdateStatusInternalServerError] =
    useState(false);
  const [updateInterViewStatus] = useUpdateStudentInterviewStatusMutation();
  const [statusLoading, setStatusLoading] = useState(false);
  const handleUpdateStatus = (event) => {
    setStatusLoading(true);
    updateInterViewStatus({
      formatData: {
        application_ids: [state?.application_id],
        interview_list_id: state?.interviewListId,
        status: event,
      },
      collegeId: collegeId,
    })
      .unwrap()
      .then((res) => {
        try {
          if (res?.message) {
            if (typeof res?.message === "string") {
              pushNotification("success", "Successfully Status Updated");
            } else {
              throw new Error("update Status API response changed");
            }
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInUpdateStatus,
            "",
            5000
          );
        }
        // }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setUpdateStatusInternalServerError,
            "",
            5000
          );
        }
      })
      .finally(() => {
        setStatusLoading(false);
      });
  };
  const handleViewList = () => {
    window.history.back();
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //InterView list Head Title add
  useEffect(() => {
    setHeadTitle("Student Profile");
    document.title = "Student Profile";
  }, [headTitle]);
  return (
    <Card sx={{ mx: 3, mb: 3 }} className="custom-component-container-box">
      {getStudentInfoInternalServerError ||
      somethingWentWrongInGetStudentInfo ||
      updateStatusInternalServerError ||
      somethingWentWrongInUpdateStatus ? (
        <>
          {(getStudentInfoInternalServerError ||
            updateStatusInternalServerError) && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {(somethingWentWrongInGetStudentInfo ||
            somethingWentWrongInUpdateStatus) && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </>
      ) : (
        <>
          {loading ? (
            <Card className="loader-wrapper">
              <LeefLottieAnimationLoader
                height={100}
                width={150}
              ></LeefLottieAnimationLoader>{" "}
            </Card>
          ) : (
            <StudentProfilePage
              role={role}
              studentInfoData={studentInfo}
              handleUpdateStatus={handleUpdateStatus}
              loading={statusLoading}
            ></StudentProfilePage>
          )}
        </>
      )}
      <Box sx={{ display: "grid", placeItems: "end", p: 4 }}>
        <Button
          variant="contained"
          size="small"
          sx={{ borderRadius: 30, paddingX: 3 }}
          color="info"
          className="button-height-design"
          onClick={() => handleViewList()}
        >
          View List
        </Button>
      </Box>
    </Card>
  );
};

export default StudentProfilePageDesign;
