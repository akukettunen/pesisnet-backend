const axios = require('axios')

const gamesByDate = date => {
  return axios(`https://www.pesistulokset.fi/api/v1/matches-per-date?date=${date}`)
}

const gameDates = season => {
  return axios(`https://www.pesistulokset.fi/api/v1/match-dates?season=${season}`)
}

const gameBasicData = id => {
  return axios(`https://www.pesistulokset.fi/api/v1/public/match?id=${id}&apikey=${process.env.API_KEY}`)
}

const gamePoll = (id, after) => {
  return axios(`https://www.pesistulokset.fi/api/v1/online/${id}/events?after=${after}`)

}

const gameData = async (date, id) => {
  const { data: { data, maps } } = await gamesByDate(date)
  if(!data) throw new Error('game not found')
  let game = data.find(g => g.id == id)

  if(typeof game['home'] !== 'object') game['home'] = maps.team.find(t => t.id == game.home)['value']
  if(typeof game['away'] !== 'object') game['away'] = maps.team.find(t => t.id == game.away)['value']

  return game
}

const handleGamesData = ({ games, maps }) => {
  let organizers = maps.organizer?.map(o => o.value).sort((a, b) => a.id - b.id)
  organizers = organizers?.map(o => {
    return {
      ...o,
      levels: _orderedOrgLevels(o.id, games, maps)
    }
  })

  return organizers
}

const _orderedOrgLevels = (org_id, games, maps) => {
  // get all level_ids from games that have this organizator
  let level_ids = []

  games.forEach(g => {
    if(g.series.organizer === org_id && !level_ids.includes(g.series.level)) level_ids.push(g.series.level)
  })

  let levels = level_ids.map(l_id => {
    let level = maps.level.find(l => l.id === l_id)?.value
    return level
  })

  levels = levels.sort((a, b) => a.weight - b.weight)

  return levels.map(level => {
    return {
      id: level.id,
      name: level.name,
      regions: _levelRegions(level.id, games, maps),
      seasonSerieses: _orderedRegionOrLevelSeasonSerieses(null, games, maps, level.id)
    }
  })
}

const _levelRegions = (level_id, games, maps) => {
  let region_ids = []

  games.forEach(g => {
    if(g.series.level === level_id && !region_ids.includes(g.series.region) && !!g.series.region) region_ids.push(g.series.region)
  })

  let regions = region_ids.map(r_id => {
    let region = maps.region.find(r => r.id === r_id)?.value
    return region
  })
  regions = regions.map(r => {
    return {
      ...r,
      seasonSerieses: _orderedRegionOrLevelSeasonSerieses(r.id, games, maps, level_id)
    }
  })

  return regions
}

const _orderedRegionOrLevelSeasonSerieses = (region_id, games, maps, level_id) => {
  let series_ids = []

  if(region_id) {
    games.forEach(g => {
      if(
        g.series.level === level_id && 
        g.series.region === region_id && 
        !series_ids.includes(g.series.seasonSeries)
      ) series_ids.push(g.series.seasonSeries)
    })
  } else {
    games.forEach(g => {
      if(
        g.series.level === level_id && 
        !g.series.region &&
        !series_ids.includes(g.series.seasonSeries)
      ) series_ids.push(g.series.seasonSeries)
    })
  }

  let serieses = series_ids.map(s_id => {
    let series = maps.seasonSeries.find(s => s.id === s_id)?.value
    return series
  })

  serieses = serieses.sort((a, b) => a.weight - b.weight)

  serieses = serieses.map(s => {
    const groups = _orderedSeasonSeriesGroups(s.id, games, maps, level_id, region_id)
    if(!groups.length) return s
    else return groups.map(group => {
      return {
        ...s,
        group_id: group.id,
        group_name: group.name
      }
    })
  })

  serieses = serieses.flat().map(s => {
    return {
      ...s,
      games: _seasonSeriesGames(s.id, s.group_id, games, maps)
    }
  })

  return serieses.flat()
}

const _orderedSeasonSeriesGroups = (series_id, games, maps, level_id, region_id) => {
  let group_ids = []
  games.forEach(g => {
    if(
      g.series.seasonSeries === series_id
      && g.series.level === level_id
      && g.series.region === region_id
      && !group_ids.includes(g.series.group)
    ) group_ids.push(g.series.group)
  })

  let groups = group_ids.map(g_id => {
    let group = maps.group.find(g => g.id === g_id)?.value
    return group
  })

  groups = groups.sort((a, b) => a.weight - b.weight)

  return groups
}

const _seasonSeriesGames = (series_id, group_id, games, maps) => {
  let return_games = games.filter(g => {
    if(group_id) {
      return g.series.seasonSeries === series_id && g.series.group === group_id
    } else {
      return g.series.seasonSeries === series_id
    }
  })

  return_games = return_games.map(game => {
    if(typeof game['home'] === 'object') {
      return game
    }

    return {
      ...game,
      home: getTeamById({ team_id: game.home, maps }),
      away: getTeamById({ team_id: game.away, maps })
    }
  })

  return return_games
}

const gameEvents = id => {
  return axios(`https://www.pesistulokset.fi/api/v1/online/${id}/events`)
}




















const getTeamById = ({ team_id, maps }) => {
  return maps?.team?.find(team => team.id === team_id)?.value
}


module.exports = { gamePoll, gameData, gameBasicData, gameEvents, handleGamesData, gamesByDate, gameDates }