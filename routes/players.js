const express = require('express')
      router = express.Router()
      helper = require('../utils/helper')
      playersHelper = require('../utils/players')
      runsHelper = require('../utils/runs')
      player_db = require('../db/player.js')
      axios = require('axios')

router.get('/', async (req, res) => {
  const players = await playersHelper.getPlayerNamesWebsite()
  res.send({ players })
})

router.get('/query/:search_string', async (req, res) => {
  const { search_string } = req.params;

  const first = player_db.searchByFirstName(search_string)  
  const last = player_db.searchByLastName(search_string)  

  let names = await Promise.all([first, last])
  names = names.map(n => n.Items).flat()
  res.json({ players: names, search_string  })
})

router.get('/:player_id', async (req, res) => {
  const { player_id } = req.params
  let { season } = req.query

  if(!season || season === 'undefined') {
    const date = new Date()
    season = date.getFullYear()
    season = 2023
  }

  if(!player_id) throw new Error('no player_id')

  let { maps: { player } } = await playersHelper.getPlayerDataFromPesistulokset(player_id)
  
  if(!player) throw new Error('player not found!')

  player = player[0]?.value
  const { name } = player

  // Get all season events of player
  const events = await playersHelper.getPlayerEvents(name, season)
  const events_grouped_by_tilanne = playersHelper.getPropertyPerecntagesAndN(events, ['tilanne'])
  const averages = await runsHelper.getPlayerAverages(name, season)

  res.json({ player, events_grouped_by_tilanne, averages })
})

module.exports = router;
