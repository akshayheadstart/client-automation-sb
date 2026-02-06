import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
} from "@mui/material";
import React, { useState } from "react";
import "../../../styles/SharedLeadDetailsTable.css";
import StudentContact from "./StudentContact";
import QuickDropdownFilters from "./QuickDropdownFilters";
import { provideTheClassName } from "../../Calendar/utils";
import { useGetAllCourseListQuery } from "../../../Redux/Slices/filterDataSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import { organizeCourseFilterOption } from "../../../helperFunctions/filterHelperFunction";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import { PaymentStatus } from "./PaymentStatus";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import { useMemo } from "react";
import IndividualCheckBox from "../../shared/SelectedStudent/IndividualCheckBox";
import RegisteredName from "./table-cell/RegisteredName";
import ChangeMultipleLeadStage from "../counsellor-dashboard/ChangeMultipleLeadStage";
const SharedLeadDetailsTable = ({
  showPaymentStatus,
  handleApplyQuickFilters,
  setSelectedLeadStage,
  selectedLeadStage,
  setSelectedCourse,
  selectedCourse,
  leadStageDetails,
  setListOfCourses,
  listOfCourses,
  leadStageLabelList,
  setSkipCallNameAndLabelApi,
  loadingLabelList,
  setSelectedApplications,
  selectedApplications,
  setSelectedMobileNumbers,
  selectedMobileNumbers,
  selectedEmails,
  setSelectedEmails,
  handleOpenUserProfileDrawer,
  setUserDetailsStateData,
  setStudentId,
  studentId,
  quickFilterList,
  clickableName,
}) => {
  const [skipCourseApiCall, setSkipCourseApiCall] = useState(true);

  const [openChangeLeadStageDialog, setOpenChangeLeadStageDialog] =
    useState(false);
  const [clickedApplicationId, setClickedApplicationId] = useState([]);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const { handleFilterListApiCall } = useCommonApiCalls();

  // get course list
  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: collegeId },
    {
      skip: skipCourseApiCall,
    }
  );

  useEffect(() => {
    if (!skipCourseApiCall) {
      const courseList = courseListInfo?.data?.data[0];
      handleFilterListApiCall(
        courseList,
        courseListInfo,
        setListOfCourses,
        () => {},
        organizeCourseFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListInfo, skipCourseApiCall]);

  const allApplicationIds = useMemo(() => {
    const emailIds = [];
    const mobileNumbers = [];
    const applicationIds = [];
    const studentId = [];
    leadStageDetails?.forEach((details) => {
      emailIds.push(details.student_email_id);
      mobileNumbers.push(details.mobile_number);
      applicationIds.push(details.application_id);
      studentId.push(details?.student_id);
    });
    return { emailIds, mobileNumbers, applicationIds, studentId };
  }, [leadStageDetails]);

  const handleRemoveSelectedItems = (selectedData, deleteData, setData) => {
    const prevData = [...selectedData];
    prevData.splice(prevData.indexOf(deleteData), 1);
    setData(prevData);
  };

  const handleCheckBoxOnChange = (checked, data) => {
    if (checked) {
      setSelectedApplications((prev) => [...prev, data.application_id]);
      setSelectedEmails((prev) => [...prev, data?.student_email_id]);
      setSelectedMobileNumbers((prev) => [...prev, data?.mobile_number]);
      setStudentId((prev) => [...prev, data?.student_id]);
    } else {
      handleRemoveSelectedItems(
        selectedApplications,
        data.application_id,
        setSelectedApplications
      );
      handleRemoveSelectedItems(
        selectedEmails,
        data.student_email_id,
        setSelectedEmails
      );
      handleRemoveSelectedItems(
        selectedMobileNumbers,
        data.mobile_number,
        setSelectedMobileNumbers
      );
      handleRemoveSelectedItems(studentId, data.student_id, setStudentId);
    }
  };

  return (
    <Box className="shared-lead-details-table-container">
      <TableContainer className="custom-scrollbar">
        <Table sx={{ minWidth: 750 }}>
          <TableHead sx={{ whiteSpace: "nowrap" }}>
            <TableRow>
              <TableCell className="table-row-sticky checkbox-check-all-container">
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedApplications(allApplicationIds.applicationIds);
                      setSelectedEmails(allApplicationIds?.emailIds);
                      setSelectedMobileNumbers(allApplicationIds.mobileNumbers);
                      setStudentId(allApplicationIds?.studentId);
                    } else {
                      setSelectedApplications([]);
                      setSelectedEmails([]);
                      setSelectedMobileNumbers([]);
                      setStudentId([]);
                    }
                  }}
                  indeterminate={
                    selectedApplications?.length &&
                    selectedApplications?.length < leadStageDetails?.length
                  }
                />
                <QuickDropdownFilters
                  handleApplyQuickFilters={handleApplyQuickFilters}
                  quickFilterList={quickFilterList}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>
                <MultipleFilterSelectPicker
                  onClean={() => handleApplyQuickFilters("course_wise")}
                  callAPIAgain={handleApplyQuickFilters}
                  style={{ maxWidth: "130px" }}
                  appearance="subtle"
                  placement="bottomEnd"
                  placeholder="Form Name"
                  onChange={(value) => {
                    setSelectedCourse(value);
                  }}
                  pickerData={listOfCourses}
                  setSelectedPicker={setSelectedCourse}
                  pickerValue={selectedCourse}
                  loading={courseListInfo.isFetching}
                  onOpen={() => setSkipCourseApiCall(false)}
                />
              </TableCell>
              <TableCell>Contact Details</TableCell>
              {showPaymentStatus && <TableCell>Payment Status</TableCell>}
              <TableCell>Lead Stage</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {leadStageDetails.length ? (
              <>
                {leadStageDetails.map((row, index) => (
                  <TableRow hover key={row.name}>
                    <TableCell
                      className={`table-row-sticky ${provideTheClassName(row)}`}
                    >
                      <IndividualCheckBox
                        id={row?.application_id}
                        selectedStudent={selectedApplications}
                        handleOnChange={(checked) =>
                          handleCheckBoxOnChange(checked, row)
                        }
                      />
                    </TableCell>
                    <TableCell
                      sx={{ whiteSpace: "nowrap" }}
                      className="registered-name"
                      scope="row"
                    >
                      <RegisteredName
                        applicationIndex={index}
                        handleOpenUserProfileDrawer={
                          handleOpenUserProfileDrawer
                        }
                        setUserDetailsStateData={setUserDetailsStateData}
                        clickableName={clickableName}
                        dataRow={row}
                      />
                    </TableCell>
                    <TableCell>
                      {row?.course_name ? row?.course_name : `– –`}
                    </TableCell>
                    <TableCell className="student-contact-details">
                      <StudentContact
                        dataRow={{
                          student_mobile_no: row?.mobile_number,
                          student_email_id: row?.student_email_id,
                        }}
                      />
                    </TableCell>
                    {showPaymentStatus && (
                      <TableCell>
                        <PaymentStatus rowData={row} />
                      </TableCell>
                    )}
                    <TableCell sx={{ whiteSpace: "nowrap" }} align="center">
                      <Box sx={{ display: "inline-block" }}>
                        <Box
                          className="status lead-stage"
                          sx={{
                            cursor: showPaymentStatus ? "pointer" : "auto",
                          }}
                          onClick={() => {
                            setClickedApplicationId([row.application_id]);
                            setOpenChangeLeadStageDialog(true);
                          }}
                        >
                          {row?.lead_stage ? row?.lead_stage : `– –`}{" "}
                          {showPaymentStatus && <ArrowDropDownIcon />}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={showPaymentStatus ? 6 : 5}>
                  <Box className="loading-lottie-file-container">
                    <BaseNotFoundLottieLoader width={200} height={200} />
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ChangeMultipleLeadStage
        color={"application"}
        handleCloseDialogs={() => setOpenChangeLeadStageDialog(false)}
        openDialogs={openChangeLeadStageDialog}
        selectedApplicationIds={clickedApplicationId}
        setSelectedApplications={setClickedApplicationId}
      ></ChangeMultipleLeadStage>
    </Box>
  );
};

export default React.memo(SharedLeadDetailsTable);
