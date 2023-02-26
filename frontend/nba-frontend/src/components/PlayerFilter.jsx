import * as React from "react";
import {
  Avatar,
  Stack,
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

//const project = projects[0];
export default function PlayerFilter(props) {
  const teamIDs = props.teamIDs;
  const [currTeamId, setCurrTeamId] = React.useState(teamIDs[0]);
  const [teamIndex, setTeamIndex] = React.useState(0);
  const [selectedPlayers, setSelectedPlayers] = React.useState([]);

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
  };

  return (
    <>
      <br></br>

      <Paper>
        <AppBar position='static' sx={{ borderRadius: 1 }}>
          <Toolbar sx={{ justifyContent: "center" }}>
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
            <IconButton onClick={handleTeamChange}></IconButton>
          </Toolbar>
        </AppBar>
        {props.players &&
          props.players
            .filter((player) => player[0] === currTeamId)
            .map((player) => (
              <>
                <FormControlLabel
                  key={player[2]}
                  label={player[1]}
                  control={
                    <Checkbox
                      checked={selectedPlayers.includes(player[2])}
                      onChange={() => handlePlayerSelect([player[2]])}
                    />
                  }
                />
              </>
            ))}
        <Button onClick={handleSave}>Save</Button>
        <br></br>

        {/* {selectedPlayers.map((player) => (
          <>
            <p>{player}</p>
          </>
        ))} */}
      </Paper>
    </>
  );
}
