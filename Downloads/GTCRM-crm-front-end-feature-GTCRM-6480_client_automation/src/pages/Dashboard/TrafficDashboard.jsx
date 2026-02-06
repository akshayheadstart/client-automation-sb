import React, { useContext, useEffect } from "react";
import { Box, Container, Grid } from "@mui/material";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";

function TrafficDashboard(props) {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
    // Traffic Dashboard Head Title add
    useEffect(() => {
      setHeadTitle("Traffic Dashboard");
      document.title = "Traffic Dashboard";
    }, [headTitle]);
  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={12} sm={12} xs={12}>
            TrafficDashboard
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default TrafficDashboard;
