# Going to attempt to apply the strategy pattern to my code to build
# out play by plays matched to their url highlight

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Play(object):
    description: str
    url: str
    quarter: int
    teamId: str
    score: str
    time: str
    playerId: str


@dataclass
class Player(object):
    playerId: int
    firstInitialLast: str
    teamId: int


class PlayByPlayStatStategy(ABC):
    """
    Handles Parsing nba json to create objects that match the
    database schema for different stat types
    """

    @abstractmethod
    def handle_stat(self, action: dict, highlight_url: str) -> Play:
        """
        create Play obj that stores relevant informaiton to be inserted
        into pgres database in the plays table
        """
        pass

    @abstractmethod
    def get_player(self, action: dict) -> Player:
        pass


class AssistStrategy(PlayByPlayStatStategy):
    def handle_stat(self, action: dict, highlight_url: str) -> Play:
        play: Play = Play(
            description=action[9] if action[7] is None else action[7],
            url=highlight_url,
            quarter=action[4],
            teamId=action[22],
            score=action[10],
            time=action[6],
            playerId=action[20],
        )
        return play

    def get_player(self, action: dict) -> Player:
        player: Player = Player(
            playerId=action[22], firstInitialLast=action[21], teamId=action[20]
        )
        return player


class FgmStrategy(PlayByPlayStatStategy):
    def handle_stat(self, action: dict, highlight_url: str) -> Play:
        play: Play = Play(
            description=action[9] if action[7] is None else action[7],
            url=highlight_url,
            quarter=action[4],
            teamId=action[15],
            score=action[10],
            time=action[6],
            playerId=action[13],
        )
        return play

    def get_player(self, action: dict) -> Player:
        player: Player = Player(
            playerId=action[15], firstInitialLast=action[14], teamId=action[13]
        )
        return player


class DunkStrategy(FgmStrategy):
    def handle_stat(self, action: dict, highlight_url: str) -> Play:
        desc = action[9] if action[7] is None else action[7]  # home desc or away desc
        if "Dunk" not in desc:
            return
        return super().handle_stat(action, highlight_url)

    def get_player(self, action: dict) -> Player:
        return super().get_player(action)


class BlockStrategy(PlayByPlayStatStategy):
    def handle_stat(self, action: dict, highlight_url: str) -> Play:
        description = action[7] if ("BLOCK" in action[7]) else action[9]
        play: Play = Play(
            description=description,
            url=highlight_url,
            quarter=action[4],
            teamId=action[29],
            score=action[10],
            time=action[6],
            playerId=action[27],
        )
        return play

    def get_player(self, action: dict) -> Player:
        player: Player = Player(
            playerId=action[29], firstInitialLast=action[28], teamId=action[27]
        )
        return player


class StealStrategy(PlayByPlayStatStategy):
    def handle_stat(self, action: dict, highlight_url: str) -> Play:
        try:
            description = action[7] if ("STEAL" in action[7]) else action[9]
            play: Play = Play(
                description=description,
                url=highlight_url,
                quarter=action[4],
                teamId=action[15],
                score=action[10],
                time=action[6],
                playerId=action[13],
            )
            return play
        except:
            # possibly raise custom exception here
            return

    def get_player(self, action: dict) -> Player:
        player: Player = Player(
            playerId=action[22], firstInitialLast=action[21], teamId=action[20]
        )
        return player
