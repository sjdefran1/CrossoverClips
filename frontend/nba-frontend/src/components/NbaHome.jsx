import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import { Container, Grid } from "@mui/material";
import DatePicker from "./DatePicker";
//const project = projects[0];
export default function CoolCard(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Container maxWidth='lg' sx={{ mt: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DatePicker />
          </Grid>
          <Grid item xs={6}>
            <p>hello</p>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
