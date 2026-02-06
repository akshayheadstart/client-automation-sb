import { Box, Button, Typography } from "@mui/material";
import React from "react";

const UserDetails = ({ userDetails, handleOpenChangeUserDialog }) => {
  return (
    <>
      <Box className="settings-user-data-row">
        <Typography className="settings-user-data-key">Name</Typography>
        <Typography className="settings-user-data-value capitalize-text">
          {userDetails?.name ? userDetails?.name : "Not found"}
        </Typography>
      </Box>

      <Box className="settings-user-data-row">
        <Typography className="settings-user-data-key">Email</Typography>
        <Typography className="settings-user-data-value">
          {userDetails?.email ? userDetails?.email : "Not found"}
        </Typography>
      </Box>

      <Box className="settings-user-data-row">
        <Typography className="settings-user-data-key">
          Mobile number
        </Typography>
        <Typography className="settings-user-data-value">
          {userDetails?.mobile_number
            ? userDetails?.mobile_number
            : "Not found"}
        </Typography>
      </Box>

      <Box className="settings-user-data-row">
        <Typography className="settings-user-data-key">Role</Typography>
        <Typography className="settings-user-data-value capitalize-text">
          {userDetails?.role_name ? userDetails?.role_name : "Not found"}
        </Typography>
      </Box>

      <Box className="assigned-college-row">
        <Typography className="settings-user-data-key">
          Assigned colleges
        </Typography>
        <Box className="settings-user-data-value user-assigned-college">
          {userDetails?.associated_colleges?.length > 0 ? (
            <>
              {userDetails?.associated_colleges?.map((college) => {
                return (
                  <Typography sx={{ mr: 1 }} key={college}>
                    {college},{" "}
                  </Typography>
                );
              })}
            </>
          ) : (
            <>
              <Typography>Not found</Typography>
            </>
          )}
        </Box>
      </Box>
      <Button
        className="common-contained-button"
        sx={{ mb: 2 }}
        onClick={handleOpenChangeUserDialog}
      >
        Change Password
      </Button>
    </>
  );
};

export default UserDetails;
