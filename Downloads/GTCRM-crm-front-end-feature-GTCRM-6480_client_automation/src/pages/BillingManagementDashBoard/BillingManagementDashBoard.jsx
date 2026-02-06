import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import QuickViewBillingManagementDashBoard from "./QuickViewBillingManagementDashBoard";
import { Box, Typography } from "@mui/material";
import "../../styles/billingManagement.css";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import {
  useGetAllClientsDataQuery,
  useGetBillingDataQuery,
} from "../../Redux/Slices/clientOnboardingSlice";
import BillingFeaturesPricing from "./BillingFeaturesPricing";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import { useGetCollegeListQuery } from "../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
const BillingManagementDashBoard = () => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  const permissions = useSelector((state) => state.authentication.permissions);
  //Billing Manager dashboard Head Title add
  useEffect(() => {
    setHeadTitle("Billing Manager Dashboard");
    document.title = "Billing Manager Dashboard";
  }, [headTitle]);
  const [headerDetailsData, setHeaderDetailsData] = useState({});
  const [somethingWentWrongInBilling, setSomethingWentWrongInBilling] =
    useState(false);
  const [billingInternalServerError, setBillingInternalServerError] =
    useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState([]);
  const pushNotification = useToasterHook();
  const [skipCallClientsAPI, setSkipCallClientsAPI] = useState(true);
  const [clientsList, setClientsList] = useState([]);
  const [listOfCollege, setListOfCollege] = useState([]);
  const [skipCallCollegeAPI, setSkipCallCollegeAPI] = useState(true);
  const [isSkipCallApi, setIsSkipCallApi] = useState(false);
  const [apiPayload, setApiPayload] = useState({});
  const payload = {
    client_ids: selectedClients,
    college_ids: selectedCollege,
  };
  //Get table api call here
  const { data, isSuccess, isError, error, isFetching } =
    useGetBillingDataQuery({
      payload: apiPayload,
    });
  React.useEffect(() => {
    try {
      if (isSuccess) {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data) {
          try {
            if (data) {
              setHeaderDetailsData(data);
            } else {
              throw new Error("Billing Dashboard API response has changed");
            }
          } catch (error) {}
        } else if (data?.detail) {
          pushNotification("error", data?.detail);
        }
      } else if (isError) {
        if (error?.status === 500) {
          handleInternalServerError(setBillingInternalServerError, "", 10000);
        }
      }
    } catch (err) {
      setApiResponseChangeMessage(err);
      handleSomethingWentWrong(setSomethingWentWrongInBilling, "", 10000);
    }
  }, [data, isSuccess, isError, error, isFetching]);
  const clientsApiCallInfo = useGetAllClientsDataQuery(
    {},
    {
      skip: skipCallClientsAPI,
    }
  );
  //get client list
  useEffect(() => {
    if (!skipCallClientsAPI) {
      const apiResponseList = clientsApiCallInfo?.data?.data;
      const modifyOptions = apiResponseList?.map((item) => ({
        label: item.client_name,
        value: item._id,
      }));
      if (modifyOptions?.length > 0) {
        setClientsList(modifyOptions);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCallClientsAPI, clientsApiCallInfo]);
  //get list of college
  const collegeApiCallInfo = useGetCollegeListQuery(
    {},
    {
      skip: skipCallCollegeAPI,
    }
  );

  useEffect(() => {
    if (!skipCallCollegeAPI) {
      const apiResponseList = collegeApiCallInfo?.data?.data;
      if (apiResponseList?.length > 0) {
        const modifyOptions = apiResponseList?.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setListOfCollege(modifyOptions);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCallCollegeAPI, collegeApiCallInfo]);

  useEffect(() => {
    if (selectedClients?.length > 0 || selectedCollege?.length > 0) {
      setApiPayload(payload);
    } else {
      setApiPayload({});
    }
  }, [isSkipCallApi]);
  return (
    <Box sx={{ mx: "25px" }} className="billing-header-box-container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6" sx={{ ml: 1, my: 2 }}>
          Features Count
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {permissions?.["aefd607c"]?.features?.["ee598d8b"]?.features?.[
            "bc3d4212"]?.visibility && (
            <MultipleFilterSelectPicker
              className="select-picker"
              style={{ width: 200 }}
              placement={"bottomEnd"}
              onChange={(value) => {
                setSelectedClients(value);
              }}
              setSelectedPicker={setSelectedClients}
              pickerData={clientsList}
              loading={clientsApiCallInfo.isFetching}
              placeholder="Client"
              pickerValue={selectedClients}
              from="leadManager"
              onOpen={() => setSkipCallClientsAPI(false)}
              callAPIAgain={() => setIsSkipCallApi((prev) => !prev)}
              onClean={() => setIsSkipCallApi((prev) => !prev)}
            />
          )}
          <MultipleFilterSelectPicker
            className="select-picker"
            style={{ width: 200 }}
            placement={"bottomEnd"}
            onChange={(value) => {
              setSelectedCollege(value);
            }}
            setSelectedPicker={setSelectedCollege}
            pickerData={listOfCollege}
            loading={collegeApiCallInfo.isFetching}
            placeholder="College"
            pickerValue={selectedCollege}
            from="leadManager"
            onOpen={() => setSkipCallCollegeAPI(false)}
            callAPIAgain={() => setIsSkipCallApi((prev) => !prev)}
            onClean={() => setIsSkipCallApi((prev) => !prev)}
          />
        </Box>
      </Box>
      <QuickViewBillingManagementDashBoard
        isFetching={isFetching}
        headerDetailsData={headerDetailsData}
        somethingWentWrongInBilling={somethingWentWrongInBilling}
        billingInternalServerError={billingInternalServerError}
        apiResponseChangeMessage={apiResponseChangeMessage}
        clientsList={clientsList}
        clientsApiCallInfo={clientsApiCallInfo}
        setSkipCallClientsAPI={setSkipCallClientsAPI}
        setSelectedClients={setSelectedClients}
        selectedClients={selectedClients}
        setSelectedCollege={setSelectedCollege}
        selectedCollege={selectedCollege}
      />
      <Typography variant="h6" sx={{ ml: 1, my: 2 }}>
        Features Pricing
      </Typography>
      <BillingFeaturesPricing
        isFetching={isFetching}
        headerDetailsData={headerDetailsData}
        somethingWentWrongInBilling={somethingWentWrongInBilling}
        billingInternalServerError={billingInternalServerError}
        apiResponseChangeMessage={apiResponseChangeMessage}
        permissions={permissions}
      />
    </Box>
  );
};

export default BillingManagementDashBoard;
