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
  Typography,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";

//const project = projects[0];
export default function PlayerFilter(props) {
  const teamIDs = props.teamIDs;
  const [currTeamId, setCurrTeamId] = React.useState(teamIDs[0]);
  const [teamIndex, setTeamIndex] = React.useState(0);

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
                <p>{player[1]}</p>
              </>
            ))}
      </Paper>
    </>
  );
}
