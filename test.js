const { spawn } = require('child_process');
const request = require('request');
const test = require('tape');

const PORT = process.env.PORT || 5000;

// Start the app
const child = spawn('npm', ['start']);

test('responds to requests', (t) => {
  t.plan(4);

  // Make a request to our app
  request(`http://127.0.0.1:${PORT}`, (error, response, body) => {
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
