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
} from "@mui/material";

import GameList2 from "../GameList2";
import CircleOutlined from "@mui/icons-material/CircleOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import TeamLabel from "./TeamLabel";
import { useLocation } from "react-router-dom";

export default function TeamSearch(props) {
  const [teamList, setTeamList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
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

  const getTeamsAxios = () => {
    axios
      .post("http://localhost:8000/teams")
      .then((response) => {
        setTeamList(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // console.log("FUCK U TEAMSEARCH");
  // console.log(props.teamsSelectedIDS);
  // console.log(props.getSelectedTeamsParent);
  // console.log(teamList);
  return (
    <>
      <Grid container sx={{ direction: "ltr" }}>
        <>
          {!isLoading &&
            teamList.map((team) => (
              <React.Fragment key={team.id}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    key={team.id}
                    label={
                      <TeamLabel team_id={team.id} name={team.full_name} />
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
                </Grid>
              </React.Fragment>
            ))}
        </>
      </Grid>
    </>
  );
}
