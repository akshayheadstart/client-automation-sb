import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Drawer } from "rsuite";
import "../../styles/MODDesignPage.css";
import "../../styles/PanellistDesignPage.css";
const InviteLinkDrawer = ({placementInviteLink,openInviteLink,setOpenInviteLink,handleInviteLink}) => {
  return (
    <Drawer
      size={"xs"}
      placement={placementInviteLink}
      open={openInviteLink}
      onClose={() => setOpenInviteLink(false)}
    >
      <Drawer.Body className="drawer-box-body">
        <Box className="invite-student-text-box">
          <Typography className="invite-student-text">
            Invite Student
          </Typography>
        </Box>
        <Box className="invite-link-box-container"></Box>
        <Box className="button-box-container">
          <Button
            sx={{ borderRadius: 50, paddingX: 3 }}
            color="info"
            size="small"
            className="invite-link-cancel-button"
            onClick={()=>setOpenInviteLink(false)}
          >
            Cancel
          </Button>
          <Button
            sx={{
              borderRadius: 50,
              paddingX: 3,
              whiteSpace: "nowrap",
              paddingY: 1,
            }}
            color="info"
            variant="contained"
            size="small"
            onClick={()=>{handleInviteLink();setOpenInviteLink(false)}}
          >
            Send Email
          </Button>
        </Box>
      </Drawer.Body>
    </Drawer>
  );
};

export default InviteLinkDrawer;
