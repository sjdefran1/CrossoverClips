import * as React from "react";
import {
  Stack,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { handleStatChange } from "./gameSlice";

export default function GameStatFilter(props) {
  const statTypes = ["FGM", "AST", "BLK", "DUNK", "STL"];
  const currentStatType = useSelector(
    (state) => state.game.currentlySelectedStatType
  );
  const dispatch = useDispatch();
  return (
    <>
      <Paper sx={{ mx: 2 }}>
        <Paper variant='outlined' sx={{ textAlign: "center", bgcolor: "#333" }}>
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

            alignItems: "left",
            ml: 1,
          }}>
          {statTypes.map((stat) => (
            <FormControlLabel
              key={stat}
              label={stat}
              sx={{ ml: 1 }}
              control={
                <Checkbox
                  color='success'
                  checked={currentStatType === stat}
                  onChange={() => dispatch(handleStatChange(stat))}
                />
              }
            />
          ))}
        </Stack>
      </Paper>
    </>
  );
}
