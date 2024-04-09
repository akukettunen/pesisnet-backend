const { getResultBoard, handleResultBoard, getScoresBoard } = require('../utils/data')
const { pitcherComparison } = require('../utils/runs')
const express = require('express')
      router = express.Router()

router.get('/standings', async (req, res) => {
  const { seasonId, seasonSeriesId, seasonSeriesPhaseId } = req.query
  if(!seasonId || !seasonSeriesId || !seasonSeriesPhaseId) {
    return res.status(400).send('bad request')
  }

  const { data: { result_boards } } = await getResultBoard({ seasonId: parseInt(seasonId), seasonSeriesId: parseInt(seasonSeriesId), seasonSeriesPhaseId: parseInt(seasonSeriesPhaseId) })

  res.json({ result_boards: result_boards.map( b => handleResultBoard(b) ), matchSeries: result_boards.map(b => b.matchSeries) })
})

router.get('/pitchers', async (req, res) => {
  const { league_id, season, filter_amount } = req.query

  fixed_filter_amount = filter_amount || 0

  if(!league_id || !season ) {
    return res.status(400).send('bad request')
  }

  const data = await pitcherComparison({ league_id, season, base: 1 })
  const data2 = await pitcherComparison({ league_id, season, base: 2 })

  const full_data = data.concat(data2)
  
  const filtered_by_amount_data = full_data.filter(p => p.amount > fixed_filter_amount)

  res.json(filtered_by_amount_data)
})

router.get('/scores', async (req, res) => {
  const { seasonId, seasonSeriesId, seasonSeriesPhaseId } = req.query

  if(!seasonId || !seasonSeriesId || !seasonSeriesPhaseId) {
    return res.status(400).send('bad request')
  }
  
  const data = await getScoresBoard({ seasonId: parseInt(seasonId), seasonSeriesId: parseInt(seasonSeriesId), seasonSeriesPhaseId: parseInt(seasonSeriesPhaseId) })
  
  res.json( data )
})

module.exports = router;
