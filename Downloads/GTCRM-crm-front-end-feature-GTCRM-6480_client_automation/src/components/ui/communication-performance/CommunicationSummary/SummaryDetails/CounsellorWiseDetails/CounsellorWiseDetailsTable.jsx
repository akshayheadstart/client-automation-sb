import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  counsellorWiseEmailDetailsTableHeader,
  counsellorWiseSMSDetailsTableHeader,
  counsellorWiseWhatsappDetailsTableHeader,
  emailReleaseDetailsTableHeader,
  smsReleaseTableHeader,
  whatsappReleaseTableHeader,
} from "../../../../../../constants/LeadStageList";
import LeefLottieAnimationLoader from "../../../../../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../../../../shared/Loader/BaseNotFoundLottieLoader";
import CounsellorWiseEmailDetailsTable from "./CounsellorWiseEmailDetailsTable";
import CounsellorWiseSMSDetailsTable from "./CounsellorWiseSMSDetailsTable";
import CounsellorWiseWhatsappDetailsTable from "./CounsellorWiseWhatsappDetailsTable";
import Pagination from "../../../../../shared/Pagination/Pagination";
import AutoCompletePagination from "../../../../../shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../../../../../helperFunctions/pagination";

const CounsellorWiseDetailsTable = ({ tabValue }) => {
  const [sortingType, setSortingType] = useState("");
  const [sortingColumn, setSortingColumn] = useState("");
  const [counsellorCommunicationDetails, setCounsellorCommunicationDetails] =
    useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState([
    "6",
    "15",
    "25",
    "50",
  ]);

  useEffect(() => {
    const releaseDetailsTableDummyData = [
      [
        {
          counsellor_name: "Sheikh Mohib",
          sent: 3333,
          delivered: 3134,
          delivery_rate: 79,
          open_rate: 33,
          click_rate: 55,
          bounce_rate: 45,
          complaint_rate: 43,
          unsubscribe_rate: 44,
          channel_1: 3333,
        },
        {
          counsellor_name: "Mohib Sheikh",
          sent: 3233,
          delivered: 3114,
          delivery_rate: 79,
          open_rate: 33,
          click_rate: 55,
          bounce_rate: 45,
          complaint_rate: 43,
          unsubscribe_rate: 44,
          channel_1: 33234,
        },
      ],
      [
        {
          counsellor_name: "Sheikh Mohib",
          sent: 33,
          delivered: 334,
          not_delivered: 79,
          channel_1: 33234,
          channel_2: 33234,
          channel_3: 33234,
        },
        {
          counsellor_name: "Mohib Sheikh",
          sent: 33,
          delivered: 334,
          not_delivered: 79,
          channel_1: 33234,
          channel_2: 33234,
          channel_3: 33234,
        },
      ],
      [
        {
          counsellor_name: "Sheikh Mohib",
          sent: 3453,
          delivered: 334,
          auto_replay_rate: 79,
          click_count: 55,
          channel_1: 33234,
          channel_2: 33234,
          channel_3: 33234,
        },
        {
          counsellor_name: "Mohib Sheikh",
          sent: 3453,
          delivered: 334,
          auto_replay_rate: 79,
          click_count: 55,
          channel_1: 33234,
          channel_2: 33234,
          channel_3: 33234,
        },
      ],
    ];

    setCounsellorCommunicationDetails(releaseDetailsTableDummyData[tabValue]);
  }, [tabValue]);

  return (
    <Box sx={{ mt: 2 }}>
      {false ? (
        <Box
          data-testid="loading-animation"
          className="common-not-found-container"
        >
          <LeefLottieAnimationLoader height={150} width={150} />
        </Box>
      ) : (
        <>
          {counsellorCommunicationDetails?.length > 0 ? (
            <>
              {tabValue === 0 && (
                <CounsellorWiseEmailDetailsTable
                  sortingColumn={sortingColumn}
                  setSortingColumn={setSortingColumn}
                  setSortingType={setSortingType}
                  sortingType={sortingType}
                  tableDetails={counsellorCommunicationDetails}
                  tabValue={tabValue}
                  tableHeader={counsellorWiseEmailDetailsTableHeader}
                />
              )}
              {tabValue === 1 && (
                <CounsellorWiseSMSDetailsTable
                  sortingColumn={sortingColumn}
                  setSortingColumn={setSortingColumn}
                  setSortingType={setSortingType}
                  sortingType={sortingType}
                  tableDetails={counsellorCommunicationDetails}
                  tabValue={tabValue}
                  tableHeader={counsellorWiseSMSDetailsTableHeader}
                />
              )}
              {tabValue === 2 && (
                <CounsellorWiseWhatsappDetailsTable
                  sortingColumn={sortingColumn}
                  setSortingColumn={setSortingColumn}
                  setSortingType={setSortingType}
                  sortingType={sortingType}
                  tableDetails={counsellorCommunicationDetails}
                  tabValue={tabValue}
                  tableHeader={counsellorWiseWhatsappDetailsTableHeader}
                />
              )}
            </>
          ) : (
            <Box className="common-not-found-container">
              <BaseNotFoundLottieLoader height={200} width={200} />
            </Box>
          )}
        </>
      )}
      {counsellorCommunicationDetails?.length > 0 && (
        <Box className="common-pagination-container">
          <Pagination
            className="pagination-bar"
            currentPage={pageNumber}
            totalCount={6}
            pageSize={rowsPerPage}
            onPageChange={(page) => handleChangePage(page, "", setPageNumber)}
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
    </Box>
  );
};

export default CounsellorWiseDetailsTable;
