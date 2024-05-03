import { createAsyncThunk } from "@reduxjs/toolkit";

class TeamService {
  async getTeams() {
    const response = await fetch(`https://nbaclipsite.onrender.com/teams`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Fetch failed");
    // console.log(response.json());
    return await response.json();
  }
}

export default new TeamService();
