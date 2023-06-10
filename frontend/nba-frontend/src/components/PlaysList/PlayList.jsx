import * as React from "react";
import NoHighlights from "./NoHighlights";
import SinglePlay from "./SinglePlay";
import { Alert, Hidden, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//const project = projects[0];
export default function PlayList(props) {
  const navigate = useNavigate();

  const linkToNeedHelp = () => {
    navigate("/downloadHelp");
  };

  //   const [anchorEl, setAnchorEl] = React.useState(null);
  //   const [showHighlightPreview, setShowHighlightPreview] = React.useState(false);

  //   const handleSwitchChange = (event) => {
  //     setShowHighlightPreview(!showHighlightPreview);
  //   };
  //   const handleClick = (event) => {
  //     setAnchorEl(event.currentTarget);
  //   };

  //   const handleClose = () => {
  //     setAnchorEl(null);
  //   };
  return (
    <>
      <Alert severity='info' sx={{ justifyContent: "center" }}>
        Click the blue download button to directly save to your device, having
        issues?
        <Button onClick={() => linkToNeedHelp()} size='small' color='success'>
          Click here
        </Button>
      </Alert>

      {props.playByPlay.plays
        .filter((play) => play.quarter === props.currentQuarter)
        .map((play) => play).length === 0 && <NoHighlights isPlay={true} />}
      {props.playByPlay.plays
        .filter((play) => play.quarter === props.currentQuarter)
        .map((play) => (
          <React.Fragment key={play.url}>
            <nav aria-label='playbyplay'>
              <SinglePlay
                play={play}
                // team_ids={props.playByPlay.team_ids}
                team_ids={[props.home_teamID, props.away_teamID]}
                players_length={props.playByPlay.players.length}
              />
            </nav>
          </React.Fragment>
        ))}
    </>
  );
}
