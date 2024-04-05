const express = require('express')
      app = express()
      cors = require('cors')
      bodyParser = require('body-parser')
      // cookieParser = require('cookie-parser')
      require('express-async-errors');
      errorMiddleware = require('./middleware/error.js')

app.use(bodyParser.json({limit: '50mb'}))
app.use(cors({
  origin: '*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  optionsSuccessStatus: 200
}))

const games = require('./routes/games')
const runs = require('./routes/runs')
const players = require('./routes/players')
const maps = require('./routes/maps')
const data = require('./routes/data')

app.use('/api/v1/games', games)
app.use('/api/v1/runs', runs)
app.use('/api/v1/players', players)
app.use('/api/v1/maps', maps)
app.use('/api/v1/data', data)

app.use(errorMiddleware)

var port = process.env.PORT || 2020;

app.listen(port, process.env.IP, function() {
    console.log("🚀 tiimi.io server started at port " + port + " 🚀")
});
