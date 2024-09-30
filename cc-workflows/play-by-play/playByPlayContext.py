from playByPlayStrategy import PlayByPlayStatStategy
from playByPlayService import PlayByPlayService
from dataclasses import dataclass


@dataclass
class Game(object):
    gameId: str
    day: str
    month: str
    year: str


class PlayByPlayContext:

    def __init__(self, game: Game) -> None:
        self._strategy: PlayByPlayStatStategy
        self.api = PlayByPlayService(gameId=game.gameId)
        self.game = game

    @property
    def strategy(self) -> PlayByPlayStatStategy:
        return self._strategy

    @strategy.setter
    def strategy(self, strategy: PlayByPlayStatStategy):
        self._strategy = strategy

    def _build_url(self, play_number: str, play_url: str):
        return f"""
        https://videos.nba.com/nba/pbp/media/{self.game.year}\
        /{self.game.month}/{self.game.day}\
        /{self.game.gameId}/{play_number}/{play_url}
        """

    def createPlayByPlay(self):
        plays_response = self.api.getPlayByPlay()
        plays_to_urls = self.api.getHighlightUrls("FGM")

        for play in plays_response:
            play_number = f"{play[1]}"
            if play_number not in plays_to_urls:
                continue
            # highlight_url =
