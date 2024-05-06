import React from "react";
import { Link, Outlet } from "react-router-dom";
import NbaFooter from "../components/NbaFooter";
import { Paper } from "@mui/material";
import NavBar from "../components/NavBar";
// import NavBar from "../components/NavBar";

export default function Root() {
  return (
    <>
      <Paper>
        <NavBar />
      </Paper>

      <nav>
        <ul>
          <li>
            <Link to={`players/2544`}>Players</Link>
          </li>
          <li>
            <Link to={`teams`}>Teams</Link>
          </li>
        </ul>
      </nav>

      <div>
        <Outlet />
      </div>
      <NbaFooter />
    </>
  );
}
