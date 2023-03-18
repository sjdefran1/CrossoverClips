import * as React from "react";
import axios from "axios";

import {
  Avatar,
  Stack,
  Alert,
  Grid,
  Box,
  Typography,
  Paper,
  Accordion,
  Chip,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";

import TeamSearch from "./TeamSearch";
import SeasonsSelect from "./SeasonsSelect";
export default function ChoicesDash(props) {
  const [selectedTeams, setSelectedTeams] = React.useState([]);
  const [seasonsSelected, setSeasonsSelected] = React.useState([]);
  const [gameList, setGameList] = React.useState([]);
  const [expanded, setExpanded] = React.useState("panel1");
  const [maxSelected, setMaxSelected] = React.useState(false);
  const [teamsSelectedIDS, setTeamsSelectedIDS] = React.useState([]);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const getTeamsSelected = (teamsArr) => {
    setSelectedTeams(teamsArr);
    //console.log(selectedTeams);
  };

  const getSeasonsSelected = (seasonsArr) => {
    setSeasonsSelected(seasonsArr);
    //console.log(selectedTeams);
  };

  const clearFilters = () => {
    setSelectedTeams([]);
    setSeasonsSelected([]);
    setTeamsSelectedIDS([]);
    setMaxSelected(false);
  };

  const getGamesByTeamAxios = () => {
    const data = {
      teams: selectedTeams,
      seasons: seasonsSelected,
    };
    props.updateGamesLoading(true);
    axios
      .post("http://localhost:8000/gamesByTeam", data)
      .then((response) => {
        setGameList(response.data);
        props.updateGamesLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (selectedTeams[1]?.id) {
      setExpanded(false);
    }
    props.updateSelectedTeams(selectedTeams);
  }, [selectedTeams]);

  React.useEffect(() => {
    props.updateSelectedSeasons(seasonsSelected);
  }, [seasonsSelected]);

  React.useEffect(() => {
    props.updateGameList(gameList);
  }, [gameList]);
  return (
    <>
      <Paper>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Choose at least 1 team</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ maxHeight: "45vh", overflow: "auto", direction: "rtl" }}>
            <Alert severity='info' sx={{ mb: 1, direction: "ltr" }}>
              Choosing a second team will fiter only games between the two
            </Alert>
            <TeamSearch
              getSelectedTeamsParent={selectedTeams}
              maxSelected={maxSelected}
              setMaxSelected={setMaxSelected}
              setSelectedTeamsParent={getTeamsSelected}
              setTeamsSelectedIDS={setTeamsSelectedIDS}
              teamsSelectedIDS={teamsSelectedIDS}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Seasons</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SeasonsSelect updateSeasons={getSeasonsSelected} />
          </AccordionDetails>
        </Accordion>

        <Stack
          direction={"row"}
          spacing={1}
          sx={{ justifyContent: "center", alignItems: "center" }}>
          <Button
            variant='outlined'
            color='success'
            disabled={!selectedTeams[0]?.id} // only avaialbe when a team has been clicked
            onClick={() => getGamesByTeamAxios()}
            sx={{ my: 1 }}>
            Submit
          </Button>
          <IconButton disabled={!selectedTeams[0]?.id} onClick={clearFilters}>
            <DeleteIcon />
          </IconButton>
          {/* <Button
            variant='outlined'
            color='success'
            disabled={!selectedTeams[0]?.id} // only avaialbe when a team has been clicked
            sx={{ my: 1, mx: "43%" }}>
            Clear
          </Button> */}
        </Stack>
      </Paper>
    </>
  );
}
