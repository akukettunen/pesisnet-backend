let AWS = require("aws-sdk");
require('dotenv').config()

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: process.env.ASOFT_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.ASOFT_AWS_SECRET_ACCESS_KEY,
});

const DB = new AWS.DynamoDB.DocumentClient({ region: 'eu-north-1', convertEmptyValues: true });

const searchByFirstName = (search_string) => {
  const search_string_two_first = search_string.substring(0, 2)
  const params = {
    TableName: 'pesisplayers',
    IndexName: 'first_name_two_first_letters-first_name-index',
    KeyConditionExpression: '#fname = :fnameVal AND begins_with(#nameAttr, :search)',
    ExpressionAttributeNames: {
        '#fname': 'first_name_two_first_letters',
        '#nameAttr': 'first_name'
    },
    ExpressionAttributeValues: {
        ':fnameVal': search_string_two_first, // You need to specify this value
        ':search': search_string
    }
  };

  return DB.query(params).promise();
}

const searchByLastName = (search_string) => {
  const search_string_two_first = search_string.substring(0, 2)
  const params = {
    TableName: 'pesisplayers',
    IndexName: 'last_name_two_first_letters-last_name-index',
    KeyConditionExpression: '#fname = :fnameVal AND begins_with(#nameAttr, :search)',
    ExpressionAttributeNames: {
        '#fname': 'last_name_two_first_letters',
        '#nameAttr': 'last_name'
    },
    ExpressionAttributeValues: {
        ':fnameVal': search_string_two_first, // You need to specify this value
        ':search': search_string
    }
  };

  return DB.query(params).promise();
}

module.exports = { searchByFirstName, searchByLastName }