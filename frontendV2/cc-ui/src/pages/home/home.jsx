import {
  Avatar,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import allnba from "../../static/allnbateamSepia.gif";
// import playersGif from "../../static/playersGif.gif";
import lebron from "../../static/2544.png";
// import knicks from "../../static/knicks.svg";
import calendar from "../../static/calendarico.png";
import cc2 from "../../static/cc2.gif";
import "./home.css";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Container maxWidth='lg'>
        <Paper
          sx={{
            height: "12vh",
            width: "100%",
            background:
              `url(${cc2}?` +
              dayjs().format("mm:ss").toString() +
              ") no-repeat",
            backgroundPosition: "center",
          }}></Paper>
        <Paper sx={{ textAlign: "center", mt: 1 }}>
          <Typography variant='h5'>Search Types</Typography>
        </Paper>
        <Paper variant='outlined' width={"100%"}>
          <Grid container>
            <Grid item xs={4} textAlign={"center"}>
              <IconButton
                className='avatar-button'
                onClick={() => navigate("/teams")}>
                <Avatar
                  src={allnba}
                  sx={{
                    height: "125px",
                    width: "125px",
                  }}
                />
              </IconButton>
            </Grid>
            <Grid item xs={4} textAlign={"center"}>
              <IconButton
                className='avatar-button'
                onClick={() => navigate("/player/2544")}>
                <Avatar src={lebron} sx={{ height: "125px", width: "125px" }} />
              </IconButton>
            </Grid>
            <Grid item xs={4} textAlign={"center"}>
              <IconButton
                className='avatar-button'
                onClick={() =>
                  navigate("/date/" + dayjs().format("YYYY-MM-DD"))
                }>
                {/* <CalendarMonthIcon sx={{ height: "125px", width: "125px" }} /> */}
                <Avatar
                  src={calendar}
                  sx={{ height: "125px", width: "125px" }}
                />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>

        <Grid container>
          <Grid item xs={6}>
            S
          </Grid>
          <Grid item xs={6}>
            S
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
