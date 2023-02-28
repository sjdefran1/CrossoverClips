import * as React from "react";
import {
  Avatar,
  Stack,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  ListItemButton,
  Link,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import StatFilter from "./StatFilters";

//const project = projects[0];
export default function PlayerFilter(props) {
  const teamIDs = props.teamIDs;
  const [currTeamId, setCurrTeamId] = React.useState(teamIDs[0]);
  const [teamIndex, setTeamIndex] = React.useState(0);
  const [selectedPlayers, setSelectedPlayers] = React.useState([]);
  const [statFilterFrom, setStatFilterFrom] = React.useState("FGM");

  const handleTeamChange = React.useCallback(
    (val) => {
      if (teamIndex === 0 && val === 0) return;
      if (teamIndex === 1 && val === 1) return;

      if (teamIndex === 0) {
        setCurrTeamId(teamIDs[1]);
        setTeamIndex(1);
      } else {
        setCurrTeamId(teamIDs[0]);
        setTeamIndex(0);
      }
      console.log(teamIndex);
    },
    [teamIndex]
  );

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
                <IconButton onClick={() => handleTeamChange(0)}>
                  <Avatar
                    src={
                      "https://cdn.nba.com/logos/nba/" +
                      teamIDs[0] +
                      "/primary/L/logo.svg"
                    }
                  />
                </IconButton>

                <IconButton onClick={() => handleTeamChange(1)}>
                  <Avatar
                    src={
                      "https://cdn.nba.com/logos/nba/" +
                      teamIDs[1] +
                      "/primary/L/logo.svg"
                    }
                  />
                </IconButton>
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
                        <>
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
                                  checked={selectedPlayers.includes(player[2])}
                                  onChange={() =>
                                    handlePlayerSelect([player[2]])
                                  }
                                />
                              }
                            />
                          </Stack>
                        </>
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
                        <>
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
                                  checked={selectedPlayers.includes(player[2])}
                                  onChange={() =>
                                    handlePlayerSelect([player[2]])
                                  }
                                />
                              }
                            />
                          </Stack>
                        </>
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
        <StatFilter updateFilter={getStatFilter} />
        <Button variant='outlined' color='success' onClick={handleSave} sx={{}}>
          Save
        </Button>
        <Button
          variant='outlined'
          color='success'
          onClick={clearPlayers}
          sx={{}}>
          Clear Players
        </Button>
      </Stack>
    </>
  );
}
