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

db.connectTo('back-end-lambda-notes')
  .then(() => {
    console.log('\n... API Connected to back-end-lambda-notes ...\n');
    server.listen(5000, () =>
      console.log('\n=== API running on port 5000 ===\n')
    );
  })
  .catch(err => {
    console.log('\n*** ERROR Connecting to MongoDB, is it running? ***\n', err);
  });