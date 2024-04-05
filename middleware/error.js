const errorHandler = (error, req, res, next) => {
  console.log("Error Handling Middleware called")
  console.log('Path: ', req.path)
  console.error('Error: ', error)
  console.log(JSON.stringify(error))

  if (error == 'bad request')
      res.status(400).send(error.message)
  else
      res.status(500).send(error.message)

  return
}

module.exports = errorHandler