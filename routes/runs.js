const express = require('express')
      router = express.Router()
      runsHelper = require('../utils/runs')

router.get('/:player_name', async (req, res) => {
  const { player_name } = req.params
  const averages = await runsHelper.getPlayerAverages(player_name, 2023)

  res.json(averages)
})

module.exports = router;
