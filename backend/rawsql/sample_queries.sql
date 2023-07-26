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