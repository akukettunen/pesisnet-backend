/**
 * Forms the raw outfield events into data by player
 * @param {Array<Object>} data - The raw events array
 * @returns {Object} - The content of the S3 object.
 */
const formOutfieldData = (events) => {
  var players = {}

  /*
    A player
    'Jari Miettunen': {
      outs: 5,
      unforced_error: 10,
      error: 11,
      success: 5,
      total: 20,
      succes_percentage: .5,
      error_percentage: .2
    }
  */

  /*
    'onnistuminen',
    'kiinniottovirhe_pesalla',
    'kiinniottovirhe',
    'pakotettu_epaonnistuminen',
    'kiinniottovirhe_vapaa',
    'muu_virhe',
    null,
    'harhaheitto'
  */

  // add stats per player
  events.forEach(event => {
    players = _handleARowOfEvents(players, event)
  })

  // form percentages
  players = _formPercentages(Object.values(players))

  return players.sort((a, b) => {
    return - a.outs + b.outs
  })
}

/**
 * Handles a row of player data
 * @param {Object} players - The players object
 * @param {Object} event - The event row
 * @returns {Object} The modified players object
 */
_handleARowOfEvents = (players, event) => {
  const player = event['up_suorittaja'] 

  if(!player) return players
  if(
    player
    && !players[player]
  ) players[player] = {
    total: 0,
    errors: 0,
    success: 0,
    outs: 0,
    player: player
  }

  if(
    !event.ulkopelisuoritus_tulos
    || event.ulkopelisuoritus_tulos == 'kiinniottovirhe_vapaa'
  ) return players

  // add one to total
  players[player]['total'] = players[player]['total'] + 1

  switch(event.ulkopelisuoritus_tulos) {
    case 'onnistuminen':
      players[player]['success'] = players[player]['success'] + 1
      break;
    case 'kiinniottovirhe':
      players[player]['errors'] = players[player]['errors'] + 1
      break;
    case 'harhaheitto':
      players[player]['errors'] = players[player]['errors'] + 1
      break;
  }

  if(Object.values(event.changes).includes('X')) players[player]['outs'] = players[player]['outs'] + 1 

  return players
}

_formPercentages = (players) => {
  players = players.map(player => {
    const errorsPerOuts 
      = player['outs'] == 0 || player['errors'] == (0).toFixed(3) ?
      0
      : (player['errors'] / player['outs']).toFixed(3)
      
    return {
      ...player,
      errorsPerOuts
    }
  })

  return players
}

module.exports = { formOutfieldData }