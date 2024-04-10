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

router.get('/time', async (req, res) => {
  let { base, player_name, season } = req.query; // 1 = 1-2 | 2 = 2-3 | 3 = 3-K
  let average;
  average = await runsHelper.getPlayerAverages(player_name, season, base)
  if(!average.length) {
    season = season - 1
    average = await runsHelper.getPlayerAverages(player_name, season, base)
  }

  res.json({
    times: average,
    season,
    current_base: base,
    player_name
  })
})

router.get('/play-time', async (req, res) => {
  let { base, player_name, season } = req.query; // 1 = 1-2 | 2 = 2-3 | 3 = 3-K
  let average;
  average = await runsHelper.getPlayerAveragePlays(player_name, season, base)
  if(!average.length) {
    season = season - 1
    average = await runsHelper.getPlayerAveragePlays(player_name, season, base)
  }

  res.json({
    times: average,
    season,
    current_base: base,
    player_name
  })
})

router.get('/:player_id', async (req, res) => {
  const { player_id } = req.params
  let { season } = req.query

  if(!season || season === 'undefined') {
    const date = new Date()
    season = date.getFullYear()
    season = 2024
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
  const average_plays = await runsHelper.getPlayerAveragePlays(name, season)

  res.json({ player, events_grouped_by_tilanne, averages, average_plays })
})

module.exports = router;
