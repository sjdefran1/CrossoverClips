import * as React from "react";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDaysToHighlight,
  fetchGamesByDate,
} from "../../services/GameService";
import { changeDateSelected, setQuickLink } from "./dateSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";

function ServerDay(props) {
  const { daysToHighlight, day, outsideCurrentMonth, ...other } = props;

  // Retrieve game count for the day
  // used to determine if a badge should be rendered
  const gameCount = daysToHighlight[dayjs(day).date()];

  return (
    <Badge
      key={day}
      variant='dot'
      color='success'
      overlap='circular'
      invisible={outsideCurrentMonth || gameCount === undefined}>
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        disabled={gameCount === undefined}
      />
    </Badge>
  );
}

export default function CustomDateCalendar() {
  const { dateStr, daysToHighlight, calendarLoading, isQuickLink } =
    useSelector((state) => state.date);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dateurlstr } = useParams();

  /**
   * Arrow keys on calendar prop are clicked
   * @param {*} date
   * @returns
   */
  const handleMonthChange = (date) => {
    let newDateStr = dayjs(date).format("YYYY-MM-DD").toString();
    if (isQuickLink) {
      return;
    }
    dispatch(changeDateSelected(newDateStr));
    dispatch(fetchDaysToHighlight(newDateStr));
  };

  /**
   * Handles URL routing, and fetching the games when a new
   * day is selected
   */
  React.useEffect(() => {
    navigate("/date/" + dateStr);
    dispatch(fetchGamesByDate(dateStr));
    return;
  }, [dateStr]);

  /**
   * Handles Quick links, avoids redirection to the first of the
   * month
   */
  React.useEffect(() => {
    if (isQuickLink) {
      dispatch(fetchDaysToHighlight(dateurlstr));
      dispatch(changeDateSelected(dateurlstr));
    }
  }, [dateurlstr]);

  /**
   * Handles refresh and when a full url is pasted
   */
  React.useEffect(() => {
    if (dateurlstr !== dateStr) {
      dispatch(setQuickLink(true));
    }
    dispatch(fetchDaysToHighlight(dateurlstr));
    dispatch(changeDateSelected(dateurlstr));
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ justifyContent: "center" }}>
        <DateCalendar
          value={dayjs(dateStr)}
          loading={calendarLoading}
          onMonthChange={(date) => {
            handleMonthChange(date);
          }}
          minDate={dayjs("2014-10-28")}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              daysToHighlight,
            },
          }}
          // triggers when a new DAY is selected
          onChange={(newValue) => {
            let newDate = newValue.format("YYYY-MM-DD");
            dispatch(changeDateSelected(newDate));
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
