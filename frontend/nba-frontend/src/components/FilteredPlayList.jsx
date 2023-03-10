import * as React from "react";

import SinglePlay from "./SinglePlay";
//const project = projects[0];
export default function FilteredPlayList(props) {
  return (
    <>
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
                play={play}
                team_ids={props.playByPlay.team_ids}
                players_length={props.playByPlay.players.length}
              />
            </nav>
          </React.Fragment>
        ))}
    </>
  );
}
