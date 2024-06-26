import {
  Chip,
  IconButton,
  Paper,
  Grid,
  Box,
  Stack,
  ButtonGroup,
  Typography,
  Button,
  Fade,
} from "@mui/material";
import * as React from "react";
import "./Filter.css";
import { useDispatch } from "react-redux";

export default function Filter(props) {
  const dispatch = useDispatch();

  return (
    <>
      <Fade in={true}>
        <Paper>
          <Paper
            variant='outlined'
            sx={{ textAlign: "center", bgcolor: "#333" }}>
            <Typography variant='body1' color='text.secondary' padding>
              {props.title}
            </Typography>
          </Paper>

          <Grid container justifyContent={"center"}>
            <ButtonGroup
              className='flex-container'
              disableFocusRipple
              disableRipple
              color='success'
              sx={{ justifyContent: "center" }}>
              {props.arrOfKeys.map((element) => (
                <Grid item key={element}>
                  <IconButton
                    disableRipple
                    onClick={() => {
                      // Create an action to be passed into the corresponding slice
                      // This filter component needs to be a child of a parent filter eg TeamFilters.jsx
                      // To pass in a parent dispatch function
                      // allowing us to use this filter componenet in multiple different pages
                      let action = {
                        title: props.title,
                        valueToChange: element,
                      };
                      dispatch(props.parentDispatchFunction(action));
                    }}
                    sx={{ borderRadius: 15 }}>
                    <Chip
                      className='hover-bg-color'
                      variant={props.dict[element] ? "filled" : "outlined"}
                      label={element}
                      color={props.dict[element] ? "success" : "default"}
                    />
                  </IconButton>
                </Grid>
              ))}
            </ButtonGroup>
          </Grid>
        </Paper>
      </Fade>
    </>
  );
}
