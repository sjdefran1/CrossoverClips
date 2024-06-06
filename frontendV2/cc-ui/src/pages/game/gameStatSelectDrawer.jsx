import * as React from "react";
import {
  Stack,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  Box,
  Grid,
  IconButton,
  Chip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { handleStatChange } from "./gameSlice";

export default function DrawerStatSelect() {
  const statTypes = ["FGM", "AST", "BLK", "DUNK", "STL"];
  const currentStatType = useSelector(
    (state) => state.game.currentlySelectedStatType
  );
  const dispatch = useDispatch();
  return (
    <>
      <Paper elevation={0} sx={{ borderRadius: 0 }}>
        <Grid container justifyContent={"center"}>
          {statTypes.map((stat) => (
            <Grid item xs={2}>
              <IconButton onClick={() => dispatch(handleStatChange(stat))}>
                <Chip
                  color={currentStatType === stat ? "info" : "default"}
                  label={stat}
                />
              </IconButton>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </>
  );
}
