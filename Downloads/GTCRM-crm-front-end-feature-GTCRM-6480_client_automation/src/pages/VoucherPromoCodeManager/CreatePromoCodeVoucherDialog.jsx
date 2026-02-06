/* eslint-disable react-hooks/exhaustive-deps */
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserListQuery } from "../../Redux/Slices/applicationDataApiSlice";
import {
  useGetAllCourseListQuery,
  useHandleCreatePromoCodeMutation,
  useHandleCreateVoucherMutation,
} from "../../Redux/Slices/filterDataSlice";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import CreateDataSegmentDrawer from "../../components/ui/DataSegmentManager/CreateDataSegmentDrawer";
import {
  organizeCourseFilterCourseIdOption,
  organizePublisherFilterOption,
} from "../../helperFunctions/filterHelperFunction";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { GetFormatDate } from "../../hooks/GetJsonDate";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/dataSegmentUserProfile.css";
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import SelectDataSegmentDrawer from "./SelectDataSegmentDrawer";
import PromoCodeInputComponent from "./PromoCodeInputComponent";
import VoucherInputComponent from "./VoucherInputComponent";
const CreatePromoCodeVoucherDialog = ({
  openCreatePromoCodeVoucher,
  handlePromoCodeVoucherClose,
  value,
  setValue,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  // const permissions = useSelector((state) => state.authentication.permissions);
  // const editPermission =
  //   permissions?.menus?.data_segment_manager?.data_segment_manager?.features
  //     ?.edit_data_segment;
  const [openCreateDataSegmentDrawer, setOpenCreateDataSegmentDrawer] =
    useState(false);
  const [selectDataSegmentDrawerOpen, setSelectDataSegmentDrawerOpen] =
    useState(false);
  const [courseDetails, setCourseDetails] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState([]);
  const [skipCourseApiCall, setSkipCourseApiCall] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  // common api call functions
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [hideCourseList, setHideCourseList] = useState(false);
  //get course list
  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: collegeId },
    { skip: skipCourseApiCall }
  );
  useEffect(() => {
    if (!skipCourseApiCall) {
      const courseList = courseListInfo?.data?.data[0];
      handleFilterListApiCall(
        courseList,
        courseListInfo,
        setCourseDetails,
        setHideCourseList,
        organizeCourseFilterCourseIdOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListInfo, skipCourseApiCall]);
  //promoCode State
  const [promoCodename, setPromoCodeName] = useState("");
  const [createPromoCode, setCreatePromoCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [units, setUnits] = useState("");
  const [promoCodeDuration, setPromoCodeDuration] = useState([]);
  const [createButtonDisabled, setCreateButtonDisabled] = useState(false);
  const [selectedDataSegmentIds, setSelectedDataSegmentIds] = useState([]);

  const promoCodePayload = {
    name: promoCodename,
    code: createPromoCode,
    discount: discount ? parseInt(discount) : 0,
    units: units ? parseInt(units) : 0,
    duration: GetFormatDate(promoCodeDuration),
    data_segment_ids: selectedDataSegmentIds,
  };
  const resetPromoCodePayload = () => {
    setPromoCodeName("");
    setCreatePromoCode("");
    setDiscount("");
    setUnits("");
    setPromoCodeDuration([]);
    setSelectedDataSegmentIds([]);
    setTotalCount(0);
  };
  //Voucher State
  const [voucherName, setVoucherName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [costPerVoucher, setCostPerVoucher] = useState("");
  const [voucherDuration, setVoucherDuration] = useState([]);
  const [assignedPublisher, setAssignedPublisher] = useState(null);

  const voucherPayload = {
    name: voucherName,
    quantity: quantity ? parseInt(quantity) : 0,
    cost_per_voucher: costPerVoucher ? parseInt(costPerVoucher) : 0,
    duration: GetFormatDate(voucherDuration),
    assign_to: assignedPublisher,
    program_name: selectedCourseId,
  };
  const resetVoucherPayload = () => {
    setVoucherName("");
    setQuantity("");
    setCostPerVoucher("");
    setVoucherDuration([]);
    setAssignedPublisher(null);
    setSelectedCourseId([]);
  };

  useEffect(() => {
    if (
      promoCodename &&
      createPromoCode &&
      discount &&
      units &&
      promoCodeDuration?.length > 0 &&
      value === "PromoCode"
    ) {
      setCreateButtonDisabled(true);
    } else if (
      voucherName &&
      quantity &&
      costPerVoucher &&
      voucherDuration?.length > 0 &&
      assignedPublisher &&
      value === "Voucher" &&
      selectedCourseId.length > 0
    ) {
      setCreateButtonDisabled(true);
    } else {
      setCreateButtonDisabled(false);
    }
  }, [
    voucherName,
    quantity,
    voucherDuration,
    costPerVoucher,
    assignedPublisher,
    promoCodename,
    createPromoCode,
    discount,
    units,
    promoCodeDuration,
    value,
    selectedCourseId,
  ]);
  //publisher get APi
  const [skipPublisherApiCall, setSkipPublisherApiCall] = useState(true);
  const [hidePublisherList, setHidePublisherList] = useState(false);
  const [publisherList, setPublisherList] = useState([]);

  const publisherListApiCallInfo = useGetUserListQuery(
    {
      userType: "college_publisher_console",
      collegeId,
    },
    {
      skip: skipPublisherApiCall,
    }
  );

  React.useEffect(() => {
    if (!skipPublisherApiCall) {
      const list = publisherListApiCallInfo?.data?.data[0];
      handleFilterListApiCall(
        list,
        publisherListApiCallInfo,
        setPublisherList,
        setHidePublisherList,
        organizePublisherFilterOption
      );
    }
  }, [publisherListApiCallInfo, skipPublisherApiCall]);
  const handleInputChange = (inputValue) => {
    const uppercaseValue = inputValue.toUpperCase();
    const alphanumericValue = uppercaseValue.replace(/[^a-zA-Z0-9]/g, "");
    setCreatePromoCode(alphanumericValue);
  };
  ///Create PromoCode API implementation
  const [
    createPromoCodeInternalServerError,
    setCreatePromoCodeInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInCreatePromoCode,
    setSomethingWentWrongInCreatePromoCode,
  ] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const pushNotification = useToasterHook();
  const [createPromoCodeInfo] = useHandleCreatePromoCodeMutation();
  const handleCreatePromoCodeInfo = () => {
    setLoading(true);
    createPromoCodeInfo({
      collegeId: collegeId,
      payload: promoCodePayload,
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
              pushNotification("success", "Create promoCode Success");
              resetPromoCodePayload();
              handlePromoCodeVoucherClose();
            } else {
              throw new Error("Create promoCode API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInCreatePromoCode,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setCreatePromoCodeInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //Create Voucher API implementation
  const [createVoucherInfo] = useHandleCreateVoucherMutation();
  const handleCreateVoucherInfo = () => {
    setLoading(true);
    createVoucherInfo({
      collegeId: collegeId,
      payload: voucherPayload,
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
              pushNotification("success", "Create Voucher Success");
              resetVoucherPayload();
              handlePromoCodeVoucherClose();
            } else {
              throw new Error("Create voucher API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInCreatePromoCode,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setCreatePromoCodeInternalServerError,
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
    if (countOfDataEntries?.count_of_entities) {
      setTotalCount(
        (prevTotalCount) =>
          prevTotalCount + countOfDataEntries.count_of_entities
      );
    }
  }, [countOfDataEntries?.count_of_entities]);
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openCreatePromoCodeVoucher}
        onClose={handlePromoCodeVoucherClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <Box className="create-promoCode-voucher-headline-text">
            <Typography className="create-promoCode-voucher-text-to-create">
              Create
            </Typography>
            <IconButton>
              <CloseIcon
                sx={{ cursor: "pointer" }}
                onClick={() => handlePromoCodeVoucherClose()}
              />
            </IconButton>
          </Box>
          {loading && (
            <Box sx={{ display: "grid", placeItems: "center" }}>
              <CircularProgress color="info" />
            </Box>
          )}
          <>
            {createPromoCodeInternalServerError ||
            somethingWentWrongInCreatePromoCode ? (
              <>
                {createPromoCodeInternalServerError && (
                  <Error500Animation
                    height={400}
                    width={400}
                  ></Error500Animation>
                )}
                {somethingWentWrongInCreatePromoCode && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </>
            ) : (
              <>
                <Box className="create-voucher-promoCode-radio-box">
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                    sx={{ flexDirection: "row !important" }}
                  >
                    <FormControlLabel
                      value="PromoCode"
                      control={<Radio color="info" />}
                      label="PromoCode"
                    />
                    <FormControlLabel
                      value="Voucher"
                      control={<Radio color="info" />}
                      label="Voucher"
                    />
                  </RadioGroup>
                </Box>
                {value === "PromoCode" && (
                  <>
                    <Box className="promoCode-input-box-container">
                      <PromoCodeInputComponent
                        setPromoCodeName={setPromoCodeName}
                        promoCodeName={promoCodename}
                        handleInputChange={handleInputChange}
                        promoCode={createPromoCode}
                        setDiscount={setDiscount}
                        discount={discount}
                        setUnit={setUnits}
                        unit={units}
                        setDuration={setPromoCodeDuration}
                        duration={promoCodeDuration}
                      />
                    </Box>
                    <Box className="promoCode-Divider-box">
                      <Divider
                        sx={{ border: "1px solid rgba(179, 210, 226, 1)" }}
                      />
                    </Box>
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
                      <Button
                        color="info"
                        variant="outlined"
                        className="promoCode-create-data-segment-button"
                      >
                        <span className="promoCode-button-text-size-for-count">
                          Count of entries :{" "}
                        </span>{" "}
                        {totalCount}
                      </Button>
                    </Box>
                  </>
                )}
                {value === "Voucher" && (
                  <>
                    <Box className="promoCode-input-box-container">
                      <VoucherInputComponent
                        setVoucherName={setVoucherName}
                        voucherName={voucherName}
                        hidePublisherList={hidePublisherList}
                        assignedPublisher={assignedPublisher}
                        publisherList={publisherList}
                        publisherListApiCallInfo={publisherListApiCallInfo}
                        setSkipPublisherApiCall={setSkipPublisherApiCall}
                        setAssignedPublisher={setAssignedPublisher}
                        hideCourseList={hideCourseList}
                        setSelectedCourseId={setSelectedCourseId}
                        courseDetails={courseDetails}
                        selectedCourseId={selectedCourseId}
                        courseListInfo={courseListInfo}
                        setSkipCourseApiCall={setSkipCourseApiCall}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        costPerVoucher={costPerVoucher}
                        setCostPerVoucher={setCostPerVoucher}
                        voucherDuration={voucherDuration}
                        setVoucherDuration={setVoucherDuration}
                      />
                    </Box>
                  </>
                )}
                <Box className="create-voucher-promoCode-button-container">
                  <Button
                    sx={{ borderRadius: 50 }}
                    className="create-voucher-promoCode-cancel-button"
                    color="info"
                    variant="outlined"
                    onClick={() => {
                      handlePromoCodeVoucherClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    sx={{ borderRadius: 50 }}
                    className={
                      !createButtonDisabled
                        ? "create-voucher-promoCode-create-button-disabled"
                        : "create-voucher-promoCode-create-button"
                    }
                    color="info"
                    variant="contained"
                    disabled={!createButtonDisabled}
                    onClick={() => {
                      if (value === "PromoCode") {
                        handleCreatePromoCodeInfo();
                      }
                      if (value === "Voucher") {
                        handleCreateVoucherInfo();
                      }
                    }}
                  >
                    Create
                  </Button>
                </Box>
              </>
            )}
          </>
        </DialogContent>
      </Dialog>
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
              previewDataSegmentIds={
                countOfDataEntries?.data_segment_id ? [countOfDataEntries] : []
              }
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
    </div>
  );
};

export default CreatePromoCodeVoucherDialog;
