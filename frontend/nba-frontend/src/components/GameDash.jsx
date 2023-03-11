import * as React from "react";

import { Avatar, Stack, Grid, Typography, Paper } from "@mui/material";

//const project = projects[0];
export default function GameDash(props) {
  const [homeName, setHomeName] = React.useState("");
  const [homeCity, setHomeCity] = React.useState("");

  const [awayName, setAwayName] = React.useState("");
  const [awayCity, setAwayCity] = React.useState("");

  const handleNameLength = (isHome, name) => {
    let split = name.split(" ");

    //annoying blazers and their weird name!!
    if (split[0] === "Portland") {
      if (isHome) {
        setHomeCity(split[0]);
        setHomeName(split[1] + " " + split[2]);
        return;
      }
      setAwayCity(split[0]);
      setAwayName(split[1] + " " + split[2]);
      return;
    }

    // Cities that are two words
    if (split.length > 2 && isHome) {
      setHomeCity(split[0] + " " + split[1]);
      setHomeName(split[2]);
      return;
    }
    if (split.length > 2 && !isHome) {
      setAwayCity(split[0] + " " + split[1]);
      setAwayName(split[2]);
      return;
    }

    // One word Cities
    if (isHome) {
      setHomeCity(split[0]);
      setHomeName(split[1]);
      return;
    }

    setAwayCity(split[0]);
    setAwayName(split[1]);
    return;
  };

  React.useEffect(() => {
    handleNameLength(true, props.game_link.home_info.TEAM_NAME);
    handleNameLength(false, props.game_link.away_info.TEAM_NAME);
    //setHomeName(props.game_link.away_info.TEAM_NAME.split(" ")[0]);
    //setAwayName(props.game_link.away_info.TEAM_NAME.split(" ")[0]);
  }, []);
  return (
    <>
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
              <Typography variant='h6'>{awayCity}</Typography>
              <Typography variant='h7' color='text.secondary'>
                {awayName}
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
              <Typography variant='h6'>{homeCity}</Typography>
              <Typography variant='h7' color='text.secondary'>
                {homeName}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <br></br>
      </Paper>
    </>
  );
}
