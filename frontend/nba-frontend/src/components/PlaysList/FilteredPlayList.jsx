import * as React from "react";
import NoHighlights from "./NoHighlights";

import SinglePlay from "./SinglePlay";
//const project = projects[0];
export default function FilteredPlayList(props) {
  return (
    <>
      {/* No Plays found for current Filter */}
      {props.playByPlay.plays
        .filter(
          (play) =>
            play.quarter === props.currentQuarter &&
            props.filteredPlayers.includes(play.playerID)
        )
        .map((play) => play).length === 0 && <NoHighlights isPlay={true} />}

      {/* Plays Found Map them */}
      {props.playByPlay.plays
        .filter(
          (play) =>
            play.quarter === props.currentQuarter &&
            props.filteredPlayers.includes(play.playerID)
        )
        .map((play) => (
          <React.Fragment key={play.url}>
            <nav aria-label='playbyplay'>
              <SinglePlay
                currentStatType={props.currentStatType}
                play={play}
                team_ids={[props.home_teamID, props.away_teamID]}
                players_length={props.playByPlay.players.length}
              />
            </nav>
          </React.Fragment>
        ))}
    </>
  );
}
