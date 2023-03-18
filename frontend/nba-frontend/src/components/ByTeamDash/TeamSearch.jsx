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
import TeamLabel from "../TeamLabel";

export default function TeamSearch(props) {
  const [teamList, setTeamList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // calls on mount
  React.useEffect(() => {
    getTeamsAxios();
    // eslint-disable-next-line
  }, []);

  //every time team is selected update parent
  React.useEffect(() => {
    let team1 = teamList.filter(
      (team) => team.id === props.teamsSelectedIDS[0]
    )[0];
    let team2 = teamList.filter(
      (team) => team.id === props.teamsSelectedIDS[1]
    )[0];
    props.setSelectedTeamsParent([team1, team2]);
  }, [props.teamsSelectedIDS]);

  // React.useEffect(() => {
  //   props.setTeamsSelectedIDS(props.getSelectedTeamsParent);
  // }, [props.getSelectedTeamsParent]);

  const handleTeamSelect = (team) => {
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
      props.setTeamsSelectedIDS(props.teamsSelectedIDS.concat(arr));
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

  return (
    <>
      <Grid container sx={{ direction: "ltr" }}>
        <>
          {!isLoading &&
            teamList.map((team) => (
              <React.Fragment key={team.id}>
                <Grid item xs={6}>
                  <Fade in={true}>
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
                  </Fade>
                </Grid>
              </React.Fragment>
            ))}
        </>
      </Grid>
    </>
  );
}
