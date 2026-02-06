import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import "./../../styles/CreateEmailTemplate.css";
import {
  useGetEmailTemplateParticularRoleBaseMembersQuery,
  useGetEmailTemplateUserRoleQuery,
} from "../../Redux/Slices/filterDataSlice";
import { useSelector } from "react-redux";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import {
  organizeMembersOptions,
  organizeRolesOptions,
} from "../../helperFunctions/filterHelperFunction";
import { updateTemplateMembersLabels } from "../StudentTotalQueries/helperFunction";
const UserRoleAndMembers = ({
  md,
  selectedRoleType,
  setSelectedRoleType,
  selectedMembers,
  setSelectedMembers,
  mood,
  setSomethingWentWrongInUploadFile,
  setUploadFileInternalServerError,
  userRoleList,
  setUserRoleList,
  membersList,
  setMembersList,
  select_profile_role,
  select_members,
}) => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [skipMembersListApi, setSkipMembersListApi] = useState(
    select_members?.length > 0 ? false : true
  );
  const [skipUserRoleListApi, setSkipUserRoleListApi] = useState(
    select_profile_role?.length > 0 ? false : true
  );

  //User List API implementation here
  const getEmailTemplateParticularRoleBaseMembers =
    useGetEmailTemplateParticularRoleBaseMembersQuery(
      { collegeId: collegeId, selectedRoleType: selectedRoleType },
      { skip: skipMembersListApi }
    );
  useEffect(() => {
    if (!skipMembersListApi) {
      const members = getEmailTemplateParticularRoleBaseMembers?.data?.data;
      handleFilterListApiCall(
        members,
        getEmailTemplateParticularRoleBaseMembers,
        setMembersList,
        "",
        organizeMembersOptions,
        "",
        setUploadFileInternalServerError,
        setSomethingWentWrongInUploadFile
      );
    }
  }, [getEmailTemplateParticularRoleBaseMembers, skipMembersListApi]);
  const [updatedMembersList, setUpdatedMembersList] = useState([]);
  useEffect(() => {
    if (membersList?.length > 0) {
      const newData = updateTemplateMembersLabels(membersList);
      setUpdatedMembersList(newData);
    }
  }, [membersList]);
  //User Role List API implementation here
  const getEmailTemplateUserRole = useGetEmailTemplateUserRoleQuery(
    { collegeId: collegeId },
    { skip: skipUserRoleListApi }
  );
  useEffect(() => {
    if (!skipUserRoleListApi) {
      const roles = getEmailTemplateUserRole?.data?.data;
      handleFilterListApiCall(
        roles,
        getEmailTemplateUserRole,
        setUserRoleList,
        "",
        organizeRolesOptions,
        "",
        setUploadFileInternalServerError,
        setSomethingWentWrongInUploadFile
      );
    }
  }, [getEmailTemplateUserRole, skipUserRoleListApi]);
  return (
    <>
      <Grid item md={3} sm={12} xs={12}>
        <MultipleFilterSelectPicker
          style={{ width: "100%" }}
          className='dashboard-select-picker'
          setSelectedPicker={setSelectedRoleType}
          pickerData={userRoleList}
          placeholder='Select Profile'
          pickerValue={selectedRoleType}
          maxHeight={150}
          placement={"bottom"}
          readOnly={mood}
          loading={getEmailTemplateUserRole.isFetching}
          onOpen={() => {
            setSkipUserRoleListApi(false);
            setSkipMembersListApi(true);
          }}
        />
      </Grid>
      {selectedRoleType?.length > 0 && (
        <Grid item md={md ? md : 6} sm={12} xs={12}>
          <MultipleFilterSelectPicker
            className='dashboard-select-picker'
            style={{ width: "100%" }}
            onChange={(value) => {
              setSelectedMembers(value);
            }}
            setSelectedPicker={setSelectedMembers}
            pickerData={updatedMembersList}
            placeholder='Select Members'
            pickerValue={selectedMembers}
            loading={getEmailTemplateParticularRoleBaseMembers.isFetching}
            placement={"bottom"}
            groupBy='role'
            onOpen={() => {
              setSkipMembersListApi(false);
            }}
            maxHeight={150}
            readOnly={mood}
          />
        </Grid>
      )}
    </>
  );
};

export default UserRoleAndMembers;
