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

export default function QuarterFilter(props) {
  return (
    <>
      {/* Filter by Quarter */}

      {/* <QuarterFilter /> */}
      <Paper>
        <Paper variant='outlined' sx={{ textAlign: "center", bgcolor: "#333" }}>
          <Chip label='Quarter' variant='outlined' sx={{ my: 0.5 }} />
        </Paper>

        <Stack
          direction={"row"}
          justifyContent={"center"}
          spacing={1}
          padding={1}
          mt={1}>
          <IconButton
            onClick={() => {
              let dictCopy = props.quarterDict;
              let newVal = !dictCopy.one;
              props.setQuarterDict((prevState) => ({
                ...prevState,
                one: newVal,
              }));
              console.log(dictCopy);
            }}>
            <Chip
              label={1}
              sx={{ height: 45, width: 45, borderRadius: "50%" }}
              // color={React.useCallback(() => {
              //   getChipColor("one");
              // }, [quarterDict])}

              color={props.quarterDict.one ? "success" : "default"}
            />
          </IconButton>

          <IconButton
            onClick={() => {
              let dictCopy = props.quarterDict;
              let newVal = !dictCopy.two;
              props.setQuarterDict((prevState) => ({
                ...prevState,
                two: newVal,
              }));
              console.log(dictCopy);
            }}>
            <Chip
              label={2}
              sx={{ height: 45, width: 45, borderRadius: "50%" }}
              color={props.quarterDict.two ? "success" : "default"}
            />
          </IconButton>

          <IconButton
            onClick={() => {
              let dictCopy = props.quarterDict;
              let newVal = !dictCopy.three;
              props.setQuarterDict((prevState) => ({
                ...prevState,
                three: newVal,
              }));
              console.log(dictCopy);
            }}
            s>
            <Chip
              label={3}
              sx={{ height: 45, width: 45, borderRadius: "50%" }}
              color={props.quarterDict.three ? "success" : "default"}
            />
          </IconButton>
        </Stack>
        <Stack direction={"row"} justifyContent={"center"}>
          <IconButton
            onClick={() => {
              let dictCopy = props.quarterDict;
              let newVal = !dictCopy.four;
              props.setQuarterDict((prevState) => ({
                ...prevState,
                four: newVal,
              }));
              console.log(dictCopy);
            }}>
            <Chip
              label={4}
              color={props.quarterDict.four ? "success" : "default"}
              sx={{ height: 45, width: 45, borderRadius: "50%" }}
            />
          </IconButton>

          <IconButton
            onClick={() => {
              let dictCopy = props.quarterDict;

              let newVal = !dictCopy.OT;
              props.setQuarterDict((prevState) => ({
                ...prevState,
                OT: newVal,
              }));
              console.log(dictCopy);
            }}>
            <Chip
              label={"OT"}
              color={props.quarterDict.OT ? "success" : "default"}
              sx={{ height: 45, width: 45, borderRadius: "50%" }}
            />
          </IconButton>
        </Stack>
      </Paper>
    </>
  );
}
