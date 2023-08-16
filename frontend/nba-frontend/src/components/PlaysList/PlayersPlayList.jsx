import * as React from "react";
import axios from "axios";
import NoHighlights from "./NoHighlights";
import SinglePlay from "./SinglePlay";
import { Alert, Hidden, Button, Grow, Collapse, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { reqString } from "../../App";

//const project = projects[0];
export default function PlayersPlayList(props) {
  const navigate = useNavigate();
  const [alertShowing, setAlertShowing] = React.useState(true);

  const linkToNeedHelp = () => {
    navigate("/downloadHelp");
  };
  const handleView = (url, ptype) => {
    let update = {
      url: url,
      ptype: ptype,
    };
    axios.post(reqString + "players/updatePlayViewCount", update);
  };
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

      {props?.playByPlay &&
        props?.playByPlay?.plays?.map((play) => play).length === 0 && (
          <NoHighlights isPlay={true} />
        )}
      {props?.playByPlay &&
        props?.playByPlay?.plays?.map((play, index) => (
          <React.Fragment key={play.playid}>
            <nav aria-label='playbyplay'>
              <SinglePlay
                index={index}
                playShowingIndex={props.playIndex}
                playInVideoPlayer={props.playInVideoPlayer}
                play={play}
                currentStatType={props.currentStatType}
                team_ids={[play.htid, play.atid]}
                players_length={1}
              />
            </nav>
            <Button
              sx={{ width: "100%" }}
              size='small'
              disabled={index === props.playIndex}
              onClick={() => {
                play.views++;
                handleView(play.url, play.ptype);
                props.setPlayArrowIndex(index);
              }}>
              {index === props.playIndex ? "Showing" : "Show in Player"}
            </Button>
          </React.Fragment>
        ))}
    </>
  );
}
