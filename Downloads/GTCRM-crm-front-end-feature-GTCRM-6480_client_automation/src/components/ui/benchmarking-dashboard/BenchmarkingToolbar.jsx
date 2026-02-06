import { Box, Typography } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ToolbarWrapper from "../../shared/toolbars/ToolBarWrapper";
import React, { useRef } from "react";
import FilterByDrawer from "../../shared/filters/FilterByDrawer";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import IconButton from "@mui/material/IconButton";
function BenchmarkingToolbar(props) {
  const [institute, setInstitute] = React.useState("");

  const handleChange = (event) => {
    setInstitute(event.target.value);
  };

  const filterByRef = useRef();
  const openDrawer = (anchor, open) => (event) => {
    filterByRef.current.openDrawer(anchor, open);
  };

  return (
    <>
      <ToolbarWrapper>
        <Box className="toolbarWrapper">
          <Typography variant="h5" component="div">
            Benchmarking Dashboar
          </Typography>
          <Box component="span" className="playCircleIcon">
            <PlayCircleIcon color="primary" />
          </Box>
        </Box>
        <IconButton>
          <FilterAltOutlinedIcon
            size="large"
            onClick={openDrawer("right", true)}
            sx={{ fontSize: "30px" }}
          />
        </IconButton>
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<FilterAltIcon />}
          onClick={openDrawer("right", true)}
        >
          <FilterAltOutlinedIcon />
        </Button> */}
      </ToolbarWrapper>
      <FilterByDrawer
        ref={filterByRef}
        title="Filter By"
        onFilterApply={props.onFilterApply}
        onFilterReset={props.onFilterReset}
      >
        <Box sx={{ minWidth: 120 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth className="formConrol">
                <InputLabel id="institute-name-select-label">
                  Institute Name
                </InputLabel>
                <Select
                  labelId="institute-name-select-label"
                  id="institute-name-select"
                  value={institute}
                  label="Institute Name"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>O.p. Jindal Gloabl University</MenuItem>
                  <MenuItem value={20}>Punjab Technical University</MenuItem>
                  <MenuItem value={30}>
                    Indira Gandhi Technical Institute
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth className="formControl">
                <InputLabel id="select-form-select-label">
                  Select Form
                </InputLabel>
                <Select
                  labelId="select-form-select-label"
                  id="select-form-select"
                  value={institute}
                  label="select Form"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>B.A form</MenuItem>
                  <MenuItem value={20}>MCA Form</MenuItem>
                  <MenuItem value={30}>B.tech Form</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </FilterByDrawer>
    </>
  );
}

export default BenchmarkingToolbar;
