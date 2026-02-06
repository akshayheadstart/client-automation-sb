import { conditions } from "./calendarConditionsDataSet";

export const handleDataMatching = (date) => {
  const dateArray = date.split(" ");
  const weekday = dateArray[0];
  const month = dateArray[1];
  const day = dateArray[2];
  const formattedDay = day.length === 2 ? `0${day}` : day;
  return `${weekday} ${month} ${formattedDay} ${dateArray[3]}`;
};

export const formatDate = (inputDate) => {
  const dateObject = new Date(inputDate);
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1; // Adding 1 since getMonth
  const day = dateObject.getDate();
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");
  return `${year}-${formattedMonth}-${formattedDay}`;
};
export const formatActiveDate = (date) => {
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};
export const dateCompare = (today, current) => {
  const formatOfToday = formatDate(today);
  const formatOfCurrent = formatDate(current);
  const date1 = new Date(formatOfToday);
  const date2 = new Date(formatOfCurrent);
  if (date1 > date2) {
    return false;
  } else if (date1 < date2) {
    return true;
  } else {
    return true;
  }
};
export const calculateOverallRating = (scores,dataSet) => {
  let totalWeightedScore = 0;
  
  scores?.forEach(score => {
    const matchingWeight = dataSet?.marking_scheme?.find(item => item.name === score.name)?.weight;
    if (matchingWeight !== undefined) {
      totalWeightedScore += score.point * (matchingWeight / 100);
    }
  });

  return totalWeightedScore;
};
export function removeUnderlineAndJoin(data) {
  const hasUnderline = data.includes('_');
  const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);
  if (hasUnderline) {
    const words = data.split('_').map(word => capitalizeFirstLetter(word));
    return words.join(' ');
  } else {
    return capitalizeFirstLetter(data);
  }
}
export const handleOverAllRatingToFixed = (data)=>{
  const fixedValue = data?.toFixed(2);
  return fixedValue;
}
export function findKeysInAllFeatures(obj,selectMenu) {
  const keys = [];
  function search(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        if (key === selectMenu) {
          keys.push(...Object.keys(obj[key]));
        }
        search(obj[key]);
      }
    }
  }

  search(obj);
  return keys;
}
export function modifyKeysWithUnderscores(obj) {
  const modifiedObj = {};

  for (const key in obj) {
    const modifiedKey = key.split(' ').join('_');
    modifiedObj[modifiedKey] = obj[key];
  }

  return modifiedObj;
}
export function findParentKey(jsonObj, targetKey) {
  function findKey(obj, key) {
    for (const k in obj) {
      if (k === key) {
        return true;
      }
      if (typeof obj[k] === 'object' && obj[k] !== null) {
        if (findKey(obj[k], key)) {
          return true;
        }
      }
    }
    return false;
  }

  for (const key in jsonObj) {
    if (findKey(jsonObj[key], targetKey)) {
      return key;
    }
  }

  return null; // If the target key is not found
}
export function checkNumberOrString(input) {
   if (!isNaN(input)) {
    return input;
  } else {
    return input?.toLowerCase();
  }
}
export function calculateTotalDurationInMinutes(startTime, endTime) {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  let totalStartMinutes = startHours * 60 + startMinutes;
  let totalEndMinutes = endHours * 60 + endMinutes;
  // Adjust for cases where end time is on the next day
  if (totalEndMinutes < totalStartMinutes) {
      
    totalEndMinutes += 12 * 60;  // Add 24 hours in minutes
  }

  const durationInMinutes = totalEndMinutes - totalStartMinutes;

  return durationInMinutes;
}

export const handleMarginTopFunction = (marginTop, startTimeToParseFloat) => {
  if(startTimeToParseFloat){
    return handleMarginTopLogicFunction(marginTop, startTimeToParseFloat)
  }else {
        return (marginTop = 1 * 0);
      }
};
//only 4 to 5 solved
export const timeDurationFunction = (timeDuration, updatedHeightToString) => {
  if (timeDuration === 10) {
    const timeFor10 = 25;
    return (updatedHeightToString = timeFor10.toString());
  } else if (timeDuration > 10 && timeDuration < 20) {
    const timeFor10 = 27;
    return (updatedHeightToString = timeFor10.toString());
  }else if (timeDuration >= 20 && timeDuration < 30) {
    const timeFor10 = 29;
    return (updatedHeightToString = timeFor10.toString());
  }
  else{
    let timeCount = 1*timeDuration
    return (updatedHeightToString = timeCount.toString());
  }
};

export const handleMarginTopLogicFunction = (marginTop, startTimeToParseFloat) => {
  for (const condition of conditions) {
    const { start, end, multiplier } = condition;
      if(startTimeToParseFloat === start && startTimeToParseFloat === end){
        let finalResult2 = multiplier;
        return (marginTop = finalResult2);
      }
      else if (startTimeToParseFloat >= start && startTimeToParseFloat < end) {
      let finalResult2 = multiplier * 1;
      return (marginTop = finalResult2);
    }
    
  }

  return (marginTop = 0);
};