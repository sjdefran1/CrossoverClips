from playByPlayContext import Game, PlayByPlayContext

if __name__ == "__main__":
    game = Game(day=24, month=10, year=2023, gameId="0022300061")
    context = PlayByPlayContext(game=game)
    context.createPlayByPlay()
