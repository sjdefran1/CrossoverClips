import * as React from "react";
import {
  Avatar,
  Stack,
  Box,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Button,
  Fade,
  IconButton,
  Paper,
  Hidden,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearPlayerFilter, handleTeamSelect } from "./gameSlice.js";
import PlayerOptionList from "./playerOptionList.jsx";

//const project = projects[0];
export default function PlayerFilter(props) {
  const dispatch = useDispatch();
  //   const [selectedPlayers, setSelectedPlayers] = React.useState(
  //     props.currentFilterPlayers
  //   );

  const allPlayers = useSelector((state) => state.game.allPlayersInGame);
  const teamIDs = [
    useSelector((state) => state.game.homeTeam.TEAM_ID),
    useSelector((state) => state.game.awayTeam.TEAM_ID),
  ];

  return (
    <>
      <Paper sx={{ width: "100%" }}>
        <Box
          sx={{
            maxHeight: "50vh",
            overflowY: "auto",
            overflowX: "clip",
            maxWidth: "100%",
          }}>
          <AppBar position='static' sx={{ borderRadius: 1, minWidth: "100%" }}>
            <Hidden mdDown>
              <Toolbar sx={{ justifyContent: "center" }}>
                {/* Team Logos Desktop View */}
                <Grid container textAlign={"center"}>
                  <Grid item xs={6}>
                    <IconButton
                      onClick={() => dispatch(handleTeamSelect(teamIDs[0]))}>
                      <Avatar
                        src={
                          "https://cdn.nba.com/logos/nba/" +
                          teamIDs[0] +
                          "/primary/L/logo.svg"
                        }
                      />
                    </IconButton>
                  </Grid>
                  <Grid item xs={6}>
                    <IconButton
                      onClick={() => dispatch(handleTeamSelect(teamIDs[1]))}>
                      <Avatar
                        src={
                          "https://cdn.nba.com/logos/nba/" +
                          teamIDs[1] +
                          "/primary/L/logo.svg"
                        }
                      />
                    </IconButton>
                  </Grid>
                </Grid>
              </Toolbar>
            </Hidden>
          </AppBar>

          {/* Filter Starts */}
          <Container>
            <Grid container>
              <Grid item xs={12} md={6}>
                {/* First Logo for mobile view */}
                <Hidden mdUp>
                  <Divider sx={{}} />
                  <Box mx={"35%"}>
                    <IconButton
                      onClick={() => dispatch(handleTeamSelect(teamIDs[0]))}>
                      <Avatar
                        src={
                          "https://cdn.nba.com/logos/nba/" +
                          teamIDs[0] +
                          "/primary/L/logo.svg"
                        }
                      />
                    </IconButton>
                  </Box>

                  <Divider sx={{ mb: 1 }} />
                </Hidden>
                <Stack
                  direction='column'
                  spacing={1}
                  sx={{
                    justifyContent: "center",
                  }}>
                  {/* First team mapping */}
                  {allPlayers
                    .filter((player) => player[0] === teamIDs[0])
                    .map((player) => (
                      <React.Fragment key={player[2]}>
                        <Fade in={true}>
                          <div>
                            <PlayerOptionList player={player} />
                          </div>
                        </Fade>
                      </React.Fragment>
                    ))}
                </Stack>
              </Grid>

              {/* Second Team Mapping, and second logo for mobile */}
              <Grid item xs={12} md={6}>
                <Hidden mdUp>
                  <Divider sx={{ mt: 1 }} />
                  <Box mx={"35%"}>
                    <IconButton
                      onClick={() => dispatch(handleTeamSelect(teamIDs[1]))}
                      sx={{ justifyContent: "center" }}>
                      <Avatar
                        src={
                          "https://cdn.nba.com/logos/nba/" +
                          teamIDs[1] +
                          "/primary/L/logo.svg"
                        }
                      />
                    </IconButton>
                  </Box>

                  <Divider sx={{ mb: 1 }} />
                </Hidden>
                <Stack
                  direction='column'
                  spacing={1}
                  sx={{
                    justifyContent: "center",
                    overflowWrap: "anywhere",
                    // textAlign: "",
                  }}>
                  {allPlayers
                    .filter((player) => player[0] === teamIDs[1])
                    .map((player) => (
                      <React.Fragment key={player[2]}>
                        <Fade in={true}>
                          <div>
                            <PlayerOptionList player={player} />
                          </div>
                        </Fade>
                      </React.Fragment>
                    ))}
                </Stack>
              </Grid>
            </Grid>
          </Container>

          <br></br>
        </Box>
        <Stack
          direction='row'
          spacing={1}
          paddingBottom
          sx={{ justifyContent: "center", mt: 1 }}>
          <Button
            variant='outlined'
            color='success'
            size='small'
            onClick={() => dispatch(clearPlayerFilter())}
            sx={{}}>
            Clear Players
          </Button>
        </Stack>
      </Paper>
    </>
  );
}
