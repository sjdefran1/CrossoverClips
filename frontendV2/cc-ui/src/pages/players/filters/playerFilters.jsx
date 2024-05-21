import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterSnackBar from "./filterSnackbar";
import PlayerTeamSearch from "./playerTeamSearch";
import { Box, Grid } from "@mui/material";
import Filter from "../../../components/filter";
import { updatePlayerFilter } from "../playerSlice";

export default function PlayerFilters() {
  const { currentPlayer, filterAutoOptions, filtersShowing } = useSelector(
    (state) => state.player
  );
  const dispatch = useDispatch();

  return (
    <>
      {currentPlayer?.playerID && <FilterSnackBar />}

      {/* Filters */}
      {currentPlayer?.playerID && filtersShowing && (
        <>
          <Grid container>
            <PlayerTeamSearch />

            {/* Want filter to span whole width so pulling it out of map */}
            <Box my={1} mx={1}>
              <Filter
                title={"Season"}
                arrOfKeys={Object.keys(filterAutoOptions["Season"])}
                dict={filterAutoOptions["Season"]}
                parentDispatchFunction={updatePlayerFilter}
              />
            </Box>
            {/* Slice to get rid of seasons */}
            {/* Stattype, location, etc */}
            {Object.entries(filterAutoOptions)
              .slice(1)
              .map(([category, dict]) => (
                <Grid item xs={12} md={6} key={category}>
                  <Box my={1} mx={1}>
                    <Filter
                      title={category}
                      arrOfKeys={Object.keys(dict)}
                      dict={dict}
                      parentDispatchFunction={updatePlayerFilter}
                    />
                  </Box>
                </Grid>
              ))}
          </Grid>
        </>
      )}
    </>
  );
}
