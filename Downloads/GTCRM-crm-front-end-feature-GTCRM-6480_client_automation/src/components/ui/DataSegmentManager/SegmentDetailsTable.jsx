/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Checkbox,
  Drawer,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TableDataCount from "../application-manager/TableDataCount";
import TableTopPagination from "../application-manager/TableTopPagination";
import QuickDropdownFilters from "../application-manager/QuickDropdownFilters";
import {
  defaultRowsPerPageOptions,
  provideTheClassNameForDataSegmentCheckbox,
} from "../../Calendar/utils";
import "../../../styles/ApplicationManagerTable.css";
import AutoCompletePagination from "../../shared/forms/AutoCompletePagination";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import Pagination from "../../shared/Pagination/Pagination";
import RenderTableColumn from "./RenderTableColumn";
import LeadActions from "../application-manager/LeadActions";
import useToasterHook from "../../../hooks/useToasterHook";
import SmsAndWhatsapp from "../../userProfile/SmsAndWhatsapp";
import Mail from "../../userProfile/Mail";
import SelectTemplateDialog from "../../../pages/TemplateManager/SelectTemplateDialog";
import { handleChangePage } from "../../../helperFunctions/pagination";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import ApplicationHeader from "../../userProfile/ApplicationHeader";
import "../../../styles/ApplicationManagerTable.css";
import "../../../styles/sharedStyles.css";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import SendEmailVerificationDialog from "../../shared/Dialogs/SendEmailVerificationDialog";

const SegmentDetailsTable = ({
  tableHeadList,
  applications,
  quickFilterList,
  setIsScrolledToPagination,
  isScrolledToPagination,
  selectedApplications,
  setSelectedApplications,
  handleApplyQuickFilters,
  isLoading,
  pageNumber,
  setPageNumber,
  rowsPerPage,
  setRowsPerPage,
  totalApplication,
  isInternalServerError,
  isSomethingWentWrong,
  apiResponseChangeMessage,
  showActions,
  leadProfileAction,
  setSelectedEmails,
  selectedEmails,
  setSelectedMobileNumbers,
  selectedMobileNumbers,
  dataType,
  dataSegmentId
}) => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();
  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  const pushNotification = useToasterHook();
  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);

  //mail component states
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [emailPayload, setEmailPayload] = useState(false);

  //select sms template component
  const [openSelectTemplateDialog, setOpenSelectTemplateDialog] =
    React.useState(false);
  const [templateBody, setTemplateBody] = React.useState("");
  const [templateId, setTemplateId] = useState("");
  const [smsDltContentId, setSmsDltContentId] = React.useState("");
  const [smsType, setSmsType] = React.useState("");
  const [smsSenderName, setSenderName] = React.useState("");
  const [templateType, setTemplateType] = React.useState("");

  const handleComposeClick = useCallback(
    () => {
      if (selectedApplications?.length === 0) {
        pushNotification("warning", "Please select applications");
      } else {
        setEmailPayload(false);
        setIsComposeOpen(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedApplications]
  );

  const handleComposerClose = () => {
    setIsComposeOpen(false);
  };

  //sms
  const [openDialogsSms, setOpenDialogsSms] = React.useState(false);
  const handleClickOpenDialogsSms = useCallback(() => {
    setOpenDialogsSms(true);
  }, []);
  const handleCloseDialogsSms = useCallback(() => {
    setOpenDialogsSms(false);
  }, []);

  const [openDialogsWhatsApp, setOpenDialogsWhatsapp] = React.useState(false);
  const handleClickOpenDialogsWhatsApp = useCallback(() => {
    if (selectedApplications?.length === 0) {
      pushNotification("warning", "Please select applications");
    } else {
      setOpenDialogsWhatsapp(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApplications]);

  const handleCloseDialogsWhatsApp = () => {
    setOpenDialogsWhatsapp(false);
  };

  const handleCloseSelectTemplate = () => {
    setOpenSelectTemplateDialog(false);
  };

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);

  const handleClickOpenSelectTemplate = useCallback(
    (type) => {
      if (selectedApplications?.length === 0) {
        pushNotification("warning", "Please select applications");
      } else {
        setOpenSelectTemplateDialog(true);
        setTemplateType(type);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedApplications]
  );

  useEffect(() => {
    if (
      selectedApplications.length === applications.length &&
      applications.length
    ) {
      setSelectTopCheckbox(true);
      setShowIndeterminate(false);
    } else if (
      selectedApplications?.length &&
      selectedApplications.length !== applications.length
    ) {
      setSelectTopCheckbox(false);
      setShowIndeterminate(true);
    } else {
      setSelectTopCheckbox(false);
      setShowIndeterminate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApplications, applications]);

  const count = Math.ceil(totalApplication / rowsPerPage);

  const applicationEmailAndPhone = useMemo(() => {
    const allApplicationId = [];
    const allEmailId = [];
    const allPhone = [];

    applications.forEach((data) => {
      allApplicationId.push(data?.application_id);
      allEmailId.push(data?.email);
      allPhone.push(data?.mobile_number);
    });
    return { allApplicationId, allEmailId, allPhone };
  }, [applications]);

  const handleRemoveSelectedItems = (selectedData, deleteData, setData) => {
    const prevData = [...selectedData];
    prevData.splice(prevData.indexOf(deleteData), 1);
    setData(prevData);
  };
  const handleApplicationCheckBox = (checked, data) => {
    if (checked) {
      setSelectedApplications((prev) => [...prev, data.application_id]);
      setSelectedEmails && setSelectedEmails((prev) => [...prev, data.email]);
      setSelectedMobileNumbers &&
        setSelectedMobileNumbers((prev) => [...prev, data.mobile_number]);
    } else {
      handleRemoveSelectedItems(
        selectedApplications,
        data.application_id,
        setSelectedApplications
      );
      setSelectedEmails &&
        handleRemoveSelectedItems(
          selectedEmails,
          data.email,
          setSelectedEmails
        );
      setSelectedMobileNumbers &&
        handleRemoveSelectedItems(
          selectedMobileNumbers,
          data.mobile_number,
          setSelectedMobileNumbers
        );
    }
  };
  //new Code
  const [userProfileOpen, setUserProfileOpen] = React.useState(false);
  const handleOpenUserProfileDrawer = (key) => {
    setUserProfileOpen(true);
  };
  const [userDetailsStateData, setUserDetailsStateData] = useState({});
  useEffect(() => {
    if (userDetailsStateData) {
      setUserDetailsStateData((prevState) => ({
        ...prevState,
        eventType: "data-segment",
        title: "dataSegment",
        leadProfileAction: leadProfileAction,
      }));
    }
  }, [userProfileOpen]);
   //send verification email dialog state
   const [openSendVerificationEmailDialog, setOpenSendVerificationEmailDialog] =
   useState(false);
  return (
    <Box>
      {isInternalServerError || isSomethingWentWrong ? (
        <Box sx={{ minHeight: "25vh" }} className="common-not-found-container">
          {isInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
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
          {isLoading ? (
            <>
              <Box className="common-not-found-container">
                <LeefLottieAnimationLoader
                  height={200}
                  width={200}
                ></LeefLottieAnimationLoader>
              </Box>
            </>
          ) : (
            <>
              <Box>
                <Box className="segment-details-table-header">
                  <TableDataCount
                    totalCount={totalApplication}
                    currentPageShowingCount={applications?.length}
                    pageNumber={pageNumber}
                    rowsPerPage={rowsPerPage}
                  />

                  <TableTopPagination
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    rowsPerPage={rowsPerPage}
                    totalCount={totalApplication}
                  />
                </Box>
                {applications?.length > 0 ? (
                  <Box className="mainTable">
                    <TableContainer
                      sx={{ minWidth: 700 }}
                      className="custom-scrollbar"
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell className="checkbox-check-all-container table-row-sticky">
                              <Checkbox
                                color="info"
                                checked={selectTopCheckbox}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedApplications(
                                      applicationEmailAndPhone.allApplicationId
                                    );
                                    setSelectedEmails &&
                                      setSelectedEmails(
                                        applicationEmailAndPhone.allEmailId
                                      );
                                    setSelectedMobileNumbers &&
                                      setSelectedMobileNumbers(
                                        applicationEmailAndPhone.allPhone
                                      );
                                  } else {
                                    setSelectedApplications([]);
                                    setSelectedEmails && setSelectedEmails([]);
                                    setSelectedMobileNumbers &&
                                      setSelectedMobileNumbers([]);
                                  }
                                }}
                                indeterminate={showIndeterminate}
                              />
                              <QuickDropdownFilters
                                quickFilterList={quickFilterList}
                                handleApplyQuickFilters={
                                  handleApplyQuickFilters
                                }
                              />
                            </TableCell>

                            {tableHeadList.map((head) => {
                              return <TableCell key={head}>{head}</TableCell>;
                            })}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {applications.map((dataRow, index) => {
                            return (
                              <TableRow key={dataRow.application_id}>
                                <TableCell
                                  className={`table-row-sticky ${provideTheClassNameForDataSegmentCheckbox(
                                    dataRow,
                                    dataType
                                  )}`}
                                  width={5}
                                >
                                  {selectedApplications?.includes(
                                    dataRow?.application_id
                                  ) ? (
                                    <IconButton
                                      sx={{ p: "9px" }}
                                      onClick={() => {
                                        handleApplicationCheckBox(
                                          false,
                                          dataRow
                                        );
                                      }}
                                    >
                                      <CheckBoxOutlinedIcon
                                        sx={{ color: "#008be2" }}
                                      />
                                    </IconButton>
                                  ) : (
                                    <Checkbox
                                      checked={
                                        selectedApplications?.includes(
                                          dataRow?.application_id
                                        )
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        handleApplicationCheckBox(
                                          e.target.checked,
                                          dataRow
                                        );
                                      }}
                                    />
                                  )}
                                </TableCell>
                                {tableHeadList.map((header) => (
                                  <TableCell key={header}>
                                    <RenderTableColumn
                                      dataType={dataType}
                                      tableHead={header}
                                      dataRow={dataRow}
                                      applicationIndex={index}
                                      handleOpenUserProfileDrawer={
                                        handleOpenUserProfileDrawer
                                      }
                                      setUserDetailsStateData={
                                        setUserDetailsStateData
                                      }
                                    />
                                  </TableCell>
                                ))}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {applications?.length > 0 && (
                      <Box
                        ref={paginationRef}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Pagination
                          className="pagination-bar"
                          currentPage={pageNumber}
                          totalCount={totalApplication}
                          pageSize={rowsPerPage}
                          onPageChange={(page) =>
                            handleChangePage(page, ``, setPageNumber)
                          }
                          count={count}
                        />

                        <AutoCompletePagination
                          rowsPerPage={rowsPerPage}
                          rowPerPageOptions={rowPerPageOptions}
                          setRowsPerPageOptions={setRowsPerPageOptions}
                          rowCount={totalApplication}
                          page={pageNumber}
                          setPage={setPageNumber}
                          setRowsPerPage={setRowsPerPage}
                        ></AutoCompletePagination>
                      </Box>
                    )}
                    {selectedApplications?.length > 0 && showActions && (
                      <LeadActions
                        assignCounselorPermission={false}
                        isScrolledToPagination={isScrolledToPagination}
                        selectedApplications={selectedApplications?.length}
                        setSelectedApplications={setSelectedApplications}
                        handleClickOpenSelectTemplate={
                          handleClickOpenSelectTemplate
                        }
                        handleSentWhatsapp={() => setOpenDialogsWhatsapp(true)}
                        handleSendSms={() =>
                          handleClickOpenSelectTemplate("sms")
                        }
                        handleSentEmail={() => handleComposeClick()}
                        rawDataUploadHistory={true}
                        smsEmailWhatsappPermission={true}
                        dataSegment={false}
                        handleSendVerificationEmail={() =>
                          setOpenSendVerificationEmailDialog(true)
                        }
                      />
                    )}
                  </Box>
                ) : (
                  <Box className="common-not-found-container">
                    <BaseNotFoundLottieLoader width={250} height={250} />
                  </Box>
                )}

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
                    selecteMobileNumber={selectedMobileNumbers}
                    templateBody={templateBody}
                    setTemplateBody={setTemplateBody}
                    smsDltContentId={smsDltContentId}
                    smsType={smsType}
                    smsSenderName={smsSenderName}
                    from={"lead-manager"}
                    setSelectedApplications={setSelectedApplications}
                    setSelectedEmails={setSelectedEmails}
                    setSelectedMobileNumbers={setSelectedMobileNumbers}
                    localStorageKey={"adminSelectedApplications"}
                    dataSegmentId={dataSegmentId}
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
                    selecteMobileNumber={selectedMobileNumbers}
                    templateBody={templateBody}
                    setTemplateBody={setTemplateBody}
                    handleClickOpenSelectTemplate={
                      handleClickOpenSelectTemplate
                    }
                    from={"lead-manager"}
                    setSelectedApplications={setSelectedApplications}
                    setSelectedEmails={setSelectedEmails}
                    setSelectedMobileNumbers={setSelectedMobileNumbers}
                    localStorageKey={"adminSelectedApplications"}
                    dataSegmentId={dataSegmentId}
                  ></SmsAndWhatsapp>
                </Box>
                {/* send email */}
                <Box>
                  <Mail
                    emailPayload={emailPayload}
                    open={isComposeOpen}
                    hideToInputField={true}
                    sendBulkEmail={true}
                    onClose={handleComposerClose}
                    selectedEmails={selectedEmails}
                    setSelectedApplications={setSelectedApplications}
                    setSelectedEmails={setSelectedEmails}
                    localStorageKey={"adminSelectedApplications"}
                    dataSegmentId={dataSegmentId}
                  ></Mail>
                </Box>
              </Box>
              {/* dreawer user profile */}

              <Drawer
                anchor={"right"}
                open={userProfileOpen}
                disableEnforceFocus={true}
                onClose={() => {
                  setUserProfileOpen(false);
                }}
                className="vertical-scrollbar-drawer"
              >
                <Box className="user-profile-control-drawer-box-container">
                  <Box>
                    <ApplicationHeader
                      userDetailsStateData={userDetailsStateData}
                      viewProfileButton={true}
                      setUserProfileOpen={setUserProfileOpen}
                      leadProfileAction={leadProfileAction}
                    ></ApplicationHeader>
                  </Box>
                </Box>
              </Drawer>
            </>
          )}
        </>
      )}
      {openSendVerificationEmailDialog && (
        <SendEmailVerificationDialog
          open={openSendVerificationEmailDialog}
          handleClose={() => setOpenSendVerificationEmailDialog(false)}
          selectedEmails={selectedEmails}
          setSelectedApplications={setSelectedApplications}
          localStorageKey={"adminSelectedApplications"}
        />
      )}
    </Box>
  );
};

export default SegmentDetailsTable;
