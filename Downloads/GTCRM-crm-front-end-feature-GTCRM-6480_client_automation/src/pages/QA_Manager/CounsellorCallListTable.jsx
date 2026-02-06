/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  Fab,
} from "@mui/material";
import {
  CounsellorCallListColumn,
  formateDate,
} from "../../utils/QAManagerUtils";
import {
  useGetQaManagerCounsellorListQuery
} from "../../Redux/Slices/applicationDataApiSlice";

import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../../styles/topPerformingChannel.css";

const CounsellorCallListTable = ({ collegeId, dateRange = [] }) => {
  const initialItemsToShow = 10;
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);

  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    React.useContext(DashboradDataContext);

  const [internalServerError, setInternalServerError] = React.useState("");
  const [somethingWentWrong, setSomethingWentWrong] = React.useState("");
  const [counsellorCallListData, setCounsellorCallListData] =
    React.useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isRemoveButtonDisabled, setIsRemoveButtonDisabled] = useState(false);
  const [displayData, setDisplayData] = React.useState([]);
  const ref = React.useRef(null);

  const handleButtonClick = () => {
    const nextItemsToShow = itemsToShow + 5;

    if (nextItemsToShow >= counsellorCallListData?.data?.[0].length) {
      setIsButtonDisabled(true);
    }
    setIsRemoveButtonDisabled(false);
    setItemsToShow(nextItemsToShow);
  };

  const handleRemoveClick = () => {
    const nextItemsToShow = itemsToShow - 5;

    if (nextItemsToShow <= 0) {
      setItemsToShow(itemsToShow);
      setIsRemoveButtonDisabled(true);
      setIsButtonDisabled(false);
    } else {
      setItemsToShow(nextItemsToShow);
      setIsButtonDisabled(false);
    }
    ref.current.focus();
  };

  React.useEffect(() => {
    const displayedData = counsellorCallListData?.data?.[0]?.slice(
      0,
      itemsToShow
    );
    if (displayedData) {
      setDisplayData(displayedData);
    }
  }, [itemsToShow, counsellorCallListData?.data?.[0]]);

  const { data, error, isError, isSuccess, isFetching } =
    useGetQaManagerCounsellorListQuery(
      {
        payload: {
          start_date: formateDate(dateRange?.[0] || null),
          end_date: formateDate(dateRange?.[1] || null),
        },
        collegeId,
      },
      {
        skip: !collegeId,
      }
    );

  React.useEffect(() => {
    try {
      if (isSuccess) {
        if (data.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data.detail) {
          pushNotification("error", data.detail);
        } else if (data?.data) {
          setCounsellorCallListData(data);
        }
      } else if (isError) {
        if (error?.status === 500) {
          handleInternalServerError(setInternalServerError, null, 10000);
        }
      }
    } catch (err) {
      setApiResponseChangeMessage(err);
      handleSomethingWentWrong(setSomethingWentWrong, null, 10000);
    }
  }, [data, error, isSuccess, isError]);

  return (
    <Box className="full-width">
      {internalServerError || somethingWentWrong ? (
        <Box className="loading-animation-for-notification">
          {internalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : isFetching ? (
        <Box className="loader-wrapper">
          <LeefLottieAnimationLoader
            height={100}
            width={150}
          ></LeefLottieAnimationLoader>{" "}
        </Box>
      ) : (
        <>
          <TableContainer className="custom-scrollbar">
            <Table
              className="call-list-table"
              size="small"
              sx={{ minWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  {CounsellorCallListColumn?.map((col) => (
                    <TableCell
                      className="header-text"
                      key={col.value}
                      sx={{ minWidth: col.width, mr: 3 }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {displayData.map((item) => {
                  return (
                    <TableRow
                      key={item?.counsellor_id}
                      className="counsellor-row"
                    >
                      <TableCell>
                        <Typography className="counsellor-cell-value">
                          {item?.counsellor_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="counsellor-cell-value">
                          {item?.total_calls}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="counsellor-cell-value">
                          {item?.total_qced_calls}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="counsellor-cell-value">
                          {item?.qc_passed}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="counsellor-cell-value">
                          {item?.qc_failed}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="counsellor-cell-value">
                          {item?.qc_fataled}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="counsellor-cell-value">
                          {item?.call_quality?.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {counsellorCallListData?.data?.[0]?.length > 10 && (
            <Box ref={ref} className="top-performing-fab-box">
              {!isButtonDisabled && (
                <Fab
                  onClick={handleButtonClick}
                  size="small"
                  sx={{
                    zIndex: "0",
                    mx: "5px",
                  }}
                  className="top-performing-fab"
                >
                  <ExpandMoreIcon />
                </Fab>
              )}
              {displayData?.length > 10 && (
                <>
                  {!isRemoveButtonDisabled && (
                    <Fab
                      onClick={handleRemoveClick}
                      size="small"
                      sx={{
                        zIndex: "0",
                        mx: "5px",
                      }}
                      className="top-performing-fab"
                    >
                      <ExpandLessIcon />
                    </Fab>
                  )}
                </>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
export default CounsellorCallListTable;
