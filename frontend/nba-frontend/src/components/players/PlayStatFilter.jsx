import * as React from "react";

import {
  Paper,
  Grid,
  Stack,
  Box,
  Badge,
  Avatar,
  Typography,
  Chip,
  Container,
  Tooltip,
  TextField,
  Alert,
  FormControl,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  LinearProgress,
  Divider,
  IconButton,
} from "@mui/material";

export default function PlayStatFilter(props) {
  return (
    <>
      {/* Filter by Quarter */}

      {/* <QuarterFilter /> */}
      <Paper>
        <Paper variant='outlined' sx={{ textAlign: "center", bgcolor: "#333" }}>
          <Chip label='Stat Type' variant='outlined' sx={{ my: 0.5 }} />
        </Paper>

        <Stack
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          spacing={0.5}
          padding={1}
          mt={1}>
          <IconButton
            onClick={() => {
              let dictCopy = props.statDict;
              let newVal = !dictCopy.fgm;
              props.setStatDict((prevState) => ({
                ...prevState,
                fgm: newVal,
              }));
              console.log(dictCopy);
            }}>
            <Chip
              label={"FGM"}
              color={props.statDict.fgm ? "success" : "default"}
            />
          </IconButton>

          <IconButton
            onClick={() => {
              let dictCopy = props.statDict;
              let newVal = !dictCopy.blk;
              props.setStatDict((prevState) => ({
                ...prevState,
                blk: newVal,
              }));
              console.log(dictCopy);
            }}>
            <Chip
              label={"BLK"}
              color={props.statDict.blk ? "success" : "default"}
            />
          </IconButton>

          <IconButton
            onClick={() => {
              let dictCopy = props.statDict;
              let newVal = !dictCopy.ast;
              props.setStatDict((prevState) => ({
                ...prevState,
                ast: newVal,
              }));
              console.log(dictCopy);
            }}
            s>
            <Chip
              label={"AST"}
              color={props.statDict.ast ? "success" : "default"}
            />
          </IconButton>
        </Stack>
        <Stack direction={"row"} justifyContent={"center"}>
          <IconButton
            onClick={() => {
              let dictCopy = props.statDict;
              let newVal = !dictCopy.stl;
              props.setStatDict((prevState) => ({
                ...prevState,
                stl: newVal,
              }));
              console.log(dictCopy);
            }}>
            <Chip
              label={"STL"}
              color={props.statDict.stl ? "success" : "default"}
            />
          </IconButton>

          <IconButton
            onClick={() => {
              let dictCopy = props.statDict;

              let newVal = !dictCopy.dunk;
              props.setStatDict((prevState) => ({
                ...prevState,
                dunk: newVal,
              }));
              console.log(dictCopy);
            }}>
            <Chip
              label={"DUNK"}
              color={props.statDict.dunk ? "success" : "default"}
            />
          </IconButton>
        </Stack>
      </Paper>
    </>
  );
}
