import React from "react";
import PlayerSearch from "./playerSearch";
import PlayerCard from "./playerCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPlayers } from "../../services/PlayerService";
import { useParams } from "react-router-dom";
import { setPlayerByPid } from "./playerSlice";
import PlayerFilters from "./filters/playerFilters";
import { Container, Grid } from "@mui/material";
import PlayersPlayList from "./playerPlayList";
import PlayerGameShowing from "./playerGameShowing";

export default function Player() {
  const {
    currentPlayer,
    allPlayers,
    playerNotFound,
    filteredSearchLoading,
    gameShowing,
    noResultsFound,
  } = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const { pid } = useParams();

  /**
   * Fetches all players on load
   */
  React.useEffect(() => {
    dispatch(fetchAllPlayers());
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

  /**
   * Updates Player View when new one is selected
   *
   * TODO: UNCMMENT WHEN BACK IN PROD
   */
  // React.useEffect(() => {
  //   updatePlayerView(pid);
  // }, [pid]);

  return (
    <>
      <Container maxWidth='xl'>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <PlayerSearch />
          </Grid>
          {playerNotFound && (
            <p>No player found with that ID. Try searching a new one above</p>
          )}

          <Grid item xs={6}>
            {currentPlayer?.playerID && <PlayerCard />}
            {gameShowing?.gid && <PlayerGameShowing />}
            {currentPlayer?.playerID && <PlayerFilters />}
          </Grid>

          <Grid item xs={6}>
            {!filteredSearchLoading && !noResultsFound && <PlayersPlayList />}
            {noResultsFound && !filteredSearchLoading && (
              <p>No results for that search</p>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
