from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from get_schedule import get_games_on_date
from datetime import datetime
import json



def fix_date(date: str):
    date_format = "%a, %d %b %Y %H:%M:%S %Z"
    parsed_date = datetime.strptime(date, date_format)
    new_date = parsed_date.strftime("%m/%d/%Y")
    return new_date


class DateStr(BaseModel):
    value: str
app = FastAPI()

origins = [
    "http://localhost:3000/",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/date")
async def get_games_on_date_controller(data: DateStr):
    date = fix_date(data.value)
    games = get_games_on_date(date)
    #print(json.dumps(games, indent=1))
    
    # if no games type will be string
    if type(games) is str:
        return "no games"
    else:
         return JSONResponse(content=games)
   


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
