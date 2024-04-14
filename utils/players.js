const cheerio = require('cheerio')
      axios = require('../utils/axios')
      events_db = require('../db/event')
      _ = require('lodash');

const getPlayerNamesWebsite = async () => {
  const { data } = await axios.get('http://www.pesiksenmaailma.fi/index.php/pelaajakortit');
  const $ = cheerio.load(data);

  const players = []
  $('#pelaajaid').find('option').each((i, op) => {
    players.push($(op).text())
 })

  return players
}

const getPlayerDataFromPesistulokset = async (id) => {
  if(!id) throw new Error('no player id')
  const { data } = await axios.get(`https://www.pesistulokset.fi/api/v1/stats-tool/players?player=${id}`);

  return data
}

const getPlayerEvents = async (name, season) => {
  const { Items } = await events_db.playerSeasonEvents(name, season)

  return Items
}

const getPropertyPerecntagesAndN = (events, properties) => {
  const grouped_data = _(events)
    .groupBy(e => {
      return [properties.map(p => e[p])]
    })

  return grouped_data
}

module.exports = { getPropertyPerecntagesAndN, getPlayerNamesWebsite, getPlayerDataFromPesistulokset, getPlayerEvents }