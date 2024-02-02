const { spawn } = require('child_process');
const { request } = require('http')
const { URL } = require('url')
const test = require('tape');

// Start the app
const env = Object.assign({}, process.env, {PORT: 5001});
const child = spawn('node', ['index.js'], {env});

test('responds to requests', (t) => {
  t.plan(4);

  // Wait until the server is ready
  child.stdout.on('data', _ => {
    // Make a request to our app
    (async () => {
      const response = await get('http://127.0.0.1:5001')
      // stop the server
      child.kill();
      // No error
      t.false(response.error);
      // Successful response
      t.equal(response.statusCode, 200);
      // Assert content checks
      t.notEqual(response.body.indexOf("<title>Node.js Getting Started on Heroku</title>"), -1);
      t.notEqual(response.body.indexOf("Getting Started on Heroku with Node.js"), -1);
    })();
  });
});

async function get(url) {
  return new Promise((resolve, reject) => {
    const req = request(url, {method: 'GET'}, (res) => {
      let body = ''
      res.setEncoding('utf-8')
      res.on('data', (data) => body += data)
      res.on('end', () => {
        resolve({
          error: false,
          statusCode: res.statusCode,
          body: body
        })
      })
    })
    req.on('error', reject)
    req.end()
  })
}
