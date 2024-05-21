import React from "react";
import PlayerSearch from "./playerSearch";
import PlayerCard from "./playerCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPlayers } from "../../services/PlayerService";
import { useParams } from "react-router-dom";
import { handlePaginationChange, setPlayerByPid } from "./playerSlice";
import PlayerFilters from "./filters/playerFilters";
import { Box, Container, Grid, Pagination } from "@mui/material";
import PlayersPlayList from "./playerPlayList";
import PlayerGameShowing from "./playerGameShowing";
import PlayerVideoWrapper from "./playerVideoWrapper";

export default function Player() {
  const {
    currentPlayer,
    allPlayers,
    playerNotFound,
    filteredSearchLoading,
    gameShowing,
    noResultsFound,
    pageCount,
    currentPage,
    fullScreenVideo,
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

  return (
    <>
      <Container maxWidth='xl'>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <PlayerSearch />
            {gameShowing?.gid && fullScreenVideo && <PlayerVideoWrapper />}
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
            {!filteredSearchLoading && gameShowing?.gid && !fullScreenVideo && (
              <PlayerVideoWrapper />
            )}

            {/* Should only be rendering plays when we have results and a game to shwo */}
            {!filteredSearchLoading && !noResultsFound && gameShowing?.gid && (
              <>
                <Box overflow={"auto"} maxHeight={"80vh"}>
                  <PlayersPlayList />
                </Box>

                {/* Pagination Controls */}
                {pageCount > 0 && (
                  <Pagination
                    sx={{ display: "flex", justifyContent: "center", mt: 1 }}
                    page={currentPage}
                    count={pageCount}
                    onChange={(event, page) =>
                      dispatch(handlePaginationChange(page))
                    }
                  />
                )}
              </>
            )}
            {noResultsFound && !filteredSearchLoading && (
              <p>No results for that search</p>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
