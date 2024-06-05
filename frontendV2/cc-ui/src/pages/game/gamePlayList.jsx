import * as React from "react";

import Play from "../../components/play";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentlyRenderedPlays, setGamePlayIndex } from "./gameSlice";
import { Button, Fade, Grow, Paper, Stack, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { handlePlayView } from "../../services/PlayService";
import NoResults from "../../components/NoResults";

//const project = projects[0];
export default function GamePlayList(props) {
  const dispatch = useDispatch();
  // Get necessary data from the store
  const plays = useSelector((state) => state.game.currentShowingPlays);
  const currentIndex = useSelector((state) => state.game.currentPlayIndex);
  const videoPlayerEnabled = useSelector(
    (state) => state.game.videoPlayerEnabled
  );
  const playsRendered = useSelector(
    (state) => state.game.currentlyRenderedPlays
  );
  const currentQuarter = useSelector((state) => state.game.quarterSelected);
  const filteredIds = useSelector((state) => state.game.filteredPlayers);
  const currentStatType = useSelector(
    (state) => state.game.currentlySelectedStatType
  );
  const teamIds = [
    useSelector((state) => state.game.homeTeam.TEAM_ID),
    useSelector((state) => state.game.awayTeam.TEAM_ID),
  ];

  /**
   * Selects Plays by current quarter
  //  */
  // const playsByQuarter = React.useMemo(() => {
  //   return plays.filter((play) => play.quarter === currentQuarter);
  // }, [plays, currentQuarter]);

  // /***
  //  * Selects plays that include filtered players
  //  * based off of quarter filter
  //  */
  // const filteredPlaysByPlayer = React.useMemo(() => {
  //   return playsByQuarter.filter((play) => filteredIds.includes(play.playerID));
  // }, [playsByQuarter, filteredIds]);

  // React.useEffect(() => {
  //   if (filteredPlaysByPlayer.length === 0 && filteredIds.length === 0) {
  //     dispatch(setCurrentlyRenderedPlays(playsByQuarter));
  //   } else {
  //     dispatch(setCurrentlyRenderedPlays(filteredPlaysByPlayer));
  //   }
  // }, [playsByQuarter, filteredPlaysByPlayer]);

  return (
    <>
      {/* No Plays found for current Filter */}
      {/* {filteredPlaysByPlayer.map((play) => play).length === 0 &&
        filteredIds.length > 0 && <NoResults />} */}

      {playsRendered.map((play, index) => (
        <React.Fragment key={play.url}>
          <nav aria-label='playbyplay'>
            {currentIndex === index && videoPlayerEnabled && (
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
            <Fade in={true}>
              <div>
                <Play
                  currentStatType={currentStatType}
                  play={play}
                  team_ids={teamIds}
                />
              </div>
            </Fade>

            {videoPlayerEnabled && (
              <Button
                sx={{ width: "100%" }}
                size='small'
                disabled={index === currentIndex}
                onClick={() => {
                  handlePlayView(play);
                  dispatch(setGamePlayIndex(index));
                }}>
                {index === currentIndex ? "Showing" : "Show in Player"}
              </Button>
            )}
          </nav>
        </React.Fragment>
      ))}
    </>
  );
}
