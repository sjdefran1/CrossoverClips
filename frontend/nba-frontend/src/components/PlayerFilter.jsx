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
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import StatFilters from "./StatFilters.jsx";

//const project = projects[0];
export default function PlayerFilter(props) {
  const teamIDs = props.teamIDs;

  const [selectedPlayers, setSelectedPlayers] = React.useState([]);
  const [statFilterFrom, setStatFilterFrom] = React.useState("FGM");

  const handlePlayerSelect = (playerId) => {
    // if (selectedPlayers.includes(playerId)) {
    //   return;
    // }
    if (selectedPlayers.includes(playerId[0])) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId[0]));
    } else {
      setSelectedPlayers(selectedPlayers.concat(playerId[0]));
    }
    //props.setPlayerFilter(selectedPlayers);
  };

  const handleSave = () => {
    props.setPlayerFilter(selectedPlayers);
    props.getStatFilter(statFilterFrom);
  };

  const clearPlayers = () => {
    setSelectedPlayers([]);
    props.setPlayerFilter([]);
  };

  const getStatFilter = (filter) => {
    setStatFilterFrom(filter);
    //props.getStatFilter(filter);
  };

  return (
    <>
      <br></br>

      <Box sx={{ maxHeight: "50vh", overflow: "auto" }}>
        <Paper>
          <AppBar position='static' sx={{ borderRadius: 1 }}>
            <Toolbar sx={{ justifyContent: "center" }}>
              <Stack direction='row' spacing={20}>
                <Avatar
                  src={
                    "https://cdn.nba.com/logos/nba/" +
                    teamIDs[0] +
                    "/primary/L/logo.svg"
                  }
                />

                <Avatar
                  src={
                    "https://cdn.nba.com/logos/nba/" +
                    teamIDs[1] +
                    "/primary/L/logo.svg"
                  }
                />
              </Stack>
            </Toolbar>
          </AppBar>
          <Container>
            <Grid container>
              <Grid item xs={6}>
                <Stack
                  direction='column'
                  spacing={1}
                  sx={{
                    justifyContent: "center",
                  }}>
                  {props.players &&
                    props.players
                      .filter((player) => player[0] === teamIDs[0])
                      .map((player) => (
                        <React.Fragment key={player[2]}>
                          <Fade in={true}>
                            <Stack direction='row'>
                              <Avatar
                                src={
                                  "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
                                  player[2] +
                                  ".png"
                                }
                                sx={{ width: 40, height: 40, ml: 1 }}
                              />
                              <FormControlLabel
                                key={player[2]}
                                label={player[1]}
                                sx={{ ml: 1 }}
                                control={
                                  <Checkbox
                                    icon={<CircleOutlinedIcon />}
                                    checkedIcon={<CircleIcon color='success' />}
                                    checked={selectedPlayers.includes(
                                      player[2]
                                    )}
                                    onChange={() =>
                                      handlePlayerSelect([player[2]])
                                    }
                                  />
                                }
                              />
                            </Stack>
                          </Fade>
                        </React.Fragment>
                      ))}
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack
                  direction='column'
                  spacing={1}
                  sx={{
                    justifyContent: "center",
                  }}>
                  {props.players &&
                    props.players
                      .filter((player) => player[0] === teamIDs[1])
                      .map((player) => (
                        <React.Fragment key={player[2]}>
                          <Fade in={true}>
                            <Stack direction='row'>
                              <Avatar
                                src={
                                  "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
                                  player[2] +
                                  ".png"
                                }
                                sx={{ width: 40, height: 40, ml: 1 }}
                              />
                              <FormControlLabel
                                key={player[2]}
                                label={player[1]}
                                sx={{ ml: 1 }}
                                control={
                                  <Checkbox
                                    icon={<CircleOutlinedIcon />}
                                    checkedIcon={<CircleIcon color='success' />}
                                    checked={selectedPlayers.includes(
                                      player[2]
                                    )}
                                    onChange={() =>
                                      handlePlayerSelect([player[2]])
                                    }
                                  />
                                }
                              />
                            </Stack>
                          </Fade>
                        </React.Fragment>
                      ))}
                </Stack>
              </Grid>
            </Grid>
          </Container>

          <br></br>
        </Paper>
      </Box>
      <Stack
        direction='row'
        spacing={1}
        paddingBottom
        sx={{ justifyContent: "center", mt: 1 }}>
        <StatFilters updateFilter={getStatFilter} />
        <Button
          size='small'
          variant='outlined'
          color='success'
          onClick={handleSave}
          sx={{}}>
          Save
        </Button>
        <Button
          variant='outlined'
          color='success'
          size='small'
          onClick={clearPlayers}
          sx={{}}>
          Clear Players
        </Button>
      </Stack>
    </>
  );
}
