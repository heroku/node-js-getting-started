const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 10030

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  // res.header('Content-Type', '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DEvarE,OPTIONS')
  next()
})

app.use('/assets', express.static(path.join(__dirname, '../dist/assets')))

app.use('/', function(req, res, next) {
  res.header('Content-Type', 'text/html;charset=utf-8')
  fs.readFile(__dirname + '/../dist/index.html', 'utf-8', function(err, data) {
    if (err) {
      res.send('error')
      return
    }
    res.send(data)
  })
  // res.render('./dist/index')
})

app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  console.log(err)

  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.send({ code: 500 })
})


app.listen(PORT, () => console.log(`Listening on ${PORT}`))
