import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";

import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import Filter7OutlinedIcon from "@mui/icons-material/Filter7Outlined";
import Replay30OutlinedIcon from "@mui/icons-material/Replay30Outlined";
import StayCurrentLandscapeOutlinedIcon from "@mui/icons-material/StayCurrentLandscapeOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import LowPriorityIcon from "@mui/icons-material/LowPriority";

import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import "../../styles/tabularFilterComponent.css";

const TabularFilterComponent = (props) => {
  return (
    <Box>
      <Dialog
        open={props?.openFilter}
        onClose={props?.handleFilterClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle sx={{ width: "320px" }} id="responsive-dialog-title">
          {" Filter timeline?"}
        </DialogTitle>
        <Divider></Divider>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <List component="nav" aria-label="main mailbox folders">
            <ListItemButton
              sx={{
                display: `${props?.selectedIndex === 6 ? "none" : "flex"}`,
              }}
              onClick={(event) => props?.handleListItemClick(event, 0)}
              className={`selected-item-design ${
                props?.selectedIndex === 0 && "selected-item-design-active"
              }`}
            >
              <ListItemIcon>
                <InsertInvitationOutlinedIcon
                  className={`${
                    props?.selectedIndex === 0 &&
                    "selected-item-filter-sub-icon"
                  }`}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "15px",
                  fontWeight: `${props?.selectedIndex === 0 && "bold"}`,
                }}
                primary="Today"
              />
            </ListItemButton>
            <ListItemButton
              sx={{
                display: `${props?.selectedIndex === 6 ? "none" : "flex"}`,
              }}
              selected={props?.selectedIndex === 1}
              onClick={(event) => props?.handleListItemClick(event, 1)}
              className={`selected-item-design ${
                props?.selectedIndex === 1 && "selected-item-design-active"
              }`}
            >
              <ListItemIcon>
                <LooksOneOutlinedIcon
                  className={`${
                    props?.selectedIndex === 1 &&
                    "selected-item-filter-sub-icon"
                  }`}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "15px",
                  fontWeight: `${props?.selectedIndex === 1 && "bold"}`,
                }}
                primary="YesterDay"
              />
            </ListItemButton>
            <ListItemButton
              sx={{
                display: `${props?.selectedIndex === 6 ? "none" : "flex"}`,
              }}
              selected={props?.selectedIndex === 2}
              onClick={(event) => props?.handleListItemClick(event, 2)}
              className={`selected-item-design ${
                props?.selectedIndex === 2 && "selected-item-design-active"
              }`}
            >
              <ListItemIcon>
                <Filter7OutlinedIcon
                  className={`${
                    props?.selectedIndex === 2 &&
                    "selected-item-filter-sub-icon"
                  }`}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "15px",
                  fontWeight: `${props?.selectedIndex === 2 && "bold"}`,
                }}
                primary="Last 7 Days"
              />
            </ListItemButton>
            <ListItemButton
              sx={{
                display: `${props?.selectedIndex === 6 ? "none" : "flex"}`,
              }}
              selected={props?.selectedIndex === 3}
              onClick={(event) => props?.handleListItemClick(event, 3)}
              className={`selected-item-design ${
                props?.selectedIndex === 3 && "selected-item-design-active"
              }`}
            >
              <ListItemIcon>
                <Replay30OutlinedIcon
                  className={`${
                    props?.selectedIndex === 3 &&
                    "selected-item-filter-sub-icon"
                  }`}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "15px",
                  fontWeight: `${props?.selectedIndex === 3 && "bold"}`,
                }}
                primary="Last 30 Days"
              />
            </ListItemButton>
            <ListItemButton
              sx={{
                display: `${props?.selectedIndex === 6 ? "none" : "flex"}`,
              }}
              selected={props?.selectedIndex === 4}
              onClick={(event) => props?.handleListItemClick(event, 4)}
              className={`selected-item-design ${
                props?.selectedIndex === 4 && "selected-item-design-active"
              }`}
            >
              <ListItemIcon>
                <StayCurrentLandscapeOutlinedIcon
                  className={`${
                    props?.selectedIndex === 4 &&
                    "selected-item-filter-sub-icon"
                  }`}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "15px",
                  fontWeight: `${props?.selectedIndex === 4 && "bold"}`,
                }}
                primary="This month"
              />
            </ListItemButton>
            <ListItemButton
              sx={{
                display: `${props?.selectedIndex === 6 ? "none" : "flex"}`,
              }}
              selected={props?.selectedIndex === 5}
              onClick={(event) => props?.handleListItemClick(event, 5)}
              className={`selected-item-design ${
                props?.selectedIndex === 5 && "selected-item-design-active"
              }`}
            >
              <ListItemIcon>
                <SettingsBackupRestoreOutlinedIcon
                  className={`${
                    props?.selectedIndex === 5 &&
                    "selected-item-filter-sub-icon"
                  }`}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "15px",
                  fontWeight: `${props?.selectedIndex === 5 && "bold"}`,
                }}
                primary="Last Month"
              />
            </ListItemButton>
            <ListItemButton
              sx={{
                display: `${props?.selectedIndex === 6 ? "none" : "flex"}`,
              }}
              selected={props?.selectedIndex === 6}
              onClick={(event) => props?.handleListItemClick(event, 6)}
              className={`selected-item-design ${
                props?.selectedIndex === 6 && "selected-item-design-active"
              }`}
            >
              <ListItemIcon>
                <LowPriorityIcon
                  className={`${
                    props?.selectedIndex === 6 &&
                    "selected-item-filter-sub-icon"
                  }`}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "15px",
                  fontWeight: `${props?.selectedIndex === 6 && "bold"}`,
                }}
                primary="Custom Range"
              />
            </ListItemButton>
          </List>
          <DialogContent
            sx={{ display: `${props?.selectedIndex === 6 ? "block" : "none"}` }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Custom input"
                value={props?.startingDate}
                onChange={(newValue) => props?.setStartingDate(newValue)}
                renderInput={({ inputRef, inputProps, InputProps }) => (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <input ref={inputRef} {...inputProps} />
                    {InputProps?.endAdornment}
                  </Box>
                )}
              />
            </LocalizationProvider>
            <Typography mt={1} ml={1} mb={1} mr={1} fontWeight={"bold"}>
              To
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Custom input"
                value={props?.endDate}
                onChange={(newValue) => props?.setEndDate(newValue)}
                renderInput={({ inputRef, inputProps, InputProps }) => (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <input ref={inputRef} {...inputProps} />
                    {InputProps?.endAdornment}
                  </Box>
                )}
              />
            </LocalizationProvider>
          </DialogContent>
        </Box>

        <DialogActions>
          <Button
            sx={{ display: `${props?.selectedIndex === 6 ? "block" : "none"}` }}
            autoFocus
          >
            Search
          </Button>
          <Button autoFocus onClick={props?.handleFilterClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TabularFilterComponent;
