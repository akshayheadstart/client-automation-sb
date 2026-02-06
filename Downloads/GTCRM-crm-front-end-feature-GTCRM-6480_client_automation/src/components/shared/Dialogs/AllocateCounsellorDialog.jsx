import { Typography, Button, Box, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { InputNumber, Modal } from "rsuite";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import useToasterHook from "../../../hooks/useToasterHook";
import { useAllocateCounsellorMutation } from "../../../Redux/Slices/applicationDataApiSlice";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import Error500Animation from "../ErrorAnimation/Error500Animation";
import { useSelector } from "react-redux";
import MultipleFilterSelectPicker from "../filters/MultipleFilterSelectPicker";
import "../../../styles/CounsellorManager.css";

const AllocateCounsellorDialog = ({
  open,
  setOpen,
  selectedCounsellorId,
  courseList,
  stateList,
  sourceList,
  counsellorWiseAllocatedCourse,
  setCounsellorWiseAllocatedCourse,
  counsellorWiseAllocatedState,
  setCounsellorWiseAllocatedState,
  counsellorWiseAllocatedSource,
  setCounsellorWiseAllocatedSource,
  sourceListInfo,
  setCallFilterOptionApi,
  stateListInfo,
  counsellorWiseAllocatedSpecializations,
  setCounsellorWiseAllocatedSpecializations,
  languagesDataList,
  setSkipLanguageApiCall,
  languagesList,
  hideLanguageList,
  counsellorWiseAllocatedLanguage,
  setCounsellorWiseAllocatedLanguage,
  counsellorWiseFreshLeadLimit,
  setCounsellorWiseFreshLeadLimit,
  setSelectedSpecializations,
  selectedSpecializations,
  setSkipCourseApiCall,
  loadingCourseListApi,
}) => {
  const [selectedFinalSpecializations, setFinalSelectedSpecializations] =
    useState([]);
  useEffect(() => {
    if (selectedSpecializations.length > 0) {
      const outputArray = selectedSpecializations?.map((str) => str.split("0"));
      const finalArray = outputArray?.map((item) => ({
        course_name: item[1],
        spec_name: item[0] === "null" ? null : item[0],
      }));
      if (finalArray.length > 0) {
        setFinalSelectedSpecializations(finalArray);
      }
    } else {
      setFinalSelectedSpecializations([]);
    }
  }, [selectedSpecializations]);
  //if user reset selected Allocated Course then Selected Specializations picker Auto reset here
  useEffect(() => {
    if (counsellorWiseAllocatedCourse.length === 0) {
      setSelectedSpecializations([]);
    }
  }, [counsellorWiseAllocatedCourse]);
  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const handleClose = () => {
    setOpen(false);
    setCounsellorWiseAllocatedCourse([]);
    setCounsellorWiseAllocatedState([]);
    setCounsellorWiseAllocatedSource([]);
    setSelectedSpecializations([]);
    setFinalSelectedSpecializations([]);
  };

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [
    counsellorAllocationInternalServerError,
    setCounsellorAllocationInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInCounsellorAllocation,
    setSomethingWentWrongInCounsellorAllocation,
  ] = useState(false);

  const [isCounselorAllocateLoading, setIsCounselorAllocateLoading] =
    useState(false);

  const payloadOfAllocateCounsellor = {
    course_name: counsellorWiseAllocatedCourse,
    state_code: counsellorWiseAllocatedState,
    source_name: counsellorWiseAllocatedSource,
    language: counsellorWiseAllocatedLanguage,
    specialization_name: selectedFinalSpecializations,
    fresh_lead_limit: parseInt(counsellorWiseFreshLeadLimit),
  };

  const [allocateCounsellor] = useAllocateCounsellorMutation();

  const handleAllocateCounsellor = async (e) => {
    e.preventDefault();
    setIsCounselorAllocateLoading(true);
    await allocateCounsellor({
      selectedCounsellorId,
      payloadOfAllocateCounsellor: payloadOfAllocateCounsellor,
      collegeId,
    })
      .unwrap()
      .then((result) => {
        if (result?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result?.code === 200) {
          const expectedData = result?.message;
          try {
            if (typeof expectedData === "string") {
              pushNotification("success", result?.message);
              handleClose();
            } else {
              throw new Error("counsellor allocate API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInCounsellorAllocation,
              handleClose,
              5000
            );
          }
        } else if (result?.detail) {
          pushNotification("error", result?.detail);
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setCounsellorAllocationInternalServerError,
          handleClose,
          5000
        );
      })
      .finally(() => {
        setIsCounselorAllocateLoading(false);
        setCounsellorWiseFreshLeadLimit(0);
      });
  };

  return (
    <Modal open={open} size="sm" overflow={true}>
      <Modal.Header onClose={handleClose}>
        {isCounselorAllocateLoading && (
          <Box className="absent-loader">
            <CircularProgress size={35} color="info" />
          </Box>
        )}

        <Modal.Title>
          <Typography variant="h6">Configure User</Typography>
        </Modal.Title>
      </Modal.Header>
      {counsellorAllocationInternalServerError ||
      somethingWentWrongInCounsellorAllocation ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            minHeight: "55vh",
            alignItems: "center",
          }}
        >
          {counsellorAllocationInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInCounsellorAllocation && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <form onSubmit={handleAllocateCounsellor}>
          <Modal.Body sx={{ height: "100vh" }}>
            <Box className="allocate-counsellor-dialog-box-container">
              <MultipleFilterSelectPicker
                loading={loadingCourseListApi}
                onOpen={() => setSkipCourseApiCall(false)}
                onChange={(value) => {
                  setCounsellorWiseAllocatedCourse(value);
                }}
                setSelectedPicker={setCounsellorWiseAllocatedCourse}
                pickerData={courseList}
                placeholder="Allocate Course"
                placement="bottom"
                pickerValue={counsellorWiseAllocatedCourse}
                style={{ width: "250px" }}
              />
              <MultipleFilterSelectPicker
                // loading={stateListInfo.isFetching}
                onChange={(values) => {
                  setSelectedSpecializations(values);
                }}
                setSelectedPicker={setSelectedSpecializations}
                pickerData={counsellorWiseAllocatedSpecializations}
                placeholder="Allocate Specialization"
                placement="bottomEnd"
                pickerValue={selectedSpecializations}
                style={{ width: "250px" }}
                groupBy="role"
              />
              <MultipleFilterSelectPicker
                loading={stateListInfo.isFetching}
                onChange={(value) => {
                  setCounsellorWiseAllocatedState(value);
                }}
                setSelectedPicker={setCounsellorWiseAllocatedState}
                pickerData={stateList}
                placeholder="Allocate State"
                placement="bottomEnd"
                pickerValue={counsellorWiseAllocatedState}
                style={{ width: "250px" }}
                onOpen={() =>
                  setCallFilterOptionApi((prev) => ({
                    ...prev,
                    skipStateApiCall: false,
                  }))
                }
              />

              <MultipleFilterSelectPicker
                loading={sourceListInfo.isFetching}
                onChange={(value) => {
                  setCounsellorWiseAllocatedSource(value);
                }}
                setSelectedPicker={setCounsellorWiseAllocatedSource}
                pickerData={sourceList}
                placeholder="Allocate Source"
                placement="bottomEnd"
                pickerValue={counsellorWiseAllocatedSource}
                style={{ width: "250px" }}
                onOpen={() =>
                  setCallFilterOptionApi((prev) => ({
                    ...prev,
                    skipSourceApiCall: false,
                  }))
                }
              />
              <MultipleFilterSelectPicker
                loading={languagesList.isFetching}
                onChange={(value) => {
                  setCounsellorWiseAllocatedLanguage(value);
                }}
                setSelectedPicker={setCounsellorWiseAllocatedLanguage}
                pickerData={languagesDataList}
                placeholder="Allocate Language"
                placement="bottomEnd"
                pickerValue={counsellorWiseAllocatedLanguage}
                style={{ width: "250px" }}
                onOpen={() => setSkipLanguageApiCall((prev) => !prev)}
              />
              <InputNumber
                defaultValue={counsellorWiseFreshLeadLimit}
                placeholder="Fresh Lead Limit"
                style={{ width: "250px" }}
                onChange={(value) => {
                  setCounsellorWiseFreshLeadLimit(value);
                }}
              />
            </Box>

            <Box></Box>
          </Modal.Body>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              sx={{ mr: 1, borderRadius: 50 }}
              onClick={() => {
                handleClose();
              }}
              variant="outlined"
              size="small"
              type="reset"
              color="info"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              type="submit"
              color="info"
              sx={{ borderRadius: 50 }}
            >
              Apply
            </Button>
          </Box>
        </form>
      )}
    </Modal>
  );
};

export default AllocateCounsellorDialog;
