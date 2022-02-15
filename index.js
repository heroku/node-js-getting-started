const express = require('express')
const path = require('path')
cont {Pool} =require('pg')
const PORT = process.env.PORT || 5000

const DATABASE_URL= process.env.DATABASE_URL
cont db = new Pool ({
  connectionString: DATABASE_URL, ssl:{rejectUnauthorized:false}
})

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
   .get ('/api/contacts',async(req, res) => {
const {rows}= await db.query( `SELECT name, email, phone FROM salesforce.contact`)res.json(rows)})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
