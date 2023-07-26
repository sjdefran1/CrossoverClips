import * as React from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Stack,
  Fade,
  Box,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  TextField,
  Divider,
  Paper,
  Chip,
  Hidden,
} from "@mui/material";

import GameList2 from "../GameList2";
import SearchIcon from "@mui/icons-material/Search";
import CircleOutlined from "@mui/icons-material/CircleOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import TeamLabel from "./TeamLabel";
import { useLocation } from "react-router-dom";
import { reqString } from "../../App.js";

export default function TeamSearch(props) {
  const [teamList, setTeamList] = React.useState([]);
  const [teamNameIdList, setTeamNameIdList] = React.useState([]);
  const [teamNameList, setTeamNameList] = React.useState([]);
  const [teamNameCompleteList, setTeamNameCompleteList] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(true);
  const [value, setValue] = React.useState([]);

  //const [locationState, setLocationState] = React.useState(useLocation());

  // calls on mount
  React.useEffect(() => {
    getTeamsAxios();

    // eslint-disable-next-line
  }, []);

  //every time team is selected update parent
  React.useEffect(() => {
    // //-----------------
    // console.log("TeamSearch pre useeffect ids");
    // console.log(props.getSelectedTeamsParent);
    //----------------------
    //console.log("TeamSearch UseEffect fire");
    // console.log("ids");
    // console.log(props.teamsSelectedIDS);
    if (props.teamSelectedIDS?.length === 0) {
      setValue([]);
      setTeamNameCompleteList([]);
      console.log("FIRED");
    }
    let team1 = teamList.filter(
      (team) => team.id === props.teamsSelectedIDS[0]
    )[0];

    let team2 = teamList.filter(
      (team) => team.id === props.teamsSelectedIDS[1]
    )[0];

    // console.log(props.teamsSelectedIDS);
    props.setSelectedTeamsParent([team1, team2]);

    // console.log("TeamSearch post useeffect ids");
    // console.log(props.getSelectedTeamsParent);
  }, [props.teamsSelectedIDS, teamList]);

  // React.useEffect(() => {
  //   props.setTeamsSelectedIDS(props.getSelectedTeamsParent);
  // }, [props.getSelectedTeamsParent]);

  const handleTeamSelect = (team) => {
    //console.log("fired");
    if (props.teamsSelectedIDS.includes(team)) {
      props.setTeamsSelectedIDS(
        props.teamsSelectedIDS.filter((id) => id !== team)
      );
      props.setMaxSelected(false); // enable all checkboxes if a team is unchecked
    } else {
      let arr = [team];
      if (props.teamsSelectedIDS.length === 1) {
        props.setMaxSelected(true);
      }
      // ['10101010', undefined]
      if (props.teamsSelectedIDS.length === 2) {
        let firstTeam = props.teamsSelectedIDS[0];
        props.setTeamsSelectedIDS([firstTeam, team]);
        console.log("Fired handleTeamSelect lenth==2");
        console.log([firstTeam, team]);
      } else {
        props.setTeamsSelectedIDS(props.teamsSelectedIDS.concat(arr));
      }
    }
  };

  const createTeamNameList = (teamListParam) => {
    // console.log(teamListParam);
    for (let i = 0; i < teamListParam.length; i++) {
      let newTeam = teamListParam[i];
      let newTeamParams = { team_id: newTeam.id, label: newTeam.full_name };
      teamNameIdList.push(newTeamParams);
      teamNameList.push(newTeam.full_name);
    }
    teamNameIdList.sort((e1, e2) => e1.label < e2.label);
    console.log(teamNameIdList);
    setIsLoading(false);
  };

  // const getTeamsAxios = () => {
  //   axios
  //     // .post("http://localhost:8000/teams")
  //     .post("https://nbaclipfinder4-1-u4961891.deta.app/teams")
  //     .then((response) => {
  //       setTeamList(response.data);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const getTeamsAxios = () => {
    axios
      // .post("http://localhost:8000/teams")
      .get(reqString + "teams")
      .then((response) => {
        setTeamList(response.data);
        createTeamNameList(response.data);
        // setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally((response) => {});
  };
  // console.log(teamNameCompleteList);

  return (
    <>
      <Grid container sx={{ direction: "ltr" }}>
        <>
          {isLoading && <CircularProgress sx={{ ml: "50%" }} />}
          <Box sx={{ mb: 1, width: "100%" }}>
            {!isLoading && (
              <Autocomplete
                multiple
                value={teamNameCompleteList}
                autoHighlight
                clearOnEscape
                autoComplete={true}
                id='combo-box-demo'
                disabled={props.maxSelected}
                options={teamNameIdList}
                getOptionLabel={(option) => option?.label}
                sx={{ width: "90%" }}
                size='small'
                onChange={(event, newValue) => {
                  let newId = newValue[newValue.length - 1];
                  handleTeamSelect(newId?.team_id);
                  console.log("newVal");
                  console.log(newValue);
                  // if (teamNameCompleteList.length === 0) {
                  //   setTeamNameCompleteList(newId?.label);
                  // }
                  // console.log(newId);
                  // setValue(newValue.team_id);
                }}
                renderOption={(props, option) => (
                  <Box component='li' {...props} key={option.team_id}>
                    <TeamLabel team_id={option?.team_id} name={option?.label} />
                  </Box>
                )}
                renderInput={(params) => (
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <SearchIcon />
                    <TextField {...params} label='Type team name' />
                  </Stack>
                )}
              />
            )}
            {/* {value.map((val) => (
              <p>{val}</p>
            ))} */}
          </Box>
          <Hidden smDown>
            <Grid item xs={12}>
              <Divider />
              <Stack direction={"row"} spacing={23} alignItems={"center"}>
                <Box my={1} ml={"20%"}>
                  <Chip variant='outlined' label='East' />
                </Box>

                <Box my={1}>
                  <Chip variant='outlined' label='West' />
                </Box>
              </Stack>
              <Divider />
            </Grid>
          </Hidden>

          <Hidden smUp>
            <Grid item xs={12} textAlign={"center"}>
              <Divider />

              <Chip
                variant='filled'
                label='East'
                sx={{ my: 0.5 }}
                size='small'
              />
              <Divider />
            </Grid>
          </Hidden>
          <Grid item xs={12} sm={6}>
            <Stack direction={"column"}>
              {!isLoading &&
                teamList
                  .filter((team) => team.conf === "East")
                  .map((team) => (
                    <React.Fragment key={team.id}>
                      {/* <Grid item xs={6} sm={6}> */}
                      <Stack direction={"row"}>
                        <FormControlLabel
                          key={team.id}
                          label={
                            <TeamLabel
                              team_id={team.id}
                              name={team.full_name}
                              conf={team.conf}
                            />
                          }
                          control={
                            <Checkbox
                              key={team.full_name}
                              checked={props.teamsSelectedIDS.includes(team.id)}
                              icon={<CircleOutlined />}
                              checkedIcon={<CircleIcon color='success' />}
                              disabled={
                                props.maxSelected &&
                                !props.teamsSelectedIDS.includes(team.id)
                              }
                              onChange={() => handleTeamSelect(team.id)}
                            />
                          }
                        />
                      </Stack>
                      {/* </Grid> */}
                    </React.Fragment>
                  ))}
            </Stack>
          </Grid>

          <Hidden smUp>
            <Grid item xs={12} textAlign={"center"}>
              <Divider />

              <Chip
                variant='filled'
                label='West'
                sx={{ my: 0.5 }}
                size='small'
              />
              <Divider />
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={6}>
            <Stack direction={"column"}>
              {!isLoading &&
                teamList
                  .filter((team) => team.conf === "West")
                  .map((team) => (
                    <React.Fragment key={team.id}>
                      {/* <Grid item xs={6} sm={6}> */}
                      <Stack direction={"row"}>
                        <FormControlLabel
                          key={team.id}
                          label={
                            <TeamLabel
                              team_id={team.id}
                              name={team.full_name}
                              conf={team.conf}
                            />
                          }
                          control={
                            <Checkbox
                              key={team.full_name}
                              checked={props.teamsSelectedIDS.includes(team.id)}
                              icon={<CircleOutlined />}
                              checkedIcon={<CircleIcon color='success' />}
                              disabled={
                                props.maxSelected &&
                                !props.teamsSelectedIDS.includes(team.id)
                              }
                              onChange={() => handleTeamSelect(team.id)}
                            />
                          }
                        />
                      </Stack>
                      {/* </Grid> */}
                    </React.Fragment>
                  ))}
            </Stack>
          </Grid>
        </>
      </Grid>
    </>
  );
}
