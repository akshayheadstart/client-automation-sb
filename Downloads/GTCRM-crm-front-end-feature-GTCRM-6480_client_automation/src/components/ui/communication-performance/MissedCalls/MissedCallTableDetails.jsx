import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { missedCallDetailsTableHeader } from "../../../../constants/LeadStageList";
import SortIndicatorWithTooltip from "../../../shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";
import { defaultRowsPerPageOptions } from "../../../Calendar/utils";
import { showCheckboxAndIndeterminate } from "../../../../helperFunctions/checkboxHandleFunction";
import IndividualCheckBox from "../../../shared/SelectedStudent/IndividualCheckBox";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import Pagination from "../../../shared/Pagination/Pagination";
import { handleChangePage } from "../../../../helperFunctions/pagination";
import AutoCompletePagination from "../../../shared/forms/AutoCompletePagination";
import MissedCallQuickActions from "./MissedCallQuickActions";
import BaseNotFoundLottieLoader from "../../../shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader";
import AssignApplicationDialog from "../CommunicationSummary/AssignApplicationDialog";
import LeadNameAndApplicationId from "../CommunicationSummary/LeadNameAndApplicationId";
import OutboundCallDialog from "../../../shared/Dialogs/OutboundCallDialog";
import SmsAndWhatsapp from "../../../userProfile/SmsAndWhatsapp";
import SelectTemplateDialog from "../../../../pages/TemplateManager/SelectTemplateDialog";
import useToasterHook from "../../../../hooks/useToasterHook";

function MissedCallTableDetails({
  sortingColumn,
  setSortingColumn,
  sortingType,
  setSortingType,
  missedCallList,
  pageNumber,
  setPageNumber,
  rowsPerPage,
  setRowsPerPage,
  totalMissedCallCount,
  loading,
  setSelectedStudentMobile,
  selectedStudentMobile,
}) {
  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedCall, setSelectedCall] = useState({});
  const [openOutboundCallDialog, setOpenOutboundCallDialog] = useState(false);

  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);

  //select sms template component
  const [openSelectTemplateDialog, setOpenSelectTemplateDialog] =
    React.useState(false);
  const [templateBody, setTemplateBody] = React.useState("");
  const [templateId, setTemplateId] = useState("");
  const [smsDltContentId, setSmsDltContentId] = React.useState("");
  const [smsType, setSmsType] = React.useState("");
  const [smsSenderName, setSenderName] = React.useState("");
  const [templateType, setTemplateType] = React.useState("");

  //sms
  const [openDialogsSms, setOpenDialogsSms] = React.useState(false);
  const handleClickOpenDialogsSms = useCallback(() => {
    setOpenDialogsSms(true);
  }, []);
  const handleCloseDialogsSms = useCallback(() => {
    setOpenDialogsSms(false);
  }, []);

  const handleCloseDialogsWhatsApp = () => {
    setOpenDialogsWhatsapp(false);
  };

  const handleCloseSelectTemplate = () => {
    setOpenSelectTemplateDialog(false);
  };

  const [openDialogsWhatsApp, setOpenDialogsWhatsapp] = React.useState(false);

  const pushNotification = useToasterHook();

  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();
  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);

  const allMissedCallDetails = useMemo(() => {
    const mobileNumbers = [];
    missedCallList?.forEach((details) => {
      mobileNumbers.push(`+91${details.student_mobile_number?.toString()}`);
    });
    return { mobileNumbers };
  }, [missedCallList]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudentMobile(allMissedCallDetails.mobileNumbers);
    } else {
      setSelectedStudentMobile([]);
    }
  };

  const handleRemoveSelectedItems = (selectedData, deleteData, setData) => {
    const prevData = [...selectedData];
    prevData.splice(prevData.indexOf(deleteData), 1);
    setData(prevData);
  };

  const handleCheckBoxOnChange = (checked, data) => {
    if (checked) {
      setSelectedStudentMobile((prev) => [
        ...prev,
        `+91${data.student_mobile_number?.toString()}`,
      ]);
    } else {
      handleRemoveSelectedItems(
        selectedStudentMobile,
        `+91${data.student_mobile_number?.toString()}`,
        setSelectedStudentMobile
      );
    }
  };

  //show top checkbox and indeterminate
  useEffect(() => {
    showCheckboxAndIndeterminate(
      allMissedCallDetails.mobileNumbers,
      selectedStudentMobile,
      setSelectTopCheckbox,
      setShowIndeterminate
    );
  }, [allMissedCallDetails.mobileNumbers, selectedStudentMobile]);

  const handleClickOpenSelectTemplate = useCallback(
    (type) => {
      if (selectedStudentMobile?.length === 0) {
        pushNotification("warning", "Please select call");
      } else {
        setOpenSelectTemplateDialog(true);
        setTemplateType(type);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedStudentMobile]
  );
  const handleClickOpenDialogsWhatsApp = useCallback(() => {
    if (selectedStudentMobile?.length === 0) {
      pushNotification("warning", "Please select call");
    } else {
      setOpenDialogsWhatsapp(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudentMobile]);

  return (
    <>
      {loading ? (
        <Box
          data-testid="loading-animation"
          className="common-not-found-container"
        >
          <LeefLottieAnimationLoader height={150} width={150} />
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          {missedCallList?.length ? (
            <TableContainer className="custom-scrollbar">
              <Table className="call-summary-details-table">
                <TableHead>
                  <TableRow>
                    <TableCell className={`table-row-sticky`}>
                      <Checkbox
                        checked={selectTopCheckbox}
                        onChange={(e) => handleSelectAll(e)}
                        indeterminate={showIndeterminate}
                        color="info"
                        sx={{ pl: 0 }}
                      />
                    </TableCell>
                    {missedCallDetailsTableHeader?.map((head) => (
                      <TableCell width={head?.width} key={head.name}>
                        <Box
                          sx={{
                            justifyContent: head?.align
                              ? "flex-start"
                              : "center",
                          }}
                          className="sorting-option-with-header-content"
                        >
                          {head?.name}
                          {head?.sort && (
                            <>
                              <SortIndicatorWithTooltip
                                sortType={
                                  sortingColumn === head?.value
                                    ? sortingType
                                    : ""
                                }
                                value={head?.value}
                                sortColumn={sortingColumn}
                                setSortType={setSortingType}
                                setSortColumn={setSortingColumn}
                              />
                            </>
                          )}
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {missedCallList.map((callDetails) => (
                    <TableRow
                      key={callDetails?._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell className={`table-row-sticky`}>
                        <IndividualCheckBox
                          id={`+91${callDetails.student_mobile_number?.toString()}`}
                          selectedStudent={selectedStudentMobile}
                          handleOnChange={(checked) =>
                            handleCheckBoxOnChange(checked, callDetails)
                          }
                          padding={0}
                        />
                      </TableCell>

                      <TableCell>
                        {callDetails?.application_id &&
                        callDetails?.student_id ? (
                          <LeadNameAndApplicationId
                            callDetails={{
                              custom_application_id:
                                callDetails?.custom_application_id,
                              applicant_name: callDetails?.student_name,
                              application_id: callDetails?.application_id,
                              student_id: callDetails?.student_id,
                            }}
                          />
                        ) : (
                          <Typography
                            onClick={() => {
                              setOpenAssignDialog(true);
                              setSelectedCall(callDetails);
                            }}
                            className="missed-caller-student-name"
                          >
                            {callDetails?.student_name}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {callDetails?.dialed_call_count}
                      </TableCell>
                      <TableCell align="center">
                        {callDetails?.missed_call_count}
                      </TableCell>
                      <TableCell align="center">
                        {callDetails?.assigned_counsellor}
                      </TableCell>
                      <TableCell align="center">
                        {`${callDetails?.missed_call_age} Days`}
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          className="missed-caller-student-name"
                          onClick={() => {
                            setOpenOutboundCallDialog(true);
                            setSelectedCall(callDetails);
                          }}
                        >
                          {callDetails?.student_mobile_number}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {callDetails?.landing_number || "--"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box className="common-not-found-container">
              <BaseNotFoundLottieLoader height={200} width={200} />
            </Box>
          )}

          {selectedStudentMobile?.length > 0 && (
            <MissedCallQuickActions
              isScrolledToPagination={isScrolledToPagination}
              selectedStudentMobile={selectedStudentMobile}
              setSelectedStudentMobile={setSelectedStudentMobile}
              handleClickOpenSelectTemplate={handleClickOpenSelectTemplate}
              handleSentWhatsapp={() => setOpenDialogsWhatsapp(true)}
              handleSendSms={() => handleClickOpenSelectTemplate("sms")}
            />
          )}
          {missedCallList?.length > 0 && (
            <Box ref={paginationRef} className="common-pagination-container">
              <Pagination
                className="pagination-bar"
                currentPage={pageNumber}
                totalCount={totalMissedCallCount}
                pageSize={rowsPerPage}
                onPageChange={(page) =>
                  handleChangePage(page, "", setPageNumber)
                }
                count={Math.ceil(totalMissedCallCount / rowsPerPage)}
              />
              <AutoCompletePagination
                rowsPerPage={rowsPerPage}
                rowPerPageOptions={rowPerPageOptions}
                setRowsPerPageOptions={setRowsPerPageOptions}
                rowCount={totalMissedCallCount}
                page={pageNumber}
                setPage={setPageNumber}
                setRowsPerPage={setRowsPerPage}
              ></AutoCompletePagination>
            </Box>
          )}
        </Box>
      )}
      <AssignApplicationDialog
        openDialog={openAssignDialog}
        setOpenDialog={setOpenAssignDialog}
        phoneNumber={`+91${selectedCall?.student_mobile_number}`}
        missedCall={true}
      />
      <OutboundCallDialog
        phoneNumber={selectedCall?.student_mobile_number}
        openDialog={openOutboundCallDialog}
        setOpenDialog={setOpenOutboundCallDialog}
        applicationId={selectedCall?.application_id}
      />
      {/* select sms template component  */}
      {openSelectTemplateDialog && (
        <SelectTemplateDialog
          setTemplateId={setTemplateId}
          handleClickOpenDialogsSms={handleClickOpenDialogsSms}
          openDialoge={openSelectTemplateDialog}
          handleClose={handleCloseSelectTemplate}
          setTemplateBody={setTemplateBody}
          setSenderName={setSenderName}
          setSmsType={setSmsType}
          setSmsDltContentId={setSmsDltContentId}
          from={templateType}
        ></SelectTemplateDialog>
      )}
      {/* Send Sms  */}
      <Box>
        <SmsAndWhatsapp
          color="#DD34B8"
          name={"SMS"}
          handleClickOpenDialogs={handleClickOpenDialogsSms}
          handleCloseDialogs={handleCloseDialogsSms}
          openDialogs={openDialogsSms}
          setOpenDialogs={setOpenDialogsSms}
          selecteMobileNumber={selectedStudentMobile}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          smsDltContentId={smsDltContentId}
          smsType={smsType}
          smsSenderName={smsSenderName}
          from={"lead-manager"}
          setSelectedApplications={() => {}}
          setSelectedEmails={() => {}}
          setSelectedMobileNumbers={setSelectedStudentMobile}
          localStorageKey={""}
        ></SmsAndWhatsapp>
      </Box>
      <Box>
        <SmsAndWhatsapp
          templateId={templateId}
          color="#25D366"
          name={"WhatsApp"}
          handleClickOpenDialogs={handleClickOpenDialogsWhatsApp}
          handleCloseDialogs={handleCloseDialogsWhatsApp}
          openDialogs={openDialogsWhatsApp}
          setOpenDialogs={setOpenDialogsWhatsapp}
          selecteMobileNumber={selectedStudentMobile}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          handleClickOpenSelectTemplate={handleClickOpenSelectTemplate}
          from={"lead-manager"}
          setSelectedApplications={() => {}}
          setSelectedEmails={() => {}}
          setSelectedMobileNumbers={setSelectedStudentMobile}
          localStorageKey={""}
        ></SmsAndWhatsapp>
      </Box>
    </>
  );
}

export default MissedCallTableDetails;
