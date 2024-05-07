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
  Chip,
  Link,
  ListItemText,
  Button,
  LinearProgress,
} from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";

import PlaySecondary from "./playSecondary";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { handlePlayDownload, handlePlayView } from "../services/PlayService";

//const project = projects[0];
export default function Play(props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDownload = async (givenUrl) => {
    setIsLoading(true);
    try {
      await handlePlayDownload({
        playUrl: givenUrl,
        play: props.play,
      });
    } catch (error) {
      console.error("Error downloading:", error);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Divider />
      <Fade in={true}>
        <Stack sx={{ justifyContent: "center" }}>
          {/* Believe this is for players dahsboard, would rather wrap this over there */}
          {/* {props?.playShowingIndex !== undefined &&
            props?.index === props.playShowingIndex && (
              <Grow in={true}>
                <Paper
                  variant='outlined'
                  sx={{
                    borderColor: "#90caf9",
                    padding: 1,
                    mt: 1,
                  }}>
                  <Stack
                    direction={"row"}
                    spacing={1}
                    justifyContent={"center"}
                    alignItems={"center"}>
                    <VisibilityIcon sx={{ color: "#90caf9" }} />
                    <Typography variant='subtitle2' color={"#90caf9"}>
                      Currently Viewing
                    </Typography>
                  </Stack>
                </Paper>
              </Grow>
            )} */}

          <Link
            target='_blank'
            rel='noreferrer'
            href={props.play.url}
            onClick={() => handlePlayView(props.play)}
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
                  <ListItemIcon>
                    <Stack direction={"column"} alignItems={"center"}>
                      <Avatar
                        src={
                          "https://cdn.nba.com/logos/nba/" +
                          props.play.teamID +
                          "/primary/L/logo.svg"
                        }
                        sx={{ width: 56, height: 56 }}
                      />
                      <Stack
                        direction={"column"}
                        spacing={0.5}
                        sx={{
                          alignItems: "center",
                        }}>
                        <Chip
                          size='small'
                          variant='outlined'
                          icon={<FileDownloadIcon color='info' />}
                          label={props.play.downloads}
                          sx={{
                            display:
                              props.play?.downloads !== undefined ? "" : "none",
                          }}
                        />
                        <Chip
                          size='small'
                          color='info'
                          variant='outlined'
                          icon={<VisibilityIcon color='info' />}
                          label={props.play.views}
                          sx={{
                            display:
                              props.play?.views !== undefined ? "" : "none",
                          }}
                        />
                      </Stack>
                    </Stack>
                  </ListItemIcon>

                  <ListItemText
                    primary={props.play.description}
                    secondary={
                      <PlaySecondary
                        meta={{
                          score: props.play.scoreAway,
                          time: props.play.time,
                          homeTeamId: props.team_ids[0],
                          awayTeamId: props.team_ids[1],
                          quarter: props.play.quarter,
                        }}
                      />
                    }
                    sx={{ textAlign: "center" }}
                  />

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
                </ListItemButton>
              </ListItem>
            </List>
          </Link>

          <Button
            color='info'
            size='small'
            sx={{ justifyContent: "center" }}
            onClick={() => {
              handleDownload(props.play.url);
            }}>
            Download
          </Button>
        </Stack>
      </Fade>
    </>
  );
}
