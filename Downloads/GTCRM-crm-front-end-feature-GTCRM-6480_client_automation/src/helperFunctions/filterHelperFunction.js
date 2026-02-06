export const organizeCounselorFilterOption = (data) => {
  return data.map((item) => ({ label: item.name, value: item.id }));
};

export const organizeQaFilterOption = (data) => {
  return data.map((item) => ({
    label: `${item.first_name} ${item.last_name}`,
    value: item.id,
  }));
};

export const organizeScriptFilterOption = (data) => {
  return data?.map((item) => ({
    label: item?.script_name,
    value: item._id,
  }));
};

export const organizeCourseFilterOption = (data) => {
  const allCoursesWithSpecializations = [];
  data.forEach((course) => {
    let index;
    const specializationLength = course?.course_specialization?.length
      ? course?.course_specialization?.length
      : 1;
    for (index = 0; index < specializationLength; index++) {
      if (Array.isArray(course?.course_specialization)) {
        allCoursesWithSpecializations.push({
          label: `${course?.course_name}${
            course.course_specialization[index]?.spec_name === null
              ? ""
              : ` in ${course.course_specialization[index]?.spec_name} `
          }`,
          value: {
            // course_name: course?.course_name, (not using it now, commenting for future use if required)
            course_id: course?._id,
            course_specialization:
              course.course_specialization[index]?.spec_name,
          },
        });
      } else {
        allCoursesWithSpecializations.push({
          label: `${course?.course_name} Program`,
          value: {
            course_id: course?._id,
            course_specialization: "",
            // course_name: course?.course_name, (not using it now, commenting for future use if required)
          },
        });
      }
    }
  });
  return allCoursesWithSpecializations;
};
//Resource section create Script function
export const organizeCourseFilterOptionScript = (data) => {
  const allCoursesWithSpecializations = [];
  data.forEach((course) => {
    let index;
    const specializationLength = course?.course_specialization?.length
      ? course?.course_specialization?.length
      : 1;
    for (index = 0; index < specializationLength; index++) {
      if (Array.isArray(course?.course_specialization)) {
        allCoursesWithSpecializations.push({
          label: `${course?.course_name}${
            course.course_specialization[index]?.spec_name === null
              ? ""
              : ` in ${course.course_specialization[index]?.spec_name} `
          }`,
          value: {
            course_name: course?.course_name,
            course_id: course?._id,
            course_specialization:
              course.course_specialization[index]?.spec_name,
          },
        });
      } else {
        allCoursesWithSpecializations.push({
          label: `${course?.course_name} Program`,
          value: {
            course_id: course?._id,
            course_specialization: "",
            course_name: course?.course_name,
          },
        });
      }
    }
  });
  return allCoursesWithSpecializations;
};

export const organizeSourceFilterOption = (data) => {
  const listOfSource = [];
  data?.forEach((item) => {
    if (item) {
      listOfSource.push({ label: item, value: item });
    }
  });
  return listOfSource;
};
export const organizeCourseFilterInterViewOption = (data) => {
  const allCoursesWithSpecializations = [];
  data.forEach((course) => {
    let index;
    const specializationLength = course?.course_specialization?.length
      ? course?.course_specialization?.length
      : 1;
    for (index = 0; index < specializationLength; index++) {
      if (Array.isArray(course?.course_specialization)) {
        allCoursesWithSpecializations.push({
          label: `${
            course?.course_name &&
            course.course_specialization[index]?.spec_name
              ? `${course?.course_name} in ${course.course_specialization[index]?.spec_name}`
              : `${course?.course_name}`
          }`,
          value: {
            course_name: course?.course_name,
            course_specialization: course.course_specialization[index]
              ?.spec_name
              ? course.course_specialization[index]?.spec_name
              : null,
          },
        });
      } else {
        allCoursesWithSpecializations.push({
          label: `${course?.course_name} Program`,
          value: {
            course_name: course?.course_name,
            course_specialization: "",
          },
        });
      }
    }
  });
  return allCoursesWithSpecializations;
};

export const courseSpecializationFilter = (
  coursesData,
  courseNamesToFilter
) => {
  const filteredSpecializations = [];

  for (const courseName of courseNamesToFilter) {
    const course = coursesData?.find(
      (course) => course.course_name === courseName
    );

    if (course && course.course_specialization) {
      const specializations = course?.course_specialization?.map(
        (spec, index) => ({
          role: course.course_name,
          label: spec.spec_name ? spec.spec_name : "no-specializations",
          value:
            spec.spec_name === null
              ? null + `0` + course.course_name
              : spec.spec_name + "0" + course.course_name,
        })
      );
      filteredSpecializations.push(...specializations);
    }
  }

  return filteredSpecializations;
};
export const organizeCourseFilterCourseNameOption = (data) => {
  const allCoursesWithSpecializations = [];
  data.forEach((course) => {
    let index;
    const specializationLength = course?.course_specialization?.length
      ? course?.course_specialization?.length
      : 1;
    for (index = 0; index < specializationLength; index++) {
      if (Array.isArray(course?.course_specialization)) {
        allCoursesWithSpecializations.push({
          label: `${course?.course_name} in ${
            course.course_specialization[index]?.spec_name
              ? course.course_specialization[index]?.spec_name
              : "No Specialization"
          }`,
          value: {
            course_name: course?.course_name,
            spec_name: course.course_specialization[index]?.spec_name
              ? course.course_specialization[index]?.spec_name
              : null,
          },
        });
      } else {
        allCoursesWithSpecializations.push({
          label: `${course?.course_name} Program`,
          value: {
            course_name: course?.course_name,
            spec_name: "",
          },
        });
      }
    }
  });
  return allCoursesWithSpecializations;
};
export const organizeCourseFilterCoursePreferenceOption = (data) => {
  const allCoursesWithSpecializations = [];
  data.forEach((course) => {
    let index;
    const specializationLength = course?.course_specialization?.length
      ? course?.course_specialization?.length
      : 1;
    for (index = 0; index < specializationLength; index++) {
      if (Array.isArray(course?.course_specialization)) {
        allCoursesWithSpecializations.push({
          label: `${course?.course_name} in ${
            course.course_specialization[index]?.spec_name
              ? course.course_specialization[index]?.spec_name
              : "No Specialization"
          }`,
          value: {
            course_id: course?._id,
            spec_name1: course.course_specialization[index]?.spec_name
              ? course.course_specialization[index]?.spec_name
              : null,
          },
        });
      } else {
        allCoursesWithSpecializations.push({
          label: `${course?.course_name} Program`,
          value: {
            course_id: course?._id,
            spec_name1: "",
          },
        });
      }
    }
  });
  return allCoursesWithSpecializations;
};

export function isNumberOrStringCompare(input) {
  if (typeof input === "number") {
    return true;
  } else if (typeof input === "string") {
    return false;
  } else {
    return null;
  }
}
export function convertDateFormat(inputDate) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dateObj = new Date(inputDate);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const period = dateObj.getHours() >= 12 ? "PM" : "AM";

  const outputDate = `${day} ${month} ${year} | ${hours}:${minutes} ${period}`;
  return outputDate;
}
export function extractValuesAutoComplete(inputArray) {
  return inputArray?.map((item) => item.value);
}

export function formatLeadVsPaidApplicationDates(inputDates) {
  return inputDates?.map((item) => {
    const [day, month] = item.x.split(" ");
    const formattedDate = `${
      day.length > 1 ? day : `0${day}`
    } ${month.substring(0, 3)}`;
    return { x: formattedDate, y: item.y, event: item.event };
  });
}
export function formatLeadDates(input) {
  const outputDates = input?.map((date) => {
    const [day, month] = date?.split(" ");
    return `${day.length > 1 ? day : `0${day}`} ${month.substring(0, 3)}`;
  });
  return outputDates;
}
export function formatSingleLeadDate(inputDate) {
  const [day, month] = inputDate?.split(" ");
  return `${day.length > 1 ? day : `0${day}`} ${month.substring(0, 3)}`;
}
export function removeUnderlineAndJoinNumberOrString(data) {
  if (typeof data === "number") {
    return data;
  } else if (typeof data === "string") {
    const hasUnderline = data.includes("_");
    const capitalizeFirstLetter = (str) =>
      str.charAt(0).toUpperCase() + str.slice(1);
    if (hasUnderline) {
      const words = data.split("_").map((word) => capitalizeFirstLetter(word));
      return words.join(" ");
    } else {
      return capitalizeFirstLetter(data);
    }
  } else {
    return null;
  }
}
export function convertAllocatedSpecializationsArray(inputArray) {
  return inputArray.map((item, index) => {
    const courseName = item.course_name || "null";
    const specName = item.spec_name || "null";
    return `${specName}0${courseName}`;
  });
}
export const organizePublisherFilterOption = (data) => {
  return data.map((item) => ({
    label: `${item.first_name} ${item.middle_name} ${item.last_name}`,
    value: item.id,
    email: item.email,
  }));
};

export const organizeCourseFilterCourseIdOption = (data) => {
  const allCoursesWithSpecializations = [];
  data.forEach((course) => {
    let index;
    const specializationLength = course?.course_specialization?.length
      ? course?.course_specialization?.length
      : 1;
    for (index = 0; index < specializationLength; index++) {
      if (Array.isArray(course?.course_specialization)) {
        allCoursesWithSpecializations.push({
          label: `${course?.course_name} in ${
            course.course_specialization[index]?.spec_name
              ? course.course_specialization[index]?.spec_name
              : "No Specialization"
          }`,
          value: {
            course_id: course?._id,
            spec_name: course.course_specialization[index]?.spec_name
              ? course.course_specialization[index]?.spec_name
              : null,
            course_name: course?.course_name,
          },
        });
      } else {
        allCoursesWithSpecializations.push({
          label: `${course?.course_name} Program`,
          value: {
            course_id: course?._id,
            spec_name: "",
            course_name: course?.course_name,
          },
        });
      }
    }
  });
  return allCoursesWithSpecializations;
};
export const organizeCourseFilterCourseSpecializationOption = (data) => {
  const allCoursesWithSpecializations = [];
  data.forEach((course) => {
    let index;
    const specializationLength = course?.course_specialization?.length
      ? course?.course_specialization?.length
      : 1;
    for (index = 0; index < specializationLength; index++) {
      if (Array.isArray(course?.course_specialization)) {
        allCoursesWithSpecializations.push({
          label: `${course?.course_name} in ${
            course.course_specialization[index]?.spec_name
              ? course.course_specialization[index]?.spec_name
              : "No Specialization"
          }`,
          value: {
            course_id: course?._id,
            course_specialization: course.course_specialization[index]
              ?.spec_name
              ? course.course_specialization[index]?.spec_name
              : null,
          },
        });
      } else {
        allCoursesWithSpecializations.push({
          label: `${course?.course_name} Program`,
          value: {
            course_id: course?._id,
            course_specialization: "",
          },
        });
      }
    }
  });
  return allCoursesWithSpecializations;
};
export const organizeEmailCategoryOption = (data) => {
  const listOfCategory = [];
  data?.forEach((item) => {
    if (item) {
      listOfCategory.push({ 
        label: item?.category_name, 
        value: item?.category_name
    });
    }
  });
  return listOfCategory;
};
export const organizeMembersOptions=(data)=>{
  const listOfMembers = [];
  data?.forEach((item) => {
    if (item) {
      listOfMembers.push({ 
        label: item?.label, 
        role: item?.role, 
        value: {type:item?.value?.role,name:item?.value?.name,id:item?.value?.id}
    });
    }
  });
  return listOfMembers;
}
export const organizeRolesOptions=(data)=>{
  return data;
}
export function paymentDeviceInfo(input) {
  if (input < 600) {
      return "Mobile";
  }
  if (input >= 600 && input < 1240) {
      return "Tablet";
  }

  return "DeskTop";
}
