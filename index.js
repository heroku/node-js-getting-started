// var express = require('express');
// var app = express();
//
// app.set('port', (process.env.PORT || 5000));
//
// app.use(express.static(__dirname + '/public'));
//
// // views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
//
// app.get('/', function(request, response) {
//   response.render('pages/index');
// });
//
// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });

// 'use strict'
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const Bot = require('bot')


let bot = new Bot({
  token: process.env.PAGE_ACCESS_TOKEN,
  verify: process.env.VERIFY_TOKEN,
  app_secret: process.env.APP_SECRET
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

let app = express()

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  return bot._verify(req, res)
})

app.post('/', (req, res) => {
  bot._handleMessage(req.body.entry)
  res.end(JSON.stringify({status: 'ok'}))
})

app.listen(app.get('port'), function() {
  console.log('Bot is running on port', app.get('port'));
});
// http.createServer(app).listen(3000)
