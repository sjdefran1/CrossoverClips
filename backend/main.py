"""
Backend main server

Adds players and teams routers (endpoints)

Sets up CORS config
"""

# fast api
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import players, teams

app = FastAPI()
app.include_router(players.players_router)
app.include_router(teams.teams_router)
origins = [
    "http://localhost:3000/",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
