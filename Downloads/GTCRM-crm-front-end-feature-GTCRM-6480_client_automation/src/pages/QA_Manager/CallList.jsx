/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/sharedStyles.css";
import MultipleTabs from "../../components/shared/tab-panel/MultipleTabs";
import CounsellorCallListTable from "./CounsellorCallListTable";
import QACallListTable from "./QACallListTable";
import CallListHeader from "./CallListHeader";
import IconDateRangePicker from "../../components/shared/filters/IconDateRangePicker";
import CallListReviewTable from "./CallListReviewTable";
import { useCallListFilterMutation } from "../../Redux/Slices/applicationDataApiSlice";
import dayjs from "dayjs";
import "../../styles/callList.css";
import useToasterHook from "../../hooks/useToasterHook";
import useCollegeIdHook from "./useCollegeIdHook";

const CallList = ({ route = "callList" }) => {
  const { token } = useSelector((state) => state.authentication);
  const [tabValue, setTabValue] = React.useState(0);
  const [dateRange, setDateRange] = React.useState([]);
  const [callListFilterData, setCallListFilterData] = React.useState({});
  const [hideComponent, setHideComponent] = React.useState(false);
  const [callListFilterDataLoading, setCallListFilterDataLoading] =
    useState(false);
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  const { collegeId } = useCollegeIdHook();
  const [callListFilter] = useCallListFilterMutation();
  const pushNotification = useToasterHook();

  //Call List Head Title add
  useEffect(() => {
    setHeadTitle(route === "qaManager" ? "QA Manager" : "Call List");
    document.title = route === "qaManager" ? "QA Manager" : "Call List";
  }, [headTitle, route]);
  const actionAllowed =
    token?.scopes[0] === "college_super_admin" ||
    token?.scopes[0] === "qa_head";
  const isHeadCounsellor = token?.scopes[0] === "college_head_counselor";

  const handleFilterChange = (appliedFilters) => {
    if (collegeId) {
      setCallListFilterDataLoading(true);
      callListFilter({
        collegeId,
        payload:
          appliedFilters.dateRange === null ||
          appliedFilters?.dateRange?.length === null
            ? null
            : {
                start_date: dayjs(appliedFilters.dateRange[0]).format(
                  "YYYY-MM-DD"
                ),
                end_date: dayjs(appliedFilters.dateRange[1]).format(
                  "YYYY-MM-DD"
                ),
              },
        qaId: appliedFilters?.qa,
      })
        .unwrap()
        .then((data) => {
          try {
            if (data.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data.detail) {
              setCallListFilterData([]);
              pushNotification("error", data.detail);
            } else if (data?.data) {
              setCallListFilterData(data?.data[0] || null);
            }
          } catch (error) {
            pushNotification("error", error?.detail);
          }
        })
        .catch((error) => {
          pushNotification("error", error?.detail);
        })
        .finally(() => {
          setCallListFilterDataLoading(false);
        });
    }
  };

  React.useEffect(() => {
    if (collegeId) {
      handleFilterChange({ dateRange: null });
    }
  }, [collegeId]);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1 }}
      className="custom-component-container-box"
    >
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item md={12} sm={12} xs={12}>
            <CallListHeader
              collegeId={collegeId}
              heading={route === "qaManager" ? null : "Call List"}
              isCallList={true}
              onChangeFilter={handleFilterChange}
              loading={callListFilterDataLoading}
              data={callListFilterData}
              route={route}
              user={token?.scopes[0]}
            />
          </Grid>
          {actionAllowed || isHeadCounsellor ? (
            <Grid item md={12} sm={12} xs={12}>
              <Box
                className={`counsellor-qa-tab-wrapper ${
                  isHeadCounsellor ? "single-tab" : ""
                }`}
              >
                <Box
                  className="full-width align-items-row"
                  sx={{ justifyContent: "space-between" }}
                >
                  <MultipleTabs
                    tabArray={
                      isHeadCounsellor
                        ? [{ tabName: "Counsellor" }]
                        : [{ tabName: "Counsellor" }, { tabName: "QA" }]
                    }
                    setMapTabValue={setTabValue}
                    mapTabValue={tabValue}
                    boxWidth="400px"
                  ></MultipleTabs>
                  <IconDateRangePicker
                    onChange={(value) => {
                      setDateRange(value);
                    }}
                    dateRange={dateRange}
                  />
                </Box>
                {tabValue === 0 ? (
                  <CounsellorCallListTable
                    collegeId={collegeId}
                    dateRange={dateRange}
                  />
                ) : null}
                {tabValue === 1 ? (
                  <QACallListTable
                    collegeId={collegeId}
                    dateRange={dateRange}
                  />
                ) : null}
              </Box>
            </Grid>
          ) : null}

          <Grid item md={12} sm={12} xs={12}>
            {hideComponent || (
              <Box className="counsellor-qa-tab-wrapper">
                <CallListReviewTable
                  collegeId={collegeId}
                  isActionDisable={!actionAllowed}
                  user={token?.scopes[0]}
                  setHideComponent={setHideComponent}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default CallList;
