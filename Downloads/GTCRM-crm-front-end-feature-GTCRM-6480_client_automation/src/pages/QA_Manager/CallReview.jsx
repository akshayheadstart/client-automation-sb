import React, { useEffect } from "react";
import {
  Typography,
  Box,
  IconButton,
  Grid,
  FormControl,
  Slider,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Rating from "@mui/material/Rating";
import useToasterHook from "../../hooks/useToasterHook";
import {
  QcStatusOptions,
  calculateCallQualityScore,
} from "../../utils/QAManagerUtils";
import { Dropdown } from "rsuite";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useAddCallReviewMutation } from "../../Redux/Slices/telephonySlice";
import CustomAudioPlayer from "../../components/ui/communication-performance/CommunicationSummary/CustomAudioPlayer";
import CallReviewImg from "../../images/call-review-img.svg";
import { callReviewedDate } from "../../hooks/GetJsonDate";
const CallReview = ({ onClose = () => {}, data = null, collegeId, open }) => {
  const [qcStatus, setQcStatus] = React.useState("");
  const [productKnowledge, setProductKnowledge] = React.useState(0);
  const [callStarting, setCallStarting] = React.useState(0);
  const [callClosing, setCallClosing] = React.useState(0);
  const [issueHandling, setIssueHandling] = React.useState(0);
  const [engagement, setEngagement] = React.useState(0);
  const [rating, setRating] = React.useState(0);
  const [remarks, setRemarks] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    React.useContext(DashboradDataContext);

  const [internalServerError, setInternalServerError] = React.useState("");
  const [somethingWentWrong, setSomethingWentWrong] = React.useState("");

  const [addCallReview] = useAddCallReviewMutation();
  const pushNotification = useToasterHook();

  const handleQcStatusChange = (keyIndex) => {
    setQcStatus(keyIndex);
  };

  React.useEffect(() => {
    const callReviewScore = [
      {
        name: "call_product_knowledge",
        point: productKnowledge || 0,
        weight: 40,
      },
      {
        name: "call_starting",
        point: callStarting || 0,
        weight: 20,
      },
      {
        name: "call_closing",
        point: callClosing || 0,
        weight: 20,
      },
      {
        name: "call_issue_handling",
        point: issueHandling || 0,
        weight: 10,
      },
      {
        name: "call_engagement",
        point: engagement || 0,
        weight: 10,
      },
    ];
    const score = calculateCallQualityScore(callReviewScore);
    setRating(score);
  }, [productKnowledge, callStarting, callClosing, issueHandling, engagement]);

  useEffect(() => {
    setProductKnowledge(data?.call_product_knowledge || 0);
    setCallStarting(data?.call_starting || 0);
    setCallClosing(data?.call_closing || 0);
    setIssueHandling(data?.call_issue_handling || 0);
    setEngagement(data?.call_engagement || 0);
    setQcStatus(data?.qc_status || "");
    setRemarks(data?.call_remarks || "");
  }, [data]);

  const handleSubmitBtn = () => {
    if (collegeId) {
      setLoading(true);
      addCallReview({
        collegeId,
        callId: data?._id,
        payload: {
          qc_status: qcStatus,
          product_knowledge: productKnowledge,
          call_starting: callStarting,
          call_closing: callClosing,
          issue_handling: issueHandling,
          engagement: engagement,
          call_quality_score: rating,
          remarks,
        },
      })
        .unwrap()
        .then((data) => {
          try {
            if (data.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data.detail) {
              pushNotification("error", data.detail);
            } else if (data?.message) {
              pushNotification("success", data?.message);
              onClose();
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setSomethingWentWrong, null, 10000);
          }
        })
        .catch((error) => {
          handleInternalServerError(setInternalServerError, null, 10000);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Box className="call-review-container">
      <Box className="header-container">
        <Typography className="label-text">Call Review</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon className="close-icon" />
        </IconButton>
      </Box>
      {internalServerError || somethingWentWrong ? (
        <Box className="loading-animation-for-notification">
          {internalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box className="qc-status-wrapper">
              {isDropdownOpen || qcStatus?.length ? (
                <label className="qc-status-label">QC Status</label>
              ) : null}
              <Dropdown
                title={isDropdownOpen || qcStatus ? qcStatus : "QC Status"}
                trigger="click"
                onSelect={(keyIndex, event) =>
                  handleQcStatusChange(keyIndex, event)
                }
                activeKey={qcStatus}
                onToggle={(open) => setIsDropdownOpen(open)}
                toggleClassName="qc-status-dropdown"
              >
                {QcStatusOptions.map((status) => (
                  <Dropdown.Item eventKey={status?.value} key={status?.value}>
                    {status?.label}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box className="call-review-sub-item">
              <Box className="percent-label-container">
                <Typography className="percent-label">40%</Typography>
              </Box>
              <Typography
                component="span"
                className="call-review-sub-item-text"
              >
                Product knowledge:
              </Typography>
              <Typography
                component="span"
                className="call-review-sub-item-number"
              >
                {productKnowledge}
              </Typography>
              <Slider
                className="call-review-slider"
                value={productKnowledge}
                onChange={(_, value) => setProductKnowledge(value)}
                min={0.5}
                max={10}
                classes={{
                  thumb: "call-review-thumb",
                }}
                step={0.5}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box className="call-review-sub-item">
              <Box className="percent-label-container">
                <Typography className="percent-label">20%</Typography>
              </Box>
              <Typography
                component="span"
                className="call-review-sub-item-text"
              >
                Call Starting:
              </Typography>
              <Typography
                component="span"
                className="call-review-sub-item-number"
              >
                {callStarting}
              </Typography>
              <Typography>
                <Slider
                  className="call-review-slider"
                  value={callStarting}
                  onChange={(_, value) => setCallStarting(value)}
                  min={0.5}
                  max={10}
                  classes={{
                    thumb: "call-review-thumb",
                  }}
                  step={0.5}
                />
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box className="call-review-sub-item">
              <Box className="percent-label-container">
                <Typography className="percent-label">20%</Typography>
              </Box>
              <Typography
                component="span"
                className="call-review-sub-item-text"
              >
                Call Closing:
              </Typography>
              <Typography
                component="span"
                className="call-review-sub-item-number"
              >
                {callClosing}
              </Typography>
              <Typography>
                <Slider
                  className="call-review-slider"
                  value={callClosing}
                  onChange={(_, value) => setCallClosing(value)}
                  min={0.5}
                  max={10}
                  classes={{
                    thumb: "call-review-thumb",
                  }}
                  step={0.5}
                />
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box className="call-review-sub-item">
              <Box className="percent-label-container">
                <Typography className="percent-label">10%</Typography>
              </Box>
              <Typography
                component="span"
                className="call-review-sub-item-text"
              >
                Issue Handling:
              </Typography>
              <Typography
                component="span"
                className="call-review-sub-item-number"
              >
                {issueHandling}
              </Typography>
              <Typography>
                <Slider
                  className="call-review-slider"
                  value={issueHandling}
                  onChange={(_, value) => setIssueHandling(value)}
                  min={0.5}
                  max={10}
                  classes={{
                    thumb: "call-review-thumb",
                  }}
                  step={0.5}
                />
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box className="call-review-sub-item">
              <Box className="percent-label-container">
                <Typography className="percent-label">10%</Typography>
              </Box>
              <Typography
                component="span"
                className="call-review-sub-item-text"
              >
                Engagement:
              </Typography>
              <Typography
                component="span"
                className="call-review-sub-item-number"
              >
                {engagement}
              </Typography>
              <Typography>
                <Slider
                  className="call-review-slider"
                  value={engagement}
                  onChange={(_, value) => setEngagement(value)}
                  min={0.5}
                  max={10}
                  classes={{
                    thumb: "call-review-thumb",
                  }}
                  step={0.5}
                />
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box className="call-review-sub-item rating-container">
              <Box className="call-review-score-raiting-container">
                <Typography className="call-review-score-text">
                  Call Quality Score :
                </Typography>
              </Box>
              <Box>
                <Typography
                  component="span"
                  className="call-review-raiting-value"
                >
                  {rating?.toFixed(1)}/5
                </Typography>
                <Typography
                  component="span"
                  className="call-review-raiting-sub-value"
                >
                  ({((rating / 5) * 100).toFixed(2)}%)
                </Typography>
              </Box>
              <Box className="call-review-rating-box">
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={() => {}}
                  precision={0.1}
                  readOnly
                />
              </Box>
            </Box>
          </Grid>

          <Grid item sm={12} md={12} lg={12} xl={12}>
            <Box className="call-review-remark-container">
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  label="Remarks"
                  InputProps={{
                    classes: {
                      notchedOutline: "remarks-outline",
                      formControl: "text-field-control",
                    },
                  }}
                  value={remarks}
                  onChange={(event) => {
                    setRemarks(event.target.value);
                  }}
                  color="info"
                />
              </FormControl>
            </Box>
          </Grid>

          <Grid item sm={12} md={12} lg={12} xl={12}>
            <Box className="call-review-submit-box">
              {loading ? (
                <CircularProgress size={22} color="info" />
              ) : (
                <Button
                  className="call-review-submit-btn"
                  onClick={() => handleSubmitBtn()}
                  disabled={qcStatus?.length === 0}
                  classes={{
                    disabled: "call-review-submit-btn-disabled",
                  }}
                >
                  Submit
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
      <Box className="call-review-history">
        <img src={CallReviewImg} alt="call-review-img" />
        <Box>
          {data?.qc_date && (
            <Typography>{callReviewedDate(data?.qc_date)}</Typography>
          )}
          <Typography>{data?.call_remarks}</Typography>
          {data?.recording && (
            <CustomAudioPlayer
              callRecordingFile={data?.recording}
              openDialog={open}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CallReview;
