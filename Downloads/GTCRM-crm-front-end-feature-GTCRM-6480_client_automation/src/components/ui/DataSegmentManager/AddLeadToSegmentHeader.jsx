import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import SearchBox from "../../shared/SearchBox/SearchBox";
import AddIcon from "@mui/icons-material/Add";
import { useAddLeadToDataSegmentMutation } from "../../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
const AddLeadToSegmentHeader = ({
  setShowAddLeadPage,
  searchText,
  setSearchText,
  setSelectedApplications,
  selectedApplications,
  dataSegmentId,
  setPageNumber,
}) => {
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [isLoadingAddLead, setIsLoadingAddLead] = useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const [addLeadToDataSegment] = useAddLeadToDataSegmentMutation();
  const handleAddLeadToDataSegment = () => {
    setIsLoadingAddLead(true);

    addLeadToDataSegment({
      collegeId,
      payload: selectedApplications,
      dataSegmentId,
    })
      .unwrap()
      .then((res) => {
        if (res?.message) {
          try {
            if (typeof res.message === "string") {
              pushNotification("success", res.message);
              setSelectedApplications([]);
            } else {
              throw new Error("Add lead to data segment API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
          }
        } else if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch((error) => {
        if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(setIsInternalServerError, "", 5000);
        }
      })
      .finally(() => {
        setIsLoadingAddLead(false);
      });
  };

  return (
    <Card
      sx={{ borderRadius: 1.5, py: 3.5, px: 3 }}
      className="common-box-shadow"
    >
      {isInternalServerError || isSomethingWentWrong ? (
        <Box sx={{ minHeight: "20vh" }} className="common-not-found-container">
          {isInternalServerError && (
            <Error500Animation height={200} width={200}></Error500Animation>
          )}
          {isSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          <Box
            sx={{ justifyContent: "space-between" }}
            className="add-lead-to-segment-header"
          >
            <Typography> Please select the student you want to add </Typography>
            <IconButton onClick={() => setShowAddLeadPage(false)}>
              <ArrowForwardIosOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Box sx={{ mt: 2 }} className="search-and-add-student">
            <SearchBox
              setSearchText={setSearchText}
              searchText={searchText}
              setPageNumber={setPageNumber}
              setAllDataFetched={() => {}}
              maxWidth={250}
              className="data-segment-details-search-box"
              searchBoxColor="info"
            />
            {selectedApplications?.length > 0 && (
              <>
                {isLoadingAddLead ? (
                  <CircularProgress size={30} color="info" />
                ) : (
                  <Button
                    onClick={handleAddLeadToDataSegment}
                    startIcon={<AddIcon />}
                  >
                    Add Students
                  </Button>
                )}
              </>
            )}
          </Box>
        </>
      )}
    </Card>
  );
};

export default AddLeadToSegmentHeader;
