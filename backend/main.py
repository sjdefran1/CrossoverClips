"""
Backend main server

Adds players and teams routers (endpoints)

Sets up CORS config
"""

# fast api
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.pgresdatabase import create_connections, ping_db
from routers import players, teams, playbyplay
from routers import pgresdatabase as db

# from db.pgresdatabase import create_connections

app = FastAPI()
app.include_router(players.players_router)
app.include_router(teams.teams_router)
app.include_router(playbyplay.playbyplay_router)

origins = ["http://localhost:3000/", "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup() -> None:
    create_connections()


@app.on_event("shutdown")
async def shutdown() -> None:
    """runs when server shutsdown, closes out connection and cursor to db"""
    print("\tCLOSING CURSOR & CONNECTION")
    db.psy_cursor.close()
    db.psyconn.close()
    print("\tCLOSED")
    return


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
