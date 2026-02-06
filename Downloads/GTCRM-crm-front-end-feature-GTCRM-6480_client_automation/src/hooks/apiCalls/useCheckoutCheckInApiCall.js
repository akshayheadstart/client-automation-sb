import { useContext } from "react";
import { useSelector } from "react-redux";
import useToasterHook from "../useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";

function useCheckoutCheckInApiCall() {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const handleCheckoutCheckIn = ({
    payload,
    checkInAndOut,
    setIsStatusUpdateLoading,
    setIsSomethingWentWrong,
    setIsInternalServerError,
    setOpenCheckoutReasonDialog,
  }) => {
    setIsStatusUpdateLoading(true);

    checkInAndOut({ payload, collegeId })
      .unwrap()
      .then((data) => {
        try {
          if (data.message) {
            pushNotification("success", data.message);
            setOpenCheckoutReasonDialog(false);
          } else {
            throw new Error("Status change API response has been changed.");
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setIsSomethingWentWrong, "", 10000);
          setOpenCheckoutReasonDialog(true);
        }
      })
      .catch((error) => {
        if (error?.data.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data.detail) {
          pushNotification("error", error?.data.detail);
        } else {
          handleInternalServerError(setIsInternalServerError, "", 10000);
          setOpenCheckoutReasonDialog(true);
        }
      })
      .finally(() => {
        setIsStatusUpdateLoading(false);
      });
  };
  return handleCheckoutCheckIn;
}

export default useCheckoutCheckInApiCall;
