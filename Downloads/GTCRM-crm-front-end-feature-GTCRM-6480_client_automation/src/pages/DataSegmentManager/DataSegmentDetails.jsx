/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SegmentDetailsHeaderAndTable from "../../components/ui/DataSegmentManager/SegmentDetailsHeaderAndTable";
import "../../styles/DataSegmentQuickView.css";
import AddLeadToSegment from "./AddLeadToSegment";
import SegmentDetailsSummary from "../../components/ui/DataSegmentManager/SegmentDetailsSummary";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/sharedStyles.css";
import AccessDenied from "../../components/shared/Loader/AccessDenied";

const DataSegmentDetails = () => {
  const { state } = useLocation();
  const [showAddLeadPage, setShowAddLeadPage] = useState(false);
  const { optionalEncrypted } = useParams();
  const navigate = useNavigate();
  const [optionalEncryptedData, setOptionalEncryptedData] = useState("");
  useEffect(() => {
    localStorage.removeItem("requestRoute");
    try {
      if (state) {
        setOptionalEncryptedData("");
      } else if (optionalEncrypted) {
        setOptionalEncryptedData(optionalEncrypted);
      } else {
        setOptionalEncryptedData("");
      }
    } catch (error) {
      navigate("/page401");
    }
  }, [optionalEncrypted]);
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Campaign manager Head Title add
  useEffect(() => {
    setHeadTitle("Data Segment Details");
    document.title = "Data Segment Details";
  }, [headTitle]);
  const [dataType, setDataType] = useState("");
  const [permissionData, setPermissionData] = useState(false);
  return (
    <Box sx={{ px: 3, pb: 4 }} className="custom-component-container-box">
      {showAddLeadPage ? (
        <>
          {(optionalEncryptedData || state?.module_name) && (
            <AddLeadToSegment
              moduleName={dataType ? dataType : state?.module_name}
              setShowAddLeadPage={setShowAddLeadPage}
              dataSegmentId={state?.segmentId ? state?.segmentId : ""}
            />
          )}
        </>
      ) : (
        <>
          {permissionData ? (
            <>
              <AccessDenied height={200} width={200}></AccessDenied>
            </>
          ) : (
            <>
              {(optionalEncryptedData || state?.segmentId) && (
                <SegmentDetailsSummary
                  dataSegmentId={state?.segmentId ? state?.segmentId : ""}
                  token={optionalEncryptedData ? optionalEncryptedData : ""}
                  setPermissionData={setPermissionData}
                />
              )}
              {(optionalEncryptedData || state?.segmentId) && (
                <SegmentDetailsHeaderAndTable
                  dataSegmentId={state?.segmentId ? state?.segmentId : ""}
                  setShowAddLeadPage={setShowAddLeadPage}
                  token={optionalEncryptedData ? optionalEncryptedData : ""}
                  setDataType={setDataType}
                  dataType={dataType}
                  setPermissionData={setPermissionData}
                />
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default DataSegmentDetails;
