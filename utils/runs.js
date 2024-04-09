const { query } = require('../db/db.js')

const getPlayerAverages = async (name, season) => {
  const avs = await query(`
    SELECT ROUND(MIN(aika), 2) as min_aika, base, COUNT(*) as amount, ROUND(AVG(lahto), 2) as avg_lahto, ROUND(AVG(aika), 2) as avg_aika, AVG(aika - lahto) as avg_juoksu
    FROM runs
    WHERE runner = ? and YEAR(run_date) = ? and is_play = FALSE
    GROUP BY base;
  `, [ name, season ])

  return avs
}

const getPlayerAveragePlays = async (name, season) => {
  const avs = await query(`
    SELECT ROUND(MIN(aika), 2) as min_aika, base, COUNT(*) as amount, ROUND(AVG(lahto), 2) as avg_hallussa, ROUND(AVG(aika), 2) as avg_suoritus, AVG(aika - lahto) as avg_heitto
    FROM runs
    WHERE runner = ? and YEAR(run_date) = ? and is_play = TRUE
    GROUP BY base;
  `, [ name, season ])

  return avs
}


const pitcherComparison = async ({ league_id, season, base }) => {
  const avs = await query(`
  SELECT lukkari, ROUND(AVG(aika), 2) as average_time, COUNT(*) as amount, base
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


const getPlayerAveragesByBase = async (name, season, base) => {
  const avs = await query(`
    SELECT ROUND(MIN(aika), 2) as min_aika, base, COUNT(*) as amount, ROUND(AVG(lahto), 2) as avg_lahto, ROUND(AVG(aika), 2) as avg_aika, AVG(aika - lahto) as avg_juoksu
    FROM runs
    WHERE runner = ? and YEAR(run_date) = ? and base = ? and is_play = FALSE
  `, [ name, season, base ])

  return avs
}

module.exports = { getPlayerAverages, getPlayerAveragesByBase, getPlayerAveragePlays, pitcherComparison }