/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import {
  useGetAllCourseListQuery,
  useGetAllSourceListQuery,
} from "../../Redux/Slices/filterDataSlice";
import {
  useCreateUpdateScriptMutation,
  useGetTagListsQuery,
} from "../../Redux/Slices/applicationDataApiSlice";
import {
  organizeCourseFilterOption,
  organizeCourseFilterOptionScript,
  organizeSourceFilterOption,
} from "../../helperFunctions/filterHelperFunction";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import "../../styles/sharedStyles.css";
import { useEffect } from "react";
import { applicationStage as applicationStageData } from "../../constants/LeadStageList";
import useToasterHook from "../../hooks/useToasterHook";
import SaveConfirmDialog from "./SaveConfirmDialog";
import useFetchCommonApi from "../../hooks/useFetchCommonApi";
import { SelectPicker } from "rsuite";

const CreateScript = ({ isEditMode, onClose, data, collegeId }) => {
  const [scriptName, setScriptName] = React.useState(data?.script_name || "");
  const [scriptText, setScriptText] = React.useState(data?.content || "");
  const [programName, setProgramName] = React.useState(
    data?.program_name.length > 0 ? data?.program_name : []
  );
  const pushNotification = useToasterHook();
  const [loading, setLoading] = React.useState(false);
  const [source, setSource] = React.useState(data?.source_name || []);

  // Tags
  const [addTag, setAddTag] = React.useState(data?.tags || []);
  const [skipCallTagList, setSkipCallTagList] = React.useState(
    data?.tags?.length>0 ? false : true
  );
  const [tagList, setTagList] = React.useState([]);
  const [hideTagList, setHideTagList] = React.useState(false);

  const [applicationStage, setApplicationStage] = React.useState(
    data?.application_stage?.length>0? data?.application_stage[0]:[]
  );
  // Program
  const [skipProgramListApi, setSkipProgramListApi] = React.useState(
    data?.program_name?.length > 0 ? false : true
  );
  const [programList, setProgramList] = React.useState([]);
  const [hideProgmList, setHideProgramList] = React.useState(false);
  // Source
  const [sourceList, setSourceList] = React.useState([]);
  const [skipSourceListApi, setSkipSourceListApi] = React.useState(
    data?.source_name?.length>0 ? false : true
  );
  const [hideSourceList, setHideSourceList] = React.useState(false);

  // Lead stage
  const [leadStage, setLeadStage] = React.useState(data?.lead_stage || []);

  const { leadStageLabelList, setSkipCallNameAndLabelApi, loadingLabelList } =
    useFetchCommonApi();

  const { handleFilterListApiCall } = useCommonApiCalls();

  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: collegeId },
    { skip: skipProgramListApi }
  );
  const sourceListInfo = useGetAllSourceListQuery(
    { collegeId: collegeId },
    { skip: skipSourceListApi }
  );

  const tagListInfo = useGetTagListsQuery(
    { collegeId },
    { skip: skipCallTagList }
  );

  const [createUpdateScript] = useCreateUpdateScriptMutation();

  const handleCloseIconClick = () => {
    onClose();
  };
const [clickButton,setClickButton]=useState(null)
  const handleSavebtn = (saveOrDraft) => {
    const payload = {
      script_name: scriptName,
      program_name: programName,
      source_name: source,
      lead_stage: leadStage,
      tags: addTag,
      application_stage:applicationStage?.length>0? [applicationStage]:[],
      script_text: scriptText,
      save_or_draft: saveOrDraft,
    };
    setClickButton(saveOrDraft)
    setLoading(true);
    createUpdateScript({
      collegeId,
      scriptId: data?._id,
      payload,
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          pushNotification("success", res?.message);
          onClose();
        }
      })
      .catch((error) => {
        pushNotification("error", error?.data?.detail);
      })
      .finally(() => {setLoading(false);setClickButton(null)});
  };

  const handleCanclebtn = () => {
    onClose();
  };

  useEffect(() => {
    if (!skipCallTagList) {
      const tags = tagListInfo?.data?.data;
      handleFilterListApiCall(
        tags,
        tagListInfo,
        setTagList,
        setHideTagList,
        organizeSourceFilterOption
      );
    }
  }, [tagListInfo, skipCallTagList]);

  useEffect(() => {
    if (!skipProgramListApi) {
      const courseList = courseListInfo?.data?.data[0];
      handleFilterListApiCall(
        courseList,
        courseListInfo,
        setProgramList,
        setHideProgramList,
        organizeCourseFilterOptionScript
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListInfo, skipProgramListApi]);

  useEffect(() => {
    data?.lead_stage?.length>0 && setSkipCallNameAndLabelApi(false);
  }, []);

  useEffect(() => {
    if (!skipSourceListApi) {
      const srList = sourceListInfo?.data?.data[0];

      handleFilterListApiCall(
        srList,
        sourceListInfo,
        setSourceList,
        setHideSourceList,
        organizeSourceFilterOption
      );
    }
  }, [sourceListInfo, skipSourceListApi]);
  const [saveConfirmOpen, setSaveConfirmOpen] = React.useState(false);

  const handleSaveConfirmClickOpen = () => {
    setSaveConfirmOpen(true);
  };

  const handleSaveConfirmClose = () => {
    setSaveConfirmOpen(false);
  };
  const [saveButtonActive, setSaveButtonActive] = useState(false);
  useEffect(() => {
    if (scriptText && scriptName && programName?.length > 0) {
      setSaveButtonActive(true);
    } else {
      setSaveButtonActive(false);
    }
  }, [scriptText, scriptName, programName]);
  return (
    <Box className="edit-script-main-container">
      <Grid container spacing={2}>
        <Grid item md={12} sm={12} xs={12}>
          <Box className="align-row">
            <Typography className="script-text">
              {isEditMode ? "Edit Script" : "Create Script"}
            </Typography>
            <IconButton
              onClick={() => handleCloseIconClick()}
              className="close-icon"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <TextField
            sx={{ width: "100%" }}
            label="Script Name*"
            variant="outlined"
            value={scriptName}
            onChange={(event) => setScriptName(event.target.value)}
            size="small"
            InputProps={{
              classes: {
                root: "script-input-root",
                notchedOutline: "script-notched-outline",
              },
            }}
            InputLabelProps={{
              className: "script-input-label",
            }}
            color="info"
          />
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          {hideProgmList || (
            <MultipleFilterSelectPicker
              placement="bottomEnd"
              placeholder="Program Name*"
              onChange={(value) => {
                setProgramName(value);
              }}
              pickerData={programList}
              setSelectedPicker={setProgramName}
              pickerValue={programName}
              loading={courseListInfo.isFetching}
              onOpen={() => setSkipProgramListApi(false)}
              className="key-select-picker"
            />
          )}
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          {hideSourceList || (
            <MultipleFilterSelectPicker
              placement="bottomEnd"
              placeholder="Source"
              onChange={(value) => {
                setSource(value);
              }}
              pickerData={sourceList}
              setSelectedPicker={setSource}
              pickerValue={source}
              loading={sourceListInfo.isFetching}
              onOpen={() => setSkipSourceListApi(false)}
              className="key-select-picker"
              onClean={() => {}}
            />
          )}
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <MultipleFilterSelectPicker
            placement="bottomEnd"
            placeholder="Lead Stage"
            onChange={(value) => {
              setLeadStage(value);
            }}
            pickerData={leadStageLabelList}
            setSelectedPicker={setLeadStage}
            pickerValue={leadStage}
            loading={loadingLabelList}
            onOpen={() => setSkipCallNameAndLabelApi(false)}
            className="key-select-picker"
            onClean={() => {}}
          />
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          {hideTagList || (
            <MultipleFilterSelectPicker
              placement="bottomEnd"
              placeholder="Add Tag"
              onChange={(value) => {
                setAddTag(value);
              }}
              pickerData={tagList}
              setSelectedPicker={setAddTag}
              pickerValue={addTag}
              loading={tagListInfo.isFetching}
              onOpen={() => setSkipCallTagList(false)}
              className="key-select-picker"
              onClean={() => {}}
            />
          )}
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
        <SelectPicker
      data={applicationStageData}
      searchable={false}
      style={{ width: "100%" }}
      placeholder="Application Stage"
      placement="bottomEnd"
      onChange={(value) => {
        setApplicationStage(value);
      }}
      value={applicationStage}
      className="key-select-picker"
    />
        </Grid>
      </Grid>
      <Box>
        <TextField
          sx={{ width: "100%", fontSize: "14px" }}
          variant="outlined"
          value={scriptText}
          onChange={(event) => setScriptText(event.target.value)}
          placeholder="Script Text*"
          size="small"
          multiline
          rows={15}
          InputProps={{
            classes: {
              root: "script-text-root",
              notchedOutline: "script-text-notched-outline",
            },
          }}
          required
          color="info"
        />
      </Box>
      <Box className="create-script-btn-box">
        
        <Button
          onClick={() => handleSavebtn("save")}
          className="create-script-save-btn"
          disabled={
            !scriptText?.length || !scriptName?.length || !programName?.length
          }
          classes={{
            disabled: "disabled-create-btn",
          }}
          startIcon={(loading && clickButton==="save") && <CircularProgress size={22} sx={{color:"white !important"}} />}
        >
          {"Save"}
        </Button>
        <Button
          onClick={() => handleSavebtn("draft")}
          className="create-script-save-btn"
          disabled={
            !scriptText?.length || !scriptName?.length || !programName?.length
          }
          classes={{
            disabled: "disabled-create-btn",
          }}
          sx={{ whiteSpace: "nowrap", minWidth: "auto !important" }}
          startIcon={(loading && clickButton==="draft") && <CircularProgress size={22} sx={{color:"white !important"}} />}
        >
          {"Save Draft"}
        </Button>
        <Button
          onClick={() => handleSaveConfirmClickOpen()}
          className="create-script-cancle-btn"
        >
          Cancel
        </Button>
      </Box>
      {saveConfirmOpen && (
        <SaveConfirmDialog
          handleSaveConfirmClose={handleSaveConfirmClose}
          saveConfirmOpen={saveConfirmOpen}
          handleOnCreateQuestionFormSubmit={() => handleSavebtn("save")}
          onCancel={handleCanclebtn}
          loading={loading}
          saveButtonActive={saveButtonActive}
        />
      )}
    </Box>
  );
};
export default CreateScript;
