import * as React from "react";
import {
  Fade,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Avatar,
  Menu,
  Button,
  MenuItem,
  Divider,
  Link,
  ListItemText,
} from "@mui/material";
import PlaySecondary from "./PlaySecondary";

//const project = projects[0];
export default function SinglePlay(props) {
  return (
    <>
      <Fade in={true}>
        <Stack sx={{ justifyContent: "center" }}>
          <Link
            target='_blank'
            rel='noreferrer'
            href={props.play.url}
            sx={{ textDecoration: "none" }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  {props.players_length > 0 && (
                    <ListItemIcon>
                      <Avatar
                        src={
                          "https://cdn.nba.com/logos/nba/" +
                          props.play.teamID +
                          "/primary/L/logo.svg"
                        }
                        sx={{ width: 56, height: 56 }}
                      />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={props.play.description}
                    // secondary={
                    //   "Home " +
                    //   props.play.scoreHome +
                    //   "-" +
                    //   props.play.scoreAway +
                    //   " Away " +
                    //   props.play.time
                    // }
                    secondary={
                      <PlaySecondary
                        stuff={[
                          props.play.scoreHome,
                          props.play.scoreAway,
                          props.play.time,
                          props.team_ids[0],
                          props.team_ids[1],
                          // props.playByPlay.team_ids[0],
                          // props.playByPlay.team_ids[1],
                        ]}
                      />
                    }
                    sx={{ textAlign: "center" }}
                  />
                  {props.players_length > 0 && (
                    <ListItemIcon>
                      <Avatar
                        src={
                          "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
                          props.play.playerID +
                          ".png"
                        }
                        sx={{ width: 56, height: 56 }}
                      />
                    </ListItemIcon>
                  )}
                </ListItemButton>
                {/* {showHighlightPreview && (
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}>
                  <MenuItem>
                    <video preload='metadata' width='624' height='480' controls>
                      <source src={props.play.url} type='video/mp4' />
                      Your browser does not support the video tag.
                    </video>
                  </MenuItem>
                </Menu>
              )} */}
              </ListItem>
            </List>
          </Link>
          {/* {showHighlightPreview && (
          <Button
            size='small'
            color='success'
            variant='outlined'
            onClick={handleClick}
            sx={{ mx: "auto", mb: 1 }}>
            View Highlight Preview
          </Button>
        )} */}
          <Divider />
        </Stack>
      </Fade>
    </>
  );
}
