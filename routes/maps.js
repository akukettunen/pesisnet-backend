const { getAndParseBaseData } = require('../utils/helper')
const express = require('express')
      router = express.Router()
      playersHelper = require('../utils/players')
      runsHelper = require('../utils/runs')
      axios = require('../utils/axios')

router.get('/', async (req, res) => {
  const baseData = await getAndParseBaseData()

  res.json({ maps: baseData })
})

module.exports = router;
