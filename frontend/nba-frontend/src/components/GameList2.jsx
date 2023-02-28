import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Avatar, Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

//import Link from "@mui/material/Link";
import { Link, Outlet } from "react-router-dom";

export default function GameList2(props) {
  //console.log(props.gameList);
  const myStyle = {
    textDecoration: "none",
  };
  return (
    <>
      {/* <Stack direction='column' sx={{ maxHeight: "70vh", overflow: "auto" }}> */}
      {props.gameList.map((game) => (
        <Grid item xs={6}>
          <Box sx={{}}>
            <a
              href={"/games/" + props.date + "/" + game.gameID}
              style={myStyle}>
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
                      game.awayTeamID +
                      "/primary/L/logo.svg"
                    }></Avatar>
                  <Stack
                    direction='column'
                    sx={{ textAlign: "center", fontFamily: "Roboto" }}>
                    <Typography variant='body1'>{game.matchup}</Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {game.score}
                    </Typography>
                  </Stack>

                  <Avatar
                    sx={{ width: 50, height: 50 }}
                    src={
                      "https://cdn.nba.com/logos/nba/" +
                      game.homeTeamID +
                      "/primary/L/logo.svg"
                    }></Avatar>
                </Stack>
              </Paper>
            </a>
          </Box>
        </Grid>
      ))}
      {/* </Stack> */}

      {/* <Routes>
        <Route exact path='/game'>
          <Typography>Hello</Typography>
        </Route>
      </Routes> */}
    </>
  );
}
