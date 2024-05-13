import React from "react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import {
  Container,
  Box,
  Fade,
  LinearProgress,
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

import QuickLinks2 from "./dateQuickLinks2";

export default function Date() {
  const navigate = useNavigate();
  const { dateurlstr } = useParams();
  const { dateStr, loading, gameList } = useSelector((state) => state.date);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (dateurlstr !== dateStr) {
      console.log(dateurlstr);
      dispatch(changeDateSelected(dateurlstr));
      dispatch(fetchGamesByDate(dateurlstr));
      return;
    }
    dispatch(fetchGamesByDate(dateStr));
  }, [dateStr, dateurlstr]);

  return (
    <>
      <Container maxWidth='xl' sx={{ minHeight: "70vh" }}>
        <Grid container mt={2} spacing={4}>
          <Grid item xs={12} md={7}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Fade in={true}>
                <Paper variant='outlined' sx={{ borderRadius: "0 0 6 6" }}>
                  {loading && (
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress color='success' />
                    </Box>
                  )}
                  <Grid container>
                    <Grid item md={6}>
                      <QuickLinks2 />
                    </Grid>

                    <Grid item md={6}>
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
                    </Grid>
                  </Grid>
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
