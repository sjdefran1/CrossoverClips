import * as React from "react";
import {
  Container,
  Grid,
  Button,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
  Stack,
  FormGroup,
} from "@mui/material";
import CircleOutlined from "@mui/icons-material/CircleOutlined";
import CircleIcon from "@mui/icons-material/Circle";

export default function SeasonsSelect(props) {
  // React.useEffect(() => {
  //   props.updateSeasons(props.seasonsSelected);
  // }, [props.seasonsSelected]);

  const [boxSelected, setBoxSelected] = React.useState([true, true]);

  const handleChange = (val) => {
    // checking regular szn
    // if true, regular season games are included
    // if false, regular szn games aren't included
    if (val === 0) {
      boxSelected[0] = !boxSelected[0];
    }

    // checking playoffs, same logic as above
    if (val === 1) {
      boxSelected[1] = !boxSelected[1];
    }

    props.setGameType(boxSelected);
  };
  return (
    <>
      <Grid container>
        <Stack direction={"row"} sx={{ mx: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                icon={<CircleOutlined />}
                checkedIcon={<CircleIcon color='success' />}
              />
            }
            label='Regular Season'
            icon={<CircleOutlined />}
            checkedIcon={<CircleIcon color='success' />}
            checked={boxSelected[0] === true}
            onClick={() => handleChange(0)}
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<CircleOutlined />}
                checkedIcon={<CircleIcon color='success' />}
              />
            }
            label='Playoffs'
            checked={boxSelected[1] === true}
            onClick={() => handleChange(1)}
          />
        </Stack>
      </Grid>
    </>
  );
}
