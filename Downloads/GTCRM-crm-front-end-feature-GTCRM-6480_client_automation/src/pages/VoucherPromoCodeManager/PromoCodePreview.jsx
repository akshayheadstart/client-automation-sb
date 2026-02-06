/* eslint-disable react-hooks/exhaustive-deps */
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DateRangePicker } from "rsuite";
import {
  useDeletePromoCodeInfoMutation,
  useUpdatePromoCodeInfoMutation,
} from "../../Redux/Slices/filterDataSlice";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import CreateDataSegmentDrawer from "../../components/ui/DataSegmentManager/CreateDataSegmentDrawer";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import AppliedPromoCodeDrawer from "./AppliedPromoCodeDrawer";
import SelectDataSegmentDrawer from "./SelectDataSegmentDrawer";
import { GetFormatDate } from "../../hooks/GetJsonDate";
import DataSegmentDetailsDrawer from "./DataSegmentDetailsDrawer";
import {
  formatDatePromoCodePreview,
  formatDatePromoCodePreviewForString,
} from "../StudentTotalQueries/helperFunction";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import PromoCodeInputComponent from "./PromoCodeInputComponent";
const PromoCodePreview = ({
  openPreviewPromoCode,
  handlePromoCodePreviewClose,
  selectedPromoCodeInfo,
}) => {
  const theme = useTheme();
  const pushNotification = useToasterHook();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [totalCount, setTotalCount] = useState(0);
  const [promoCodeName, setPromoCodeName] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [unit, setUnit] = useState("");
  const [duration, setDuration] = useState([]);
  const [selectAppliedDrawerOpen, setSelectAppliedDrawerOpen] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  // const permissions = useSelector((state) => state.authentication.permissions);
  // const editPermission =
  //   permissions?.menus?.data_segment_manager?.data_segment_manager?.features
  //     ?.edit_data_segment;
  const [openCreateDataSegmentDrawer, setOpenCreateDataSegmentDrawer] =
    useState(false);
  const [selectDataSegmentDrawerOpen, setSelectDataSegmentDrawerOpen] =
    useState(false);
  const handleInputChange = (inputValue) => {
    const uppercaseValue = inputValue.toUpperCase();
    const alphanumericValue = uppercaseValue.replace(/[^a-zA-Z0-9]/g, "");
    setPromoCode(alphanumericValue);
  };
  const [selectedDataSegmentIds, setSelectedDataSegmentIds] = useState([]);
  const [getDataSegment, setGetDataSegment] = useState([]);
  useEffect(() => {
    if (selectedPromoCodeInfo?.code) {
      setPromoCode(selectedPromoCodeInfo?.code);
    }
    if (selectedPromoCodeInfo?.discount) {
      setDiscount(selectedPromoCodeInfo?.discount);
    }
    if (selectedPromoCodeInfo?.total_units) {
      setUnit(selectedPromoCodeInfo?.total_units);
    }
    if (selectedPromoCodeInfo?.name) {
      setPromoCodeName(selectedPromoCodeInfo?.name);
    }
    if (selectedPromoCodeInfo?.start_date) {
      setDuration([
        new Date(selectedPromoCodeInfo?.start_date),
        new Date(selectedPromoCodeInfo.end_date),
      ]);
    }
    if (
      selectedPromoCodeInfo?.data_segment_ids?.length > 0 &&
      selectedPromoCodeInfo?.data_segment_ids[0] !== null
    ) {
      setGetDataSegment(selectedPromoCodeInfo?.data_segment_ids);
      const allIds = selectedPromoCodeInfo?.data_segment_ids?.map(
        (segment) => segment?.data_segment_id
      );
      setSelectedDataSegmentIds(allIds);
    }
  }, [selectedPromoCodeInfo]);
  useEffect(() => {
    if (
      promoCodeName &&
      promoCode &&
      discount &&
      unit &&
      duration?.length > 0
    ) {
      if (selectedPromoCodeInfo?.applied_count > parseInt(unit)) {
        pushNotification(
          "warning",
          "The unit value must be greater than the applied value!"
        );
        return setButtonDisabled(true);
      } else if (duration?.length > 0) {
        if (selectedPromoCodeInfo?.status === "Upcoming") {
          const todayDate = new Date();
          if (
            formatDatePromoCodePreview(todayDate) >
            formatDatePromoCodePreviewForString(duration[0])
          ) {
            pushNotification(
              "warning",
              "Start Date must be greater than today Date!"
            );
            return setButtonDisabled(true);
          }
        }
        if (selectedPromoCodeInfo?.status === "Inactive") {
          const todayDate = new Date();
          if (
            formatDatePromoCodePreview(todayDate) >
            formatDatePromoCodePreviewForString(duration[0])
          ) {
            pushNotification(
              "warning",
              "Start Date can be equal to Today date or greater than Today!"
            );
            return setButtonDisabled(true);
          }
        }
        if (selectedPromoCodeInfo?.status === "Active") {
          if (
            formatDatePromoCodePreview(selectedPromoCodeInfo?.start_date) !==
            formatDatePromoCodePreview(duration[0])
          ) {
            pushNotification("warning", "Don't change the start Date!");
            return setButtonDisabled(true);
          }
        }
        if (selectedPromoCodeInfo?.status === "Expired") {
          pushNotification("warning", "This PromoCode all ready Expired!");
          return setButtonDisabled(true);
        }
        const today = new Date();
        if (
          formatDatePromoCodePreview(today) >
          formatDatePromoCodePreviewForString(duration[1])
        ) {
          pushNotification(
            "warning",
            "End Date can be equal to Today date or greater than Today!"
          );
          return setButtonDisabled(true);
        }
      } else {
        return setButtonDisabled(false);
      }
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [promoCodeName, promoCode, discount, unit, duration]);
  //Update promoCode info API implementation
  const [
    updatePromoCodeInternalServerError,
    setUpdatePromoCodeInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInUpdatePromoCode,
    setSomethingWentWrongInUpdatePromoCode,
  ] = useState(false);
  const updatePromoCodePayload = {
    name: promoCodeName,
    discount: parseInt(discount),
    units: parseInt(unit),
    duration: GetFormatDate(duration),
    data_segments: selectedDataSegmentIds,
    status: false,
  };
  if (selectedPromoCodeInfo?.code !== promoCode) {
    updatePromoCodePayload.code = promoCode;
  }
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [loading, setLoading] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [updatePromoCodeInfo] = useUpdatePromoCodeInfoMutation();
  const handleUpdatePromoCodeInfo = () => {
    setLoading(true);
    updatePromoCodeInfo({
      collegeId: collegeId,
      promoCodeId: selectedPromoCodeInfo?._id,
      payload: updatePromoCodePayload,
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", "Updated promoCode Success");
              handlePromoCodePreviewClose();
            } else {
              throw new Error("Updated promoCode API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInUpdatePromoCode,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setUpdatePromoCodeInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const [countOfDataEntries, setCountOfDataEntries] = useState({});
  useEffect(() => {
    if (countOfDataEntries && Object.keys(countOfDataEntries).length > 0) {
      if (getDataSegment.length > 0) {
        const newDataSegment = [...getDataSegment];
        newDataSegment.push(countOfDataEntries);
        setGetDataSegment(newDataSegment);
        const allIds = newDataSegment?.map(
          (segment) => segment?.data_segment_id
        );
        setSelectedDataSegmentIds(allIds);
      }
    }
  }, [countOfDataEntries]);
  const [dataSegmentDetailsDrawerOpen, setDataSegmentDetailsDrawerOpen] =
    useState(false);
  const [openConfirmStatusDialog, setOpenConfirmStatusDialog] = useState(false);
  const [selectedDataSegmentInfo, setSelectedDataSegmentInfo] = useState({});
  //delete PromoCode
  const [deletePromoCodeInfo] = useDeletePromoCodeInfoMutation();
  const handleDeletePromoCodeInfo = () => {
    setLoading(true);
    deletePromoCodeInfo({
      collegeId: collegeId,
      promoCode: true,
      payload: [selectedPromoCodeInfo?._id],
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", "Deleted promoCode Success");
              handlePromoCodePreviewClose();
            } else {
              throw new Error("Deleted promoCode API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInUpdatePromoCode,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setUpdatePromoCodeInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setLoading(false);
        setOpenConfirmStatusDialog(false);
      });
  };

  const { beforeToday } = DateRangePicker;
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openPreviewPromoCode}
        onClose={handlePromoCodePreviewClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <Box
            className="create-promoCode-voucher-headline-text"
            sx={{ mb: "10px" }}
          >
            <Typography className="create-promoCode-voucher-text-to-create">
              Promocode Detail |{" "}
              {selectedPromoCodeInfo?.code
                ? selectedPromoCodeInfo?.code
                : "N/A"}
            </Typography>
            <IconButton>
              <CloseIcon
                sx={{ cursor: "pointer" }}
                onClick={() => handlePromoCodePreviewClose()}
              />
            </IconButton>
          </Box>
          {loading && (
            <Box sx={{ display: "grid", placeItems: "center", mb: 1 }}>
              <CircularProgress color="info" />
            </Box>
          )}
          {updatePromoCodeInternalServerError ||
          somethingWentWrongInUpdatePromoCode ? (
            <>
              {updatePromoCodeInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInUpdatePromoCode && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </>
          ) : (
            <>
              <Box className="promoCode-input-box-container">
                <PromoCodeInputComponent
                  setPromoCodeName={setPromoCodeName}
                  promoCodeName={promoCodeName}
                  selectedPromoCodeInfo={selectedPromoCodeInfo}
                  handleInputChange={handleInputChange}
                  promoCode={promoCode}
                  setDiscount={setDiscount}
                  discount={discount}
                  setUnit={setUnit}
                  unit={unit}
                  setDuration={setDuration}
                  duration={duration}
                  beforeToday={beforeToday}
                />
              </Box>
              <Box className="promoCode-Divider-box">
                <Divider sx={{ border: "1px solid rgba(179, 210, 226, 1)" }} />
              </Box>
              <Box className="promoCode-preview-data-segment-details-container">
                <Box className="promoCode-preview-data-segment-details-box">
                  {getDataSegment?.length > 0 && getDataSegment[0] !== null ? (
                    <>
                      {getDataSegment?.map((segment) => {
                        return (
                          <Button
                            color="info"
                            variant="outlined"
                            className="promoCode-create-data-segment-button-preview"
                            disabled={
                              selectedPromoCodeInfo?.status !== "Upcoming"
                            }
                            onClick={() => {
                              setSelectedDataSegmentInfo(segment);
                              setDataSegmentDetailsDrawerOpen(true);
                            }}
                          >{`${
                            segment?.data_segment_name
                              ? segment?.data_segment_name
                              : "---"
                          } | ${
                            segment?.count_of_entities
                              ? segment?.count_of_entities
                              : "---"
                          } | ${
                            segment?.segment_type
                              ? segment?.segment_type
                              : "---"
                          }`}</Button>
                        );
                      })}
                    </>
                  ) : (
                    ""
                  )}
                </Box>
                <Box>
                  {selectedPromoCodeInfo?.applied_count ? (
                    <Button
                      color="info"
                      variant="outlined"
                      className="promoCode-create-data-segment-button-edit"
                      onClick={() => {
                        if (selectedPromoCodeInfo?.applied_count) {
                          setSelectAppliedDrawerOpen(true);
                        }
                      }}
                    >
                      <span className="promoCode-button-text-size-for-count">
                        Count of entries :{" "}
                      </span>{" "}
                      {selectedPromoCodeInfo?.applied_count}
                    </Button>
                  ) : (
                    ""
                  )}
                </Box>
              </Box>
              {selectedPromoCodeInfo?.status === "Upcoming" && (
                <Box className="promoCode-Divider-box">
                  <Divider
                    sx={{ border: "1px solid rgba(179, 210, 226, 1)" }}
                  />
                </Box>
              )}
              {selectedPromoCodeInfo?.status === "Upcoming" && (
                <Box className="promoCode-input-box-container">
                  {/* {editPermission && ( */}
                  <Button
                    color="info"
                    variant="outlined"
                    className="promoCode-create-data-segment-button"
                    onClick={() => {
                      setOpenCreateDataSegmentDrawer(true);
                    }}
                  >
                    Create Data segment
                  </Button>
                  {/* )} */}
                  <Box></Box>
                  <Button
                    color="info"
                    variant="outlined"
                    className="promoCode-create-data-segment-button"
                    onClick={() => {
                      setSelectDataSegmentDrawerOpen(true);
                    }}
                  >
                    Select Data segment
                  </Button>
                </Box>
              )}
              <Box className="create-voucher-promoCode-button-container">
                {selectedPromoCodeInfo?.status === "Upcoming" && (
                  <Button
                    sx={{ borderRadius: 50 }}
                    className="create-voucher-promoCode-create-button-discard"
                    color="info"
                    variant="contained"
                    onClick={() => {
                      setOpenConfirmStatusDialog(true);
                    }}
                  >
                    Discard
                  </Button>
                )}
                <Button
                  sx={{ borderRadius: 50 }}
                  className="create-voucher-promoCode-cancel-button"
                  color="info"
                  variant="outlined"
                  onClick={() => {
                    handlePromoCodePreviewClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  sx={{ borderRadius: 50 }}
                  className={
                    buttonDisabled
                      ? "create-voucher-promoCode-create-button-disabled"
                      : "create-voucher-promoCode-create-button"
                  }
                  color="info"
                  variant="contained"
                  disabled={buttonDisabled}
                  onClick={() => {
                    handleUpdatePromoCodeInfo();
                  }}
                >
                  Save
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* drawer applied user */}
      <Drawer
        anchor={"right"}
        open={selectAppliedDrawerOpen}
        disableEnforceFocus={true}
        sx={{ zIndex: 1300 }}
        onClose={() => {
          setSelectAppliedDrawerOpen(false);
        }}
        className="vertical-scrollbar-drawer"
      >
        <Box className="voucher-drawer-box-container">
          <Box>
            <AppliedPromoCodeDrawer
              setSelectAppliedDrawerOpen={setSelectAppliedDrawerOpen}
              selectedPromoCodeInfo={selectedPromoCodeInfo}
            />
          </Box>
        </Box>
      </Drawer>

      {openCreateDataSegmentDrawer && (
        <CreateDataSegmentDrawer
          setOpenCreateDataSegmentDrawer={setOpenCreateDataSegmentDrawer}
          openCreateDataSegmentDrawer={openCreateDataSegmentDrawer}
          zIndex={true}
          setCountOfDataEntries={setCountOfDataEntries}
          promoCode={true}
        />
      )}
      {/* drawer select data segment */}
      <Drawer
        anchor={"right"}
        open={selectDataSegmentDrawerOpen}
        disableEnforceFocus={true}
        onClose={() => {
          setSelectDataSegmentDrawerOpen(false);
        }}
        className="vertical-scrollbar-drawer"
        sx={{ zIndex: 1300 }}
      >
        <Box className="voucher-drawer-box-container">
          <Box>
            <SelectDataSegmentDrawer
              setSelectDataSegmentDrawerOpen={setSelectDataSegmentDrawerOpen}
              totalCount={totalCount}
              setTotalCount={setTotalCount}
              setSelectedDataSegmentIds={setSelectedDataSegmentIds}
              previewDataSegmentIds={getDataSegment}
              previewUpdate={true}
              setGetDataSegment={setGetDataSegment}
            />
          </Box>
        </Box>
      </Drawer>
      {/* drawer select data segment Details */}
      <Drawer
        anchor={"right"}
        open={dataSegmentDetailsDrawerOpen}
        disableEnforceFocus={true}
        onClose={() => {
          setDataSegmentDetailsDrawerOpen(false);
        }}
        className="vertical-scrollbar-drawer"
        sx={{ zIndex: 1300 }}
      >
        <Box className="voucher-drawer-box-container">
          <Box>
            <DataSegmentDetailsDrawer
              setDataSegmentDetailsDrawerOpen={setDataSegmentDetailsDrawerOpen}
              selectedDataSegmentInfo={selectedDataSegmentInfo}
            />
          </Box>
        </Box>
      </Drawer>
      <DeleteDialogue
        title={"Are you sure , you want to Delete PromoCode?"}
        openDeleteModal={openConfirmStatusDialog}
        handleDeleteSingleTemplate={() => handleDeletePromoCodeInfo()}
        handleCloseDeleteModal={() => setOpenConfirmStatusDialog(false)}
        loading={loading}
      />
    </div>
  );
};

export default PromoCodePreview;
