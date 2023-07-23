-- Restore script

 --HOUSEKEEPING FOR BAD DATA --------

  -- broken game
DELETE FROM plays WHERE gid=21700211; 
DELETE FROM matchups WHERE gid=21700211;

-- Indexes ---------------------------------

  --plays
DROP INDEX IF EXISTS plays_gid_idx;
DROP INDEX IF EXISTS plays_pid_idx;
DROP INDEX IF EXISTS plays_url_idx;

CREATE INDEX plays_gid_idx ON plays(gid);
CREATE INDEX plays_pid_idx ON plays(pid);
CREATE INDEX plays_url_idx on plays(url);
  --teams
DROP INDEX IF EXISTS teams_tid;
CREATE INDEX teams_tid on teams(tid);

  --players
DROP INDEX IF EXISTS players_pid;
DROP INDEX IF EXISTS players_tid;
CREATE INDEX players_pid on players(pid);
CREATE INDEX players_tid on players(tid);

  --matchups
DROP INDEX IF EXISTS matchups_gid;
CREATE INDEX matchups_gid on matchups(gid);
-------------------------------------------------------------

-- Primary Keys
----------------------------------------------
ALTER TABLE plays DROP CONSTRAINT IF EXISTS pk_plays;
ALTER TABLE matchups DROP CONSTRAINT IF EXISTS pk_matchups;
ALTER TABLE players DROP CONSTRAINT IF EXISTS pk_players;
ALTER TABLE teams DROP CONSTRAINT IF EXISTS pk_teams;

ALTER TABLE plays ADD CONSTRAINT pk_plays PRIMARY KEY (playid);
ALTER TABLE players ADD CONSTRAINT pk_players PRIMARY KEY (pid);
ALTER TABLE teams ADD CONSTRAINT pk_teams PRIMARY KEY (tid);
ALTER TABLE matchups ADD CONSTRAINT pk_matchups PRIMARY KEY (gid);
-----------------------------------------------------------


-- Foreign Keys
-----------------------------------------------------------

 --plays

ALTER TABLE plays DROP CONSTRAINT IF EXISTS fk_gid;
ALTER TABLE plays DROP CONSTRAINT IF EXISTS fk_pid;
ALTER TABLE plays DROP CONSTRAINT IF EXISTS fk_tid;

ALTER TABLE plays
ADD CONSTRAINT fk_pid
FOREIGN KEY (pid)
REFERENCES players (pid);

ALTER TABLE plays
ADD CONSTRAINT fk_gid
FOREIGN KEY (gid)
REFERENCES matchups (gid);

ALTER TABLE plays
ADD CONSTRAINT fk_tid
FOREIGN KEY (tid)
REFERENCES teams (tid);

 --players
ALTER TABLE players DROP CONSTRAINT IF EXISTS fk_tid;

-- players w/ pid=0, has to be done after
-- teams creates pid
INSERT INTO teams (tid, full_name, abbreviation, nickname, city, state, year_founded)
VALUES
    (0, 'INACTIVE/FREE AGENT', '', '', '', '', 0000)
ON CONFLICT (tid)
DO NOTHING; 

ALTER TABLE players
ADD CONSTRAINT fk_tid
FOREIGN KEY (tid)
REFERENCES teams (tid);

--Matchups
ALTER TABLE matchups DROP CONSTRAINT IF EXISTS fk_htid;
ALTER TABLE matchups DROP CONSTRAINT IF EXISTS fk_atid;

ALTER TABLE matchups
ADD CONSTRAINT fk_htid
FOREIGN KEY (htid)
REFERENCES teams (tid);

ALTER TABLE matchups
ADD CONSTRAINT fk_atid
FOREIGN KEY (atid)
REFERENCES teams (tid)