/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext } from "react";
import { Box, Container, Grid } from "@mui/material";

import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import CallListHeader from "./CallListHeader";
import { useSelector } from "react-redux";
import "../../styles/callList.css";
import useCollegeIdHook from "./useCollegeIdHook";
import CallListReviewTable from "./CallListReviewTable";
import { useRejectedCallListFilterMutation } from "../../Redux/Slices/applicationDataApiSlice";
import useToasterHook from "../../hooks/useToasterHook";
import dayjs from "dayjs";

const QcdRejectedCalls = () => {
  const { token } = useSelector((state) => state.authentication);

  const { selectedSeason, setHeadTitle, headTitle } =
    useContext(LayoutSettingContext);
  const { collegeId } = useCollegeIdHook();
  const [rejectedCallListFilterData, setRejectedCallListFilterData] =
    React.useState({});
  const [
    rejectedcallListFilterDataLoading,
    setRejectedCallListFilterDataLoading,
  ] = useState(false);

  const actionAllowed =
    token?.scopes[0] === "college_super_admin" ||
    token?.scopes[0] === "qa_head";

  const [rejectedCallListFilter] = useRejectedCallListFilterMutation();
  const pushNotification = useToasterHook();

  React.useEffect(() => {
    setHeadTitle("QC Rejected Calls");
    document.title = "QC Rejected Calls";
  }, [headTitle]);

  const handleFilterChange = (appliedFilters) => {
    if (collegeId) {
      setRejectedCallListFilterDataLoading(true);
      rejectedCallListFilter({
        collegeId,
        payload:
          appliedFilters?.dateRange === null ||
          appliedFilters?.dateRange?.length === 0
            ? null
            : {
                start_date: dayjs(appliedFilters.dateRange[0]).format(
                  "YYYY-MM-DD"
                ),
                end_date: dayjs(appliedFilters.dateRange[1]).format(
                  "YYYY-MM-DD"
                ),
              },
        counsellorId: appliedFilters?.counsellor,
      })
        .unwrap()
        .then((data) => {
          try {
            if (data.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data.detail) {
              setRejectedCallListFilterData([]);
              pushNotification("error", data.detail);
            } else if (data?.data) {
              setRejectedCallListFilterData(data?.data[0] || null);
            }
          } catch (error) {
            pushNotification("error", error?.detail);
          }
        })
        .catch((error) => {
          pushNotification("error", error?.detail);
        })
        .finally(() => {
          setRejectedCallListFilterDataLoading(false);
        });
    }
  };

  React.useEffect(() => {
    if (collegeId) {
      handleFilterChange({ dateRange: null });
    }
  }, [collegeId]);

  return (
    <Box component="main" sx={{ flexGrow: 1, pt: 2, px: 2 }}>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item md={12} sm={12} xs={12}>
            <CallListHeader
              collegeId={collegeId}
              selectedSeason={selectedSeason}
              onChangeFilter={handleFilterChange}
              loading={rejectedcallListFilterDataLoading}
              data={rejectedCallListFilterData}
              user={token?.scopes[0]}
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Box className="counsellor-qa-tab-wrapper">
              <CallListReviewTable
                collegeId={collegeId}
                isActionDisable={!actionAllowed}
                user={token?.scopes[0]}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default QcdRejectedCalls;
