import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Card,
  Drawer,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Cookies from "js-cookie";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import AutoCompletePagination from "../../shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../../helperFunctions/pagination";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import useToasterHook from "../../../hooks/useToasterHook";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import Pagination from "../../shared/Pagination/Pagination";
import StudentContact from "../application-manager/StudentContact";
import { PaymentStatus } from "../application-manager/PaymentStatus";
import LeadType from "../application-manager/LeadType";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import { useSelector } from "react-redux";
import { defaultRowsPerPageOptions } from "../../Calendar/utils";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import "../../../styles/ApplicationManagerTable.css";
import "../../../styles/sharedStyles.css";
import ApplicationHeader from "../../userProfile/ApplicationHeader";
import {
  customFetch,
  getFormStatusClass,
  getPublisherClassName,
  getPublisherLeadTypeClass,
} from "../../../pages/StudentTotalQueries/helperFunction";
const PublisherDashboardTable = ({
  openCol,
  setOpenCol,
  applications,
  rowsPerPage,
  setRowsPerPage,
  rowCount,
  loading,
  setLoading,
  selectedApplications,
  setSelectedApplications,
  page,
  setPage,
  setDownloadApplicationsInternalServerError,
  setSomethingWentWrongInDownloadApplication,
  setIsScrolledToPagination,
}) => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const count = Math.ceil(rowCount / rowsPerPage);
  const pushNotification = useToasterHook();
  //getting data form context
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const token = Cookies.get("jwtTokenCredentialsAccessToken");

  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);

  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();

  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  //single application download function
  const handleSingleApplicationDownload = (applicationId) => {
    setLoading(true);
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/admin/download_applications_data/${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(
        token,
        "POST",
        JSON.stringify({
          application_ids: [applicationId],
        })
      )
    )
      .then((res) =>
        res.json().then((result) => {
          if (result?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result?.message) {
            setLoading(false);
            const expectedData = result?.file_url;
            try {
              if (typeof expectedData === "string") {
                window.open(result?.file_url);
                setSelectedApplications([]);
                localStorage.removeItem(
                  `${Cookies.get("userId")}publisherSelectedApplications`
                );
              } else {
                throw new Error(
                  "download_applications_data API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInDownloadApplication,
                "",
                5000
              );
            }
          } else if (result?.detail) {
            pushNotification("error", result?.detail);
          }
        })
      )
      .catch((err) => {
        handleInternalServerError(
          setDownloadApplicationsInternalServerError,
          "",
          5000
        );
      })
      .finally(() => setLoading(false));
  };

  //get all application from api
  const allApplicationId = applications?.map(
    (application) => application?.application_id
  );

  //top checkbox handler function
  const handleAllCheckbox = (e) => {
    if (e.target.checked === true) {
      const publisherSelectedApplications = JSON.parse(
        localStorage.getItem(
          `${Cookies.get("userId")}publisherSelectedApplications`
        )
      );
      if (publisherSelectedApplications?.length > 0) {
        const filteredApplications = allApplicationId.filter(
          (element) => !selectedApplications.includes(element)
        );

        setSelectedApplications((currentArray) => [
          ...currentArray,
          ...filteredApplications,
        ]);

        localStorage.setItem(
          `${Cookies.get("userId")}publisherSelectedApplications`,
          JSON.stringify([...selectedApplications, ...filteredApplications])
        );
      } else {
        setSelectedApplications(allApplicationId);
        localStorage.setItem(
          `${Cookies.get("userId")}publisherSelectedApplications`,
          JSON.stringify(allApplicationId)
        );
      }
    } else {
      const filteredApplications = selectedApplications.filter(
        (element) => !allApplicationId.includes(element)
      );
      setSelectedApplications(filteredApplications);
      localStorage.setItem(
        `${Cookies.get("userId")}publisherSelectedApplications`,
        JSON.stringify(filteredApplications)
      );
    }
  };

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);

  //show top checkbox and indeterminate
  useEffect(() => {
    let applicationCount = 0;
    allApplicationId.forEach((item) => {
      if (selectedApplications.indexOf(item) !== -1) applicationCount++;
    });

    if (applicationCount === allApplicationId?.length && applicationCount > 0) {
      setSelectTopCheckbox(true);
    } else {
      setSelectTopCheckbox(false);
    }

    if (applicationCount < allApplicationId?.length && applicationCount > 0) {
      setShowIndeterminate(true);
    } else {
      setShowIndeterminate(false);
    }
  }, [allApplicationId, selectedApplications]);

  //according to checkbox select set the application id in selectApplications state
  const handleApplicationCheckBox = (e, applicationId) => {
    if (e.target.checked === true) {
      if (selectedApplications?.length < 1) {
        setSelectedApplications([applicationId]);
        localStorage.setItem(
          `${Cookies.get("userId")}publisherSelectedApplications`,
          JSON.stringify([applicationId])
        );
      } else if (!selectedApplications.includes(applicationId)) {
        setSelectedApplications((currentArray) => [
          ...currentArray,
          applicationId,
        ]);

        localStorage.setItem(
          `${Cookies.get("userId")}publisherSelectedApplications`,
          JSON.stringify([...selectedApplications, applicationId])
        );
      }
    } else {
      var index = selectedApplications?.indexOf(applicationId);
      if (index !== -1) selectedApplications.splice(index, 1);
      setSelectedApplications((currentArray) => [...currentArray]);
      localStorage.setItem(
        `${Cookies.get("userId")}publisherSelectedApplications`,
        JSON.stringify([...selectedApplications])
      );
    }
  };

  //set selected applications in state from localstorage after reload
  useEffect(() => {
    const publisherSelectedApplications = JSON.parse(
      localStorage.getItem(
        `${Cookies.get("userId")}publisherSelectedApplications`
      )
    );
    if (publisherSelectedApplications?.length > 0) {
      setSelectedApplications(publisherSelectedApplications);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //function for email masking
  const maskEmail = (email = "") => {
    const [name, domain] = email.split("@");
    const { length: len } = name;
    if (len > 4) {
      const maskedName = name[0] + name[1] + name[2] + name[3] + "*****";
      const maskedEmail = maskedName + "@" + domain;
      return maskedEmail;
    } else if (len <= 2) {
      const maskedName = "*****";
      const maskedEmail = maskedName + "@" + domain;
      return maskedEmail;
    } else if (len > 2 && len <= 4) {
      const maskedName = name[0] + "*****";
      const maskedEmail = maskedName + "@" + domain;
      return maskedEmail;
    }
  };
  const [userProfileOpen, setUserProfileOpen] = React.useState(false);
  const handleOpenUserProfileDrawer = (key) => {
    setUserProfileOpen(true);
  };
  const [userDetailsStateData, setUserDetailsStateData] = useState({});
  useEffect(() => {
    if (userDetailsStateData) {
      setUserDetailsStateData((prevState) => ({
        ...prevState,
        leadProfileAction: true,
        viewProfileButtonDisabled: true,
      }));
    }
  }, [userProfileOpen]);
  return (
    <Box className="basicDetailsTable">
      {loading ? (
        <TableBody
          sx={{
            width: "100%",
            minHeight: "85vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          <LeefLottieAnimationLoader
            height={120}
            width={120}
          ></LeefLottieAnimationLoader>{" "}
        </TableBody>
      ) : applications?.length > 0 ? (
        <TableContainer className="custom-scrollbar">
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectTopCheckbox}
                    onChange={(e) => handleAllCheckbox(e)}
                    indeterminate={showIndeterminate}
                    color="info"
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Form Name</TableCell>
                <TableCell>Contact details</TableCell>
                <TableCell>Application Stage</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Form Status</TableCell>

                <TableCell>Lead Type</TableCell>
                <TableCell>UTM Campaign</TableCell>
                <TableCell>UTM Medium</TableCell>
              </TableRow>
            </TableHead>

            {applications?.length > 0 ? (
              <TableBody>
                {applications.map((dataRow) => (
                  <TableRow key={dataRow.application_id}>
                    <TableCell>
                      {selectedApplications?.includes(
                        dataRow?.application_id
                      ) ? (
                        <IconButton
                          sx={{ p: "9px" }}
                          onClick={() => {
                            handleApplicationCheckBox(
                              {
                                target: {
                                  checked: false,
                                },
                              },
                              dataRow?.application_id
                            );
                          }}
                        >
                          <CheckBoxOutlinedIcon sx={{ color: "#008be2" }} />
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
                          onChange={(e) =>
                            handleApplicationCheckBox(
                              e,
                              dataRow?.application_id
                            )
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box>
                          <Typography
                            className="lead-name-text-for-publisher"
                            // Right now we are not use this code if we need this code in future we use it.
                            // onClick={()=>{
                            //   if(dataRow?.application_id && dataRow?.student_id){
                            //     handleOpenUserProfileDrawer()
                            //     setUserDetailsStateData({
                            //       applicationId: dataRow?.application_id,
                            //       studentId: dataRow?.student_id,
                            //       eventType: "publisher-dashboard",
                            //       title: "publisherDashboard",
                            //     });
                            //   }
                            // }}
                          >
                            {dataRow?.student_name
                              ? dataRow?.student_name
                              : `– –`}
                          </Typography>
                          <Typography variant="subtitle2">
                            {dataRow?.custom_application_id
                              ? dataRow?.custom_application_id?.substring(
                                  0,
                                  5
                                ) + "*****"
                              : `– –`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {dataRow?.course_name ? dataRow?.course_name : `– –`}
                    </TableCell>

                    <TableCell>
                      <StudentContact
                        dataRow={dataRow}
                        publisher={true}
                        maskEmail={maskEmail}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        className={
                          dataRow?.application_stage
                            ? "publisher-payment-status-box"
                            : "status"
                        }
                      >
                        {dataRow?.application_stage
                          ? dataRow?.application_stage
                          : `– –`}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className={getPublisherClassName(dataRow)}>
                        {dataRow?.payment_status
                          ? dataRow?.payment_status
                          : `– –`}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {dataRow?.form_status?.length > 0 ? (
                        <Box className={getFormStatusClass(dataRow)}>
                          {dataRow?.form_status?.toLowerCase() === "completed"
                            ? "Completed"
                            : "In progress"}
                        </Box>
                      ) : (
                        "---"
                      )}
                    </TableCell>

                    <TableCell>
                      <Box className={getPublisherLeadTypeClass(dataRow)}>
                        {dataRow?.lead_type ? dataRow?.lead_type : `– –`}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography className="publisher-table-text">
                        {dataRow?.utm_campaign ? dataRow?.utm_campaign : `– –`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className="publisher-table-text">
                        {" "}
                        {dataRow?.utm_medium ? dataRow?.utm_medium : `– –`}
                      </Typography>
                    </TableCell>
                    {/* download action not  added new design. Right now we are not use this code if we need this code in future we use it. */}
                    {/* <TableCell>
                      <IconButton>
                        <Download
                          color="primary"
                          onClick={() =>
                            handleSingleApplicationDownload(
                              dataRow?.application_id
                            )
                          }
                        />
                      </IconButton>
                    </TableCell> */}
                  </TableRow>
                ))}
                {/* {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
              </TableBody>
            ) : null}
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            minHeight: "75vh",
            alignItems: "center",
          }}
        >
          <BaseNotFoundLottieLoader
            height={250}
            width={250}
          ></BaseNotFoundLottieLoader>
        </Box>
      )}
      {!applications && (
        <Card
          sx={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BaseNotFoundLottieLoader
            height={250}
            width={250}
          ></BaseNotFoundLottieLoader>
        </Card>
      )}
      {!loading && applications?.length > 0 && (
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
            currentPage={page}
            totalCount={rowCount}
            pageSize={rowsPerPage}
            onPageChange={(page) =>
              handleChangePage(page, `publisherApplicationSavePageNo`, setPage)
            }
            count={count}
          />

          <AutoCompletePagination
            rowsPerPage={rowsPerPage}
            rowPerPageOptions={rowPerPageOptions}
            setRowsPerPageOptions={setRowsPerPageOptions}
            rowCount={rowCount}
            page={page}
            setPage={setPage}
            localStorageChangeRowPerPage={`publisherTableRowPerPage`}
            localStorageChangePage={`publisherApplicationSavePageNo`}
            setRowsPerPage={setRowsPerPage}
          ></AutoCompletePagination>
        </Box>
      )}
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
              leadProfileAction={true}
            ></ApplicationHeader>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default PublisherDashboardTable;
