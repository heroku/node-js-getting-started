const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

// const { Pool } = require('pg');
// var pool;
// pool = new Pool({
//   connectionString: process.env.DATABASE_URL

// })

const { Pool } = require('pg');
var pool;
pool = new Pool({
  connectionString: 'postgres://postgres:123456789@localhost/rectangle'
})



var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));
app.get('/database', (req,res) => {
  var getRecsQuery = 'SELECT * FROM rectable';
  pool.query(getRecsQuery, (error, result) => {
    if(error)
      res.end(error);
    var results = {'rows':result.rows}
    res.render('pages/db',results);
  })
});

app.get('/results', (req,res) => {
  var getNameQuery = 'SELECT * FROM rectable';
  pool.query(getNameQuery, (error, result) => {
    if(error)
      res.end(error);
    var Final = {'res':result.rows}
    res.render('pages/result',Final);
  })

});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
