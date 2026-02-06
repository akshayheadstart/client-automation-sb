import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Button, CircularProgress, Dialog, Typography } from "@mui/material";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { Input, SelectPicker } from "rsuite";
import { useGetCheckoutReasonListQuery } from "../../../Redux/Slices/telephonySlice";
import { useSelector } from "react-redux";
import useToasterHook from "../../../hooks/useToasterHook";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
function CheckOutReasonDialog({
  open,
  setOpen,
  isInternalServerError,
  setIsInternalServerError,
  isSomethingWentWrong,
  setIsSomethingWentWrong,
  isStatusUpdateLoading,
  handleCheckoutCheckIn,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const midScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [customSelectedReason, setCustomSelectedReason] = useState("");
  const [skipReasonApiCall, setSkipReasonApiCall] = useState(true);
  const [indexOfOther, setIndexOfOther] = useState(null);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const { data, error, isError, isSuccess, isFetching } =
    useGetCheckoutReasonListQuery({ collegeId }, { skip: skipReasonApiCall });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data[0])) {
          const modifiedResponse = data?.data[0]?.map((reason, index) => {
            if (reason?.title === "Other") {
              setIndexOfOther(index);
              return {
                label: "",
                value: JSON.stringify(reason),
              };
            }
            return {
              label: reason?.title,
              value: JSON.stringify(reason),
              icon:reason?.icon
            };
          });
          setReasons(modifiedResponse);
        } else {
          throw new Error("Checkout Reason List API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error.status === 500) {
          setIsInternalServerError(true);
        }
      }
    } catch (error) {
      setIsSomethingWentWrong(true);
      setApiResponseChangeMessage(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isSuccess, isError]);

  return (
    <Dialog
      PaperProps={{ sx: { borderRadius: midScreen ? 2.5 : 0 } }}
      fullScreen={fullScreen}
      open={open}
    >
      {isInternalServerError || isSomethingWentWrong ? (
        <Box sx={{ minHeight: "25vh" }} className="common-not-found-container">
          {isInternalServerError && (
            <Error500Animation height={200} width={200}></Error500Animation>
          )}
          {isSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box
          sx={{ width: midScreen ? 450 : "80%" }}
          className="check-out-reason-dialog-container"
        >
          <Box>
            <Typography>Check-out Reason</Typography>
            <CloseIcon onClick={() => setOpen(false)} />
          </Box>
          <Box>
            <SelectPicker
              value={selectedReason}
              searchable={false}
              placeholder="Reasons"
              className="select-picker"
              data={reasons}
              block
              menuMaxHeight={260}
              onOpen={() => setSkipReasonApiCall(false)}
              loading={isFetching}
              onChange={(value) => {
                const listOfReasons = [...reasons];
                listOfReasons[indexOfOther] = {
                  label: "",
                  value: listOfReasons[indexOfOther]?.value,
                };
                setReasons(listOfReasons);

                setSelectedReason(value);
                setCustomSelectedReason("");
              }}
              renderMenuItem={(label, item) => (
                <Box
                  onClick={(e) =>
                    item?.value === reasons[indexOfOther]?.value &&
                    e.stopPropagation()
                  }
                >
                  {item?.value === reasons[indexOfOther]?.value ? (
                    <>
                      <Input
                        value={reasons[indexOfOther]?.label}
                        onChange={(value) => {
                          const listOfReasons = [...reasons];

                          listOfReasons[indexOfOther] = {
                            label: value,
                            value: item?.value,
                          };
                          setReasons(listOfReasons);
                          setSelectedReason(item?.value);
                          setCustomSelectedReason(value);
                        }}
                        placeholder={"Other"}
                      />
                    </>
                  ) : (
                    <Box className="check-out-box-container">
                      <img src={item?.icon} alt={label} />
                      <Typography className="check-out-label-text-size">{label}</Typography>
                      </Box>
                  )}
                </Box>
              )}
            />
          </Box>
          <Box>
            {isStatusUpdateLoading ? (
              <CircularProgress color="info" size={30} />
            ) : (
              <Button
                disabled={
                  selectedReason?.includes(`{"title":"Other",`)
                    ? !customSelectedReason?.length
                    : !selectedReason?.length
                }
                onClick={() => {
                  const reason = JSON.parse(selectedReason);
                  if (customSelectedReason?.length) {
                    reason.title = customSelectedReason;
                  }
                  handleCheckoutCheckIn({
                    check_in_status: false,
                    reason: reason,
                  });
                }}
                className="common-contained-button"
              >
                Save
              </Button>
            )}

            <Button
              onClick={() => setOpen(false)}
              className="common-outlined-button"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}

export default CheckOutReasonDialog;
