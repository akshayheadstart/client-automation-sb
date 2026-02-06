import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import InterviewListTable from "./InterviewListTable";
import InterviewListTableActions from "./InterviewListTableActions";
import TableDataCount from "../ui/application-manager/TableDataCount";
import TableTopPagination from "../ui/application-manager/TableTopPagination";

export default function ArchivedListDialog({
  open,
  handleClose,
  interviewListData,
  isFetching,
  interviewListInternalServerError,
  interviewListSomethingWentWrong,
  hideInterviewList,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  totalInterviewList,
  localStorageKeyName,
  isScrolledToPagination,
  setInterviewListInternalServerError,
  setInterviewListSomethingWentWrong,
}) {
  const [selectedArchivedList, setSelectedArchivedList] = useState([]);

  return (
    <Dialog fullWidth={true} maxWidth={"xl"} open={open} onClose={handleClose}>
      <DialogTitle id="archived-list-dialog-title">Archived Lists</DialogTitle>
      <DialogContent>
        <Box
          className="interview-table-tab-design-left-text common-table-heading-container"
          sx={{ mb: "-15px" }}
        >
          <TableDataCount
            totalCount={totalInterviewList}
            currentPageShowingCount={interviewListData.length}
            pageNumber={pageNumber}
            rowsPerPage={pageSize}
          />

          <TableTopPagination
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            totalCount={totalInterviewList}
            rowsPerPage={pageSize}
          />
        </Box>
        <InterviewListTable
          interviewListData={interviewListData}
          isFetching={isFetching}
          interviewListInternalServerError={interviewListInternalServerError}
          interviewListSomethingWentWrong={interviewListSomethingWentWrong}
          hideInterviewList={hideInterviewList}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalInterviewList={totalInterviewList}
          selectedInterviewList={selectedArchivedList}
          setSelectedInterviewList={setSelectedArchivedList}
          localStorageKeyName={localStorageKeyName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>

      {selectedArchivedList?.length > 0 && (
        <InterviewListTableActions
          isScrolledToPagination={isScrolledToPagination}
          selectedInterviewList={selectedArchivedList}
          setSelectedInterviewList={setSelectedArchivedList}
          setInterviewListInternalServerError={
            setInterviewListInternalServerError
          }
          setInterviewListSomethingWentWrong={
            setInterviewListSomethingWentWrong
          }
          localStorageKeyName={localStorageKeyName}
          localStorageKey={"selectedArchivedListRow"}
          from="archived-list"
        />
      )}
    </Dialog>
  );
}
