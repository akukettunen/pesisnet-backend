const { query } = require('../db/db.js')

const getPlayerAverages = async (name, season) => {
  const avs = await query(`
    SELECT ROUND(MIN(aika), 2) as min_aika, base, COUNT(*) as amount, ROUND(AVG(lahto), 2) as avg_lahto, ROUND(AVG(aika), 2) as avg_aika, AVG(aika - lahto) as avg_juoksu
    FROM runs
    WHERE runner = ? and YEAR(run_date) = ?
    GROUP BY base;
  `, [ name, season ])

  return avs
}

module.exports = { getPlayerAverages }