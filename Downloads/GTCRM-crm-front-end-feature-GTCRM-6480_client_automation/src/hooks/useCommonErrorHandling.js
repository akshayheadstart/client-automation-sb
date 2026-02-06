import { handleInternalServerError } from "../utils/handleInternalServerError";
import useToasterHook from "./useToasterHook";

const useCommonErrorHandling = () => {
  const pushNotification = useToasterHook();

  const handleError = ({ error, setIsInternalServerError, setHide }) => {
    if (error?.data?.detail === "Could not validate credentials") {
      window.location.reload();
    } else if (error?.data?.detail) {
      pushNotification("error", error?.data?.detail);
    }
    if (error.status === 500) {
      handleInternalServerError(
        setIsInternalServerError,
        setHide && setHide,
        5000
      );
    }
  };
  return handleError;
};

export default useCommonErrorHandling;
