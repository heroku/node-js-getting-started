const express = require('express')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 5000


const db = require('./_config/db');


const setupMiddleware = require('./_config/middleware');
const setupRoutes = require('./_config/routes');

const server = express();

setupMiddleware(server);
setupRoutes(server);

express()
  .get('/', (req, res) => res.json({hello: 'hello world!'}))

db.connectTo('lambda-notes')
  .then(() => {
    console.log('\n... API Connected to lambda-notes Database ...\n');
    server.listen(5000, () =>
      console.log('\n=== API running on port 5000 ===\n')
    );
  })
  .catch(err => {
    console.log('\n*** ERROR Connecting to MongoDB, is it running? ***\n', err);
  });