import { render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import CounselorFollowUpCalendarDay from "../../pages/Dashboard/CounselorFollowUpCalendarDay";

describe("GIVEN CounselorFollowUpCalendarDay", () => {
  test("should render component", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CounselorFollowUpCalendarDay
          highlightedDays={[]}
          day={dayjs()}
          outsideCurrentMonth={false}
        />
      </LocalizationProvider>
    );

    expect(screen.getByTestId("pickers-day")).toBeInTheDocument();
  });

  test("should render dot icon for highlighted day", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CounselorFollowUpCalendarDay
          highlightedDays={[
            {
              date: 16,
              month: 10,
              followUpCount: 20,
              totalFollowUpCount: 25,
              leadAssigned: 40,
              paidApplications: 30,
              admissionConfirmed: 2,
            },
          ]}
          day={dayjs()}
          outsideCurrentMonth={false}
        />
      </LocalizationProvider>
    );

    const dotIcon = screen.getByText(`${new Date().getDate()}`);

    expect(dotIcon).toBeInTheDocument();
  });
});
