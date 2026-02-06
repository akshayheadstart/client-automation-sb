import React, { useEffect, useState } from "react";
import { Box, Drawer, Typography, IconButton } from "@mui/material";
import "../../../styles/QuickSnapshoot.css";
import { CloseOutlined } from "@mui/icons-material";
import ApplicationTrendsGraph from "./chartjs/ApplicationTrendsGraph";
import StageWiseApplicationChart from "./chartjs/StageWiseApplicationChart";
import GeographicalChart from "./chartjs/GeographicalChart";
import "../../../styles/QuickSnapshot.css";
import Cookies from "js-cookie";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function QuickSnapshoot({
  openQuickSnapShotDrawer,
  setOpenQuickSnapShotDrawer,
}) {
  const [collegeId, setCollegeId] = useState("");
  const [stateList, setStateList] = useState([]);
  const [selectPickerValue, setSelectPickerValue] = useState("");
  useEffect(() => {
    setCollegeId(Cookies.get("collegeId"));
    setSelectPickerValue('')
  }, []);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Drawer
      disableEnforceFocus={true}
      PaperProps={
        fullScreen
          ? {
              sx: {
                width: "100%",
              },
            }
          : {
              sx: {
                width: "70%",
              },
            }
      }
      open={openQuickSnapShotDrawer}
      onClose={() => setOpenQuickSnapShotDrawer(false)}
      anchor="right"
    >
      <Box sx={{ p: 3 }}>
        <Box className="lead-stage-details-drawer-header">
          <Typography sx={{ fontSize: "20px" }} variant="h5">
            Charts
          </Typography>

          <IconButton onClick={() => setOpenQuickSnapShotDrawer(false)}>
            <CloseOutlined />
          </IconButton>
        </Box>

        <Box className="applicationTrends_graph">
          <ApplicationTrendsGraph collegeId={collegeId} />

          <StageWiseApplicationChart />

          <GeographicalChart
            collegeId={collegeId}
            setStateList={setStateList}
            stateList={stateList}
            selectPickerValue={selectPickerValue}
          />

          {/* {snapShootTabs === 4 && <ApplicationStageChart />} */}
        </Box>
      </Box>
    </Drawer>
  );
}
export default QuickSnapshoot;
