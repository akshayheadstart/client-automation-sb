import * as React from "react";

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const universities = [
  {
    value: "1",
    label: "O.P Jindal University",
  },
  {
    value: "2",
    label: "Ignou University",
  },
  {
    value: "3",
    label: "Delhi University",
  },
];
const forms = [
  {
    value: "1",
    label: "B.Tech Form",
  },
  {
    value: "2",
    label: "M.Tech Form",
  },
];
const rows = [
  {
    value: "1",
    label: "Row1",
  },
  {
    value: "2",
    label: "Row2",
  },
];

const columns = [
  {
    value: "1",
    label: "Column1",
  },
  {
    value: "2",
    label: "Column2",
  },
];

export default function SearchForm() {
  const [university, setUniversity] = React.useState("2");
  const [form, setForm] = React.useState("2");
  const [row, setRow] = React.useState("2");
  const [column, setColumn] = React.useState("2");

  const handleUniversityChange = (event) => {
    setUniversity(event.target.value);
  };
  const handleFormChange = (event) => {
    setForm(event.target.value);
  };
  const handleRowChange = (event) => {
    setRow(event.target.value);
  };
  const handleColumnChange = (event) => {
    setColumn(event.target.value);
  };

  return (
    <Box className="searchFormWrapper">
      <Container maxWidth="md">
        <Grid container spacing={1}>
          <Grid item lg={12} sm={12} xs={12} sx={{ mb: 3 }}>
            <Box className="headingWrapper">
              <Box sx={{ flexGrow: 2 }}>
                <hr />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">Show Trends For</Typography>
              </Box>

              <Box sx={{ flexGrow: 2 }}>
                <hr />
              </Box>
            </Box>
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <TextField
              id="outlined-select-university"
              select
              label="Select Univesity"
              value={university}
              onChange={handleUniversityChange}
              helperText="Please select your university"
              fullWidth
              color="info"
            >
              {universities.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <TextField
              id="outlined-select-form"
              select
              label="Select Form"
              value={form}
              onChange={handleFormChange}
              helperText="Please select your form"
              fullWidth
              color="info"
            >
              {forms.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <TextField
              id="outlined-select-row"
              select
              label="Select Row"
              value={row}
              onChange={handleRowChange}
              helperText="Please select your row"
              fullWidth
              color="info"
            >
              {rows.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <TextField
              id="outlined-select-column"
              select
              label="Select Column"
              value={column}
              onChange={handleColumnChange}
              helperText="Please select your column"
              fullWidth
              color="info"
            >
              {columns.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item lg={12} sm={12} xs={12}>
            <Box>
              <FormGroup sx={{ pt: 0 }}>
                <FormControlLabel
                  className="checkboxLabel"
                  control={<Checkbox defaultChecked />}
                  label="Show trends of applications basis dependent fields"
                />
              </FormGroup>
            </Box>
          </Grid>
          <Grid item lg={12} sm={12} xs={12}>
            <Box className="actions">
              <Button
                size="small"
                variant="outlined"
                color="success"
                startIcon={<RestartAltIcon />}
                sx={{
                  flexGrow: 1,
                  maxWidth: 100,
                }}
              >
                Reset
              </Button>
              <Button
                color="primary"
                size="small"
                variant="contained"
                startIcon={<SearchIcon />}
                sx={{
                  flexGrow: 1,
                  maxWidth: 100,
                }}
              >
                Search
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
