import { useDispatch } from "react-redux";
import { setIsActionDisable } from "../Redux/Slices/authSlice";

const useSetActionDisable = () => {
  const dispatch = useDispatch();
  return (value) => {
    if (value?.length) {
      if (JSON.parse(value)?.current_season) {
        dispatch(setIsActionDisable(false));
      } else {
        dispatch(setIsActionDisable(true));
      }
    }
  };
};

export default useSetActionDisable;
