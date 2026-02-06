import { Box, ClickAwayListener } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import ResetIcon from "../../../../src/icons/reset-icon.svg";
import AddColumnIcon from "../../../../src/icons/add-column-icon.svg";
import ColumnReorderIcon from "../../../../src/icons/suffle-icon.svg";
import SearchBox from "./SearchBox";
import ChartIcon from "../../../../src/icons/chart-icon.svg";
import LeadStageIcon from "../../../../src/icons/lead-stage-icon.svg";
import FilterIcon from "../../../../src/icons/filter-icon.svg";
import FilterHeaderIcon from "./FilterHeaderIcon";
import SavedFilterPicker from "./SavedFilterPicker";
import { useState } from "react";
import AddLeadDialog from "./AddLeadDialog";
import counsellorSearchIcon from "../../../images/searchIcon.png";
function FilterHeader({
  handleClickOpenColumnsReorder,
  setShowFilterOption,
  setShouldShowAddColumn,
  resetFilterOptions,
  columnsOrder,
  showFilterOption,
  shouldShowAddColumn,
  isActionDisable,
  publisher,
  showCreateLead,
  savedFilterProps,
  setShowLeadStageCount,
  showLeadStageCount,
  showChartPermission,
  openQuickSnapShotDrawer,
  setOpenQuickSnapShotDrawer,
  handleEmailInputField,
  searchedEmail,
  setSearchedEmail,
  handleSearchByEmail,
  handleResetSearchByEmail,
  initialColumns,
  setItems,
  innerSearchPermission,
}) {
  const [openAddLeadDialog, setOpenLeadDialog] = useState();
  const [searchFieldToggle, setSearchFieldToggle] = useState(false);
  return (
    <>
      <Box className="filter-header-container">
        <Box
          id="filters"
          onClick={() => {
            setShowFilterOption((prev) => !prev);
          }}
          className={`${
            showFilterOption
              ? "filter-header-items-active"
              : "filter-header-items-inactive"
          } filter-header-items`}
        >
          Filter
          <img src={FilterIcon} alt="all-column-icon" />
        </Box>
        {!publisher && (
          <FilterHeaderIcon
            icon={AddColumnIcon}
            condition={shouldShowAddColumn}
            action={() => setShouldShowAddColumn((prev) => !prev)}
          />
        )}

        {!publisher && (
          <FilterHeaderIcon
            icon={ColumnReorderIcon}
            condition={columnsOrder}
            action={() => handleClickOpenColumnsReorder()}
          />
        )}
        {showChartPermission && (
          <FilterHeaderIcon
            icon={ChartIcon}
            condition={openQuickSnapShotDrawer}
            action={() => setOpenQuickSnapShotDrawer((prev) => !prev)}
          />
        )}
        {!showFilterOption && !shouldShowAddColumn && (
          <>
            {!publisher && (
              <FilterHeaderIcon
                icon={LeadStageIcon}
                condition={showLeadStageCount}
                action={() => setShowLeadStageCount((prev) => !prev)}
              />
            )}
          </>
        )}
        <FilterHeaderIcon
          icon={ResetIcon}
          action={() => resetFilterOptions()}
        />
        {/* {!publisher && (
          <Box className="saved-filter-warning-icon">
            <InfoOutlinedIcon />
          </Box>
        )} */}
        {!publisher && (
          <Box className="saved-filter-container">
            {/*
            // save filter warning message is commented for now.
             <Box className="saved-filter-warning-icon">
              <CustomTooltip
                description="If you save more than five filters, the oldest filter will be removed."
                component={
                  <IconButton>
                    {" "}
                    <InfoOutlinedIcon />
                  </IconButton>
                }
              />
            </Box> */}
            <SavedFilterPicker savedFilterProps={savedFilterProps} />
          </Box>
        )}
      </Box>
      {!isActionDisable && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {innerSearchPermission && (
            <Box sx={{ mb: 1 }}>
              <ClickAwayListener
                onClickAway={() => setSearchFieldToggle(false)}
              >
                <Box>
                  {!searchFieldToggle ? (
                    <Box sx={{ mt: 1, cursor: "pointer" }}>
                      <img
                        onClick={() => setSearchFieldToggle(true)}
                        src={counsellorSearchIcon}
                        alt=""
                        srcset=""
                      />
                    </Box>
                  ) : (
                    <>
                      {innerSearchPermission && (
                        <SearchBox
                          handleEmailInputField={handleEmailInputField}
                          searchedEmail={searchedEmail}
                          setSearchedEmail={setSearchedEmail}
                          handleSearchByEmail={handleSearchByEmail}
                          handleResetSearchByEmail={handleResetSearchByEmail}
                          initialColumns={initialColumns}
                          setItems={setItems}
                        />
                      )}
                    </>
                  )}
                </Box>
              </ClickAwayListener>
            </Box>
          )}
          {/* 
          {shouldSentEmailToAll && (
            <Box>
              <Tooltip placement="top" arrow title="Sent email to all records">
                <IconButton
                  disabled={searchedInput}
                  onClick={() => handleComposeClick("all email")}
                >
                  <ForwardToInboxOutlinedIcon color="info" />
                </IconButton>
              </Tooltip>
            </Box>
          )} */}
          {/* <Box>
            <Tooltip arrow placement="top" title="Download all records">
              <IconButton
                disabled={searchedInput}
                onClick={() =>
                  handleAllApplicationsDownload(
                    "download all",
                    totalApplicationCount
                  )
                }
              >
                <FileDownloadOutlinedIcon color="info" />
              </IconButton>
            </Tooltip>
          </Box> */}
          {showCreateLead && (
            <Box
              className={`
               filter-header-items-inactive
               filter-header-items`}
              onClick={() => setOpenLeadDialog(true)}
            >
              Add Lead
              <AddIcon />
            </Box>
          )}
        </Box>
      )}
      <AddLeadDialog
        openAddLeadDialog={openAddLeadDialog}
        setOpenLeadDialog={setOpenLeadDialog}
      />
    </>
  );
}

export default React.memo(FilterHeader);
