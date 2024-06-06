import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  IconButton,
  Avatar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import trophyGif from "../../static/trophy.gif";
import playoffs from "../../static/bracket.jpg";
import { useNavigate } from "react-router-dom";
import { quickLinks } from "./dateMeta";
import { useDispatch } from "react-redux";
import { setQuickLink } from "./dateSlice";

export default function QuickLinks2(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const customNavigate = (date) => {
    dispatch(setQuickLink(true));
    navigate(date);
  };
  return (
    <>
      <Accordion defaultExpanded={props.defaultExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2-content'
          id='panel2-header'>
          <Typography>Quick links</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ maxHeight: "50vh", overflowY: "scroll", width: "100%" }}>
          <Alert severity='info' sx={{ justifyContent: "center" }}>
            Click the icons/buttons to navigate
          </Alert>
          <TableContainer>
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow key={"headers"}>
                  <TableCell key={"season"} align='center'>
                    Season Start
                  </TableCell>
                  <TableCell key={"playoffs"} align='center'>
                    Playoffs
                  </TableCell>
                  <TableCell key={"finals"} align='center'>
                    Finals
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quickLinks.map((season) => {
                  const [seasonYear, dates] = Object.entries(season)[0];
                  return (
                    <>
                      <TableRow
                        key={seasonYear}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}>
                        <TableCell align='center' key={dates.openingDay}>
                          <Button
                            variant='contained'
                            color='info'
                            onClick={() => customNavigate(dates.openingDay)}
                            sx={{ my: 2 }}>
                            {seasonYear}
                          </Button>
                        </TableCell>

                        <TableCell align='center' key={dates.playoffs}>
                          <IconButton
                            onClick={() => customNavigate(dates.playoffs)}>
                            <Avatar
                              sx={{ height: 56, width: 56 }}
                              src={playoffs}
                            />
                          </IconButton>
                        </TableCell>
                        <TableCell align='center' key={dates.finals}>
                          <IconButton
                            onClick={() => customNavigate(dates.finals)}>
                            <Avatar
                              sx={{ height: 56, width: 56 }}
                              src={trophyGif}
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
