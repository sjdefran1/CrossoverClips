import React from "react";
import { Outlet } from "react-router-dom";
import NbaFooter from "../components/NbaFooter";
import NavBar2 from "../components/navBar2";

export default function Root() {
  return (
    <>
      <NavBar2 />

      <div>
        <Outlet />
      </div>
      <NbaFooter />
    </>
  );
}
