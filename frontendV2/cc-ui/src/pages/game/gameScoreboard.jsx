import * as React from "react";

import {
  Avatar,
  Stack,
  Grid,
  Typography,
  Paper,
  Hidden,
  Fade,
} from "@mui/material";
import { useSelector } from "react-redux";

export default function ScoreBoard(props) {
  const homeTeam = useSelector((state) => state.game.homeTeam);
  const awayTeam = useSelector((state) => state.game.awayTeam);
  const date = useSelector((state) => state.game.dateStr);
  const [homeName, setHomeName] = React.useState("");
  const [homeCity, setHomeCity] = React.useState("");

  const [awayName, setAwayName] = React.useState("");
  const [awayCity, setAwayCity] = React.useState("");
  const containerRef = React.useRef(null);
  const handleNameLength = (name) => {
    let split = name.split(" ");
    //annoying blazers and their weird name!!
    if (split[0] === "Portland") {
      return [split[0], split[1] + " " + split[2]];
    }
    // Cities that are two words
    if (split.length > 2) {
      return [split[0] + " " + split[1], split[2]];
    }
    // One word Cities
    return [split[0], split[1]];
  };

  React.useEffect(() => {
    // set home name and city

    let result = handleNameLength(homeTeam.TEAM_NAME);
    setHomeCity(result[0]);
    setHomeName(result[1]);

    // set away name and city
    result = handleNameLength(awayTeam.TEAM_NAME);
    setAwayCity(result[0]);
    setAwayName(result[1]);
  }, []);

  return (
    <>
      <Paper sx={{ borderRadius: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Stack
              direction='column'
              spacing={0.5}
              ref={containerRef}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}>
              <Fade in={true} timeout={500}>
                <Avatar
                  src={
                    "https://cdn.nba.com/logos/nba/" +
                    awayTeam.TEAM_ID +
                    "/primary/L/logo.svg"
                  }
                  sx={{
                    width: { xs: 70, md: 100 },
                    height: { xs: 70, md: 100 },
                  }}
                />
              </Fade>
              <Hidden mdDown>
                <Typography variant='h6'>{awayCity}</Typography>
                <Typography variant='h7' color='text.secondary'>
                  {awayName}{" "}
                </Typography>
              </Hidden>

              <Hidden mdUp>
                <Typography variant='body1'>{awayCity}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  {awayName}
                </Typography>
              </Hidden>
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
              spacing={{ xs: 1, md: 5 }}
              sx={{ alignItems: "center", justifyContent: "center" }}>
              <Hidden mdDown>
                <Typography variant='h4' sx={{}}>
                  {awayTeam.PTS}
                </Typography>
                <Typography variant='h4'>-</Typography>
                <Typography variant='h4' sx={{}}>
                  {homeTeam.PTS}
                </Typography>
              </Hidden>

              <Hidden mdUp>
                <Typography variant='h5' sx={{}}>
                  {awayTeam.PTS}
                </Typography>
                <Typography variant='h4'>-</Typography>
                <Typography variant='h5' sx={{}}>
                  {homeTeam.PTS}
                </Typography>
              </Hidden>
            </Stack>
            <Stack
              direction='column'
              paddingTop
              sx={{ alignItems: "center", justifyContent: "center" }}>
              <Typography variant='body1' color='text.secondary'>
                Final
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {awayTeam.MATCHUP}
              </Typography>
              <Typography
                variant='subtitle2'
                fontSize={11}
                color='text.secondary'>
                {date}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack
              direction='column'
              spacing={0.5}
              ref={containerRef}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}>
              <Fade
                in={true}
                // direction='left'
                timeout={500}
                // ref={containerRef.current}
              >
                <Avatar
                  src={
                    "https://cdn.nba.com/logos/nba/" +
                    homeTeam.TEAM_ID +
                    "/primary/L/logo.svg"
                  }
                  sx={{
                    width: { xs: 70, md: 100 },
                    height: { xs: 70, md: 100 },
                  }}
                />
              </Fade>
              <Hidden mdDown>
                <Typography variant='h6'>{homeCity}</Typography>
                <Typography variant='h7' color='text.secondary'>
                  {homeName}
                </Typography>
              </Hidden>

              <Hidden mdUp>
                <Typography variant='body1'>{homeCity}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  {homeName}
                </Typography>
              </Hidden>
            </Stack>
          </Grid>
        </Grid>
        <br></br>
      </Paper>
    </>
  );
}
