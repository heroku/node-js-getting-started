// app.js
const app = require('express')()

let port = process.env.PORT || 3000 // Wallarm is not configured, listen on $PORT
if(process.env.WALLARM_API_TOKEN) port = '/tmp/nginx.socket' // Wallarm is configured

app.listen(port, (err) => {
    if (err) throw err
    console.log(`> App is listening on ${port}`)
})

app.get('/', (req, res) => {
    res.send('This app is protected by Wallarm')
})

