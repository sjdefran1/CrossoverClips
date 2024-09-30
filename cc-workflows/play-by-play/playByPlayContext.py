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

    def __init__(self, strategy: PlayByPlayStatStategy, game: Game) -> None:
        self._strategy = strategy
        self.game = game
        self.api = PlayByPlayService(gameId=game.gameId)

    @property
    def strategy(self) -> PlayByPlayStatStategy:
        return self._strategy

    @strategy.setter
    def strategy(self, strategy: PlayByPlayStatStategy):
        self._strategy = strategy
