import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Card, Drawer, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LeefLottieAnimationLoader from "../../../../../shared/Loader/LeefLottieAnimationLoader";
import TableDataCount from "../../../../application-manager/TableDataCount";
import TableTopPagination from "../../../../application-manager/TableTopPagination";
import BaseNotFoundLottieLoader from "../../../../../shared/Loader/BaseNotFoundLottieLoader";
import Pagination from "../../../../../shared/Pagination/Pagination";
import AutoCompletePagination from "../../../../../shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../../../../../helperFunctions/pagination";
import MessageNotDeliveredDetailsTable from "./MessageNotDeliveredDetailsTable";

const MessageNotDeliveredDetailsDrawer = ({ open, setOpen }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [notDeliveredMessageDetails, setNotDeliveredMessageDetails] = useState(
    []
  );
  const [rowPerPageOptions, setRowsPerPageOptions] = useState([
    "6",
    "15",
    "25",
    "50",
  ]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const notDeliveredDetails = [
      {
        message_count: 34,
        error_code: 502,
        error_description: "Number found in DdD base",
      },
      {
        message_count: 34,
        error_code: 502,
        error_description: "Blocked By DLT",
      },
      {
        message_count: 34,
        error_code: 502,
        error_description: "Template preference mismatch",
      },
      {
        message_count: 34,
        error_code: 502,
        error_description: "Number found in DdD base",
      },
      {
        message_count: 34,
        error_code: 502,
        error_description: "Template preference mismatch",
      },
    ];
    setNotDeliveredMessageDetails(notDeliveredDetails);
  }, []);

  return (
    <Drawer
      PaperProps={{
        sx: {
          width: fullScreen ? "100%" : "60%",
          borderRadius: "10px 0 0 10px",
        },
      }}
      open={open}
      onClose={() => setOpen(false)}
      anchor="right"
    >
      <Box sx={{ p: 3 }}>
        <Box className="communication-details-drawer-header">
          <Typography variant="h6">Not Delivered</Typography>
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
                  {notDeliveredMessageDetails?.length > 0 ? (
                    <>
                      <MessageNotDeliveredDetailsTable
                        notDeliveredDetails={notDeliveredMessageDetails}
                      />
                    </>
                  ) : (
                    <Box className="common-not-found-container">
                      <BaseNotFoundLottieLoader height={200} width={200} />
                    </Box>
                  )}
                </>
                {notDeliveredMessageDetails?.length > 0 && (
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

export default MessageNotDeliveredDetailsDrawer;
