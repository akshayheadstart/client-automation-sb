import React, { useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Container,
  Box,
  Card,
  CardHeader,
  TableContainer,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../../styles/ViewRawData.css";
import "../../styles/sharedStyles.css";
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
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
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
import SelectTemplateDialog from "../TemplateManager/SelectTemplateDialog";
import SmsAndWhatsapp from "../../components/userProfile/SmsAndWhatsapp";
import Pagination from "../../components/shared/Pagination/Pagination";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import TableTopPagination from "../../components/ui/application-manager/TableTopPagination";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";

const ViewLeadsData = () => {
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

  const [rowCount, setRowCount] = useState(5);

  const getPageNoFromLocalStorage = localStorage.getItem(
    `${Cookies.get("userId")}'succesfullLeadTableSavePageNo'`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}'succesfullLeadTableSavePageNo'`
        )
      )
    : 1;

  const getRowsPerPageFromLocalStorage = localStorage.getItem(
    `${Cookies.get("userId")}'succesfullLeadTableRowPerPage'`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}'succesfullLeadTableRowPerPage'`
        )
      )
    : 25;

  const [rowsPerPage, setRowsPerPage] = useState(
    getRowsPerPageFromLocalStorage
  );
  const [pageNumber, setPageNumber] = useState(getPageNoFromLocalStorage);

  const count = Math.ceil(rowCount / rowsPerPage);

  const {
    data: rawData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetViewRawDataQuery({
    offlineId: state?.lead_offline_id,
    pageNumber,
    rowsPerPage,
    collegeId,
    viewLead: true,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(rawData?.data)) {
          setViewRawData(rawData?.data);
          setTotalRecordsCount(rawData?.total);
          setRowCount(rawData?.total);
        } else {
          throw new Error("Get All Lead Data API response has changed");
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
      { offlineId: state?.lead_offline_id, viewLead: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rawData,
    pageNumber,
    prefetchAllViewRawData,
    rowsPerPage,
    state?.lead_offline_id,
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
          `${Cookies.get("userId")}${state?.lead_offline_id}selectedLeadData`
        )
      );

      if (selectedLeads?.length > 0) {
        //leads
        const filteredLeads = viewRawData.filter(
          (lead) => !selectedLeads.some((element) => element.id === lead.id)
        );

        setSelectedLeads((currentArray) => [...currentArray, ...filteredLeads]);
        localStorage.setItem(
          `${Cookies.get("userId")}${state?.lead_offline_id}selectedLeadData`,
          JSON.stringify([...selectedLeads, ...filteredLeads])
        );
      } else {
        setSelectedLeads(viewRawData);
        localStorage.setItem(
          `${Cookies.get("userId")}${state?.lead_offline_id}selectedLeadData`,
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
        `${Cookies.get("userId")}${state?.lead_offline_id}selectedLeadData`,
        JSON.stringify(filteredLeads)
      );
    }
  };

  //set state of leads id, emails and mobile numbers
  useEffect(() => {
    const selectedLeadsMandatoryFields = selectedLeads.map((lead) => ({
      email: lead?.basic_details?.email,
      mobile_number: lead?.basic_details?.mobile_number,
    }));

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
          `${Cookies.get("userId")}${state?.lead_offline_id}selectedLeadData`,
          JSON.stringify([dataRow])
        );
      } else if (!selectedLeadIds.includes(dataRow.id)) {
        //leads
        setSelectedLeads((currentArray) => [...currentArray, dataRow]);

        localStorage.setItem(
          `${Cookies.get("userId")}${state?.lead_offline_id}selectedLeadData`,
          JSON.stringify([...selectedLeads, dataRow])
        );
      }
    } else {
      const filteredLeads = selectedLeads.filter((object) => {
        return object.id !== dataRow.id;
      });

      setSelectedLeads(filteredLeads);
      localStorage.setItem(
        `${Cookies.get("userId")}${state?.lead_offline_id}selectedLeadData`,
        JSON.stringify(filteredLeads)
      );
    }
  };

  // set selected leads in state from localstorage after reload
  useEffect(() => {
    //leads
    const selectedLeads = JSON.parse(
      localStorage.getItem(
        `${Cookies.get("userId")}${state?.lead_offline_id}selectedLeadData`
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
  const returnCourseName = (object) => {
    for (const property in object) {
      return `${property} ${
        object[property]?.specs?.length > 0
          ? `in ${object[property]?.specs[0]?.spec_name}`
          : ""
      }`;
    }
  };
  return (
    <Box>
      <Container maxWidth={false}>
        <Grid container>
          <Grid item md={12} sm={12} xs={12}>
            <Box className="view-raw-data-heading">
              <Box sx={{ display: "flex", alignItems: "center", pt: 2 }}>
                <IconButton onClick={() => navigate(-1)} aria-label="Example">
                  <ArrowBackIcon />
                </IconButton>
                <CardHeader
                  sx={{ flexWrap: "wrap", p: 0 }}
                  titleTypographyProps={{ fontSize: "22px" }}
                  title="Successfully Imported Lead"
                />
              </Box>

              {state?.lead_offline_id && (
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
                        handleClickOpenSelectTemplate("whatsapp");
                        handleClickOpenDialogsWhatsApp();
                      }}
                    >
                      Send WhatsApp
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>

            <Card sx={{ my: 2 }}>
              <Box>
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
              </Box>
              <Divider />

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
                    <TableContainer className="custom-scrollbar">
                      <Table sx={{ minWidth: 800 }}>
                        <TableHead sx={{ backgroundColor: "#F2F9FE" }}>
                          <TableRow>
                            <TableCell>
                              <Checkbox
                                checked={selectTopCheckbox}
                                onChange={(e) => handleAllCheckbox(e)}
                                indeterminate={showIndeterminate}
                                color="info"
                              />
                            </TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Phone</TableCell>
                            <TableCell align="center">Verify</TableCell>
                            <TableCell align="center">Course Name</TableCell>
                            <TableCell align="center">Created At</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {viewRawData.map((data) => (
                            <TableRow hover key={data?.id}>
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
                              <TableCell align="center">
                                <span
                                  style={{ fontWeight: "bold" }}
                                >{`${data?.basic_details?.first_name} ${data?.basic_details?.middle_name} ${data?.basic_details?.last_name}`}</span>
                              </TableCell>
                              <TableCell align="center">
                                {data?.basic_details?.email}
                              </TableCell>
                              <TableCell align="center">
                                {data?.basic_details?.mobile_number}
                                <IconButton
                                  onClick={() =>
                                    window.open(
                                      `tel:${
                                        data?.basic_details?.mobile_number
                                          ? data?.basic_details?.mobile_number
                                          : "NA"
                                      }`,
                                      "_self"
                                    )
                                  }
                                  sx={{ backgroundColor: "#e8f5e9", ml: 1 }}
                                >
                                  <PhoneEnabledIcon
                                    sx={{
                                      fontSize: "20px",
                                      color: "rgb(20, 110, 190)",
                                    }}
                                  ></PhoneEnabledIcon>
                                </IconButton>
                              </TableCell>
                              <TableCell align="center">
                                <span
                                  className={
                                    data?.basic_details?.is_verify
                                      ? "severityPill-success"
                                      : "severityPill-failed"
                                  }
                                >
                                  {data?.basic_details?.is_verify
                                    ? "Verified"
                                    : "Unverified"}
                                </span>
                              </TableCell>
                              <TableCell align="center">
                                {returnCourseName(data?.course_details)}
                              </TableCell>
                              <TableCell align="center">
                                {data?.created_at}
                              </TableCell>
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
                          handleChangePage(
                            page,
                            `${state?.lead_offline_id}'succesfullLeadTableSavePageNo'`,
                            setPageNumber
                          )
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
                        localStorageChangeRowPerPage={`${state?.lead_offline_id}'succesfullLeadTableRowPerPage'`}
                        localStorageChangePage={`${state?.lead_offline_id}'succesfullLeadTableSavePageNo'`}
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
          localStorageKey={`${state?.lead_offline_id}selectedLeadData`}
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
export default ViewLeadsData;
