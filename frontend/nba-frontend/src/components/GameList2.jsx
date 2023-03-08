import * as React from "react";
import Box from "@mui/material/Box";
import { Avatar, Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";

//import Link from "@mui/material/Link";
import { Link } from "react-router-dom";

export default function GameList2(props) {
  return (
    <>
      {/* <Stack direction='column' sx={{ maxHeight: "70vh", overflow: "auto" }}> */}
      {props.gameList.map((game) => (
        <Grid item xs={6}>
          <Box sx={{}}>
            <Link
              to={"/games/" + props.date + "/" + game.game_id}
              state={{ game_link: game }}
              style={{ textDecoration: "none" }}>
              <Fade in={true}>
                <Paper
                  variant='outlined'
                  sx={{
                    "&:hover": {
                      backgroundColor: "#ffffff14",
                    },
                    borderRadius: 2,
                    padding: 0.5,
                  }}>
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{ justifyContent: "center" }}>
                    <Avatar
                      sx={{ width: 50, height: 50 }}
                      src={
                        "https://cdn.nba.com/logos/nba/" +
                        game.away_info.TEAM_ID +
                        "/primary/L/logo.svg"
                      }></Avatar>
                    <Stack
                      direction='column'
                      sx={{ textAlign: "center", fontFamily: "Roboto" }}>
                      <Typography variant='body1'>
                        {game.away_info.MATCHUP}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {game.away_info.PTS} - {game.home_info.PTS}
                      </Typography>
                    </Stack>

                    <Avatar
                      sx={{ width: 50, height: 50 }}
                      src={
                        "https://cdn.nba.com/logos/nba/" +
                        game.home_info.TEAM_ID +
                        "/primary/L/logo.svg"
                      }></Avatar>
                  </Stack>
                </Paper>
              </Fade>
            </Link>
          </Box>
        </Grid>
      ))}
      {/* </Stack> */}
      {/* <Routes>
        <Route
          exact
          path='/games/:date/:id'
          element={<GameDetails game={"hello"} />}
        />
      </Routes> */}
      {/* <Routes>
        <Route exact path='/game'>
          <Typography>Hello</Typography>
        </Route>
      </Routes> */}
    </>
  );
}
