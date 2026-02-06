import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  counsellorWiseEmailDetailsTableHeader,
  counsellorWiseSMSDetailsTableHeader,
  counsellorWiseWhatsappDetailsTableHeader,
  dataSegmentWiseEmailDetailsTableHeader,
  dataSegmentWiseSMSDetailsTableHeader,
  dataSegmentWiseWhatsappDetailsTableHeader,
  emailReleaseDetailsTableHeader,
  smsReleaseTableHeader,
  whatsappReleaseTableHeader,
} from "../../../../../../constants/LeadStageList";
import LeefLottieAnimationLoader from "../../../../../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../../../../shared/Loader/BaseNotFoundLottieLoader";
import Pagination from "../../../../../shared/Pagination/Pagination";
import AutoCompletePagination from "../../../../../shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../../../../../helperFunctions/pagination";
import CounsellorWiseEmailDetailsTable from "../CounsellorWiseDetails/CounsellorWiseEmailDetailsTable";
import CounsellorWiseSMSDetailsTable from "../CounsellorWiseDetails/CounsellorWiseSMSDetailsTable";
import CounsellorWiseWhatsappDetailsTable from "../CounsellorWiseDetails/CounsellorWiseWhatsappDetailsTable";

const DataSegmentWiseDetailsTable = ({ tabValue }) => {
  const [sortingType, setSortingType] = useState("");
  const [sortingColumn, setSortingColumn] = useState("");
  const [segmentWiseCommunicationDetails, setSegmentWiseCommunicationDetails] =
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
          segment_name: "Segment name",
          sent: 3333,
          delivered: 3134,
          delivery_rate: 79,
          open_rate: 33,
          click_rate: 55,
          bounce_rate: 45,
          complaint_rate: 43,
          unsubscribe_rate: 44,
          data_type: "Lead",
          segment_type: "Dynamic",
          channel_1: 3333,
        },
        {
          segment_name: "Segment name",
          sent: 3233,
          delivered: 3114,
          delivery_rate: 79,
          open_rate: 33,
          click_rate: 55,
          bounce_rate: 45,
          complaint_rate: 43,
          unsubscribe_rate: 44,
          data_type: "Application",
          segment_type: "Static",
          channel_1: 33234,
        },
      ],
      [
        {
          segment_name: "Segment name",
          sent: 33,
          delivered: 334,
          not_delivered: 79,
          data_type: "Lead",
          segment_type: "Dynamic",
          channel_1: 33234,
          channel_2: 33234,
          channel_3: 33234,
        },
        {
          segment_name: "Segment name",
          sent: 33,
          delivered: 334,
          not_delivered: 79,
          data_type: "Application",
          segment_type: "Static",
          channel_1: 33234,
          channel_2: 33234,
          channel_3: 33234,
        },
      ],
      [
        {
          segment_name: "Segment name",
          sent: 3453,
          delivered: 334,
          auto_replay_rate: 79,
          click_count: 55,
          data_type: "Application",
          segment_type: "Static",
          channel_1: 33234,
          channel_2: 33234,
          channel_3: 33234,
        },
        {
          segment_name: "Segment name",
          sent: 3453,
          delivered: 334,
          auto_replay_rate: 79,
          click_count: 55,
          data_type: "Lead",
          segment_type: "Dynamic",
          channel_1: 33234,
          channel_2: 33234,
          channel_3: 33234,
        },
      ],
    ];

    setSegmentWiseCommunicationDetails(releaseDetailsTableDummyData[tabValue]);
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
          {segmentWiseCommunicationDetails?.length > 0 ? (
            <>
              {tabValue === 0 && (
                <CounsellorWiseEmailDetailsTable
                  sortingColumn={sortingColumn}
                  setSortingColumn={setSortingColumn}
                  setSortingType={setSortingType}
                  sortingType={sortingType}
                  tableDetails={segmentWiseCommunicationDetails}
                  tabValue={tabValue}
                  tableHeader={dataSegmentWiseEmailDetailsTableHeader}
                  dataSegment={true}
                />
              )}
              {tabValue === 1 && (
                <CounsellorWiseSMSDetailsTable
                  sortingColumn={sortingColumn}
                  setSortingColumn={setSortingColumn}
                  setSortingType={setSortingType}
                  sortingType={sortingType}
                  tableDetails={segmentWiseCommunicationDetails}
                  tabValue={tabValue}
                  tableHeader={dataSegmentWiseSMSDetailsTableHeader}
                  dataSegment={true}
                />
              )}
              {tabValue === 2 && (
                <CounsellorWiseWhatsappDetailsTable
                  sortingColumn={sortingColumn}
                  setSortingColumn={setSortingColumn}
                  setSortingType={setSortingType}
                  sortingType={sortingType}
                  tableDetails={segmentWiseCommunicationDetails}
                  tabValue={tabValue}
                  tableHeader={dataSegmentWiseWhatsappDetailsTableHeader}
                  dataSegment={true}
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
      {segmentWiseCommunicationDetails?.length > 0 && (
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

export default DataSegmentWiseDetailsTable;
