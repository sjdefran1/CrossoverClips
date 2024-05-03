import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamsAxios } from "./teamSlice";
import TeamSelector from "./teamSelector";
import MatchupDisplay from "./matchupDisplay";

export default function Teams() {
  const teams = useSelector((state) => state.teams);

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchTeamsAxios());
  }, []);
  return (
    <>
      <h3>Teams</h3>
      <p>Hello This is teams</p>

      {teams.loading && <p> teams loading</p>}

      {!teams.loading && <MatchupDisplay />}
      {!teams.loading && <TeamSelector />}
    </>
  );
}
