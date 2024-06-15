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
  Hidden,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";

import TeamSelector from "./teamSelector";
import MatchupDisplay from "./matchupDisplay";
import TeamFilters from "./teamFilters";

import TeamGameList from "./teamGameList";
import { resetTeamPage } from "./teamSlice";
import Loading from "../../components/loading";
import MatchupDisplay2 from "./matchupDisplay2";
import Search from "@mui/icons-material/Search";

export default function Teams() {
  const teams = useSelector((state) => state.teams);
  const gamesAvailableBool = Object.keys(teams.gamesFound).length === 0;
  const dispatch = useDispatch();
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // Retrieve Teams on Load
  React.useEffect(() => {
    dispatch(fetchTeamsAxios());
    // eslint-disable-next-line
  }, []);

  /**
   * Close Accordion when second team is selected
   */
  React.useEffect(() => {
    if (teams.selectedTeamOne?.id && teams.selectedTeamTwo?.id) {
      setExpanded(false);
    } else {
      // when cleared want to reopen selector
      setExpanded("panel1");
    }
  }, [teams.selectedTeamOne, teams.selectedTeamTwo]);

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
      {teams.loading && <Loading />}

      {!teams.loading && (
        <Container>
          <Paper elevation={0} sx={{ minHeight: "70vh" }}>
            <Grid container spacing={2} mt={2}>
              {/* (left hand side) */}
              <Grid item xs={12} md={6}>
                {/* Mobile team display */}
                <Hidden mdUp>
                  <MatchupDisplay2 />
                </Hidden>
                {/* Team Selector */}
                <Accordion
                  // defaultExpanded
                  expanded={expanded === "panel1"}
                  onChange={handleChange("panel1")}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1-content'
                    id='panel1-header'>
                    Choose your team(s)
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{ maxHeight: "50vh", overflow: "auto" }}>
                    {/* Team list */}
                    <TeamSelector />
                  </AccordionDetails>
                </Accordion>

                {/* Fitlers */}
                <Accordion
                  expanded={expanded === "panel2"}
                  onChange={handleChange("panel2")}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel2-content'
                    id='panel2-header'>
                    Search Filters (Optional)
                  </AccordionSummary>
                  <AccordionDetails>
                    <TeamFilters />
                  </AccordionDetails>
                </Accordion>

                {/* Submit/Delete Buttons */}
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 1,
                  }}>
                  <Button
                    variant='contained'
                    color='success'
                    startIcon={<Search />}
                    disabled={!teams.selectedTeamOne?.id} // only avaialbe when a team has been clicked
                    onClick={submitSearch}
                    sx={{ my: 1 }}>
                    Search
                  </Button>

                  <IconButton
                    disabled={!teams.selectedTeamOne?.id}
                    onClick={() => dispatch(resetTeamPage())}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Grid>

              {/* (right side of desktop view) */}
              <Grid item xs={12} md={6}>
                <Hidden mdDown>
                  <MatchupDisplay2 />
                </Hidden>
                {/* Request is complete, and we found games */}
                {!teams.resultsLoading && !gamesAvailableBool && (
                  <TeamGameList />
                )}

                {/* Request is complete, and we found NO games */}
                {!teams.resultsLoading && gamesAvailableBool && (
                  <p>No Games Returned</p>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      )}
    </>
  );
}
