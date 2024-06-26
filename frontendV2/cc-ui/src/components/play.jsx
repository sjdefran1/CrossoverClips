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
  Typography,
} from "@mui/material";

import PlaySecondary from "./playSecondary";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { handlePlayDownload, handlePlayView } from "../services/PlayService";
import { incrementDownloadCount } from "../pages/players/playerSlice";
import { useDispatch } from "react-redux";
import DownloadButton from "./downloadButton";

//const project = projects[0];
export default function Play(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();

  const handleDownload = async (givenUrl) => {
    setIsLoading(true);
    // dispatch(
    //   incrementDownloadCount({ url: givenUrl, ptype: props.play.ptype })
    // ); // need better solution because this is used in both game and player states
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
                        {/* <Chip
                          size='small'
                          variant='outlined'
                          icon={<FileDownloadIcon color='info' />}
                          label={props.play.downloads}
                          sx={{
                            display:
                              props.play?.downloads !== undefined ? "" : "none",
                          }}
                        /> */}
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
                    primary={
                      <Typography component={"div"}>
                        {props.play.description}
                      </Typography>
                    }
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

          {/* <Button
            color='info'
            size='small'
            sx={{ justifyContent: "center" }}
            onClick={() => {
              handleDownload(props.play.url);
            }}>
            Download
          </Button> */}
          <DownloadButton
            url={props.play.url}
            filename={`Q${props.play.quarter}_m${props.play.time.replace(
              ":",
              "-s"
            )}_${props.play.description}.mp4`}
          />
        </Stack>
      </Fade>
    </>
  );
}
