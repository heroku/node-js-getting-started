const express = require('express');
const path = require('path');

module.exports = function createApp() {
  return express()
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(express.static(path.join(__dirname, 'public')))
    .get('/', (req, res) => {
      res.render('pages/index');
    });
};
