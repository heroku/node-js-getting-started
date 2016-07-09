var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/webhook', function(req, res) {
  res.send('Hello!!');
  // if (req.query['hub.mode'] === 'subscribe' &&
//       req.query['hub.verify_token'] === VALIDATION_TOKEN) {
//     console.log("Validating webhook");
//     res.status(200).send(req.query['hub.challenge']);
//   } else {
//     console.error("Failed validation. Make sure the validation tokens match.");
//     res.sendStatus(403);          
//   }  
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


