import * as React from "react";

//const project = projects[0];
export default function PlayerFilter(props) {
  const currTeamId = props.players?.[0][0];
  return (
    <>
      {props.players &&
        props.players
          .filter((player) => player[0] === currTeamId)
          .map((player) => (
            <>
              <p>{player[1]}</p>
            </>
          ))}
    </>
  );
}
