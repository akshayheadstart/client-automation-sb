import { Box, Button } from "@mui/material";
import React from "react";
import { useState } from "react";

import PanelAndStudentLIstDetailsDrawer from "./PanelAndStudentLIstDetailsDrawer";
import "../../styles/PanelAndStudentListDetails.css";
const PanelAndStudentListDetails = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerSize, setDrawerSize] = useState("lg");
  const [headerDetails, setHeaderDetails] = useState({});
  const [typeOfPanel, setTypeOfPanel] = useState("");
  const [openReschedule, setOpenReschedule] = useState(false);

  // const panelData = ;
  const handleDrawerSize = (size, headerDetails, panelType) => {
    setDrawerSize(size);
    setOpenDrawer(true);
    setHeaderDetails(headerDetails);
    setTypeOfPanel(panelType);
  };
  const panelData = {
    heading: "Panel Name",
    list_name: "List Name",
    type: "GD",
    date: "08 June 2023",
  };

  const gdData = {
    heading: "Slot Time",
    list_name: "List Name",
    type: "GD",
    date: "08 June 2023",
  };
  const piData = {
    heading: "Slot Time",
    list_name: "List Name",
    type: "PI",
    date: "08 June 2023",
  };
  return (
    <Box sx={{ m: { md: 4, xs: 3 }, display: "flex", gap: 2 }}>
      <Button
        variant="outlined"
        onClick={() => handleDrawerSize("lg", panelData)}
      >
        Open Panel
      </Button>
      <Button
        onClick={() => handleDrawerSize("md", gdData, "gd")}
        variant="outlined"
      >
        Open GD
      </Button>
      <Button
        onClick={() => handleDrawerSize("md", piData, "pi")}
        variant="outlined"
      >
        Open PI
      </Button>
      <Button
        onClick={() => {
          handleDrawerSize("md", gdData, "gd");
          setOpenReschedule(true);
        }}
        variant="outlined"
      >
        Open reschedule GD
      </Button>
      <Button
        onClick={() => {
          handleDrawerSize("md", piData, "pi");
          setOpenReschedule(true);
        }}
        variant="outlined"
      >
        Open reschedule PI
      </Button>

      <PanelAndStudentLIstDetailsDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        size={drawerSize}
        data={headerDetails}
        typeOfPanel={typeOfPanel}
        openReschedule={openReschedule}
        setOpenReschedule={setOpenReschedule}
      />
    </Box>
  );
};

export default PanelAndStudentListDetails;
