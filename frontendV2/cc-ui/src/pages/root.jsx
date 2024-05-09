import React from "react";
import { Link, Outlet } from "react-router-dom";
import NbaFooter from "../components/NbaFooter";
import { Paper, Box } from "@mui/material";
import NavBar from "../components/NavBar";
import NavBar2 from "../components/navBar2";
// import NavBar from "../components/NavBar";

export default function Root() {
  return (
    <>
      {/* <NavBar small={true} /> */}
      <NavBar2 />

      <div>
        <Outlet />
      </div>
      <NbaFooter />
    </>
  );
}
