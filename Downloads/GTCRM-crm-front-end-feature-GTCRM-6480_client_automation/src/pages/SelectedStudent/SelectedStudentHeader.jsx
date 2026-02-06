import {
  Box,
  CircularProgress,
  ClickAwayListener,
  FormHelperText,
  Grid,
} from "@mui/material";
import React from "react";
import HeadingText from "../../components/shared/SelectedStudent/HeadingText";
import MultipleFilterSelectionInterviewModule from "../../components/shared/CreateInterviewRoomList/CreateInterviewFilter";
import { twelveMarksList } from "../../constants/LeadStageList";
import { useState } from "react";
import SearchIconButton from "../../components/shared/forms/SearchIconButton";
import SearchInputField from "../../components/shared/forms/SearchInputField";
const SelectedStudentHeader = ({
  data,
  filterOptions,
  handleApplyFilters,
  handleSendForApprovalApiCall,
  loadingSendForApproval,
  setSearchText,
  searchText,
  handleSearchApiCall,
}) => {
  const [clickedSearchIcon, setClickedSearchIcon] = useState(false);

  return (
    <Box className="selected-student-header">
      <Box>
        <Box>
          <ClickAwayListener onClickAway={() => setClickedSearchIcon(false)}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchApiCall();
              }}
            >
              <Box className="student-header-search-box">
                {clickedSearchIcon ? (
                  <Box>
                    <SearchInputField
                      searchText={searchText}
                      setSearchText={setSearchText}
                    />
                    <FormHelperText sx={{ color: "#FFB020" }}>
                      Please press Enter key
                    </FormHelperText>
                  </Box>
                ) : (
                  <SearchIconButton
                    sx={{ padding: "4px 8px" }}
                    setClickedSearchIcon={setClickedSearchIcon}
                  />
                )}
              </Box>
            </form>
          </ClickAwayListener>
        </Box>
        <Box sx={{ pb: 2, pt: 1, whiteSpace: "nowrap" }}>
          <Grid container spacing={3} sx={{ px: 2, alignItems: "center" }}>
            <Grid item md={3} sm={12} xs={12}>
              <HeadingText title="List Name" text={data?.interview_name} />
              <HeadingText title="Program Name" text={data?.program_name} />
            </Grid>
            {filterOptions?.map((options) => (
              <Grid item md={2} sm={12} xs={12}>
                <MultipleFilterSelectionInterviewModule
                  placeholder={options.placeholder}
                  size="lg"
                  data={twelveMarksList}
                  className="selected-student-filter"
                  value={options.value}
                  setValue={options.setValue}
                />
              </Grid>
            ))}

            <Grid item md={1} sm={12} xs={12}>
              <Box className="send-for-approval-btn">
                <button
                  onClick={() => {
                    handleApplyFilters();
                  }}
                >
                  Apply
                </button>
              </Box>
            </Grid>

            <Grid item md={2} sm={12} xs={12}>
              {loadingSendForApproval ? (
                <CircularProgress size={25} color="info" />
              ) : (
                <Box className="send-for-approval-btn">
                  <button onClick={() => handleSendForApprovalApiCall()}>
                    Send for Approval
                  </button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default SelectedStudentHeader;
