import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamsAxios, fetchGamesByTeam } from "../../services/TeamService";
import TeamSelector from "./teamSelector";
import MatchupDisplay from "./matchupDisplay";
import TeamFilters from "./teamFilters";
import { Button, Container } from "@mui/material";
import TeamGameList from "./teamGameList";

export default function Teams() {
  const teams = useSelector((state) => state.teams);

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchTeamsAxios());
  }, []);

  function submitSearch() {
    // create seasons arr
    let seasonsList = Object.keys(teams.searchOptions["Seasons"]).filter(
      (key) => teams.searchOptions["Seasons"][key]
    );

    // create Season type str
    let seasonTypeStr = "";
    let seasonTypeDict = teams.searchOptions["Season Type"];
    if (seasonTypeDict["Regular Season"] && !seasonTypeDict["Playoffs"]) {
      seasonTypeStr = "Regular Season";
    } else if (seasonTypeDict["Regular Season"] && seasonTypeDict["Playoffs"]) {
      seasonTypeStr = "";
    } else if (
      !seasonTypeDict["Regular Season"] &&
      seasonTypeDict["Playoffs"]
    ) {
      seasonTypeStr = "Playoffs";
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
        {teams.loading && <p> teams loading</p>}

        {!teams.loading && <MatchupDisplay />}
        {!teams.loading && <TeamSelector />}

        {!teams.loading && <TeamFilters />}

        {/* TODO: fix dumb backend logic to clean this tf up */}
        <Button disabled={!teams.selectedTeamOne?.id} onClick={submitSearch}>
          Submit Search
        </Button>

        {!teams.resultsLoading && <TeamGameList />}
      </Container>
    </>
  );
}
