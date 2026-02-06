import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  useGetAllFeatureListsQuery,
  useUpdatePricingScreenMutation,
} from "../../Redux/Slices/clientOnboardingSlice";
import useCommonErrorHandling from "../../hooks/useCommonErrorHandling";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import TableTopPagination from "../../components/ui/application-manager/TableTopPagination";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../components/shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import SharedPaginationAndRowsPerPage from "../../components/shared/Pagination/SharedPaginationAndRowsPerPage";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import ShowModulesAndSubModules from "../../components/ui/client-onboarding/ModuleSubscriptionTable/ShowModulesAndSubModules";
import useToasterHook from "../../hooks/useToasterHook";
import { useGetCollegeListQuery } from "../../Redux/Slices/applicationDataApiSlice";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import { SelectPicker } from "rsuite";
import "../../styles/clientOnboardingStyles.css"

const EditPricingDialog = ({ open, setOpen, collegeId, clientId, from }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [subscriptionModules, setSubscriptionModules] = useState([]);
  const [totalModulesCount, setTotalModulesCount] = useState(0);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const [selectedModules, setSelectedModules] = useState([]);
  const [loadingEditFeature, setLoadingEditFeature] = useState(false);
  const pushNotification = useToasterHook();
  const [listOfCollege, setListOfCollege] = useState([]);
  const [skipCallCollegeAPI, setSkipCallCollegeAPI] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState("");
  const { isError, error, isSuccess, isFetching, data } =
    useGetAllFeatureListsQuery({
      pageNumber,
      pageSize: rowsPerPage,
    });
  const { handleError } = useCommonErrorHandling();
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data.data)) {
          setSubscriptionModules(data.data.data);
          setTotalModulesCount(data.total);
        } else {
          throw new Error(
            "Get all feature list API response has been changed."
          );
        }
      } else if (isError) {
        handleError({ error, setIsInternalServerError });
      }
    } catch {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, null, 5000);
    }
  }, [data, error, isError, isSuccess]);
  //update Features Amount API
  const [updatePricingScreen] = useUpdatePricingScreenMutation();

  const handleEditFeature = () => {
    setLoadingEditFeature(true);
    updatePricingScreen({
      payload: { screen_details: selectedModules },
      type: "admin_dashboard",
      collegeId: selectedCollege,
    })
      .unwrap()
      .then((res) => {
        if (res?.message) {
          pushNotification("success", res.message);
          setOpen(false)
        } else if (res?.detail) {
          if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          }
        }
      })
      .catch((err) => pushNotification("error", err?.data?.detail))
      .finally(() => setLoadingEditFeature(false));
  };
  //get list of college
  const collegeApiCallInfo = useGetCollegeListQuery(
    {},
    {
      skip: skipCallCollegeAPI,
    }
  );

  useEffect(() => {
    if (!skipCallCollegeAPI) {
      const apiResponseList = collegeApiCallInfo?.data?.data;
      if (apiResponseList?.length > 0) {
        const modifyOptions = apiResponseList?.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setListOfCollege(modifyOptions);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCallCollegeAPI, collegeApiCallInfo]);
  return (
    <Dialog
      PaperProps={{ sx: { borderRadius: "20px" } }}
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="lg"
      fullWidth
    >
      <Box sx={{ p: 3 }}>
        <Box className="edit-course-header">
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="h6">Update Features Pricing</Typography>
            <SelectPicker
              value={selectedCollege}
              data={listOfCollege}
              style={{ width: 200 }}
              placement={"bottomEnd"}
              placeholder="Select College"
              loading={collegeApiCallInfo?.isFetching}
              onOpen={() => {
                setSkipCallCollegeAPI(false);
              }}
              onChange={(value) => {
                setSelectedCollege(value);
              }}
            />
          </Box>

          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      
            <Box className="common-table-heading-container">
              <TableDataCount
                totalCount={totalModulesCount}
                currentPageShowingCount={subscriptionModules?.length}
                pageNumber={pageNumber}
                rowsPerPage={rowsPerPage}
              />

              <TableTopPagination
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                totalCount={totalModulesCount}
                rowsPerPage={rowsPerPage}
              />
            </Box>
            {isFetching ? (
              <Box className="common-not-found-container">
                <LeefLottieAnimationLoader height={150} width={150} />
              </Box>
            ) : (
              <>
                {isInternalServerError || isSomethingWentWrong ? (
                  <ErrorAndSomethingWentWrong
                    isInternalServerError={isInternalServerError}
                    isSomethingWentWrong={isSomethingWentWrong}
                  />
                ) : (
                  <>
                    {subscriptionModules?.length > 0 ? (
                      <>
                        <ShowModulesAndSubModules
                          selectedModules={selectedModules}
                          setSelectedModules={setSelectedModules}
                          subscriptionModules={subscriptionModules}
                          hideCheckBoxAndAmountFieldShow={true}
                        />
                        <Box>
                          <SharedPaginationAndRowsPerPage
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            totalDataCount={totalModulesCount}
                          />
                        </Box>
                      </>
                    ) : (
                      <Box className={"common-not-found-container"}>
                        <BaseNotFoundLottieLoader height={250} width={250} />
                      </Box>
                    )}
                  </>
                )}
              </>
            )}
            <Box sx={{ display: "grid", placeItems: "center", my: 2 }}>
              <Button
                variant="contained"
                color="info"
                sx={{ position: "absolute" }}
                onClick={() => {
                  handleEditFeature();
                }}
                disabled={!selectedCollege}
              >
                {loadingEditFeature ? (
                  <CircularProgress sx={{ color: "white" }} size={25} />
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
      </Box>
    </Dialog>
  );
};

export default EditPricingDialog;
