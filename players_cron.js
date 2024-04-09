let AWS = require("aws-sdk");
require('dotenv').config()
const playersHelper = require('./utils/players.js')

AWS.config.update({
  region: process.env.ASOFT_S3_REGION,
  accessKeyId: process.env.ASOFT_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.ASOFT_AWS_SECRET_ACCESS_KEY,
});

var DB = new AWS.DynamoDB.DocumentClient({ region: process.env.ASOFT_S3_REGION, convertEmptyValues: true });

const getPlayers = async () => {
  const players = await playersHelper.getPlayerNamesWebsite()
  return players
}

const batchWriteManyItems = async (tableName, itemObjs, chunkSize = 25) => {

  const buildParams = (table) => JSON.parse(`{"RequestItems": {"${table}": []}}`)

  const queryChunk = (arr, size) => {
      const tempArr = []
      for (let i = 0, len = arr.length; i < len; i += size) {
          tempArr.push(arr.slice(i, i + size));
      }

      return tempArr
  }

  const chunks = queryChunk(itemObjs, chunkSize)
  Promise.all(chunks.map(chunk => {
      let itemParams = buildParams(tableName);
      itemParams.RequestItems[tableName] = chunk
      return DB.batchWrite(itemParams).promise()
  }))
  .then(e => {
    // console.log('success', e.map(e => e.UnprocessedItems.pesisplayers))
  })
  .catch(e => {
    console.log('error', e)
  })
}

getPlayers()
  .then(e => {
    const mapped = e.map((p, i) => {
      const id = p.split('(')[1].split(')')[0].toLowerCase()
      const name = p.split('(')[0].trim().toLowerCase()
      const first_name = name.split(' ')[1]?.toLowerCase()
      if(!first_name) {
        return undefined
      }
      const last_name = name.split(' ')[0]?.toLowerCase()
      if(last_name == 'pirinen') {
        console.log(name)
      }
      if(!last_name) {
        return undefined
      }
      const first_name_first_letter = first_name[0]
      const last_name_first_letter = last_name[0]
      const first_name_two_first_letters = first_name[0] + first_name[1]
      const last_name_two_first_letters = last_name[0] + last_name[1]

      if(!first_name 
        || !last_name
        || !first_name_first_letter
        || !last_name_first_letter
        || !first_name_two_first_letters
        || !last_name_two_first_letters
      ) {
        console.log('fail')
        return undefined
      }

      const player = {
        PutRequest: {
          Item: {
            id: parseInt(id),
            name: first_name + ' ' + last_name,
            first_name_first_letter,
            last_name_first_letter,
            first_name_two_first_letters,
            last_name_two_first_letters,
            first_name,
            last_name
          }
        },
      }

      return player
    })
    console.log(mapped.filter(p => p != undefined).length)
    batchWriteManyItems('pesisplayers', mapped.filter(p => p != undefined))
  })
