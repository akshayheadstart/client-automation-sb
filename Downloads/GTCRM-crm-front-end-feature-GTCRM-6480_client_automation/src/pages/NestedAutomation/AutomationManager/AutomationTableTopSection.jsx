import { Box } from "@mui/system";
import React from "react";
import { SelectPicker } from "rsuite";
import { automationCommunicationType } from "../../../constants/LeadStageList";
import {
  Button,
  InputAdornment,
  TextField,
  inputLabelClasses,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import IconDateRangePicker from "../../../components/shared/filters/IconDateRangePicker";

function AutomationTableTopSection({
  communicationType,
  setCommunicationType,
  searchText,
  setSearchText,
  dateRange,
  setDateRange,
  setPageNumber,
  handleManageCreateAutomationDialogue,
}) {
  return (
    <Box className="automation-filter-container">
      <Box>
        <SelectPicker
          style={{ width: 180 }}
          data={automationCommunicationType}
          placeholder="Communication Type"
          searchable={false}
          value={communicationType}
          onChange={setCommunicationType}
        />
      </Box>
      <Box className="automation-search-and-date-filter">
        <Box>
          <TextField
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#008BE2",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#008BE2",
                },
              "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#008BE2",
                },
              width: "230px",
            }}
            className="automation-search-box"
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
              setPageNumber(1);
            }}
            label="Search Automation"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#008BE2" }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              sx: {
                // set the color of the label when not shrinked
                color: "#008BE2",
                fontSize: 14,
                [`&.${inputLabelClasses.shrink}`]: {
                  // set the color of the label when shrinked (usually when the TextField is focused)
                  color: "#008BE2",
                },
              },
            }}
          />
        </Box>
        <Box>
          <Button
            startIcon={<AddIcon sx={{ color: "#008BE2" }} />}
            className="automation-manager-btn"
            onClick={() => handleManageCreateAutomationDialogue(true)}
          >
            Create Automation
          </Button>
        </Box>
        <Box>
          <IconDateRangePicker
            dateRange={dateRange}
            onChange={(value) => setDateRange(value)}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default AutomationTableTopSection;
