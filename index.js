const express = require('express')
const path = require('path')
const cool = require('cool-ascii-faces')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/db', async (req, res) => {
      try {
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM test_table');
        res.render('pages/db', result);
        client.release();
      } catch (err) {
        console.error(err);
        res.send("Error " + err);
      }
    })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
