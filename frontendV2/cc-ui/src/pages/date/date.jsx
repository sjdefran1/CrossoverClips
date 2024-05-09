import React from "react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import {
  Container,
  Box,
  Fade,
  LinearProgress,
  TextField,
  Paper,
  Grid,
} from "@mui/material";

import dayjs from "dayjs";
import "dayjs/locale/de";

import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { changeDateSelected } from "./dateSlice";
import { fetchGamesByDate } from "../../services/GameService";
import DateSelection from "./dateSelection";
import GameList from "../../components/GameList";
export default function Date() {
  const navigate = useNavigate();
  const { dateStr, loading, gameList } = useSelector((state) => state.date);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchGamesByDate(dateStr));
  }, [dateStr]);

  return (
    <>
      <Container maxWidth='xl' sx={{ minHeight: "70vh" }}>
        <Grid container mt={2} spacing={4}>
          <Grid item xs={12} md={7}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Fade in={true}>
                <Paper
                  variant='outlined'
                  sx={{ borderRadius: 4, overflow: "auto" }}>
                  {loading && (
                    <Box sx={{ width: "100%" }}>
                      {/* <CircularProgress /> */}
                      <LinearProgress color='success' />
                    </Box>
                  )}

                  <DateCalendar
                    value={dayjs(dateStr)}
                    minDate={dayjs("2014-10-28")}
                    maxDate={dayjs()}
                    onChange={(newValue) => {
                      let newDate = newValue.format("YYYY-MM-DD");
                      dispatch(changeDateSelected(newDate));
                      navigate("/date/" + newDate);
                    }}
                  />
                </Paper>
              </Fade>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={5}>
            <DateSelection />

            {!loading && (
              <Grid container>
                <GameList gameList={gameList} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
