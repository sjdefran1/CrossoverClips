import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Avatar } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function GameList2(props) {
  //console.log(props.gameList);
  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <nav aria-label='games'>
        <Stack spacing={1}>
          {props.gameList.map((game) => (
            <>
              <Paper
                variant='outlined'
                sx={{
                  "&:hover": {
                    backgroundColor: "#696666",
                  },
                }}>
                <Stack
                  direction='row'
                  spacing={1}
                  sx={{ justifyContent: "center" }}>
                  <Avatar
                    src={
                      "https://cdn.nba.com/logos/nba/" +
                      game.awayTeamID +
                      "/primary/L/logo.svg"
                    }></Avatar>
                  <Stack
                    direction='column'
                    sx={{ textAlign: "center", fontFamily: "Roboto" }}>
                    <Typography variant='h6'>{game.matchup}</Typography>
                    <Typography>{game.score}</Typography>
                  </Stack>

                  <Avatar
                    src={
                      "https://cdn.nba.com/logos/nba/" +
                      game.homeTeamID +
                      "/primary/L/logo.svg"
                    }></Avatar>
                </Stack>
              </Paper>
            </>
          ))}
        </Stack>
      </nav>
      <Divider />
    </Box>
  );
}
