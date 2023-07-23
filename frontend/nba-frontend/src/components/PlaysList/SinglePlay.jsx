import * as React from "react";
import {
  Fade,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Avatar,
  Divider,
  Link,
  ListItemText,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import PlaySecondary from "./PlaySecondary";
import { reqString } from "../../App";

import axios from "axios";
import fileDownload from "js-file-download";

//const project = projects[0];
export default function SinglePlay(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleDownload = (givenUrl) => {
    // let fileName = givenUrl.split("/")[11];
    let data = {
      url: givenUrl,
    };
    setIsLoading(true);
    axios
      .post(reqString + "downloadClip", data, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, props.play.description + ".mp4");
        setIsLoading(false);
      });

    let update = {
      url: props.play.url,
      ptype: props.currentStatType,
    };
    axios.post(reqString + "players/updatePlayDownloadCount", update);
    axios.post(reqString + "players/updatePlayViewCount", update);
  };

  const handleView = () => {
    let update = {
      url: props.play.url,
      ptype: props.currentStatType,
    };
    axios.post(reqString + "players/updatePlayViewCount", update);
  };

  return (
    <>
      <Divider />

      <Fade in={true}>
        <Stack sx={{ justifyContent: "center" }}>
          {/* {console.log(props.play.url.split("/")[11])} */}
          <Link
            target='_blank'
            rel='noreferrer'
            href={props.play.url}
            onClick={() => handleView()}
            sx={{
              textDecoration: "none",
            }}>
            <List>
              {/* user clicked download button, run untill req returns */}
              {isLoading && (
                <LinearProgress variant='indeterminate' color='success' />
              )}

              {/* Single Play UI */}
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
          {/* <Divider /> */}

          {/* <Divider /> */}
          <Button
            color='info'
            size='small'
            sx={{ justifyContent: "center" }}
            onClick={() => {
              handleDownload(props.play.url, props.play.url.split("/")[11]);
            }}>
            Download
          </Button>
        </Stack>
      </Fade>
    </>
  );
}
