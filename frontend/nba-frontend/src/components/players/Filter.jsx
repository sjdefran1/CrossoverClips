import {
  Chip,
  IconButton,
  Paper,
  Grid,
  Box,
  Stack,
  ButtonGroup,
  Button,
} from "@mui/material";
import * as React from "react";
import "./File2.css";
export default function Filter(props) {
  /**
   * if we pass in arr of elements (dict keys)
   * title = header label
   * arr =[1,2,3,4]
   * dict = {1: t, 2: t, 3: t, 4: t}
   *
   * grid 12
   *  arr.map
   *   /grid 3
   *      button onclick dict[element] = !dict[element]
   *          chip label=element color = dict.element ? green:default
   *      /button
   *   /grod
   * /grid
   */
  //   console.log(12 % props.arrOfKeys.length);
  return (
    <>
      <Paper>
        <Paper variant='outlined' sx={{ textAlign: "center", bgcolor: "#333" }}>
          <Chip label={props.title} variant='outlined' sx={{ my: 0.5 }} />
        </Paper>

        {/* <Grid container className='flex-container'>
          {props.arrOfKeys.map((element) => (
            // <Grid item xs={4} key={element}>
            <IconButton
              onClick={() => {
                let dictCopy = { ...props.dict };
                let newVal = dictCopy[element];
                props.setDict((prevState) => ({
                  ...prevState,
                  [element]: newVal,
                }));
              }}>
              <Chip label={element} />
            </IconButton>
            // </Grid>
          ))}
        </Grid> */}
        {/* 
        <Grid container justifyContent={"center"}>
          <ButtonGroup disableFocusRipple disableRipple color='success'>
            {props.arrOfKeys.map((element) => (
              // <Grid item xs={4} key={element}>
              <Button
                key={element}
                // color={props.dict[element] ? "success" : "default"}
                variant={props.dict[element] ? "contained" : "outlined"}
                onClick={() => {
                  let dictCopy = props.dict;
                  let newVal = !dictCopy[element];
                  props.setDict((prevState) => ({
                    ...prevState,
                    [element]: newVal,
                  }));
                }}>
                {element}
              </Button>
            ))}
          </ButtonGroup>
        </Grid> */}

        <Grid container justifyContent={"center"}>
          <ButtonGroup
            disableFocusRipple
            disableRipple
            color='success'
            sx={{ justifyContent: "center" }}>
            {props.arrOfKeys.map((element) => (
              // <Grid item xs={4} key={element}>
              <IconButton
                onClick={() => {
                  let dictCopy = { ...props.dict };
                  let newVal = !dictCopy[element];
                  props.setDict((prevState) => ({
                    ...prevState,
                    [element]: newVal,
                  }));
                }}>
                <Chip
                  variant={props.dict[element] ? "filled" : "outlined"}
                  label={element}
                  color={props.dict[element] ? "success" : "default"}
                />
              </IconButton>
            ))}
          </ButtonGroup>
        </Grid>
      </Paper>
    </>
  );
}
