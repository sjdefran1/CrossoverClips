import * as React from "react";

import { Avatar, Stack, Grid, Typography, Paper } from "@mui/material";

//const project = projects[0];
export default function GameDash(props) {
  return (
    <Paper sx={{ borderRadius: 2 }}>
      <br></br>
      <Grid container spacing={1}>
        {/* {props.game_link.date} */}
        <Grid item xs={4}>
          <Stack
            direction='column'
            spacing={0.5}
            sx={{ alignItems: "center", justifyContent: "center" }}>
            <Avatar
              src={
                "https://cdn.nba.com/logos/nba/" +
                props.game_link.away_info.TEAM_ID +
                "/primary/L/logo.svg"
              }
              sx={{ width: 100, height: 100 }}
            />
            <Typography variant='h6'>
              {props.game_link.away_info.TEAM_NAME.split(" ")[0]}
            </Typography>
            <Typography variant='h7' color='text.secondary'>
              {props.game_link.away_info.TEAM_NAME.split(" ")[1]}
            </Typography>
          </Stack>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{ alignItems: "center", justifyContent: "center" }}>
          <br></br>
          <br></br>
          <Stack
            direction='row'
            spacing={5}
            sx={{ alignItems: "center", justifyContent: "center" }}>
            <Typography variant='h4' sx={{}}>
              {props.game_link.away_info.PTS}
            </Typography>
            <Typography variant='h4'>-</Typography>
            <Typography variant='h4' sx={{}}>
              {props.game_link.home_info.PTS}
            </Typography>
          </Stack>
          <Stack
            direction='column'
            paddingTop
            sx={{ alignItems: "center", justifyContent: "center" }}>
            <Typography variant='body1' color='text.secondary'>
              Final
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {props.game_link.away_info.MATCHUP}
            </Typography>
            <Typography
              variant='subtitle2'
              fontSize={11}
              color='text.secondary'>
              {props.game_link.date}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack
            direction='column'
            spacing={0.5}
            sx={{ alignItems: "center", justifyContent: "center" }}>
            <Avatar
              src={
                "https://cdn.nba.com/logos/nba/" +
                props.game_link.home_info.TEAM_ID +
                "/primary/L/logo.svg"
              }
              sx={{ width: 100, height: 100 }}
            />
            <Typography variant='h6'>
              {props.game_link.home_info.TEAM_NAME.split(" ")[0]}
            </Typography>
            <Typography variant='h7' color='text.secondary'>
              {props.game_link.home_info.TEAM_NAME.split(" ")[1]}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <br></br>
    </Paper>
  );
}
