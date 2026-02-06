import React from "react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Box } from "@mui/system";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate } from "react-router-dom";
import { ClickAwayListener, FormHelperText } from "@mui/material";
import { useState } from "react";
import SearchInputField from "../forms/SearchInputField";
const ListHeaderActions = ({
  setShowFilter,
  showFilter,
  setClickedAddStudentButton,
  searchText,
  setSearchText,
  handleSearchApiCall,
}) => {
  const [clickedSearchIcon, setClickedSearchIcon] = useState(false);
  const navigate = useNavigate();
  return (
    <Box className="student-list-header-action-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchApiCall();
        }}
      >
        <ClickAwayListener onClickAway={() => setClickedSearchIcon(false)}>
          <Box
            sx={{ alignItems: "flex-start" }}
            className="search-and-filter-container"
          >
            {clickedSearchIcon ? (
              <Box>
                <SearchInputField
                  searchText={searchText}
                  setSearchText={setSearchText}
                  maxWidth={220}
                />
                <FormHelperText sx={{ color: "#FFB020" }}>
                  Please press Enter key
                </FormHelperText>
              </Box>
            ) : (
              <Box
                onClick={() => setClickedSearchIcon(true)}
                className="icon-container"
              >
                <SearchOutlinedIcon />
              </Box>
            )}

            <Box
              onClick={() => {
                setShowFilter((prev) => !prev);
                setSearchText("");
              }}
              className="icon-container"
              sx={{
                padding: clickedSearchIcon ? "9px 10px !important" : "4px 8px",
              }}
            >
              <FilterAltOutlinedIcon color={showFilter ? "primary" : ""} />
            </Box>
          </Box>
        </ClickAwayListener>
      </form>
      <Box
        sx={{ textAlign: "center" }}
        className="manager-panel-and-slots-button"
      >
        <button onClick={() => navigate("/planner")}>
          Manage Panel and Slots
        </button>
      </Box>
      <Box className="add-application-button">
        <AddOutlinedIcon />
        <button onClick={() => setClickedAddStudentButton(true)}>
          Add Applications
        </button>
      </Box>
    </Box>
  );
};

export default ListHeaderActions;
