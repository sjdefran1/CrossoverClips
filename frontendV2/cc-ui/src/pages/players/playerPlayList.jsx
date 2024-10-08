import * as React from "react";

import Play from "../../components/play";
import {
  Alert,
  Hidden,
  Button,
  Grow,
  Collapse,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPlayIndex } from "./playerSlice";
import { handlePlayView } from "../../services/PlayService";

//const project = projects[0];
export default function PlayersPlayList(props) {
  const navigate = useNavigate();
  const [alertShowing, setAlertShowing] = React.useState(true);
  const { currentPagePlays, playIndex } = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const linkToNeedHelp = () => {
    navigate("/downloadHelp");
  };
  // const handleView = (url, ptype) => {
  //   let update = {
  //     url: url,
  //     ptype: ptype,
  //   };
  //   axios.post(reqString + "players/updatePlayViewCount", update);
  // };
  return (
    <>
      <Collapse in={alertShowing}>
        <Hidden smDown>
          <Alert
            severity='info'
            onClose={() => setAlertShowing(false)}
            sx={{ justifyContent: "center" }}>
            Click the blue download button to directly save to your device,
            having issues?
            <Button
              onClick={() => linkToNeedHelp()}
              size='small'
              color='success'>
              Get Help
            </Button>
          </Alert>
        </Hidden>
      </Collapse>

      {currentPagePlays &&
        currentPagePlays.map((play, index) => (
          <React.Fragment key={play.playid}>
            <nav aria-label='playbyplay'>
              {/* Currently Viewing Label */}
              {index === playIndex && (
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
              )}

              {/* Play Render */}
              <Play
                index={index}
                playShowingIndex={playIndex}
                playInVideoPlayer={currentPagePlays[playIndex]}
                play={play}
                team_ids={[play.htid, play.atid]}
                players_length={1}
              />
            </nav>

            {/* Showing/Show in Player */}
            <Button
              sx={{ width: "100%" }}
              size='small'
              disabled={index === playIndex}
              onClick={() => {
                handlePlayView(play);
                dispatch(setPlayIndex(index));
              }}>
              {index === playIndex ? "Showing" : "Show in Player"}
            </Button>
          </React.Fragment>
        ))}
    </>
  );
}
