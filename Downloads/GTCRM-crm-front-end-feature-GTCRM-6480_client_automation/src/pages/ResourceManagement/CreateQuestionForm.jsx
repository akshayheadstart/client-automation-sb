/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Checkbox, CircularProgress, FormControl, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SelectPicker } from "rsuite";
import {
  useGetAllSchoolListQuery
} from "../../Redux/Slices/filterDataSlice";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import FormField from "../../components/shared/forms/FormField";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import "../../styles/Resources.css";
import "../../styles/sharedStyles.css";
import { organizeCourseFilterInterViewOption } from "../../helperFunctions/filterHelperFunction";
import SaveConfirmDialog from "./SaveConfirmDialog";
const CreateQuestionForm = ({
  onSubmit = () => {},
  onCancel = () => {},
  tagList = [],
  isEditQuestionMode,
  data = {},
  loading,
}) => {
  const [question, setQuestion] = React.useState("");
  const [selectedCourseId,setSelectedCourseId]=useState([]);
  const [schoolName, setSchoolName] = useState("");
  const [answer, setAnswer] = React.useState("");
  const [selectedTags, setSelectedtags] = React.useState([]);
const [studentCheckBox, setStudentCheckBox]=useState(false)
useEffect(()=>{
  if(data?.question){
    setQuestion(data?.question)
  }
  if(data?.program_list?.length>0){
    setSelectedCourseId(data?.program_list)
  }
  if(data?.school_name){
    setSchoolName(data?.school_name)
  }
  if(data?.answer){
    setAnswer(data?.answer)
  }
  if(data?.tags?.length>0){
    setSelectedtags(data?.tags)
  }
  if(data?.is_visible_to_student){
    setStudentCheckBox(true)
  }
},[data?._id])
  const handleOnCreateQuestionFormSubmit = () => {
    const payload = {
      ...data,
      question: question,
      answer: answer,
      tags: selectedTags,
      program_list:selectedCourseId,
      school_name:schoolName,
      is_visible_to_student:studentCheckBox
    };

    onSubmit(payload, isEditQuestionMode);
  };

  const handleQuestion = (text) => {
    setQuestion(text);
  };
  const handleAnswer = (text) => {
    setAnswer(text);
  };
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [listOfSchool, setListOfSchool] = React.useState([]);
  const [listOfCourses, setListOfCourses] = React.useState([]);
  // common api call functions
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [hideCourseList, setHideCourseList] = useState(false);

  const [listOfSchoolObject, setListOfSchoolObject] = React.useState({});
  const [callSchoolFilterOptionApi, setCallSchoolFilterOptionApi] = useState({
    skipSchoolListApiCall: data?.school_name?false:true,
  });
  //school API Call
  const schoolNameList = useGetAllSchoolListQuery(
    { collegeId: collegeId },
    { skip: callSchoolFilterOptionApi.skipSchoolListApiCall }
  );
  useEffect(() => {
    if (!callSchoolFilterOptionApi.skipSchoolListApiCall) {
      const courseList = schoolNameList?.data?.data;
      if (typeof courseList === "object" && courseList !== null) {
        setListOfSchoolObject(courseList);
        const parentKeys = Object?.keys(courseList);
        if (parentKeys) {
          const mapParentKeys = parentKeys.map((item) => ({
            label: item,
            value: item,
          }));
          setListOfSchool(mapParentKeys);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    schoolNameList,
    callSchoolFilterOptionApi.skipSchoolListApiCall,
    callSchoolFilterOptionApi,
  ]);

  useEffect(() => {
    if (schoolName || data?.school_name) {
      const courseList = listOfSchoolObject[data?.school_name?data?.school_name:schoolName];
      handleFilterListApiCall(
        courseList,
        schoolNameList,
        setListOfCourses,
        setHideCourseList,
        organizeCourseFilterInterViewOption
      );
    }else{
      setSelectedCourseId([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolName, hideCourseList,data,schoolNameList?.data?.data]);
  const [saveConfirmOpen, setSaveConfirmOpen] = React.useState(false);

  const handleSaveConfirmClickOpen = () => {
    setSaveConfirmOpen(true);
  };

  const handleSaveConfirmClose = () => {
    setSaveConfirmOpen(false);
  };
  const [saveButtonActive,setSaveButtonActive]=useState(false)
  useEffect(()=>{
    if(selectedTags?.length>0 &&schoolName &&selectedCourseId?.length>0 && question && answer){
      setSaveButtonActive(true)
    }else{
      setSaveButtonActive(false)
    }

  },[selectedTags,schoolName,selectedCourseId,question,answer])
  return (
    <>
      <Box className="select-tag-and-school-program-box-container">
        <MultipleFilterSelectPicker
          placement="bottomStart"
          placeholder="Type tag name"
          onChange={(value) => {
            setSelectedtags(value);
          }}
          pickerData={tagList}
          setSelectedPicker={setSelectedtags}
          pickerValue={selectedTags}
          loading={false}
          onOpen={() => {}}
          className="key-select-picker tags-select-picker dashboard-select-picker"
          onClean={() => {}}
          style={{ width: "153px" }}
        />
            <SelectPicker
              placement="bottomEnd"
              value={schoolName}
              size="md"
              placeholder="School Name*"
              data={listOfSchool}
              style={{ width: "156px" }}
              className="select-picker dashboard-select-picker"
              loading={schoolNameList.isFetching}
              onOpen={() => {
                setCallSchoolFilterOptionApi &&
                  setCallSchoolFilterOptionApi((prev) => ({
                    ...prev,
                    skipSchoolListApiCall: false,
                  }));
              }}
              onChange={(newValue) => {
                setSchoolName(newValue);
              }}
            />
        
            <MultipleFilterSelectPicker
              style={{ width: "160px" }}
              placement="bottomEnd"
              placeholder="Program Name"
              className="dashboard-select-picker input-field-placeholder-color-for-check-picker"
              onChange={(value) => {
                setSelectedCourseId(value);
              }}
              pickerData={listOfCourses}
              setSelectedPicker={setSelectedCourseId}
              pickerValue={selectedCourseId}
              disableField={!schoolName}
            />
      </Box>
      <FormField
        value={question}
        onChange={(e) => handleQuestion(e.target.value)}
        placeholder="Question"
        required={true}
        // error={questionError}
      />
      <FormField
        value={answer}
        onChange={(e) => handleAnswer(e.target.value)}
        placeholder="Answer"
        required={true}
        // error={answerError}
        multiline={true}
        rows={4}
      />
<Box className='visible-to-student-box-container'>
<Checkbox color='info' 
onChange={(e)=>setStudentCheckBox(e.target.checked)}
checked={studentCheckBox}
 />
<Typography className='visible-to-student-box-text'>Visible to student</Typography>
</Box>
      <FormControl className="center-align-items" fullWidth>
        {loading ? (
          <CircularProgress size={22} color="info" />
        ) : (
          <Button
            className="resource-form-submit-btn center-align-items"
            type="submit"
            disabled={!saveButtonActive}
            classes={{
              disabled: "save-btn-disabled",
            }}
            onClick={()=>{
              handleOnCreateQuestionFormSubmit()
            }}
          >
            Save
          </Button>
        )}
        <Button
          className="resource-form-cancel-btn center-align-items"
          type="button"
          onClick={()=>{
            handleSaveConfirmClickOpen()
          }}
        >
          Cancel
        </Button>
      </FormControl>
    {
      saveConfirmOpen && <SaveConfirmDialog handleSaveConfirmClose={handleSaveConfirmClose}
      saveConfirmOpen={saveConfirmOpen}
      handleOnCreateQuestionFormSubmit={handleOnCreateQuestionFormSubmit}
      onCancel={onCancel}
      loading={loading}
      saveButtonActive={saveButtonActive}
      />
    }
    </>
  );
};
export default CreateQuestionForm;
