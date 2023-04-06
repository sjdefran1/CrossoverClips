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
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useLocation } from "react-router-dom";
import { reqString } from "../../App.js";

import TeamSearch from "./TeamSearch";
import SeasonsSelect from "./SeasonsSelect";
export default function ChoicesDash(props) {
  const [locationState, setLocationState] = React.useState(useLocation());
  const [selectedTeams, setSelectedTeams] = React.useState(
    !locationState.state ? [] : locationState.state.selectedTeamsLink
  );
  const [seasonsSelected, setSeasonsSelected] = React.useState(
    [
      "2014-15",
      "2015-16",
      "2016-17",
      "2017-18",
      "2018-19",
      "2020-21",
      "2021-22",
      "2022-23",
    ].reverse()
  );
  const [gameList, setGameList] = React.useState([]);
  const [expanded, setExpanded] = React.useState("panel1");
  // const [maxSelected, setMaxSelected] = React.useState(false);

  const [maxSelected, setMaxSelected] = React.useState(
    !locationState.state ? false : locationState.state.maxSelectedLink
  );

  //console.log(selectedTeams);
  // const [seasonsSelected, setSeasonsSelected] = React.useState([]);

  const handleTeamIds = () => {
    // coming back from clicking on game
    if (locationState.state) {
      let arr = locationState.state.selectedTeamsLink;
      // two teams were selected
      if (arr[1]?.id) {
        return [arr[0].id, arr[1].id];
      }
      // one team was selected
      return [arr[0].id, undefined];
    }
    //fresh load, nothing selected before
    return [];
  };

  const [teamsSelectedIDS, setTeamsSelectedIDS] = React.useState(
    handleTeamIds()
  );
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
    // if (panel == "panel1") {
    //   setExpanded("panel2");
    // }
  };

  const getTeamsSelected = (teamsArr) => {
    setSelectedTeams(teamsArr);

    //-----------------
    // console.log("getTeamsSelected ChoicesDashh");
    // console.log(teamsArr);
  };

  const getSeasonsSelected = (seasonsArr) => {
    setSeasonsSelected(seasonsArr);
    //console.log(selectedTeams);
  };

  const clearFilters = () => {
    setSelectedTeams([]);
    setSeasonsSelected(
      [
        "2014-15",
        "2015-16",
        "2016-17",
        "2017-18",
        "2018-19",
        "2020-21",
        "2021-22",
        "2022-23",
      ].reverse()
    );
    setTeamsSelectedIDS([]);
    setMaxSelected(false);
    props.setResponseData([]);
    // handleChange("panel1");
    setExpanded("panel1");
  };

  const getGamesByTeamAxios = () => {
    const data = {
      teams: selectedTeams,
      seasons: seasonsSelected,
    };
    props.updateGamesLoading(true);
    axios
      .post(reqString + "gamesByTeam", data)
      .then((response) => {
        setGameList(response.data);
        props.updateGamesLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    //---------------
    //console.log("useEffect Pre ChoicesDash [selectedteams]");
    // console.log(selectedTeams);
    // console.log(teamsSelectedIDS);
    //console.log("Choices Dash UseEffect fire");
    //----------------
    if (selectedTeams[1]?.id) {
      setExpanded("panel2");
    }
    props.updateSelectedTeams(selectedTeams);
    //---------------
    //console.log("useEffect Post ChoicesDash [selectedteams]");
    // console.log(selectedTeams);
    // console.log(teamsSelectedIDS);
    //----------------
    //console.log([locationState, selectedTeams, teamsSelectedIDS]);
  }, [selectedTeams]);

  React.useEffect(() => {
    props.updateSelectedSeasons(seasonsSelected);
    props.updateGameList(gameList);
  }, [seasonsSelected, gameList]);

  // React.useEffect(() => {
  //   props.updateGameList(gameList);
  // }, [gameList]);
  // console.log("ooga booga");
  // console.log(selectedTeams);
  // console.log(teamsSelectedIDS);
  return (
    <>
      <Paper>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack alignItems={"center"} direction='row' spacing={1}>
              <Chip color='info' label='1' />
              <Typography>Choose at least one team </Typography>
            </Stack>
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
        <Accordion
          expanded={expanded !== "panel1" && expanded == "panel2"}
          onChange={handleChange("panel2")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack alignItems={"center"} direction='row' spacing={1}>
              <Chip color='info' label='2' />
              <Typography>Choose at least one season</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <SeasonsSelect
              seasonsSelected={seasonsSelected}
              setSeasonsSelected={setSeasonsSelected}
            />
          </AccordionDetails>
        </Accordion>

        <Stack
          direction={"row"}
          spacing={1}
          sx={{ justifyContent: "center", alignItems: "center" }}>
          {!selectedTeams[0]?.id || !seasonsSelected.length > 0 ? (
            <Button variant='contained' color='success' disabled sx={{ my: 1 }}>
              Submit
            </Button>
          ) : (
            <Link
              to={
                !selectedTeams[1]?.id
                  ? "/byTeam/" + selectedTeams[0]?.id
                  : "/byTeam/" +
                    selectedTeams[0]?.id +
                    "/" +
                    selectedTeams[1].id
              }
              state={{
                seasons: seasonsSelected,
                selectedTeamsLink: selectedTeams,
                maxSelectedLink: maxSelected,
                tabValueLink: 0,
                valueLink: "",
              }}>
              <Button
                variant='contained'
                color='success'
                disabled={!selectedTeams[0]?.id || !seasonsSelected.length > 0} // only avaialbe when a team has been clicked
                onClick={() => getGamesByTeamAxios()}
                sx={{ my: 1 }}>
                Submit
              </Button>
            </Link>
          )}

          {/* <Link
            to={
              !selectedTeams[1]?.id
                ? "/byTeam/" + selectedTeams[0]?.id
                : "/byTeam/" + selectedTeams[0]?.id + "/" + selectedTeams[1].id
            }
            state={{
              seasons: seasonsSelected,
              selectedTeamsLink: selectedTeams,
              maxSelectedLink: maxSelected,
            }}>
            <Button
              variant='contained'
              color='success'
              disabled={!selectedTeams[0]?.id || !seasonsSelected.length > 0} // only avaialbe when a team has been clicked
              onClick={() => getGamesByTeamAxios()}
              sx={{ my: 1 }}>
              Submit
            </Button>
          </Link> */}
          {/* <Tooltip title='Clear Filters' hidden={!selectedTeams[0]?.id}> */}
          <IconButton disabled={!selectedTeams[0]?.id} onClick={clearFilters}>
            <DeleteIcon />
          </IconButton>
          {/* </Tooltip> */}
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
