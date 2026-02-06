import * as React from "react";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../../styles/managementDashboard.css";
import CollegeUrlTableDesign from "./CollegeUrlTableDesign";
import useToasterHook from "../../hooks/useToasterHook";
import { useState } from "react";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import { useGetManagementDashboardUrlQuery } from "../../Redux/Slices/clientOnboardingSlice";
export default function CollegeUrlDialog({
  viewCollegeDialogOpen,
  handleViewCollegeDialogClose,
  selectedCollegeInfo,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [urlInfo, setUrlInfo] = useState({});
  const pushNotification = useToasterHook();
  const [somethingWentWrongInUrl, setSomethingWentWrongInUrl] =
    React.useState(false);
  const [allUrlInternalServerError, setUrlInternalServerError] =
    useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    React.useContext(DashboradDataContext);
  //Get table api call here
  const { data, isSuccess, isError, error, isFetching } =
    useGetManagementDashboardUrlQuery({
      collegeId: selectedCollegeInfo?._id,
    });
  React.useEffect(() => {
    try {
      if (isSuccess) {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.data) {
          try {
            if (
              typeof data?.data === "object" &&
              data?.data !== null &&
              !Array.isArray(data?.data)
            ) {
              setUrlInfo(data?.data);
            } else {
              throw new Error(
                "Get Management Dashboard Url API response has changed"
              );
            }
          } catch (error) {}
        } else if (data?.detail) {
          pushNotification("error", data?.detail);
        }
      } else if (isError) {
        if (error?.status === 500) {
          handleInternalServerError(setUrlInternalServerError, "", 10000);
        }
      }
    } catch (err) {
      setApiResponseChangeMessage(err);
      handleSomethingWentWrong(setSomethingWentWrongInUrl, "", 10000);
    }
  }, [data, isSuccess, isError, error, isFetching]);
  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        maxWidth={false}
        open={viewCollegeDialogOpen}
        onClose={handleViewCollegeDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <Box className="management-create-college-dialog-close-box-new">
          <Typography className="college-name-text-dialog">
            {selectedCollegeInfo?.college_name}
          </Typography>
          <IconButton onClick={() => handleViewCollegeDialogClose()}>
            <CloseIcon color="info" />
          </IconButton>
        </Box>
        {isFetching ? (
          <Box
            className="loading-animation-box"
            data-testid="loading-animation-container"
          >
            <LeefLottieAnimationLoader
              height={120}
              width={120}
            ></LeefLottieAnimationLoader>
          </Box>
        ) : (
          <>
            {allUrlInternalServerError || somethingWentWrongInUrl ? (
              <Box>
                {allUrlInternalServerError && (
                  <Error500Animation
                    height={400}
                    width={400}
                  ></Error500Animation>
                )}
                {somethingWentWrongInUrl && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </Box>
            ) : (
              <>
                {urlInfo?.student_dashboard_url?.length > 0 ||
                urlInfo?.admin_dashboard_url?.length > 0 ? (
                  <Box className="college-show-url-box">
                    <CollegeUrlTableDesign
                      headerText={"Live Student Dashboard URL"}
                      urlList={[urlInfo?.student_dashboard_url]}
                    />
                    <CollegeUrlTableDesign
                      headerText={"Admin Dashboard URL"}
                      urlList={[urlInfo?.admin_dashboard_url]}
                    />
                  </Box>
                ) : (
                  <Box sx={{minWidth:"500px"}}>
                    <BaseNotFoundLottieLoader
                      height={250}
                      width={250}
                    ></BaseNotFoundLottieLoader>
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Dialog>
    </React.Fragment>
  );
}
