import * as React from "react";
import {
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Paper,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export default function StatFilter(props) {
  const [statTypes, setStatTypes] = React.useState(["FGM", "AST", "BLK"]);
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
      <Paper sx={{ mx: 1 }}>
        <Paper sx={{ textAlign: "center" }}>
          <Typography variant='body1' color='text.secondary' padding>
            STATS
          </Typography>
        </Paper>
        <Stack
          direction={"column"}
          padding
          sx={{
            //maxHeight: "25vh",
            //overflow: "auto",

            alignItems: "center",
          }}
          >
          {statTypes.map((stat) => (
            <FormControlLabel
              key={stat}
              label={stat}
              sx={{ ml: 1 }}
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
              Save Stat Filter
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
