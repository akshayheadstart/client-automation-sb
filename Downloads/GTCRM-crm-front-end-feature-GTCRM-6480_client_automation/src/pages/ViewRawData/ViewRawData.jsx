/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Box,
  Card,
  TableContainer,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import "../../styles/ViewRawData.css";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { removeCookies } from "../../Redux/Slices/authSlice";
import { handleChangePage } from "../../helperFunctions/pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import {
  useGetViewRawDataQuery,
  usePrefetch,
} from "../../Redux/Slices/applicationDataApiSlice";
import useToasterHook from "../../hooks/useToasterHook";
import { removeDuplicatesAndSetObjectValues } from "../../helperFunctions/removeDuplicatesAndSetObjectValues";
import { ChevronDown as ChevronDownIcon } from "../../icons/ChevronDown";
import Mail from "../../components/userProfile/Mail";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import SelectTemplateDialog from "../TemplateManager/SelectTemplateDialog";
import SmsAndWhatsapp from "../../components/userProfile/SmsAndWhatsapp";
import Pagination from "../../components/shared/Pagination/Pagination";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import TableTopPagination from "../../components/ui/application-manager/TableTopPagination";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import "../../styles/communicationSummary.css";

const ViewRawData = () => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const tokenState = useSelector((state) => state.authentication.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (tokenState.detail) {
    dispatch(removeCookies());
    navigate("/page401");
  }
  const pushNotification = useToasterHook();
  const { state } = useLocation();

  // action button-----
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [
    viewRawDataTableInternalServerError,
    setViewRawDataTableInternalServerError,
  ] = useState(false);
  const [hideViewRawDataTable, setHideViewRawDataTable] = useState(false);
  const [
    somethingWentWrongInViewRawDataTable,
    setSomethingWentWrongInViewRawDataTable,
  ] = useState(false);

  const [viewRawData, setViewRawData] = useState([]);
  const [totalRecordsCount, setTotalRecordsCount] = useState(0);

  const [rowCount, setRowCount] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [pageNumber, setPageNumber] = useState(1);

  const count = Math.ceil(rowCount / rowsPerPage);
  const [otherFieldsOfColumn, setOtherFieldsOfColumn] = useState([]);

  const {
    data: rawData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetViewRawDataQuery({
    pageNumber,
    rowsPerPage,
    collegeId,
    offlineId: state?.offlineDataId,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(rawData?.data)) {
          const headerOfTheTable = [];
          /* 
          here in this loop we are extracting the dynamic key name to be used as the dynamic header of the table in UI
          */
          rawData?.data.forEach((record) => {
            const keysOfOtherField = Object.keys(record.other_field);
            keysOfOtherField.forEach((key) => {
              if (!headerOfTheTable.includes(key)) {
                headerOfTheTable.push(key);
              }
            });
          });
          setOtherFieldsOfColumn(headerOfTheTable);
          setViewRawData(rawData?.data);
          setTotalRecordsCount(rawData?.total);
          setRowCount(rawData?.total);
        } else {
          throw new Error("get_all_raw_data API response has changed");
        }
      }

      if (isError) {
        setTotalRecordsCount(0);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setViewRawDataTableInternalServerError,
            setHideViewRawDataTable,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInViewRawDataTable,
        setHideViewRawDataTable,
        10000
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error, isError, isSuccess, navigate, rawData]);

  // use react hook for this
  const prefetchAllViewRawData = usePrefetch("getViewRawData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      rawData,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchAllViewRawData,
      { offlineId: state?.offlineDataId }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rawData,
    pageNumber,
    prefetchAllViewRawData,
    rowsPerPage,
    state?.offlineDataId,
  ]);

  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedMobileNumbers, setSelectedMobileNumbers] = useState([]);

  //top checkbox handler function
  const handleAllCheckbox = (e) => {
    if (e.target.checked === true) {
      const selectedLeads = JSON.parse(
        localStorage.getItem(
          `${Cookies.get("userId")}${state?.offlineDataId}selectedLeads`
        )
      );

      if (selectedLeads?.length > 0) {
        //leads
        const filteredLeads = viewRawData.filter(
          (lead) => !selectedLeads.some((element) => element.id === lead.id)
        );

        setSelectedLeads((currentArray) => [...currentArray, ...filteredLeads]);
        localStorage.setItem(
          `${Cookies.get("userId")}${state?.offlineDataId}selectedLeads`,
          JSON.stringify([...selectedLeads, ...filteredLeads])
        );
      } else {
        setSelectedLeads(viewRawData);
        localStorage.setItem(
          `${Cookies.get("userId")}${state?.offlineDataId}selectedLeads`,
          JSON.stringify(viewRawData)
        );
      }
    } else {
      //set selected leads
      const filteredLeads = selectedLeads.filter(
        (lead) => !viewRawData.some((element) => element.id === lead.id)
      );
      setSelectedLeads(filteredLeads);
      localStorage.setItem(
        `${Cookies.get("userId")}${state?.offlineDataId}selectedLeads`,
        JSON.stringify(filteredLeads)
      );
    }
  };

  //set state of leads id, emails and mobile numbers
  useEffect(() => {
    const selectedLeadsMandatoryFields = selectedLeads.map(
      (lead) => lead.mandatory_field
    );
    setSelectedMobileNumbers(
      removeDuplicatesAndSetObjectValues(
        "mobile_number",
        selectedLeadsMandatoryFields
      )
    );
    setSelectedEmails(
      removeDuplicatesAndSetObjectValues("email", selectedLeadsMandatoryFields)
    );
    const selectedLeadIds = selectedLeads?.map((object) => object.id);
    setSelectedLeadIds(selectedLeadIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeads]);

  //show top checkbox and indeterminate
  useEffect(() => {
    let leadCount = 0;
    const leadIds = viewRawData?.map((lead) => lead.id);
    leadIds?.forEach((item) => {
      if (selectedLeadIds?.indexOf(item) !== -1) leadCount++;
    });
    if (leadCount === viewRawData?.length && leadCount > 0) {
      setSelectTopCheckbox(true);
    } else {
      setSelectTopCheckbox(false);
    }

    if (leadCount < viewRawData?.length && leadCount > 0) {
      setShowIndeterminate(true);
    } else {
      setShowIndeterminate(false);
    }
  }, [viewRawData, selectedLeadIds]);

  //according to checkbox select set the leads id in selectleads state
  const handleSingleCheckBox = (e, dataRow) => {
    const selectedLeadIds = selectedLeads.map((lead) => lead.id);
    if (e.target.checked === true) {
      if (selectedLeads.length < 1) {
        //leads
        setSelectedLeads([dataRow]);
        localStorage.setItem(
          `${Cookies.get("userId")}${state?.offlineDataId}selectedLeads`,
          JSON.stringify([dataRow])
        );
      } else if (!selectedLeadIds.includes(dataRow.id)) {
        //leads
        setSelectedLeads((currentArray) => [...currentArray, dataRow]);

        localStorage.setItem(
          `${Cookies.get("userId")}${state?.offlineDataId}selectedLeads`,
          JSON.stringify([...selectedLeads, dataRow])
        );
      }
    } else {
      const filteredLeads = selectedLeads.filter((object) => {
        return object.id !== dataRow.id;
      });

      setSelectedLeads(filteredLeads);
      localStorage.setItem(
        `${Cookies.get("userId")}${state?.offlineDataId}selectedLeads`,
        JSON.stringify(filteredLeads)
      );
    }
  };

  // set selected leads in state from localstorage after reload
  useEffect(() => {
    //leads
    const selectedLeads = JSON.parse(
      localStorage.getItem(
        `${Cookies.get("userId")}${state?.offlineDataId}selectedLeads`
      )
    );
    if (selectedLeads?.length > 0) {
      setSelectedLeads(selectedLeads);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //mail component states
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [emailPayload, setEmailPayload] = useState(false);
  const handleComposeClick = () => {
    if (selectedLeads?.length === 0) {
      pushNotification("warning", "Please select leads");
    } else if (selectedEmails?.length === 0) {
      pushNotification("warning", "This lead has no email");
    } else {
      setIsComposeOpen(true);
      setEmailPayload(false);
    }
  };

  const handleComposerClose = () => {
    setIsComposeOpen(false);
  };

  //select sms template component
  const [openSelectTemplateDialog, setOpenSelectTemplateDialog] =
    React.useState(false);
  const [templateBody, setTemplateBody] = React.useState("");
  const [templateId, setTemplateId] = useState("");
  const [smsDltContentId, setSmsDltContentId] = React.useState("");
  const [smsType, setSmsType] = React.useState("");
  const [smsSenderName, setSenderName] = React.useState("");
  const [templateType, setTemplateType] = React.useState("");

  const handleClickOpenSelectTemplate = (type) => {
    if (selectedLeads?.length === 0) {
      pushNotification("warning", "Please select leads");
    } else if (selectedMobileNumbers?.length === 0) {
      pushNotification("warning", "This lead has no mobile number");
    } else {
      setOpenSelectTemplateDialog(true);
      setTemplateType(type);
    }
  };

  const handleCloseSelectTemplate = () => {
    setOpenSelectTemplateDialog(false);
  };

  //sms
  const [openDialogsSms, setOpenDialogsSms] = React.useState(false);
  const handleClickOpenDialogsSms = () => {
    setOpenDialogsSms(true);
  };
  const handleCloseDialogsSms = () => {
    setOpenDialogsSms(false);
  };
  //whatsApp
  const [openDialogsWhatsApp, setOpenDialogsWhatsApp] = React.useState(false);
  const handleClickOpenDialogsWhatsApp = () => {
    if (selectedLeads?.length === 0) {
      pushNotification("warning", "Please select leads");
    } else if (selectedMobileNumbers?.length === 0) {
      pushNotification("warning", "This lead has no mobile number");
    } else {
      setOpenDialogsWhatsApp(true);
    }
  };
  const handleCloseDialogsWhatsApp = () => {
    setOpenDialogsWhatsApp(false);
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Admin dashboard Head Title add
  useEffect(() => {
    setHeadTitle(
      state?.offlineDataId ? "Successfully Imported Entries" : "View Raw Data"
    );
    document.title = state?.offlineDataId
      ? "Successfully Imported Entries"
      : "View Raw Data";
  }, [headTitle]);
  return (
    <Box className="view-raw-data-header-box-container">
      <Container maxWidth={false}>
        <Grid container>
          <Grid item md={12} sm={12} xs={12}>
            <Box className="view-raw-data-heading">
              {state?.offlineDataId && (
                <>
                  <Button
                    id="action-button"
                    aria-controls={open ? "action-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    endIcon={<ChevronDownIcon fontSize="small" />}
                    sx={{ m: 1 }}
                    variant="outlined"
                    size="small"
                  >
                    Actions
                  </Button>
                  <Menu
                    id="action-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "action-button",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        handleComposeClick();
                      }}
                    >
                      Send email
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        handleClickOpenSelectTemplate("sms");
                      }}
                    >
                      Send sms
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        handleClickOpenSelectTemplate();
                        handleClickOpenDialogsWhatsApp();
                      }}
                    >
                      Send WhatsApp
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>

            <Card
              className="view-raw-data-container common-box-shadow"
              sx={{ my: 2 }}
            >
              <Box className="common-table-heading-container" sx={{ p: 2 }}>
                <TableDataCount
                  totalCount={totalRecordsCount}
                  currentPageShowingCount={viewRawData.length}
                  pageNumber={pageNumber}
                  rowsPerPage={rowsPerPage}
                />

                <TableTopPagination
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  totalCount={totalRecordsCount}
                  rowsPerPage={rowsPerPage}
                />
              </Box>

              {viewRawDataTableInternalServerError ||
              somethingWentWrongInViewRawDataTable ? (
                <Box className="common-layout-style">
                  {viewRawDataTableInternalServerError && (
                    <Error500Animation
                      height={400}
                      width={400}
                    ></Error500Animation>
                  )}
                  {somethingWentWrongInViewRawDataTable && (
                    <ErrorFallback
                      error={apiResponseChangeMessage}
                      resetErrorBoundary={() => window.location.reload()}
                    />
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    visibility: hideViewRawDataTable ? "hidden" : "visible",
                  }}
                >
                  {isFetching ? (
                    <TableBody
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        minHeight: "55vh",
                      }}
                    >
                      <LeefLottieAnimationLoader
                        height={120}
                        width={120}
                      ></LeefLottieAnimationLoader>
                    </TableBody>
                  ) : viewRawData?.length > 0 ? (
                    <TableContainer
                      sx={{ whiteSpace: "nowrap" }}
                      className="custom-scrollbar call-summary-details-table"
                    >
                      <Table sx={{ minWidth: 800 }}>
                        <TableHead sx={{ backgroundColor: "#F2F9FE" }}>
                          <TableRow>
                            {state?.offlineDataId && (
                              <TableCell>
                                <Checkbox
                                  checked={selectTopCheckbox}
                                  onChange={(e) => handleAllCheckbox(e)}
                                  indeterminate={showIndeterminate}
                                  color="info"
                                />
                              </TableCell>
                            )}
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Created At</TableCell>
                            {otherFieldsOfColumn.map((column) => (
                              <TableCell>{column}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {viewRawData.map((data) => (
                            <TableRow key={data?.id}>
                              {state?.offlineDataId && (
                                <TableCell>
                                  {selectedLeadIds?.includes(data?.id) ? (
                                    <IconButton
                                      sx={{ p: "9px" }}
                                      onClick={() => {
                                        handleSingleCheckBox(
                                          {
                                            target: {
                                              checked: false,
                                            },
                                          },
                                          data
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
                                        selectedLeadIds?.includes(data?.id)
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        handleSingleCheckBox(e, data);
                                      }}
                                    />
                                  )}
                                </TableCell>
                              )}
                              <TableCell>
                                {data?.mandatory_field?.email
                                  ? data?.mandatory_field?.email
                                  : `– –`}
                              </TableCell>
                              <TableCell>
                                {data?.mandatory_field?.mobile_number
                                  ? data?.mandatory_field?.mobile_number
                                  : `– –`}
                              </TableCell>
                              <TableCell>
                                {data?.created_at ? data?.created_at : `– –`}
                              </TableCell>

                              {otherFieldsOfColumn.map((header) => (
                                <TableCell key={data?.other_field[header]}>
                                  {data?.other_field[header]
                                    ? data?.other_field[header]
                                    : `– –`}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box className="common-layout-style">
                      <BaseNotFoundLottieLoader
                        height={250}
                        width={250}
                      ></BaseNotFoundLottieLoader>
                    </Box>
                  )}

                  {!isFetching && viewRawData?.length > 0 && (
                    <Box className="view-raw-data-pagination-container">
                      <Pagination
                        className="pagination-bar"
                        currentPage={pageNumber}
                        totalCount={rowCount}
                        pageSize={rowsPerPage}
                        onPageChange={(page) =>
                          handleChangePage(page, "", setPageNumber)
                        }
                        count={count}
                      />

                      <AutoCompletePagination
                        rowsPerPage={rowsPerPage}
                        rowPerPageOptions={rowPerPageOptions}
                        setRowsPerPageOptions={setRowsPerPageOptions}
                        rowCount={rowCount}
                        page={pageNumber}
                        setPage={setPageNumber}
                        setRowsPerPage={setRowsPerPage}
                      ></AutoCompletePagination>
                    </Box>
                  )}
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
      {/* send email */}
      <Box>
        <Mail
          localStorageKey={`${state?.offlineDataId}selectedLeads`}
          emailPayload={emailPayload}
          open={isComposeOpen}
          hideToInputField={true}
          sendBulkEmail={true}
          onClose={handleComposerClose}
          selectedEmails={selectedEmails}
          setSelectedApplications={setSelectedLeads}
          setSelectedEmails={setSelectedEmails}
        ></Mail>
      </Box>
      {/* select sms template component  */}
      {openSelectTemplateDialog && (
        <SelectTemplateDialog
          setTemplateId={setTemplateId}
          handleClickOpenDialogsSms={handleClickOpenDialogsSms}
          openDialoge={openSelectTemplateDialog}
          handleClose={handleCloseSelectTemplate}
          setTemplateBody={setTemplateBody}
          setSmsDltContentId={setSmsDltContentId}
          setSmsType={setSmsType}
          setSenderName={setSenderName}
          from={templateType}
        ></SelectTemplateDialog>
      )}
      {/* Send Sms  */}
      <Box>
        <SmsAndWhatsapp
          localStorageKey={`${state?.offlineDataId}selectedLeads`}
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
          setSelectedApplications={setSelectedLeads}
          setSelectedEmails={setSelectedEmails}
          setSelectedMobileNumbers={setSelectedMobileNumbers}
        ></SmsAndWhatsapp>
      </Box>
      <Box>
        <SmsAndWhatsapp
          templateId={templateId}
          localStorageKey={`${state?.offlineDataId}selectedLeads`}
          color="#25D366"
          name={"WhatsApp"}
          handleClickOpenSelectTemplate={handleClickOpenSelectTemplate}
          handleClickOpenDialogs={handleClickOpenDialogsWhatsApp}
          handleCloseDialogs={handleCloseDialogsWhatsApp}
          openDialogs={openDialogsWhatsApp}
          setOpenDialogs={setOpenDialogsWhatsApp}
          selecteMobileNumber={selectedMobileNumbers}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          from={"lead-manager"}
          setSelectedApplications={setSelectedLeads}
          setSelectedEmails={setSelectedEmails}
          setSelectedMobileNumbers={setSelectedMobileNumbers}
        ></SmsAndWhatsapp>
      </Box>
    </Box>
  );
};

export default ViewRawData;
