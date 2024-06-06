import React from "react";
import { Outlet } from "react-router-dom";
import NbaFooter from "../components/NbaFooter";
import NavBar2 from "../components/navBar2";
import { useSelector } from "react-redux";

export default function Root() {
  const fullScreenVideo = useSelector((state) => state.game.fullScreenVideo);
  return (
    <>
      <NavBar2 />
      <div>
        <Outlet />
      </div>
      {fullScreenVideo ? <br></br> : <NbaFooter />}
    </>
  );
}
