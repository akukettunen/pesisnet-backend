const express = require('express')
      router = express.Router()
      awsHelper = require('../utils/aws')
      outfieldHelper = require('../utils/outfield')
      axios = require('../utils/axios')
      GENERAL_S3_KEY = 'outfielder-stats-latest.json'
      BUCKET_NAME = 'epesis2-outfielder-stats'

router.get('/', async (req, res) => {
  try {
    const data = await awsHelper.fetchS3Object(
      BUCKET_NAME,
      GENERAL_S3_KEY
    )
    const formed_data = outfieldHelper.formOutfieldData(JSON.parse(data))
    res.json( formed_data )
  } catch(e) {
    console.log(e)
  }
})

module.exports = router;
