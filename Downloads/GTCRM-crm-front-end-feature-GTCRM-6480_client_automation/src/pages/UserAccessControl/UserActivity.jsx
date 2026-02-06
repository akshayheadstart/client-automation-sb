import React from "react";
import "../../styles/UserActivity.css";
import {
  Grid,
  Divider,
  Typography,
  Box,
  TextField,
  Button,
  Card,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
const UserActivity = () => {
  return (
    <div className="activity">
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Box className="header">
            <Typography gutterBottom variant="h5">
              Users Activity Logs
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ borderRadius: "50px", textAlign: "center" }}>
            <Card sx={{ maxWidth: 850,padding:"30px",margin:'0 auto' }}>
              <TextField
              color="info"
                className="search_field"
                label="Search By Name"
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography className="filter_text">Filter By</Typography>
              {/* filter by */}
              <Grid
                container
                md={12}
                sm={12}
                xs={12}
                sx={{ width: "800px", margin: "0 auto" }}
              >
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl variant="outlined" sx={{ width: "250px" }}>
                    <InputLabel id="demo-simple-select-outlined-label">
                      JK Lakshmiput University
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="JK Lakshmiput University"
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={4} xs={4}>
                  <FormControl variant="outlined" sx={{ width: "250px" }}>
                    <InputLabel id="demo-simple-select-outlined-label">
                      User Role
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="User Role"
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={4} xs={12}>
                  <FormControl variant="outlined" sx={{ width: "250px" }}>
                    <InputLabel id="demo-simple-select-outlined-label">
                      Module Name
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="Module Name"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {/* second grid */}
              <Grid
                container
                md={12}
                sm={12}
                xs={12}
                sx={{ width: "800px", margin: "0 auto", marginTop: "20px" }}
              >
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl variant="outlined" sx={{ width: "250px" }}>
                    <InputLabel id="demo-simple-select-outlined-label">
                      Actions
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="Actions"
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={4} xs={4}>
                  <FormControl variant="outlined" sx={{ width: "250px" }}>
                    <InputLabel id="demo-simple-select-outlined-label">
                      Select Data Range
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="Select Data Range"
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box className="btn_box">
                <Button className="search_btn">Search</Button>
                <Button className="reset_btn">Reset</Button>
              </Box>
            </Card>

            <Typography className="textDesign">
              Please click search button to view activity
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserActivity;
