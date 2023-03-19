import * as React from "react";
import {
  Container,
  Grid,
  Button,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CircleOutlined from "@mui/icons-material/CircleOutlined";
import CircleIcon from "@mui/icons-material/Circle";

export default function SeasonsSelect(props) {
  const [seasonsList, setSeasonsList] = React.useState(
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

  const handleSeasonSelect = (season) => {
    if (props.seasonsSelected.includes(season)) {
      props.setSeasonsSelected(
        props.seasonsSelected.filter((year) => year !== season)
      );
    } else {
      let arr = [season];
      props.setSeasonsSelected(props.seasonsSelected.concat(arr));
    }
  };

  const handleAll = () => {
    props.setSeasonsSelected(seasonsList);
  };

  const handleClear = () => {
    props.setSeasonsSelected([]);
  };
  // React.useEffect(() => {
  //   props.updateSeasons(props.seasonsSelected);
  // }, [props.seasonsSelected]);

  return (
    <>
      <Alert severity='info'>
        All seasons returned by default, submit button below
      </Alert>
      <Grid container>
        {seasonsList.map((season) => (
          <React.Fragment key={season}>
            <Grid item xs={6} sm={3}>
              <FormControlLabel
                key={season}
                label={
                  <Typography variant='body2' color={"text.secondary"}>
                    {season}
                  </Typography>
                }
                control={
                  <Checkbox
                    key={season}
                    checked={props.seasonsSelected.includes(season)}
                    icon={<CircleOutlined />}
                    checkedIcon={<CircleIcon color='success' />}
                    onChange={() => handleSeasonSelect(season)}
                  />
                }
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Grid container>
        <Button onClick={handleAll} color='success'>
          All
        </Button>
        <Button color='warning' onClick={handleClear}>
          Clear
        </Button>
      </Grid>
    </>
  );
}
