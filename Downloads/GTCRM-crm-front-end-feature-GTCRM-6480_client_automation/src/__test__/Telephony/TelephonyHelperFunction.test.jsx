import {
  enableOrDisableViewProfile,
  handleUpdateOngoingCallDuration,
  secondsToMMSS,
  shouldCallSave,
} from "../../helperFunctions/telephonyHelperFunction";

describe("Telephony helper function test", () => {
  const telephonyCallDetails = {
    is_call_end: false,
    call_initiate_time: "05 Mar 2024 06:25:00 PM",
    duration: 0,
  };

  test("Testing handleUpdateOngoingCallDuration function to update the duration", () => {
    const endDateTime = new Date("05 Mar 2024 06:30:00 PM");
    const updatedDuration = handleUpdateOngoingCallDuration(
      telephonyCallDetails,
      endDateTime
    );
    expect(updatedDuration?.duration).toBe(300);
  });

  test("Testing second to MM:SS conversion", () => {
    const convertedMinutesAndSeconds = secondsToMMSS(300);
    expect(convertedMinutesAndSeconds).toBe("05:00");
  });

  test("Testing should call save function when the duration is less than one minute", () => {
    const telephonyCallDetails = {
      is_call_end: true,
      call_initiate_time: "05 Mar 2024 06:25:00 PM",
      duration: 0,
    };
    const now = new Date("05 Mar 2024 06:25:30 PM");
    const shouldSave = shouldCallSave(telephonyCallDetails, now);
    expect(shouldSave).toBeFalsy();
  });
  test("Testing should call save function when the duration is more than one minute", () => {
    const telephonyCallDetails = {
      is_call_end: true,
      call_initiate_time: "05 Mar 2024 06:25:00 PM",
      duration: 0,
    };
    const now = new Date("05 Mar 2024 06:26:30 PM");
    const shouldSave = shouldCallSave(telephonyCallDetails, now);
    expect(shouldSave).toBeFalsy();
  });
  test("Testing should call save function when the call is ongoing but duration is more than one minute", () => {
    const telephonyCallDetails = {
      is_call_end: false,
      call_initiate_time: "05 Mar 2024 06:25:00 PM",
      duration: 0,
    };
    const now = new Date("05 Mar 2024 06:26:30 PM");
    const shouldSave = shouldCallSave(telephonyCallDetails, now);
    expect(shouldSave).toBeFalsy();
  });

  const telephonyDialogCallDetails = {
    is_student_exist: false,
    is_call_end: true,
  };

  test("Testing the telephony enableOrDisableViewProfile function when student doesn't exist in our system", () => {
    /**
     *    Purpose of this test :
     *          1. We are checking if the student doesn't exists we are returning "false".
     *          2. Based on the false, we are enabling the telephony call dialog action button.
     */

    const result = enableOrDisableViewProfile(telephonyDialogCallDetails);
    expect(result).toBeFalsy();
  });
  test("Testing the telephony enableOrDisableViewProfile function when student exist in our system", () => {
    telephonyDialogCallDetails.is_student_exist = true;
    /**
     *    Purpose of this test :
     *          1. If the student exists in system and doesn't select any application we are returning "true".
     *          2. Based on the true, we are disabling the telephony call dialog action button.
     */

    const result = enableOrDisableViewProfile(telephonyDialogCallDetails);
    expect(result).toBeTruthy();
  });
  test("Testing the telephony enableOrDisableViewProfile function when student exist in our system and select application", () => {
    telephonyDialogCallDetails.is_student_exist = true;
    /**
     *    Purpose of this test :
     *          1. If the student exists in system and select any application we are returning "false".
     *          2. Based on the false, we are enabling the telephony call dialog action button.
     */

    const result = enableOrDisableViewProfile(
      telephonyDialogCallDetails,
      "Selected applicationId"
    );
    expect(result).toBeFalsy();
  });
});
