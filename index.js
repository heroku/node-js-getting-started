  
const express = require('express')
const path = require('path')	
const PORT = process.env.PORT || 5000	
const APIKEY = process.env.API
const DBKEY = process.env.DB
var app = express()
var http = require('http')
const basicAuth = require('express-basic-auth')

const server = require('http').createServer(app);
const options3 = { /* ... */ };
const io = require('socket.io')(server, options3);
var request = require('request');

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());




io.on('connection', function(client) {
    console.log('Client connected...');
    
    client.on('join', function(data) {
    	console.log(data);
    });
	//io.sockets.emit('broadcast',{ description: ' connec Time!'});
});




//pg
var data
const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'josh',
  host: 'theway.c15j82hx0pnm.us-east-2.rds.amazonaws.com',
  database: 'postgres',
  password: DBKEY,
  port: 5432,
})
pool.connect()
function getData() {
		 pool.query('SELECT * FROM public.orders', (err, res) => {
			data = res.rows
		})
}


getData();

//console.log(data);

// Add headers
app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


var auth;
var auth1;


function doesOrderContainTable(orderData) {
	if (orderData != null) {
    var itemsInOrder = orderData.length;
}
    var count = -1;
    var tableCheck = null;
    var tableOrder;
    for (var y = 0; y < itemsInOrder; y++) {
        var orderName = orderData[y].name.substring(0,5)
        if(orderName == "Table") {
            tableOrder = true;
            tableCheck = orderData[y].name;
            table = orderData[y].name;
            count = count + 1
        }
    }
    if(tableCheck == null) {tableOrder = false}
return tableOrder;
}


// auth settings
var options = {
    'method': 'POST',
    'url': 'https://oauth.izettle.com/token',
    'headers': {
        'X-Requested-With': '*',
        'Origin': 'null',
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
        'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'client_id': 'f5cbac98-e2d4-11ea-8771-c3299c61a3e9',
        'assertion': APIKEY,
        '': ''
    }
};
//alert counters
thisVal = 0
nextVal = 1

//every 5seconds
setInterval(function() {
	
	//request auth
    request(options, function(error, response) {
        if (error) throw new Error(error);
		
        auth = JSON.parse(response.body);
        auth = JSON.stringify(auth.access_token);
        auth = auth.substring(1, auth.length - 1);
        auth = 'Bearer ' + auth
        var options1 = {
            'url': "https://purchase.izettle.com/purchases/v2?limit=1&descending=true",
            'method': "GET",
            'timeout': 0,
            'headers': {
                "content-type": "application/json",
                'Authorization': auth
            }
        }
		
		//request from izettle
        request(options1, function(error, response) {
            if (error) throw new Error(error);
            auth1 = response.body;
            auth1 = JSON.parse(auth1);
            newBody = createBody(auth1.purchases[0].globalPurchaseNumber, auth1.purchases[0].products);
			
		//send to pg
		var thisQuery = "INSERT INTO public.devorders (order_id, products) VALUES ("+auth1.purchases[0].globalPurchaseNumber+", '" +JSON.stringify(auth1.purchases[0].products)+"')"
		
		pool.query(thisQuery, (err, res) => {
			console.log(err);
			console.log(res);
		})
		
		//alert over socket
			nextVal = thisVal + 1
			if (nextVal == auth1.purchases[0].globalPurchaseNumber) io.sockets.emit('broadcast',{ description: true});
			thisVal = auth1.purchases[0].globalPurchaseNumber
		//send data over socket	
       	pool.query('SELECT * FROM public.devorders', (err, res) => {
			io.sockets.emit('db',{ db: res.rows});
		})
	});
});

}, 5000)
max = 0;




//server
	myAuth = basicAuth({
	  users: { 'admin': 'espresso',
	           'staff': 'latte',
	  },
	  challenge: true,
	  realm: 'foo',
	});

	app.use(express.static(path.join(__dirname, 'public')))
	app.set('views', path.join(__dirname, 'views'))
	app.set('view engine', 'ejs')

    app.get('/', myAuth, (req, res) => res.render('pages/table'))
 	
	app.get('/allOrders', (req,result) => {
		pool.query('SELECT * FROM public.devorders', (err, res) => {
			result.send(res.rows)
		})
	})
	
	//update db
	app.post('/update', (req,res) => {
		const id = req.body.id;
		const column = req.body.column
		const value = req.body.value
		var thisQuery = "UPDATE public.devorders SET "+column+" = "+value+" WHERE order_id = "+id;
		pool.query(thisQuery, (err, res) => {
			console.log(err);
			console.log(res);
		})
		res.send('Order:' +id+" has been updated at the column "+ column+ " with the value: " + value);
	})
	
	
	
	
	
	
    //app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
	server.listen(PORT);