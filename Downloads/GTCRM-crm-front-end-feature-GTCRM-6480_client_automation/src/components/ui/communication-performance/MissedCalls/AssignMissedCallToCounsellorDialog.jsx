import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import FilterSelectPicker from "../../../shared/filters/FilterSelectPicker";
import { useCommonApiCalls } from "../../../../hooks/apiCalls/useCommonApiCalls";
import { useGetCounselorListQuery } from "../../../../Redux/Slices/applicationDataApiSlice";
import { organizeCounselorFilterOption } from "../../../../helperFunctions/filterHelperFunction";
import { useSelector } from "react-redux";
import ErrorAndSomethingWentWrong from "../../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
function AssignMissedCallToCounsellorDialog({
  open,
  setOpen,
  handleAssignCounselor,
  loading,
  isInternalServerError,
  isSomethingWentWrong,
}) {
  const [selectedCounsellorId, setSelectedCounsellorId] = useState("");
  const [skipCounselorApiCall, setSkipCounselorApiCall] = useState(true);
  const [counsellorList, setCounsellorList] = useState([]);

  const { handleFilterListApiCall } = useCommonApiCalls();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: collegeId },
    {
      skip: skipCounselorApiCall,
    }
  );

  //get counsellor list
  useEffect(() => {
    if (!skipCounselorApiCall) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellorList,
        null,
        organizeCounselorFilterOption
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCounselorApiCall, counselorListApiCallInfo]);

  return (
    <Dialog
      PaperProps={{ sx: { borderRadius: 2 } }}
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle>Change Counselor</DialogTitle>
      {isInternalServerError || isSomethingWentWrong ? (
        <ErrorAndSomethingWentWrong
          isInternalServerError={isInternalServerError}
          isSomethingWentWrong={isSomethingWentWrong}
          containerHeight="20vh"
        />
      ) : (
        <>
          <DialogContent sx={{ width: 350 }}>
            <FilterSelectPicker
              pickerValue={selectedCounsellorId}
              pickerData={counsellorList}
              setSelectedPicker={setSelectedCounsellorId}
              placeholder="Select Counselor"
              loading={counselorListApiCallInfo?.isFetching}
              onOpen={() => setSkipCounselorApiCall(false)}
              className="select-picker"
              placement="bottomEnd"
              style={{ width: "100%" }}
              maxHeight={200}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpen(false)}
              className="common-outlined-button"
            >
              Cancel
            </Button>
            {loading ? (
              <CircularProgress color="info" size={30} />
            ) : (
              <Button
                disabled={!selectedCounsellorId?.length}
                onClick={() => handleAssignCounselor(selectedCounsellorId)}
                className="common-contained-button"
              >
                Save
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default AssignMissedCallToCounsellorDialog;
