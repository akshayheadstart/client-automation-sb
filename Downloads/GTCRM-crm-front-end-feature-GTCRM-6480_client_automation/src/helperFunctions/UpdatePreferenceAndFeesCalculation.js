export function updateFees(mainCourseArray, feesCalculation) {
  const updatedFeesCalculation = {
    base_fees: {},
  };

  mainCourseArray.forEach((course) => {
    const courseName = course.courseName;
    if (!updatedFeesCalculation.base_fees[courseName]) {
      updatedFeesCalculation.base_fees[courseName] = {};
    }

    if (course.courseSpecializations.length === 0) {
      updatedFeesCalculation.base_fees[courseName]["null"] =
        feesCalculation.base_fees?.[courseName]?.["null"] ?? 0;
    } else {
      course.courseSpecializations.forEach((spec) => {
        updatedFeesCalculation.base_fees[courseName][spec.spec_name] =
          feesCalculation.base_fees?.[courseName]?.[spec.spec_name] ?? 0;
      });
    }
  });

  return updatedFeesCalculation;
}
