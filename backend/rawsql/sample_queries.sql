-- Plays from player with team info
select * from plays p1 
JOIN players p2 on p1.pid=p2.pid
JOIN teams t on t.tid=p1.tid
where p1.pid = 1630214 
and p1.ptype='FGM'; --opt

-- Players plays from game
select * from plays p1 
join players p2 on p1.pid=p2.pid
join teams t on t.tid=p1.tid
where p1.pid = 1630214 
and p1.ptype='FGM' --opt
and p1.gid=22201133;


-------------------------------------------------------
-- Evan Mobley all fourth quarter
-- plays **against the sixers** 
-- (plays vs matchup logic)
select distinct p1.*, p2.fname, p2.lname from plays p1
left join players p2 on p1.pid=p2.pid
join teams t on t.tid=p1.tid
join matchups m on
-- conditionally join to find matchup, 
-- don't know from play if they are home or away
  case 
        when m.htid = t.tid then m.atid=1610612755
        when m.atid = t.tid then m.htid=1610612755
  end
where p1.pid=1630596 
AND p1.quarter = 4 --opt
limit 1000; 

-- v2 -- 
-- Same as above just against list of matchups
select * from plays p1
join players p2 on p1.pid=p2.pid
join teams t on t.tid=p1.tid
join matchups m on
-- conditionally join to find matchup, 
-- don't know from play if they are home or away
  case 
        when m.htid = t.tid then m.atid IN (1610612755, 1610612741)
        when m.atid = t.tid then m.htid IN (1610612755, 1610612741)
  end
where p1.pid=1630596 
AND p1.quarter=4; -- opt

-----------------------------------------------
        -- all plays from game, J. Embiid abr
select concat(SUBSTRING(p2.fname, 1, 1), '. ', p2.lname) as pname, p1.* from plays p1 join players p2 on p1.pid=p2.pid  where gid='0022101034';

        -- viewers by date
SELECT DATE(first_visited_time) AS date_part, COUNT(*) AS count
FROM viewers
GROUP BY date_part;

-- Query Ideas

-- Matchup against team home game, away game, playoff game, reg game


-- Feel like we could string a lot of these together w/ some logic

-- Overall call for most of these in sort of function that builds the query

-- might be doing to much work myself but idk



 -- 8/4/2023 dump

 --CREATE VIEW player_plays_view AS
--select distinct 
--    p1.*, 
--    m.matchupstr,
--    m.gtype,
--    m.date,
--    m.sznstr,
--    ROW_NUMBER () OVER (ORDER BY p1.pid) AS row_number,
--    case
--        when m.atid = p1.tid then m."HWL"
--        when m.htid = p1.tid then m."AWL"
--    end as wl,
--    case
--        when m.atid = p1.tid then m.htid
--        when m.htid = p1.tid then m.atid
--    end as mid
--from plays p1
--join teams t on 
--    t.tid=p1.tid
--join matchups m on
--p1.gid = m.gid
--where p1.pid='977'

--select count(*)
--from plays p1
--join teams t on 
--    t.tid=p1.tid
--join matchups m on
--p1.gid = m.gid
--where p1.pid='977'
--and p1.ptype = 'FGM'
--
--select count(*) as query_length from  player_plays_view p;
----
--select * from player_plays_view order by row_number offset 500;
--
--drop view player_plays_view;

        -- view/download counts
--select * from plays where views > 0 ORDER BY views desc;
--select * from plays where downloads > 0 ORDER BY downloads desc;

--        -- most viewed plays by player
--select 
--   fname,
--   lname,
--   sum(plays.views) as play_views,
--   plays.pid
--from
--   plays
--join 
--   players 
--on
--   players.pid=plays.pid 
--group by 
--   plays.pid, fname, lname
--order by 
--   play_views desc;
--select matchupstr, date, gtype, views from matchups where views > 0 ORDER BY views desc;

        -- all plays from game, J. Embiid abr
--select concat(SUBSTRING(p2.fname, 1, 1), '. ', p2.lname) as pname, p1.* from plays p1 join players p2 on p1.pid=p2.pid  where gid='0022101034';

        -- viewers by date
--SELECT DATE(first_visited_time) AS date_part, COUNT(*) AS new_users
--FROM viewers
--GROUP BY date_part;
--
--select * from viewers where DATE(first_visited_time)=CURRENT_DATE or DATE(last_visited_time)=CURRENT_DATE;
--
--select count(*) from viewers;
--
--select * from viewers where SUBSTRING(ip, 1, 2) = '17';

        -- pts from game
--select description from plays where gid='41400114' and pid='2544' and ptype='FGM' order by playid desc;

--select * from plays limit 10;
--select * from viewers;

--select * from plays where ptime='0:00';





-- 
with sample as (
select distinct
    p1.*,
    m.matchupstr,
    m.gtype,
    m.date,
    m.sznstr,
    m.htid,
    m.atid,
    m.views as game_views,
    ROW_NUMBER () OVER (ORDER BY p1.pid) AS row_number,
    case
        when m.atid = p1.tid then m."HWL"
        when m.htid = p1.tid then m."AWL"
    end as wl,
    case
        when m.atid = p1.tid then m.htid
        when m.htid = p1.tid then m.atid
    end as mid
from plays p1
join teams t on
    t.tid=p1.tid
join matchups m on

p1.gid = m.gid

where p1.pid=2544 and p1.gid=m.gid

and p1.ptype in ('BLK', 'FGM')

ORDER BY playid),

ast_count AS (
        SELECT s.gid, COUNT(*) AS ast_count
        FROM sample s
        WHERE s.ptype = 'AST'
        GROUP BY s.gid
    ),
blk_count AS (
        SELECT s.gid, COUNT(*) AS blk_count
        FROM sample s
        WHERE s.ptype = 'BLK'
        GROUP BY s.gid
    ),
pts_query as (
    SELECT
        s.gid,
        s.playid,
        s.description,
        s.matchupstr,
        s.ptype,
        s.sznstr,
        s.date,
        s.tid,
        ROW_NUMBER() OVER (PARTITION BY s.gid ORDER BY s.playid DESC) AS rn
    FROM
        sample s
    WHERE
        s.ptype = 'FGM'
    )
    
SELECT
    f.gid,
    f.playid,
    f.description,
    f.matchupstr,
    m.atid,
    m.htid,
    f.sznstr,
    m."HWL",
    m."HPTS",
    m."APTS",
    m.views,
    f.date,
    f.rn,
    case
        when m.atid = f.tid then m."HWL"
        when m.htid = f.tid then m."AWL"
    end as pwl,
    COALESCE(ast_count.ast_count, 0) AS ast_count, -- Add AST count with default value 0
    COALESCE(blk_count.blk_count, 0) AS blk_count -- Add BLK count with default value 0
FROM
    pts_query f
JOIN
    matchups m ON f.gid = m.gid
LEFT JOIN
    ast_count ON f.gid = ast_count.gid
LEFT JOIN
    blk_count ON f.gid = blk_count.gid

WHERE
    f.rn = 1

ORDER BY playid;
