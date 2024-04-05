const axios = require('axios')
const cheerio = require('cheerio')

const getBaseData = () => {
  return new Promise((resolve, reject) => {
    axios('https://pesistulokset.fi/kaikki')
      .then(e => {
        resolve(e)
      })
      .catch(e => {
        reject(e)
      })
  })
}

const getAndParseBaseData = () => {
  return new Promise(async (resolve, reject) => {
    let e;
    try {
      e = await getBaseData()
    } catch(err) {
      reject(err)
    }

    let seriesSettings;
    try {
      const $ = cheerio.load(e.data)
      const a = $('#seriesSettings').get()
      seriesSettings = JSON.parse(a[0].children[0].data)
    } catch(e) {
      reject(e)
    }
  
    resolve(seriesSettings)
  })
}

module.exports = { getBaseData, getAndParseBaseData }