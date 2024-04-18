const { query } = require('../db/db.js')

const getPlayerAverages = async (name, season) => {
  const avs = await query(`
    SELECT FORMAT(MIN(aika), 2) as min_aika, base, COUNT(*) as amount, FORMAT(AVG(lahto), 2) as avg_lahto, FORMAT(AVG(aika), 2) as avg_aika, AVG(aika - lahto) as avg_juoksu
    FROM runs
    WHERE runner = ? and YEAR(run_date) = ? and is_play = FALSE
    GROUP BY base;
  `, [ name, season ])

  return avs
}

const getPlayerAveragePlays = async (name, season) => {
  const avs = await query(`
    SELECT FORMAT(MIN(aika), 2) as min_aika, base, COUNT(*) as amount, FORMAT(AVG(lahto), 2) as avg_hallussa, FORMAT(AVG(aika), 2) as avg_suoritus, AVG(aika - lahto) as avg_heitto
    FROM runs
    WHERE runner = ? and YEAR(run_date) = ? and is_play = TRUE
    GROUP BY base;
  `, [ name, season ])

  return avs
}


const pitcherComparison = async ({ league_id, season, base }) => {
  const avs = await query(`
  SELECT lukkari, FORMAT(AVG(aika), 2) as average_time, COUNT(*) as amount, base
  FROM runs
  WHERE is_play = 0
        AND leagueId = ?
        AND YEAR(run_date) = ?
        AND base = ?
  GROUP BY lukkari
  ORDER BY average_time DESC;
  `, [ league_id, season, base ])

  return avs
}

const topRunners = async ({ league_id, season, base }) => {
  const avs = await query(`
  SELECT runner, FORMAT(AVG(aika), 2) as average_time, FORMAT(MIN(aika), 2) as min_time, COUNT(*) as amount, base
  FROM runs
  WHERE is_play = 0
        AND leagueId = ?
        AND YEAR(run_date) = ?
        AND base = ?
  GROUP BY runner
  ORDER BY average_time ASC
  LIMIT 20;
  `, [ league_id, season, base ])

  return avs
}

const getPlayerAveragesByBase = async (name, season, base) => {
  const avs = await query(`
    SELECT FORMAT(MIN(aika), 2) as min_aika, base, COUNT(*) as amount, FORMAT(AVG(lahto), 2) as avg_lahto, FORMAT(AVG(aika), 2) as avg_aika, AVG(aika - lahto) as avg_juoksu
    FROM runs
    WHERE runner = ? and YEAR(run_date) = ? and base = ? and is_play = FALSE
  `, [ name, season, base ])

  return avs
}

module.exports = { topRunners, getPlayerAverages, getPlayerAveragesByBase, getPlayerAveragePlays, pitcherComparison }