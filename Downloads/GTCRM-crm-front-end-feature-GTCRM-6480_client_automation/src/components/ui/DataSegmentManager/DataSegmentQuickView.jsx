import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import HorizontalCharts from "../../CustomCharts/HorizontalCharts";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import "../../../styles/DataSegmentQuickView.css";
import { useGetDataSegmentQuickViewQuery } from "../../../Redux/Slices/dataSegmentSlice";
import { useSelector } from "react-redux";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { useNavigate } from "react-router-dom";

const DataSegmentQuickView = () => {
  const navigate = useNavigate();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  // const permissions = useSelector((state) => state.authentication.permissions);
  // const editPermission =
  //   permissions?.menus?.data_segment_manager?.data_segment_manager?.features
  //     ?.edit_data_segment;

  const pushNotification = useToasterHook();

  const [dataSegmentQuickViewData, setDataSegmentQuickViewData] = useState({});
  const [hideQuickView, setHideQuickView] = useState(false);
  const [quickViewInternalServerError, setQuickViewInternalServerError] =
    useState(false);
  const [quickViewSomethingWentWrong, setQuickViewSomethingWentWrong] =
    useState(false);

  const [dataSegmentQuickViewStatus, setDataSegmentQuickViewStatus] = useState(
    []
  );

  const handleCheckboxChange = (checkboxId) => {
    if (dataSegmentQuickViewStatus?.includes(checkboxId)) {
      setDataSegmentQuickViewStatus(
        dataSegmentQuickViewStatus?.filter((id) => id !== checkboxId)
      );
    } else {
      setDataSegmentQuickViewStatus([
        ...dataSegmentQuickViewStatus,
        checkboxId,
      ]);
    }
  };

  // get data segment quick view data
  const {
    data: quickViewData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetDataSegmentQuickViewQuery({
    collegeId,
    status:
      dataSegmentQuickViewStatus?.length === 1
        ? dataSegmentQuickViewStatus[0]
        : "",
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        const expectedData = quickViewData?.data;
        if (
          typeof expectedData === "object" &&
          expectedData !== null &&
          !Array.isArray(expectedData)
        ) {
          setDataSegmentQuickViewData(expectedData);
        } else {
          throw new Error(
            "get data segment quick view API response has changed"
          );
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setQuickViewInternalServerError,
            setHideQuickView,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setQuickViewSomethingWentWrong,
        setHideQuickView,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickViewData, error, isError, isSuccess]);

  const quickViewDataList = [
    {
      title: "Total Datasegment",
      value: dataSegmentQuickViewData?.total_data_segments,
      chartsData: [
        {
          plotName: "Active",
          value: dataSegmentQuickViewData?.active_data_segments,
          color: "#11BED2",
        },
        {
          plotName: "Closed",
          value: dataSegmentQuickViewData?.closed_data_segments,
          color: "#008BE2",
        },
      ],
    },
    {
      title: "Data Types",
      value:
        dataSegmentQuickViewData?.lead_data_segments +
        dataSegmentQuickViewData?.raw_data_segments +
        dataSegmentQuickViewData?.application_data_segments,
      chartsData: [
        {
          plotName: "Lead",
          value: dataSegmentQuickViewData?.lead_data_segments,
          color: "#11BED2",
        },
        {
          plotName: "Raw",
          value: dataSegmentQuickViewData?.raw_data_segments,
          color: "#008BE2",
        },
        {
          plotName: "Application",
          value: dataSegmentQuickViewData?.application_data_segments,
          color: "#00465F",
        },
      ],
    },
    {
      title: "Total Communications",
      value: dataSegmentQuickViewData?.communication_info?.total,
      chartsData: [
        {
          plotName: "Whatsapp",
          value: dataSegmentQuickViewData?.communication_info?.whatsapp,
          color: "#11BED2",
        },
        {
          plotName: "Email",
          value: dataSegmentQuickViewData?.communication_info?.email,
          color: "#008BE2",
        },
        {
          plotName: "SMS",
          value: dataSegmentQuickViewData?.communication_info?.sms,
          color: "#00465F",
        },
      ],
    },
  ];

  return (
    <Box
      className="data-segment-quick-view-card"
      sx={{ display: hideQuickView ? "none" : "block" }}
    >
      <Box className="data-segment-quick-view-card-content">
        {quickViewSomethingWentWrong || quickViewInternalServerError ? (
          <Box>
            {quickViewInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {quickViewSomethingWentWrong && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <>
            {isFetching ? (
              <Box
                className="loader-container"
                sx={{ minHeight: "30vh !important" }}
              >
                <LeefLottieAnimationLoader
                  height={100}
                  width={150}
                ></LeefLottieAnimationLoader>
              </Box>
            ) : (
              <Box
                sx={{ px: 0, pt: 0 }}
                className="data-segment-quick-view-list-wrapper"
              >
                {quickViewDataList?.map((data, index) => (
                  <>
                    <Box className="data-segment-quick-view-header-box">
                      <Typography className="data-segment-quick-view-title-design">
                        {data?.title}
                      </Typography>

                      <Typography id="data-segment-quick-view-value">
                        {data?.value ? data?.value : 0}
                      </Typography>

                      <Box className="data-segment-quick-view-vertical-representation">
                        <HorizontalCharts
                          data={data?.chartsData}
                        ></HorizontalCharts>
                      </Box>
                    </Box>

                    {index === quickViewDataList?.length - 1 || (
                      <Box className="data-segment-quick-view-vertical-line"></Box>
                    )}
                  </>
                ))}
                {/* {editPermission && ( */}
                <Box sx={{ mt: "4px" }}>
                  <Button
                    onClick={() => navigate("/automation-manager")}
                    id="manage-automation-btn"
                  >
                    Manage Automation
                  </Button>
                  <Box className="data-segment-quick-view-filter-box">
                    <div class="form-group">
                      <input
                        onChange={() => handleCheckboxChange("Closed")}
                        type="checkbox"
                        id="closed"
                        checked={dataSegmentQuickViewStatus?.includes("Closed")}
                      />
                      <label for="closed">Closed</label>
                    </div>
                    <div class="form-group">
                      <input
                        onChange={() => handleCheckboxChange("Active")}
                        type="checkbox"
                        id="active"
                        checked={dataSegmentQuickViewStatus?.includes("Active")}
                      />
                      <label for="active">Active</label>
                    </div>
                  </Box>
                </Box>
                {/* )} */}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default DataSegmentQuickView;
