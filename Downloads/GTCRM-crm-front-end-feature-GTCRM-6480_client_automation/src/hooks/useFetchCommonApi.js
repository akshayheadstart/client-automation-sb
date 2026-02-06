import { useContext, useEffect, useState } from "react";
import { useGetCurrentUserDetailsQuery } from "../Redux/Slices/telephonySlice";
import useToasterHook from "./useToasterHook";
import { useNavigate } from "react-router-dom";
import { DashboradDataContext } from "../store/contexts/DashboardDataContext";
import { useSelector } from "react-redux";
import { useGetNameAndLabelListQuery } from "../Redux/Slices/applicationDataApiSlice";

const useFetchCommonApi = () => {
  const [currentUserDetails, setCurrentUserDetails] = useState({});
  const [skipCallNameAndLabelApi, setSkipCallNameAndLabelApi] = useState(true);
  const [leadStageList, setLeadStageList] = useState([]);
  const [leadStageObject, setLeadStageObject] = useState([]);
  const [leadStageLabelList, setLeadStageLabelList] = useState([]);

  const pushNotification = useToasterHook();
  const navigate = useNavigate();
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const {
    data: currentUserData,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetCurrentUserDetailsQuery();

  useEffect(() => {
    try {
      if (isSuccess) {
        if (currentUserData?.email) {
          setCurrentUserDetails(currentUserData);
        } else {
          throw new Error("User details API response has changed");
        }
      } else if (isError) {
        if (
          currentUserData?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (currentUserData?.data?.detail) {
          pushNotification("error", currentUserData?.data?.detail);
        }
        if (error.status === 500) {
          navigate("/page500");
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, isFetching]);

  const nameAndLabelInfo = useGetNameAndLabelListQuery(
    { collegeId },
    { skip: skipCallNameAndLabelApi }
  );

  // getting lead stage list
  useEffect(() => {
    if (nameAndLabelInfo.isSuccess) {
      const listOfLeadStage = [];
      const listOfLeadStageLabel = [];
      const LeadStages = nameAndLabelInfo.data?.data[0];
      setLeadStageObject(LeadStages);
      for (let stageName in LeadStages) {
        if (LeadStages[stageName]?.length > 0) {
          listOfLeadStage.push({
            label: stageName,
            value: stageName,
            children: LeadStages[stageName].map((item) => {
              return {
                label: item,
                value: JSON.stringify({ parent: stageName, item: item }),
              };
            }),
          });
        } else {
          listOfLeadStage.push({
            label: stageName,
            value: stageName,
          });
        }

        listOfLeadStageLabel.push({
          label: stageName,
          value: stageName,
        });
      }

      setLeadStageLabelList(listOfLeadStageLabel);
      setLeadStageList(listOfLeadStage);
    } else if (nameAndLabelInfo.isError) {
      if (
        nameAndLabelInfo.error.data?.detail === "Could not validate credentials"
      ) {
        window.location.reload();
      } else if (nameAndLabelInfo.error.data.detail) {
        pushNotification("error", nameAndLabelInfo.error.data?.detail);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameAndLabelInfo]);

  return {
    currentUserDetails,
    leadStageList,
    leadStageObject,
    leadStageLabelList,
    loadingLabelList: nameAndLabelInfo.isFetching,
    setSkipCallNameAndLabelApi,
    reFetchLabelApi: nameAndLabelInfo.refetch,
  };
};

export default useFetchCommonApi;
