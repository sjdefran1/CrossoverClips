import requests

headers = {
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "Origin": "https://www.nba.com",
    "Referer": "https://www.nba.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
}


class PlayByPlayService:
    def __init__(self, gameId: str) -> None:
        self.gameId = gameId

    def _get_action_to_url(self, url: str):
        if url["lurl"]:
            # 'https://videos.nba.com/nba/pbp/media/2023/02/16/0022200885/9/e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4'
            # ['9/', 'e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4']
            # ['9', 'e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4']
            return url["lurl"].split(f"{self.gameId}/")[1].split("/")

    def getPlayByPlay(self) -> dict:
        try:
            url = f"https://stats.nba.com/stats/playbyplayv2?EndPeriod=9&GameID={self.gameId}&StartPeriod=1"
            response = requests.get(url=url, headers=headers, timeout=15)
            response = dict(response.json())
            return response
        except:
            # raise something
            print("request timeout")

    def getHighlightUrls(self, stat_type: str) -> dict[str, str]:
        params: dict = {
            "GameID": self.gameId,  # not required,
            "ContextMeasure": stat_type,
            "Month": "0",  # required //
            "OpponentTeamID": "0",  # required //
            "Period": "0",  # required //
            "PlayerID": "0",  # required nullable
            #'RangeType': '0', # not required
            #'Season': '2022-23', # not required
            #'SeasonType': 'Regular Season', # not required
            #'StartPeriod': '0', # not required
            #'StartRange': '0', # not required
            "TeamID": "0",  # required //
        }
        try:
            print(f"Making request to VideoDetail Asset ({stat_type})...")
            response = requests.get(
                "https://stats.nba.com/stats/videodetailsasset",
                params=params,
                headers=headers,
                timeout=15,
            )
            print("Request to VideoDetail Asset complete")
            urls = response.json()["resultSets"]["Meta"]["videoUrls"]
            action_to_url: dict = {}
            for url in urls:
                split_url = self._get_action_to_url(url=url)
                action_to_url.update({split_url[0]: split_url[1]})
            return action_to_url
        except:
            print("request Timeout")
            return
