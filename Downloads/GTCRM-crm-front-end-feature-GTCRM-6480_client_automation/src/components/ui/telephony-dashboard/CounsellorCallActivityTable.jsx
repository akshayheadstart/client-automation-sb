import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import { counsellorCallActivityTableHeader } from "../../../constants/LeadStageList";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import SortIndicatorWithTooltip from "../../shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";
import "../../../styles/communicationSummary.css";
import ActivityListDetails from "./ActivityListDetails";
import { showCheckboxAndIndeterminate } from "../../../helperFunctions/checkboxHandleFunction";
import CounsellorActivityActions from "./CounsellorActivityActions";
import QuickFilterDropdown from "./QuickFilterDropdown";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
function CounsellorCallActivityTable({
  sortingType,
  setSortingType,
  sortingColumn,
  setSortingColumn,
  counsellorCallActivityList,
  selectedQuickFilter,
  setSelectedQuickFilter,
  loading,
  selectedCounsellorID,
  setSelectedCounsellorID,
  callActivityDateRange,
}) {
  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);

  const allCounsellorIds = useMemo(
    () => counsellorCallActivityList?.map((list) => list?.id),
    [counsellorCallActivityList]
  );

  //show top checkbox and indeterminate
  useEffect(() => {
    showCheckboxAndIndeterminate(
      allCounsellorIds,
      selectedCounsellorID,
      setSelectTopCheckbox,
      setShowIndeterminate
    );
  }, [allCounsellorIds, selectedCounsellorID]);

  const handleAllCheckbox = (e) => {
    setSelectTopCheckbox(e.target.checked);
    if (e.target.checked) {
      setSelectedCounsellorID(allCounsellorIds);
    } else {
      setSelectedCounsellorID([]);
    }
  };

  return (
    <Box sx={{ my: 3 }}>
      {loading ? (
        <Box sx={{ minHeight: "45vh" }} className="common-not-found-container">
          <LeefLottieAnimationLoader
            height={150}
            width={150}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <>
          {counsellorCallActivityList?.length > 0 ? (
            <TableContainer className="custom-scrollbar">
              <Table className="call-summary-details-table">
                <TableHead>
                  <TableRow>
                    {callActivityDateRange?.length === 0 && (
                      <TableCell
                        sx={{ pr: 0 }}
                        className="table-row-sticky checkbox-check-all-container"
                      >
                        <Checkbox
                          color="info"
                          checked={selectTopCheckbox}
                          onChange={(e) => handleAllCheckbox(e)}
                          indeterminate={showIndeterminate}
                          icon={
                            <CheckBoxOutlineBlankOutlinedIcon color="info" />
                          }
                        />
                        <QuickFilterDropdown
                          selectedQuickFilter={selectedQuickFilter}
                          setSelectedQuickFilter={setSelectedQuickFilter}
                        />
                      </TableCell>
                    )}

                    {counsellorCallActivityTableHeader
                      .slice(
                        0,
                        callActivityDateRange?.length
                          ? 6
                          : counsellorCallActivityTableHeader?.length
                      )
                      ?.map((head) => (
                        <TableCell key={head?.name}>
                          <Box
                            sx={{
                              justifyContent: head?.align
                                ? "flex-start"
                                : "center",
                            }}
                            className="sorting-option-with-header-content"
                          >
                            {head?.name}
                            {head?.sort && (
                              <>
                                <SortIndicatorWithTooltip
                                  sortType={
                                    sortingColumn === head?.name
                                      ? sortingType
                                      : ""
                                  }
                                  value={head?.value}
                                  sortColumn={sortingColumn}
                                  setSortType={setSortingType}
                                  setSortColumn={setSortingColumn}
                                />
                              </>
                            )}
                          </Box>
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {counsellorCallActivityList?.map((details) => (
                    <ActivityListDetails
                      key={details?.id}
                      details={details}
                      selectedCounsellorID={selectedCounsellorID}
                      setSelectedCounsellorID={setSelectedCounsellorID}
                      callActivityDateRange={callActivityDateRange}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{ minHeight: "45vh" }}
              className="common-not-found-container"
            >
              <BaseNotFoundLottieLoader
                height={200}
                width={200}
              ></BaseNotFoundLottieLoader>
            </Box>
          )}
        </>
      )}
      {selectedCounsellorID?.length > 0 && (
        <CounsellorActivityActions
          selectedCounsellorID={selectedCounsellorID}
          counsellorCallActivityList={counsellorCallActivityList}
          setSelectedCounsellorID={setSelectedCounsellorID}
        />
      )}
    </Box>
  );
}

export default CounsellorCallActivityTable;
