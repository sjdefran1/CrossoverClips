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
import playersGif from "../../static/playersGif.gif";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Container maxWidth='lg'>
        <Paper sx={{ textAlign: "center", mt: 1 }}>
          <Typography variant='h5'>Search Types</Typography>
        </Paper>
        <Paper variant='outlined' width={"100%"}>
          <Grid container>
            <Grid item xs={4} textAlign={"center"}>
              <IconButton onClick={() => navigate("/teams")}>
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
              <IconButton onClick={() => navigate("/player/2544")}>
                <Avatar
                  src={playersGif}
                  sx={{ height: "125px", width: "125px" }}
                />
              </IconButton>
            </Grid>
            <Grid item xs={4} textAlign={"center"}>
              <IconButton
                onClick={() =>
                  navigate("/date/" + dayjs().format("YYYY-MM-DD"))
                }>
                <CalendarMonthIcon sx={{ height: "125px", width: "125px" }} />
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
