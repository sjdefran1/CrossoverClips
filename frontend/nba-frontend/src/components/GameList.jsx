import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Avatar } from "@mui/material";

export default function GameList(props) {
  //console.log(props.gameList);
  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <nav aria-label='games'>
        <List>
          {props.gameList.map((game) => (
            <>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Avatar
                      src={
                        "https://cdn.nba.com/logos/nba/" +
                        game.awayTeamID +
                        "/primary/L/logo.svg"
                      }></Avatar>
                  </ListItemIcon>
                  <ListItemText primary={game.matchup} secondary={game.score} />
                  <ListItemIcon>
                    <Avatar
                      src={
                        "https://cdn.nba.com/logos/nba/" +
                        game.homeTeamID +
                        "/primary/L/logo.svg"
                      }></Avatar>
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            </>
          ))}
        </List>
      </nav>
      <Divider />
    </Box>
  );
}
