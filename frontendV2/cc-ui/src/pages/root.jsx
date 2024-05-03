import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <h1>This is the landing Page</h1>

      <h2>Below is the child content</h2>

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
      <h5>This is in Root but below players</h5>
    </>
  );
}
