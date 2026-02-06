import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "../../styles/ticketManager.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { SeverityPillTicket } from "./severityPill/SeverityPIllTicket";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeCookies } from "../../Redux/Slices/authSlice";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import BootstrapDialogTitle from "../shared/Dialogs/BootsrapDialogsTitle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import useToasterHook from "../../hooks/useToasterHook";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import "../../styles/sharedStyles.css";
import {
  tableSlice,
  useGetUserProfileLeadTicketListQuery,
  usePrefetch,
} from "../../Redux/Slices/applicationDataApiSlice";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";
const TicketManager = (props) => {
  const pushNotification = useToasterHook();
  //get initial values from page
  const applicationPageNo = localStorage.getItem(
    `${Cookies.get("userId")}ticketApplicationSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}ticketApplicationSavePageNo`
        )
      )
    : 0;
  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}ticketTableRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}ticketTableRowPerPage`)
      )
    : 5;

  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [ticketID, setTicketID] = useState([]);
  const [anchorElAction, setAnchorEl] = React.useState(null);
  const openAction = Boolean(anchorElAction);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const state = useSelector((state) => state.authentication.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // states for pagination
  const [pageNumber, setPageNumber] = useState(applicationPageNo + 1);
  const [pageSize, setPageSize] = useState(tableRowPerPage);
  const [rowCount, setRowCount] = useState();
  const [rowCountReplies, setRowCountReplies] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const [rowsPerPageReplies, setRowsPerPageReplies] = useState(5);
  const [page, setPage] = useState(applicationPageNo);
  const [pageReplies, setPageReplies] = useState(0);
  const [ticketStatus, setTicketStatus] = useState(true);

  // set tickets details
  const [ticketReply, setTicketReply] = useState("");
  const [ticketDetails, setTicketDetails] = useState({});
  const [openDialogs, setOpenDialogs] = React.useState(false);

  //ticket manager internal server error and hide states
  const [
    ticketSectionInternalServerError,
    setTicketSectionInternalServerError,
  ] = useState(false);
  const [hideTicketSection, setHideTicketSection] = useState(false);
  const [queryReplyInternalServerError, setQueryReplyInternalServerError] =
    useState(false);
  const [
    somethingWentWrongInTicketSection,
    setSomethingWentWrongInTicketSection,
  ] = useState(false);
  const [somethingWentWrongInQueryReply, setSomethingWentWrongInQueryReply] =
    useState(false);

  const handleClick = (event, id) => {
    setTicketID(id);
    setAnchorEl(event.currentTarget);
  };
  const handleActionClose = () => {
    setAnchorEl(null);
  };

  // navigate user to 401 page
  if (state.detail) {
    dispatch(removeCookies());
    navigate("/page401");
  }

  const [replySended, setReplySended] = useState(true);
  const [ticketDetailsIndex, setTicketDetailsIndex] = useState({});
  //get queries
  const { data, isSuccess, isFetching, error, isError } =
    useGetUserProfileLeadTicketListQuery(
      {
        collegeId: collegeId,
        applicationId: props?.applicationId,
        pageNumber: pageNumber,
        pageSize: pageSize,
      },
      { skip: props?.applicationId ? false : true }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setRowCount(data?.total);
          setTickets(data?.data);
          setReplySended(!replySended);
        } else {
          throw new Error("student_timeline API response has changed");
        }
      }
      if (isError) {
        setTickets([]);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail !== "Query not found.") {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setTicketSectionInternalServerError,
            setHideTicketSection,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInTicketSection,
        setHideTicketSection,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, data?.data, error, isError, error?.data?.detail, error?.status]);
  // use react hook for prefetch data
  const prefetchUserProfileLeadTicketListData = usePrefetch(
    "getUserProfileLeadTicketList"
  );
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      pageSize,
      pageNumber,
      collegeId,
      prefetchUserProfileLeadTicketListData,
      {
        applicationId: props?.applicationId,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, pageSize, collegeId]);
  // tickets page handle function
  const handleChangePage = (event, newPage) => {
    setPageNumber(newPage + 1);
    setPage(newPage);
    localStorage.setItem(
      `${Cookies.get("userId")}ticketApplicationSavePageNo`,
      newPage
    );
  };
  // tickets rows per page handle function
  const handleChangeRowsPerPage = (event) => {
    const checkPageAvialability =
      Math.ceil(rowCount / parseInt(event.target.value, 10)) - 1;
    if (page < checkPageAvialability) {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPageSize(parseInt(event.target.value, 10));
      localStorage.setItem(
        `${Cookies.get("userId")}ticketTableRowPerPage`,
        parseInt(event.target.value, 10)
      );
    } else {
      setPageNumber(checkPageAvialability + 1);
      setPage(checkPageAvialability);
      localStorage.setItem(
        `${Cookies.get("userId")}ticketApplicationSavePageNo`,
        checkPageAvialability
      );
      setRowsPerPage(parseInt(event.target.value, 10));
      setPageSize(parseInt(event.target.value, 10));
      localStorage.setItem(
        `${Cookies.get("userId")}ticketTableRowPerPage`,
        parseInt(event.target.value, 10)
      );
    }
  };
  // tickets replies page handle function
  const handleChangePageReplies = (event, newPage) => {
    setPageReplies(newPage);
  };
  // tickets rows per page replies handle function
  const handleChangeRowsPerPageReplies = (event) => {
    setPageReplies(0);
    setRowsPerPageReplies(parseInt(event.target.value, 10));
  };

  // change ticket status function
  const handleChangeTicketStatus = (status) => {
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/query/change_status/?ticket_id=${ticketID}&status=${status}${
        collegeId ? "&college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "PUT")
    )
      .then((res1) => res1.json())
      .then((res) => {
        if (res.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.data) {
          const expectedData = res?.message;
          try {
            if (typeof expectedData === "string") {
              setTicketStatus(!ticketStatus);
              pushNotification("success", res?.message);
              dispatch(
                tableSlice.util.invalidateTags(["UserProfileLeadTicketList"])
              );
            } else {
              throw new Error("query change_status API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInTicketSection,
              "",
              5000
            );
          }
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch((err) => {
        handleInternalServerError(
          setTicketSectionInternalServerError,
          "",
          5000
        );
      });
  };

  useEffect(() => {
    if (typeof ticketDetailsIndex === "number") {
      setTicketDetails(tickets[ticketDetailsIndex]);

      const initisalPageNumberForPaginationReplies = Math.ceil(
        tickets[ticketDetailsIndex]?.replies?.length / 5
      );
      setPageReplies(initisalPageNumberForPaginationReplies - 1);
      setRowCountReplies(tickets[ticketDetailsIndex]?.replies?.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replySended]);

  const handleClickOpenDialogs = (ticketDetails, index) => {
    setTicketDetailsIndex(index);
    const initisalPageNumberForPaginationReplies = Math.ceil(
      ticketDetails?.replies?.length / 5
    );
    setPageReplies(initisalPageNumberForPaginationReplies - 1);
    setRowCountReplies(ticketDetails?.replies?.length);

    setTicketDetails(ticketDetails);
    setOpenDialogs(true);
  };
  const handleCloseDialogs = () => {
    setPageReplies(0);
    setRowsPerPageReplies(5);
    setOpenDialogs(false);
  };

  // send reply query function
  const handleSendReply = (event) => {
    event.preventDefault();

    setIsLoading(true);
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/query/reply/?ticket_id=${
        ticketDetails?.ticket_id
      }${collegeId ? "&college_id=" + collegeId : ""}`,
      ApiCallHeaderAndBody(
        token,
        "POST",
        JSON.stringify({ reply: ticketReply })
      )
    )
      .then((res) =>
        res.json().then((res) => {
          if (res.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.data[0]) {
            setIsLoading(false);
            const expectedData = res?.message;
            try {
              if (typeof expectedData === "string") {
                pushNotification("success", res?.message);
                setTicketReply("");
                setTicketStatus(!ticketStatus);
                handleCloseDialogs();
              } else {
                throw new Error("query reply API response has changed");
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInQueryReply,
                handleCloseDialogs,
                5000
              );
            }
          } else if (res.detail) {
            setIsLoading(false);
            pushNotification("error", res?.message);
            setTicketReply("");
            handleCloseDialogs();
          }
        })
      )
      .catch((err) => {
        handleInternalServerError(
          setQueryReplyInternalServerError,
          handleCloseDialogs,
          5000
        );
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {ticketSectionInternalServerError || somethingWentWrongInTicketSection ? (
        <Box>
          <Typography align="left" pl={2} variant="h6">
            Tickets Manager
          </Typography>
          {ticketSectionInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInTicketSection && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box sx={{ display: hideTicketSection ? "none" : "block" }}>
          <Box sx={{ pb: 1.5, pt: 1.5 }} id="ticket-manage-tab-top-section">
            <Typography pl={2} variant="h6">
              Tickets Manager
            </Typography>
          </Box>
          {isFetching ? (
            <TableBody
              sx={{
                width: "100%",
                minHeight: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              <LeefLottieAnimationLoader
                height={50}
                width={80}
              ></LeefLottieAnimationLoader>{" "}
            </TableBody>
          ) : (
            <>
              {tickets.length > 0 ? (
                <TableContainer
                  className="custom-scrollbar"
                  component={Paper}
                  sx={{ pl: 1, pr: 2 }}
                >
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ whiteSpace: "nowrap" }} width="10%">
                          Ticket Id
                        </TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          width="15%"
                          align="left"
                        >
                          Category Name
                        </TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          width="15%"
                          align="left"
                        >
                          Created At
                        </TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          width="15%"
                          align="left"
                        >
                          Assigned Counselor
                        </TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          width="15%"
                          align="left"
                        >
                          Status
                        </TableCell>
                        <TableCell width="15%" align="left">
                          Attachment
                        </TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          width="15%"
                          align="left"
                        >
                          Change Status
                        </TableCell>
                        <TableCell
                          sx={{ whiteSpace: "nowrap" }}
                          width="10%"
                          align="left"
                        >
                          Open Ticket
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tickets.map((row, index) => (
                        <TableRow
                          key={row?._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row?.ticket_id}
                          </TableCell>
                          <TableCell align="left">
                            {row?.category_name}
                          </TableCell>
                          <TableCell align="left">{row?.created_at}</TableCell>
                          <TableCell align="left">
                            {row?.assigned_counselor_id}
                          </TableCell>
                          <TableCell align="left">
                            <SeverityPillTicket
                              color={
                                (row.status === "DONE" && "success") ||
                                (row.status === "TO DO" && "info") ||
                                (row.status === "IN PROGRESS" && "warning") ||
                                "error"
                              }
                            >
                              {row.status}
                            </SeverityPillTicket>
                          </TableCell>
                          <TableCell align="left">
                            <IconButton
                              onClick={() => {
                                if (!props?.leadProfileAction) {
                                  window.open(row?.attachments[0]?.public_url);
                                }
                              }}
                              aria-label="delete"
                              disabled={row?.attachments ? false : true}
                              color="primary"
                            >
                              <CloudDownloadIcon color="info" />
                            </IconButton>
                          </TableCell>
                          <TableCell align="left">
                            <Button
                              className="followup-and-note-button"
                              onClick={(event) => {
                                if (!props?.leadProfileAction) {
                                  handleClick(event, row?.ticket_id);
                                }
                              }}
                              color="info"
                              size="small"
                              variant="outlined"
                              endIcon={<ArrowDropDownIcon color="info" />}
                            >
                              Change
                            </Button>
                            <Menu
                              id="basic-menu"
                              anchorEl={anchorElAction}
                              open={openAction}
                              onClose={() => {
                                handleActionClose();
                              }}
                              MenuListProps={{
                                "aria-labelledby": "basic-button",
                              }}
                            >
                              <MenuItem
                                sx={{ fontSize: "14px", pt: 0, pb: 0 }}
                                onClick={() => {
                                  if (!props?.leadProfileAction) {
                                    handleChangeTicketStatus("TO DO");
                                    handleActionClose();
                                  }
                                }}
                              >
                                To Do
                              </MenuItem>
                              <Divider></Divider>
                              <MenuItem
                                sx={{ fontSize: "14px", pt: 0, pb: 0 }}
                                onClick={() => {
                                  if (!props?.leadProfileAction) {
                                    handleChangeTicketStatus("IN PROGRESS");
                                    handleActionClose();
                                  }
                                }}
                              >
                                In Progress
                              </MenuItem>
                              <Divider></Divider>
                              <MenuItem
                                sx={{ fontSize: "14px", pt: 0, pb: 0 }}
                                onClick={() => {
                                  if (!props?.leadProfileAction) {
                                    handleChangeTicketStatus("DONE");
                                    handleActionClose();
                                  }
                                }}
                              >
                                Done
                              </MenuItem>
                            </Menu>
                          </TableCell>
                          <TableCell align="left">
                            <Button
                              className="ticket-manage-button"
                              size="small"
                              variant="outlined"
                              color="info"
                              onClick={() => {
                                if (!props?.leadProfileAction) {
                                  handleClickOpenDialogs(row, index);
                                }
                              }}
                            >
                              Open
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "350px",
                    alignItems: "center",
                  }}
                >
                  <BaseNotFoundLottieLoader
                    height={250}
                    width={250}
                  ></BaseNotFoundLottieLoader>
                </Box>
              )}
            </>
          )}
          {tickets.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={rowCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}

          <Dialog
            onClose={() => {
              handleCloseDialogs();
              setTicketReply("");
            }}
            aria-labelledby="customized-dialog-title"
            open={openDialogs}
            maxWidth={false}
          >
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <CircularProgress size={35} color="info" />
              </Box>
            )}
            <Box
              sx={{
                backgroundColor: "background.paper",
                minHeight: "100%",
              }}
            >
              <BootstrapDialogTitle
                color={"followup"}
                id="customized-dialog-title"
                onClose={() => {
                  handleCloseDialogs();
                  setTicketReply("");
                }}
              >
                Manage Ticket
              </BootstrapDialogTitle>
              {(queryReplyInternalServerError ||
                somethingWentWrongInQueryReply) &&
              !loading ? (
                <>
                  {queryReplyInternalServerError && (
                    <Error500Animation
                      height={400}
                      width={400}
                    ></Error500Animation>
                  )}
                  {somethingWentWrongInQueryReply && (
                    <ErrorFallback
                      error={apiResponseChangeMessage}
                      resetErrorBoundary={() => window.location.reload()}
                    />
                  )}
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      pb: 3,

                      px: 2,
                    }}
                  >
                    <Box className="details-box" sx={{ maxWidth: "600px" }}>
                      <Typography variant="h7">
                        <span style={{ color: "#143cbe", fontWeight: "bold" }}>
                          Details
                        </span>
                      </Typography>
                      <Typography variant="body2">
                        <span style={{ fontWeight: "bold" }}> Title:-</span>{" "}
                        {ticketDetails?.title}
                      </Typography>
                      <Typography variant="body2">
                        <span style={{ fontWeight: "bold" }}>
                          Descriptions:-
                        </span>{" "}
                        {ticketDetails?.description}
                      </Typography>
                      <Typography variant="body2">
                        <span style={{ fontWeight: "bold" }}>
                          Created at :-
                        </span>{" "}
                        {ticketDetails?.created_at}
                      </Typography>
                    </Box>

                    {ticketDetails?.replies && (
                      <Box>
                        <Typography
                          sx={{
                            mt: 3,
                          }}
                          variant="h5"
                          align="center"
                          fontSize="19px"
                        >
                          Replies
                        </Typography>
                        <Box id="timeline-body">
                          <Box className="timeline">
                            {ticketDetails?.replies
                              ?.slice(
                                pageReplies * rowsPerPageReplies,
                                pageReplies * rowsPerPageReplies +
                                  rowsPerPageReplies
                              )
                              .map((reply) => (
                                <Box
                                  className={`timeline__event--type${
                                    reply?.is_replied_by_student ? "2" : "3"
                                  }`}
                                  sx={{
                                    width: "40vw",
                                    display: "flex",
                                    mb: 2,
                                    flexDirection: reply?.is_replied_by_student
                                      ? "row"
                                      : "row-reverse",
                                  }}
                                >
                                  <Box className="timeline__event__icon">
                                    {reply?.is_replied_by_student ? (
                                      <AccountCircleIcon
                                        sx={{
                                          fontSize: "30px",
                                          color: "#9251AC",
                                        }}
                                        className="lni-cake "
                                      />
                                    ) : (
                                      <AdminPanelSettingsIcon
                                        sx={{
                                          fontSize: "30px",
                                          color: "#9251AC",
                                        }}
                                        className="lni-cake "
                                      />
                                    )}
                                  </Box>
                                  <Box sx={{ display: "flex" }}>
                                    <Box className="timeline__event__date">
                                      {reply?.timestamp?.slice(0, 12)} <br />
                                      {reply?.timestamp?.slice(
                                        12,
                                        reply?.timestamp?.length
                                      )}
                                    </Box>
                                    <Box className="timeline__event__content ">
                                      <Box className="timeline__event__description">
                                        <span style={{ fontWeight: "bold" }}>
                                          {" "}
                                          Name:{" "}
                                        </span>
                                        {reply?.user_name}
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                          Message:{" "}
                                        </span>
                                        {reply?.message}
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              ))}
                          </Box>
                        </Box>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 15]}
                          component="div"
                          count={rowCountReplies}
                          rowsPerPage={rowsPerPageReplies}
                          page={pageReplies}
                          onPageChange={handleChangePageReplies}
                          onRowsPerPageChange={handleChangeRowsPerPageReplies}
                        />
                      </Box>
                    )}
                  </Box>
                  <Typography
                    sx={{
                      mb: 1,
                      ml: 2,
                    }}
                    variant="h5"
                    align="center"
                    fontSize="19px"
                  >
                    Send Message
                  </Typography>
                  <Box
                    sx={{
                      pb: 3,

                      px: 2,
                      minWidth: 500,
                    }}
                  >
                    <form onSubmit={handleSendReply}>
                      <TextField
                        required
                        label="Reply"
                        fullWidth
                        multiline
                        rows={6}
                        placeholder="Enter Reply"
                        onChange={(event) => {
                          setTicketReply(event.target.value);
                        }}
                        color="info"
                      />

                      <Button
                        sx={{ mt: 2 }}
                        type="submit"
                        variant="contained"
                        size="small"
                      >
                        Send
                      </Button>
                    </form>
                  </Box>
                </>
              )}
            </Box>
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default TicketManager;
