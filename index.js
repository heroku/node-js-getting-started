const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const toiletURL = 'https://geosite.pncc.govt.nz/arcgis/rest/services/Public/WEB_Parks/MapServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=json'
const request = require('request')

let toiletData = {}
// Get the toilet data 
request(toiletURL, { json: true }, (err, resp, body) => {
  if (err) { return console.log(err) }
  
  toiletData = body.features
  console.log(toiletData)
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))