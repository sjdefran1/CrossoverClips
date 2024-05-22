import * as React from "react";

import Play from "../../components/play";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentlyRenderedPlays } from "./gameSlice";
//const project = projects[0];
export default function GamePlayList(props) {
  const dispatch = useDispatch();
  // Get necessary data from the store
  const plays = useSelector((state) => state.game.currentShowingPlays);
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
   */
  const playsByQuarter = React.useMemo(() => {
    return plays.filter((play) => play.quarter === currentQuarter);
  }, [plays, currentQuarter]);

  /***
   * Selects plays that include filtered players
   * based off of quarter filter
   */
  const filteredPlaysByPlayer = React.useMemo(() => {
    return playsByQuarter.filter((play) => filteredIds.includes(play.playerID));
  }, [playsByQuarter, filteredIds]);

  React.useEffect(() => {
    console.log("fired");
    if (filteredPlaysByPlayer.length === 0) {
      dispatch(setCurrentlyRenderedPlays(playsByQuarter));
    } else {
      dispatch(setCurrentlyRenderedPlays(filteredPlaysByPlayer));
    }
  }, [playsByQuarter, filteredPlaysByPlayer]);

  return (
    <>
      {/* No Plays found for current Filter */}
      {filteredPlaysByPlayer.map((play) => play).length === 0 &&
        filteredIds.length > 0 && <p>No Highlights Found</p>}

      {/* If there are any filtered ids, show only plays that include that player */}
      {/* Else list only plays from currentQuarter */}
      {filteredIds.length > 0
        ? filteredPlaysByPlayer.map((play) => (
            <React.Fragment key={play.url}>
              <nav aria-label='playbyplay'>
                <Play
                  currentStatType={currentStatType}
                  play={play}
                  team_ids={teamIds}
                />
              </nav>
            </React.Fragment>
          ))
        : playsByQuarter.map((play) => (
            <React.Fragment key={play.url}>
              <nav aria-label='playbyplay'>
                <Play
                  currentStatType={currentStatType}
                  play={play}
                  team_ids={teamIds}
                />
              </nav>
            </React.Fragment>
          ))}
    </>
  );
}
