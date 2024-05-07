import * as React from "react";

import Play from "../../components/play";
import { useSelector } from "react-redux";
//const project = projects[0];
export default function GamePlayList(props) {
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
  return (
    <>
      {/* No Plays found for current Filter */}
      {plays
        .filter(
          (play) =>
            play.quarter === currentQuarter &&
            filteredIds.includes(play.playerID)
        )
        .map((play) => play).length === 0 &&
        filteredIds.length > 0 && <p>No Highlights Found</p>}

      {/* If there are any filtered ids, show only plays that include that player */}
      {/* Else list only plays from currentQuarter */}
      {filteredIds.length > 0
        ? plays
            .filter(
              (play) =>
                play.quarter === currentQuarter &&
                filteredIds.includes(play.playerID)
            )
            .map((play) => (
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
        : plays // no player filter
            .filter((play) => play.quarter === currentQuarter)
            .map((play) => (
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
