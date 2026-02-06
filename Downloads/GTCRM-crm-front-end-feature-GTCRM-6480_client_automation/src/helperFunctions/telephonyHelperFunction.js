export const handleUpdateOngoingCallDuration = (call, nowTime) => {
  if (!call.is_call_end) {
    const startTime = new Date(call.call_initiate_time);
    const durationInSeconds = Math.floor((nowTime - startTime) / 1000);
    return { ...call, duration: durationInSeconds };
  }
  return call;
};

export function secondsToMMSS(seconds) {
  // Ensure the input is a positive number
  seconds = Math.abs(seconds);

  // Calculate minutes and seconds
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  // Add leading zero if necessary
  minutes = minutes < 10 ? "0" + minutes : minutes;
  remainingSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  // Combine minutes and seconds in "mm:ss" format
  return minutes + ":" + remainingSeconds;
}

export const shouldCallSave = (callDetails, now, prevSavedCallIDs = []) => {
  if (callDetails?.is_call_end) {
    if (prevSavedCallIDs?.includes(callDetails?.call_id)) {
      return false;
    } else {
      const nowMinute = new Date(now).getTime();
      const callInitiate = new Date(callDetails?.call_end_time)?.getTime();

      const timeDifference = Math.abs(nowMinute - callInitiate);
      const minutesGap = Math.floor(timeDifference / (1000 * 60));

      if (callDetails?.is_call_end && minutesGap >= 1) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
};

export const lastCheckoutDuration = (lastCheckoutTime) => {
  const startDate = new Date(lastCheckoutTime);
  const endDate = new Date();
  const diffInMilliseconds = Math.abs(endDate - startDate);
  const hours = Math.floor(diffInMilliseconds / 3600000);
  const minutes = Math.floor((diffInMilliseconds % 3600000) / 60000);
  const seconds = ((diffInMilliseconds % 60000) / 1000).toFixed(0);

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  } else {
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }
};

export const enableOrDisableViewProfile = (
  callDetails,
  selectedApplicationId
) => {
  if (callDetails?.is_student_exist) {
    if (selectedApplicationId?.length) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};
