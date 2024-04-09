const express = require('express')
      router = express.Router()
      helper = require('../utils/helper')
      gamesHelper = require('../utils/games')
      axios = require('axios')
      require('dotenv')
      _ = require('lodash');
      require('express-async-errors');

router.get('/', async (req, res) => {
  /*
    org
      name
      id
      levels
        name
        id
        regions
          name
          id
          seasonSerieses
            groupName (null)
            groupId (null)
            name
            id
            games
        seasonSerieses
          groupName (null)
          groupId (null)
          name
          id
          games
  */
  // organizer -> seasonSerieses
  const { date } = req.query;
  if(!date) throw new Error('date required')

  // parse season year
  let year = date.split('-')[0]
  const month = date.split('-')[1]

  if(!year) throw new Error("Couldn't parse year from date")
  if(!month) throw new Error("Couldn't parse month from date")

  if(Number(month) > 9) year++

  const { data: { data: date_games, maps } } = await gamesHelper.gamesByDate(date)
  const orgs = gamesHelper.handleGamesData({ games: date_games, maps })

  res.json({ organizers: orgs })
})

router.get('/poll/:game_id', async (req, res) => {
  const { after } = req.query;
  const { game_id } = req.params;

  // A hack. The pesistulokset.fi is fucked up
  const url_encodedish_after = after.replace('+', '%2B')

  let { data } = await gamesHelper.gamePoll(game_id, url_encodedish_after)

  res.json(data)
})

router.get('/dates', async (req, res) => {
  // returns the known gamedates by year
  const { season } = req.query;
  if(!season) throw new Error('season required')

  const { data: { dates } } = await gamesHelper.gameDates(season)

  res.json(dates)
})

router.get('/:id', async (req, res) => {
  const { data: game } = await gamesHelper.gameBasicData( req.params.id )
  if(!game) throw new Error('game not found!')

  const date = game.date.split('T')[0]
  const { data } = await gamesHelper.gameEvents( req.params.id )
  const { events, finished } = data
  const gameData = await gamesHelper.gameData( date, req.params.id )

  /*
  {
    events: [],
    period: 
    inning: 
    team:
    bat_turn:
    finished: false || true
  }
  */

  res.json({ game, events: events || [], gameData, finished })
})

module.exports = router;
