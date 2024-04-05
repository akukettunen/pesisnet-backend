require('dotenv').config()
const mysql = require('mysql');
      promisify = require('util');

const databaseConfig = {
  connectionLimit: 1000,
  host: "epesis2.cgizl8uo5piu.eu-central-1.rds.amazonaws.com",
  user: "admin",
  password: process.env.DB_PASSWORD,
  database: 'epesis'
};

const pool = mysql.createPool(databaseConfig)
const promiseQuery = promisify.promisify(pool.query).bind(pool)
const promisePoolEnd = promisify.promisify(pool.end).bind(pool)

module.exports = { query: promiseQuery };