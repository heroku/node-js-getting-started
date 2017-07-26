const { spawn } = require('child_process');
const request = require('request');
const test = require('tape');

// Start the app
const env = Object.assign({}, process.env, {PORT: 5000});
const child = spawn('npm', ['start'], {env});

test('responds to requests', (t) => {
  t.plan(4);

  // Make a request to our app
  request('http://localhost:5000', (error, response, body) => {
    // No error
    t.false(error);
    // Successful response
    t.equal(response.statusCode, 200);
    // Assert content checks
    t.notEqual(body.indexOf("<title>Node.js Getting Started on Heroku</title>"), -1);
    t.notEqual(body.indexOf("Getting Started with Node on Heroku"), -1);

    // stop the server
    child.kill();
  });
});
