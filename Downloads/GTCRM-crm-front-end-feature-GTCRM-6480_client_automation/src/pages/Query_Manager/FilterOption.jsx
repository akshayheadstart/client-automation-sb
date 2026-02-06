import React, { useState } from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Stack from '@mui/material/Stack';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import "../../styles/FilterOpttion.css";
import {
    FilterAlt,
} from "@mui/icons-material";
export default function FilterOption(props) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = React.useState(new Date('2018-01-01T00:00:00.000Z'));
    const handleDrawer = () => {
        setOpen(true);
    };
    return (
        <div>
            <Box>
                {/* filter drawer */}
                <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                    <Box
                        className="drawer_width"
                        style={{
                            margin: "20px",
                        }}
                    >
                        <Box className="filter_items_flex">
                            <Typography className="filter_text">Filter</Typography>
                            <Button size="small" className="close_btn">
                                <IconButton>
                                    <CloseIcon onClick={() => setOpen(false)} />
                                </IconButton>
                            </Button>
                        </Box>
                        {/* name field */}
                        <form onSubmit={(event) => event.preventDefault()}>
                            {/* choose your form field */}
                            <Box sx={{ mt: 1 }}>
                                <FormControl className="filled_width" variant="outlined" sx={{ width: "250px" }}>
                                    <InputLabel data-testid="choose-your-form" id="demo-simple-select-outlined-label">
                                        Choose Your Form
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        label="Choose Your Form"
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            {/* Payment status */}
                            <Box sx={{ mt: 2 }}>
                                <FormControl className="filled_width" variant="outlined" sx={{ width: "250px" }}>
                                    <InputLabel
                                        data-testid="payment-status"
                                        id="demo-simple-select-outlined-label">
                                        Payment Status
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        label="Payment Status"
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            {/* Category */}
                            <Box sx={{ mt: 2 }}>
                                <FormControl className="filled_width" variant="outlined" sx={{ width: "250px" }}>
                                    <InputLabel
                                        data-testid="choose-your-preferred-category"
                                        id="demo-simple-select-outlined-label">
                                        Choose Your Preferred Category
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        label="Choose Your Preferred Category"
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            {/* Assigned To */}
                            <Box sx={{ mt: 2 }}>
                                <FormControl className="filled_width" variant="outlined" sx={{ width: "250px" }}>
                                    <InputLabel
                                        data-testid="assigned-to"
                                        id="demo-simple-select-outlined-label">
                                        Assigned To
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        label="Assigned To"
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            {/* Select Your Status */}
                            <Box sx={{ mt: 2 }}>
                                <FormControl className="filled_width" variant="outlined" sx={{ width: "250px" }}>
                                    <InputLabel
                                        data-testid="select-your-status" id="demo-simple-select-outlined-label">
                                        Select Your Status
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        label="Select Your Status"
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            {/* select date */}
                            <Box className="filled_width" sx={{ mt: 2 }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={3}>
                                        <DateTimePicker
                                            renderInput={(params) => <TextField {...params} />}
                                            value={value}
                                            onChange={(newValue) => {
                                                setValue(newValue);
                                            }}
                                            color="info"
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{ flexGrow: 1, mt: 2 }}>
                                <Button data-testid="reset-btn" variant="outlined" sx={{ height: "40px" }}>
                                    Reset
                                </Button>
                                <Button data-testid="apply-btn"
                                    sx={{ ml: 1, height: "40px" }}
                                    type="submit"
                                    variant="contained"
                                >
                                    Apply
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Drawer>
            </Box >
            <Box>
                <Button data-testid="filter-btn" onClick={handleDrawer}>
                    <IconButton>
                        <FilterAlt />
                    </IconButton>
                </Button>
            </Box>
        </div >
    );
}
