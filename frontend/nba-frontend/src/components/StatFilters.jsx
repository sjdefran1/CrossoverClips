import * as React from "react";
import { Box, Checkbox, FormControlLabel } from "@mui/material";

export default function StatFilter(props) {
  const [statTypes, setStatTypes] = React.useState(["FGM", "AST", "BLK"]);
  const [choosenType, setChoosenType] = React.useState("FGM");

  const handleStatSelect = (stat) => {
    setChoosenType(stat);
    props.updateFilter(stat);
  };
  return (
    <>
      <Box sx={{ maxHeight: "25vh", overflow: "auto" }}>
        {statTypes.map((stat) => (
          <FormControlLabel
            key={stat}
            label={stat}
            sx={{ ml: 1 }}
            control={
              <Checkbox
                checked={choosenType === stat}
                onChange={() => handleStatSelect(stat)}
              />
            }
          />
        ))}
      </Box>
    </>
  );
}
