import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamsAxios, fetchGamesByTeam } from "../../services/TeamService";
import {
  Button,
  Container,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";

import TeamSelector from "./teamSelector";
import MatchupDisplay from "./matchupDisplay";
import TeamFilters from "./teamFilters";

import TeamGameList from "./teamGameList";
import { resetTeamPage } from "./teamSlice";

export default function Teams() {
  const teams = useSelector((state) => state.teams);
  const gamesAvailableBool = Object.keys(teams.gamesFound).length === 0;

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchTeamsAxios());
  }, []);

  /* TODO: fix dumb backend logic to clean this tf up */
  function submitSearch() {
    // create seasons arr
    let seasonsList = Object.keys(teams.searchOptions["Seasons"]).filter(
      (key) => teams.searchOptions["Seasons"][key]
    );

    // create Season type str
    let seasonTypeStr = "";
    let seasonTypeDict = teams.searchOptions["Season Type"];
    if (seasonTypeDict["Regular Season"] && !seasonTypeDict["Playoffs"]) {
      seasonTypeStr = "regular season";
    } else if (seasonTypeDict["Regular Season"] && seasonTypeDict["Playoffs"]) {
      seasonTypeStr = "";
    } else if (
      !seasonTypeDict["Regular Season"] &&
      seasonTypeDict["Playoffs"]
    ) {
      seasonTypeStr = "playoffs";
    }
    let data = {
      teams: [teams.selectedTeamOne, teams.selectedTeamTwo], // id array
      seasons: seasonsList, // list of season str's that were true
      game_type: seasonTypeStr,
    };
    dispatch(fetchGamesByTeam(data));
  }
  return (
    <>
      <h3>Teams</h3>
      <Container>
        <Grid container spacing={2}>
          {/* Team Selector, Filters, and submit/delete (left hand side) */}
          <Grid item xs={12} md={6}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1-content'
                id='panel1-header'>
                Choose your team(s)
              </AccordionSummary>
              <AccordionDetails sx={{ maxHeight: "40vh", overflow: "auto" }}>
                {!teams.loading && <TeamSelector />}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel2-content'
                id='panel2-header'>
                Search Filters (Optional)
              </AccordionSummary>
              <AccordionDetails>
                {!teams.loading && <TeamFilters />}
              </AccordionDetails>
            </Accordion>

            <Stack
              direction={"row"}
              spacing={1}
              sx={{ justifyContent: "center", alignItems: "center", mt: 1 }}>
              <Button
                variant='contained'
                color='success'
                disabled={!teams.selectedTeamOne?.id} // only avaialbe when a team has been clicked
                onClick={submitSearch}
                sx={{ my: 1 }}>
                Submit
              </Button>

              <IconButton
                disabled={!teams.selectedTeamOne?.id}
                onClick={() => dispatch(resetTeamPage())}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Teams selected view and games list (right side of desktop view) */}
          <Grid item xs={12} md={6}>
            {!teams.loading && <MatchupDisplay />}

            {/* Request is complete, and we found games */}
            {!teams.resultsLoading && !gamesAvailableBool && <TeamGameList />}

            {/* Request is complete, and we found NO games */}
            {!teams.resultsLoading && gamesAvailableBool && (
              <p>No Games Returned</p>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
