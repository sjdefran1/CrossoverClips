import * as React from "react";
import {
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export default function QuarterFilter2(props) {
  const [statTypes, setStatTypes] = React.useState(["1", "2", "3", "4", "OT"]);
  const [choosenType, setChoosenType] = React.useState("FGM");

  const handleStatSelect = (stat) => {
    setChoosenType(stat);
    //props.updateFilter(stat);
  };

  const handleSave = () => {
    //props.setPlayerFilter(selectedPlayers);
    props.updateFilter(choosenType);
  };
  return (
    <>
      <Paper sx={{ mx: 2 }}>
        <Paper variant='outlined' sx={{ textAlign: "center", bgcolor: "#333" }}>
          <Chip label='Quarter' variant='outlined' sx={{ my: 0.5 }} />
        </Paper>
        <Stack
          direction={"row"}
          padding
          sx={{
            //maxHeight: "25vh",
            //overflow: "auto",

            alignItems: "left",
            // ml: 1,
          }}>
          {statTypes.map((stat) => (
            <FormControlLabel
              key={stat}
              label={stat}
              sx={{}}
              control={
                <Checkbox
                  color='success'
                  checked={choosenType === stat}
                  onChange={() => handleStatSelect(stat)}
                />
              }
            />
          ))}
          <Stack direction='row' spacing={1}>
            <Tooltip title='Available Players will change when stat filter is changed, if they do not have any highlights in the new stat type they will be unselected'>
              <InfoIcon color='success' />
            </Tooltip>
            <Button
              size='small'
              variant='outlined'
              onClick={handleSave}
              color='success'>
              Save Quarters
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
