import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import EmailReleaseDetailsTable from "./EmailReleaseDetailsTable";
import SMSReleaseDetailsTable from "./SMSReleaseDetailsTable";
import WhatsappReleaseDetailsTable from "./WhatsappReleaseDetailsTable";
import {
  emailReleaseDetailsTableHeader,
  smsReleaseTableHeader,
  whatsappReleaseTableHeader,
} from "../../../../../../constants/LeadStageList";
import LeefLottieAnimationLoader from "../../../../../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../../../../shared/Loader/BaseNotFoundLottieLoader";

const ReleaseDetailsTable = ({ tabValue }) => {
  const [sortingType, setSortingType] = useState("");
  const [sortingColumn, setSortingColumn] = useState("");
  const [releaseDetails, setReleaseDetails] = useState([]);

  useEffect(() => {
    const releaseDetailsTableDummyData = [
      [
        {
          type: "Manual Release",
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
          type: "Automated Release",
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
          type: "Manual Release",
          sent: 33,
          delivered: 334,
          not_delivered: 79,
        },
        {
          type: "Automated Release",
          sent: 33,
          delivered: 334,
          not_delivered: 79,
        },
      ],
      [
        {
          type: "Manual Release",
          sent: 3453,
          delivered: 334,
          auto_replay_rate: 79,
          click_count: 55,
          click_rate: 30,
        },
        {
          type: "Automated Release",
          sent: 3453,
          delivered: 334,
          auto_replay_rate: 79,
          click_count: 55,
          click_rate: 30,
        },
      ],
    ];

    setReleaseDetails(releaseDetailsTableDummyData[tabValue]);
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
          {releaseDetails?.length > 0 ? (
            <>
              {tabValue === 0 && (
                <EmailReleaseDetailsTable
                  sortingColumn={sortingColumn}
                  setSortingColumn={setSortingColumn}
                  setSortingType={setSortingType}
                  sortingType={sortingType}
                  releaseDetails={releaseDetails}
                  tabValue={tabValue}
                  tableHeader={emailReleaseDetailsTableHeader}
                />
              )}
              {tabValue === 1 && (
                <SMSReleaseDetailsTable
                  sortingColumn={sortingColumn}
                  setSortingColumn={setSortingColumn}
                  setSortingType={setSortingType}
                  sortingType={sortingType}
                  releaseDetails={releaseDetails}
                  tabValue={tabValue}
                  tableHeader={smsReleaseTableHeader}
                />
              )}
              {tabValue === 2 && (
                <WhatsappReleaseDetailsTable
                  sortingColumn={sortingColumn}
                  setSortingColumn={setSortingColumn}
                  setSortingType={setSortingType}
                  sortingType={sortingType}
                  releaseDetails={releaseDetails}
                  tabValue={tabValue}
                  tableHeader={whatsappReleaseTableHeader}
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
    </Box>
  );
};

export default ReleaseDetailsTable;
