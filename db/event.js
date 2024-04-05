let AWS = require("aws-sdk");
require('dotenv').config()

AWS.config.update({
  region: process.env.S3_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const DB = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1', convertEmptyValues: true });

playerSeasonEvents = (player_name, season) => {
  season = season.toString()
  var params = {
    TableName : "event",
    IndexName: "lyoja-date-index",
    KeyConditionExpression: "#l = :lyoja and begins_with(#d, :date)",
    ExpressionAttributeNames:{
      "#l": "lyoja",
      "#d": "date"
    },
    ExpressionAttributeValues: {
      ":lyoja": player_name,
      ":date": season
    }
  }

  return DB.query(params).promise()
}

module.exports = { playerSeasonEvents }