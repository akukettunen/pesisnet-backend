const { getResultBoard, handleResultBoard, getScoresBoard } = require('../utils/data')
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

router.get('/scores', async (req, res) => {
  const { seasonId, seasonSeriesId, seasonSeriesPhaseId } = req.query
  console.log({ seasonId, seasonSeriesId, seasonSeriesPhaseId })
  if(!seasonId || !seasonSeriesId || !seasonSeriesPhaseId) {
    return res.status(400).send('bad request')
  }
  
  const data = await getScoresBoard({ seasonId: parseInt(seasonId), seasonSeriesId: parseInt(seasonSeriesId), seasonSeriesPhaseId: parseInt(seasonSeriesPhaseId) })
  
  res.json( data )
})

module.exports = router;
