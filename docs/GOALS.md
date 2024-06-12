# Front End Redesign


## Adding Redux

> There is a ton of insanely complex logic in this frontend currently from prop drilling and trying to maintain state for when the user presses the back arrow...

After discovering redux recently it seems like it could be very useful for this project. Although, I have seen a lot of negativity about redux complaining it makes systems even more complex.. so need to brainstorm on if this project really requires it


## Adding Users ??

If I want this site to grow some traction, or at least have a better gauge for it I think adding users could be a huge W. I was hesitatnt to do so because adding it to the current frontend state will be a nightmare. I feel that with a redux system it would be much easier to maintain user state across the site

If I were to do so some ideas of the top of the head

- Favorite teams
- Save highlights to ur account (for future reference)
- Comment on plays
- customize a profile page
- create posts "analyze"
- download videos with options
  - screen ratio
  - watermark??
- new stat types
  - fg missed
  - reb
  - foul?

## improve mobile design




## Complete rethink of routing and how the home page works
  - Teams, Date, and Players all need to become their own route/page

    ```
    /home
    ```
    - Simple landing page, have buttons to lead to the new routes
    - maybe an update log
    - users? display your favorite teams highlights from tonight blah blah


    
    ```
    /teams/ (choose by team)
    /teams/id1 (1 team)
    /teams/id1/vs/id2 (2 teams) (matchup)
    ```
    - basic team dash setup
    - reroute based on how many teams selected / whose selected
    - filter system

    Possible Redux States
    
    - teamOneSelected data
    - teamTwoSelected data
    - Filter Options
      - seasons
      - playoff/regular
      - add: wins/losses
      - add: overtime
    - RecentGameList


    


