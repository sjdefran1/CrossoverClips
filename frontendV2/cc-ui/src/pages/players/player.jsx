import React from "react";
import PlayerSearch from "./playerSearch";
import PlayerCard from "./playerCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPlayers } from "../../services/PlayerService";
import { useParams } from "react-router-dom";
import { setPlayer, setPlayerByPid } from "./playerSlice";
import FilterSnackBar from "./filters/filterSnackbar";
import PlayerFilters from "./filters/playerFilters";

export default function Player() {
  const { currentPlayer, allPlayers, playerNotFound } = useSelector(
    (state) => state.player
  );
  const dispatch = useDispatch();
  const { pid } = useParams();

  /**
   * Fetches all players on load
   */
  React.useEffect(() => {
    dispatch(fetchAllPlayers());
    dispatch();
  }, []);

  /**
   * Sets our player to whatever pid is in the url
   * Seperated from top useEffect to ensure all players have been fetched
   * first
   */
  React.useEffect(() => {
    if (allPlayers.length > 0) {
      dispatch(setPlayerByPid({ pid: Number(pid) }));
    }
  }, [allPlayers]);

  return (
    <>
      <PlayerSearch />

      {playerNotFound && (
        <p>No player found with that ID. Try searching a new one above</p>
      )}

      {currentPlayer?.playerID && <PlayerCard />}

      {currentPlayer?.playerID && <PlayerFilters />}
    </>
  );
}
