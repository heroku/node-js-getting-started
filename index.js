const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/privacypolicy', (req, res) => res.render('pages/privacypolicy'))
  .get('/termsofuse', (req, res) => res.render('pages/termsofuse'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
