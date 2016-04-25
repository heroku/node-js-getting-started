'use strict'
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const Bot = require('./bot')
const Wit = require('node-wit').Wit;

// Wit.ai bot specific code
// Setting up our bot

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

const findOrCreateSession = (fbid) => {
  let sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
  }
  return sessionId;
};

// Wit.ai bot engine actions
const actions = {
  say(sessionId, context, message, cb) {
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      bot.sendMessage(recipientId, message, (err, resp, data) => {
        if (err) throw err
        console.log(`Oops! An error occurred while forwarding the response to ${recipientId}: ${err.message}`)
      })
      // Let's give the wheel back to our bot
      cb();
    } else {
      console.log('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      cb();
    }
  },
  merge(sessionId, context, entities, message, cb) {
    cb(context);
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },
  // implement custom actions here
  // See https://wit.ai/docs/quickstart
};

const wit = new Wit(process.env.WIT_SERVER_ACCESS_TOKEN, actions);

let bot = new Bot({
  fb_app_id: process.env.FB_APP_ID,
  fb_page_id: process.env.FB_PAGE_ID,
  fb_page_access_token: process.env.FB_PAGE_ACCESS_TOKEN,
  fb_page_verify_token: process.env.FB_VERIFY_TOKEN,
  fb_app_secret: process.env.FB_APP_SECRET,

  wit_app_id: process.env.WIT_APP_ID,
  wit_server_token: process.env.WIT_SERVER_ACCESS_TOKEN,
  wit_client_token: process.env.WIT_CLIENT_ACCESS_TOKEN,
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text //message

  let atts = payload.message.attachments;
  // We retrieve the user's current session, or create one if it doesn't exist
  // This is needed for our bot to figure out the conversation history
  const sessionId = findOrCreateSession(payload.sender.id);

  if (atts) {
    //received an attachments
    let autoReply = 'Sorry, I can only handle text messages for now.'
    reply({autoReply}, (err) => {
      if (err) throw err
      console.log(`Echoed back: ${autoReply}`)
    })
  } else if (text) {
    //received a text message
    //forward the message to Wit.ai Bot engine
    //This will run all actions until our bot has nothing left to do

    wit.runActions(sessionId, text, sessions[sessionId].context, (err, context) => {
      if (err) {
        console.log('Oops! Got an error from Wit.Ai:', err)
      } else {
        console.log('Waiting for further messages.')

        // Based on the session state, you might want to reset the session.
        // This depends heavily on the business logic of your bot.
        // Example:
        // if (context['done']) {
        //   delete sessions[sessionId];
        // }

        // Updating the user's current session state
        sessions[sessionId].context = context;
      }
    });
  }

  // bot.getProfile(payload.sender.id, (err, profile) => {
  //   if (err) throw err
  //
  //   reply({ text }, (err) => {
  //     if (err) throw err
  //
  //     console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
  //   })
  // })
})


let app = express()

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  console.log(req.body);
  return bot._verify(req, res)
})

app.post('/', (req, res) => {
  console.log(req.body);
  bot._handleMessage(req.body.entry)
  res.end(JSON.stringify({status: 'ok'}))
})

app.listen(app.get('port'), function() {
  console.log('Bot is running on port', app.get('port'));
});
