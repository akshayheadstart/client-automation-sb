import { Box, Card, Drawer, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  communicationTabs,
  emailCommunicationDetailsTableHeader,
  smsCommunicationDetailsTableHeader,
  whatsappCommunicationDetailsTableHeader,
} from "../../../../../constants/LeadStageList";
import CloseIcon from "@mui/icons-material/Close";
import TableDataCount from "../../../application-manager/TableDataCount";
import TableTopPagination from "../../../application-manager/TableTopPagination";
import EmailReleaseDetailsTable from "./ReleaseDetails/EmailReleaseDetailsTable";
import { handleChangePage } from "../../../../../helperFunctions/pagination";
import AutoCompletePagination from "../../../../shared/forms/AutoCompletePagination";
import Pagination from "../../../../shared/Pagination/Pagination";
import SMSReleaseDetailsTable from "./ReleaseDetails/SMSReleaseDetailsTable";
import WhatsappReleaseDetailsTable from "./ReleaseDetails/WhatsappReleaseDetailsTable";
import BaseNotFoundLottieLoader from "../../../../shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../../../shared/Loader/LeefLottieAnimationLoader";
const CommunicationDetailsDrawer = ({ open, setOpen, tabValue }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [communicationDetails, setCommunicationDetails] = useState([]);
  const [sortingType, setSortingType] = useState("");
  const [sortingColumn, setSortingColumn] = useState("");
  const [rowPerPageOptions, setRowsPerPageOptions] = useState([
    "6",
    "15",
    "25",
    "50",
  ]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const releaseDetailsTableDummyData = [
      [
        {
          channel_name: "Channel 1",
          sent: 3333,
          delivered: 3134,
          delivery_rate: 79,
          open_rate: 33,
          click_rate: 55,
          bounce_rate: 45,
          complaint_rate: 43,
          unsubscribe_rate: 44,
        },
        {
          channel_name: "Channel 2",
          sent: 3233,
          delivered: 3114,
          delivery_rate: 79,
          open_rate: 33,
          click_rate: 55,
          bounce_rate: 45,
          complaint_rate: 43,
          unsubscribe_rate: 44,
        },
      ],
      [
        {
          channel_name: "Channel 1",
          sent: 33,
          delivered: 334,
          not_delivered: 79,
        },
        {
          channel_name: "Channel 2",
          sent: 33,
          delivered: 334,
          not_delivered: 79,
        },
      ],
      [
        {
          channel_name: "Channel 1",
          sent: 3453,
          delivered: 334,
          auto_replay_rate: 79,
          click_count: 55,
          click_rate: 30,
        },
        {
          channel_name: "Channel 2",
          sent: 3453,
          delivered: 334,
          auto_replay_rate: 79,
          click_count: 55,
          click_rate: 30,
        },
      ],
    ];

    setCommunicationDetails(releaseDetailsTableDummyData[tabValue]);
  }, [tabValue]);

  return (
    <Drawer
      PaperProps={{
        sx: {
          width: fullScreen ? "100%" : "70%",
          borderRadius: "10px 0 0 10px",
        },
      }}
      open={open}
      onClose={() => setOpen(false)}
      anchor="right"
    >
      <Box sx={{ p: 3 }}>
        <Box className="communication-details-drawer-header">
          <Typography variant="h6">
            {communicationTabs[tabValue]?.tabName}
          </Typography>
          <CloseIcon onClick={() => setOpen(false)} />
        </Box>
        <Card
          sx={{ my: 2.5, p: 2 }}
          className="common-box-shadow common-summary-details-container"
        >
          <>
            {false ? (
              <Box
                data-testid="loading-animation"
                className="common-not-found-container"
              >
                <LeefLottieAnimationLoader height={150} width={150} />
              </Box>
            ) : (
              <>
                <Box
                  className="table-data-count-container"
                  sx={{ justifyContent: "space-between", my: 1 }}
                >
                  <TableDataCount
                    totalCount={6}
                    currentPageShowingCount={6}
                    pageNumber={pageNumber}
                    rowsPerPage={rowsPerPage}
                  />
                  <TableTopPagination
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    localStoragePageNumberKey={""}
                    rowsPerPage={rowsPerPage}
                    totalCount={6}
                  />
                </Box>
                <>
                  {communicationDetails?.length > 0 ? (
                    <>
                      {tabValue === 0 && (
                        <EmailReleaseDetailsTable
                          sortingColumn={sortingColumn}
                          setSortingColumn={setSortingColumn}
                          setSortingType={setSortingType}
                          sortingType={sortingType}
                          releaseDetails={communicationDetails}
                          tabValue={tabValue}
                          tableHeader={emailCommunicationDetailsTableHeader}
                          communicationDetails={true}
                        />
                      )}
                      {tabValue === 1 && (
                        <SMSReleaseDetailsTable
                          sortingColumn={sortingColumn}
                          setSortingColumn={setSortingColumn}
                          setSortingType={setSortingType}
                          sortingType={sortingType}
                          releaseDetails={communicationDetails}
                          tabValue={tabValue}
                          tableHeader={smsCommunicationDetailsTableHeader}
                          communicationDetails={true}
                        />
                      )}
                      {tabValue === 2 && (
                        <WhatsappReleaseDetailsTable
                          sortingColumn={sortingColumn}
                          setSortingColumn={setSortingColumn}
                          setSortingType={setSortingType}
                          sortingType={sortingType}
                          releaseDetails={communicationDetails}
                          tabValue={tabValue}
                          tableHeader={whatsappCommunicationDetailsTableHeader}
                          communicationDetails={true}
                        />
                      )}
                    </>
                  ) : (
                    <Box className="common-not-found-container">
                      <BaseNotFoundLottieLoader height={200} width={200} />
                    </Box>
                  )}
                </>
                {communicationDetails?.length > 0 && (
                  <Box className="common-pagination-container">
                    <Pagination
                      className="pagination-bar"
                      currentPage={pageNumber}
                      totalCount={6}
                      pageSize={rowsPerPage}
                      onPageChange={(page) =>
                        handleChangePage(page, "", setPageNumber)
                      }
                      count={Math.ceil(6 / rowsPerPage)}
                    />
                    <AutoCompletePagination
                      rowsPerPage={rowsPerPage}
                      rowPerPageOptions={rowPerPageOptions}
                      setRowsPerPageOptions={setRowsPerPageOptions}
                      rowCount={6}
                      page={pageNumber}
                      setPage={setPageNumber}
                      setRowsPerPage={setRowsPerPage}
                    ></AutoCompletePagination>
                  </Box>
                )}
              </>
            )}
          </>
        </Card>
      </Box>
    </Drawer>
  );
};

export default CommunicationDetailsDrawer;
