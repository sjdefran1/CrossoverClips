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
  Alert,
  Checkbox,
} from "@mui/material";

import GameList2 from "../GameList2";
import CircleOutlined from "@mui/icons-material/CircleOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import TeamLabel from "../TeamLabel";

export default function TeamSearch(props) {
  const [teamList, setTeamList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [maxSelected, setMaxSelected] = React.useState(false);
  const [teamsSelected, setTeamsSelected] = React.useState([]);

  // calls on mount
  React.useEffect(() => {
    getTeamsAxios();
    // eslint-disable-next-line
  }, []);

  //every time team is selected update parent
  React.useEffect(() => {
    let team1 = teamList.filter((team) => team.id === teamsSelected[0])[0];
    let team2 = teamList.filter((team) => team.id === teamsSelected[1])[0];
    props.setSelectedTeamsParent([team1, team2]);
  }, [teamsSelected]);

  const handleTeamSelect = (team) => {
    if (teamsSelected.includes(team)) {
      setTeamsSelected(teamsSelected.filter((id) => id !== team));
      setMaxSelected(false); // enable all checkboxes if a team is unchecked
    } else {
      let arr = [team];
      if (teamsSelected.length === 1) {
        setMaxSelected(true);
      }
      setTeamsSelected(teamsSelected.concat(arr));
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
      <Grid container>
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
                          icon={<CircleOutlined />}
                          checkedIcon={<CircleIcon />}
                          disabled={
                            maxSelected && !teamsSelected.includes(team.id)
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
