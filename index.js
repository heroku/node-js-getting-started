  
const express = require('express')
const path = require('path')	
const PORT = process.env.PORT || 5000	
const APIKEY = process.env.API
const DBKEY = process.env.DB
var app = express()
var http = require('http')
const basicAuth = require('express-basic-auth')
var basicAuthError = '<html lang="id" dir="ltr">  <head>      <meta charset="utf-8" />      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />      <meta name="description" content="" />      <meta name="author" content="" />       <!-- Title -->      <title>Sorry, This Page Can&#39;t Be Accessed</title>      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" />      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous" /> </head>  <body class="bg-dark text-white py-5">      <div class="container py-5">           <div class="row">                <div class="col-md-2 text-center">                     <p><i class="fa fa-exclamation-triangle fa-5x"></i><br/>Status Code: 403</p>                </div>                <div class="col-md-10">                     <h3>Incorrect Credentials</h3>                     <p>Your username and or password is incorrect. Please contact Rob, Steve or Jeremy for help.<br/>If you think you have made a mistake, please try again.</p>                     <a class="btn btn-danger" href="javascript:location.reload();">Try Again</a>                </div>           </div>      </div>       </body>  </html>'


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
var theTime = 0
//v
setInterval(function(){
	//send data over socket	
    pool.query('SELECT * FROM public.devorders', (err, res) => {
		io.sockets.emit('db',{ db: res.rows});
	})
	theTime = Date.now();
}, 500)


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
			
		//send to pg
		var thisQuery = "INSERT INTO public.devorders (order_id, products, istable, isnew, isclosed, isprocessing, time) VALUES ("+auth1.purchases[0].globalPurchaseNumber+", '" +JSON.stringify(auth1.purchases[0].products)+"',"+doesOrderContainTable(auth1.purchases[0].products)+", "+true+", "+false+", "+false+", "+theTime+")"
		
		pool.query(thisQuery, (err, res) => {
			console.log(err);
			console.log(res);
		})
		
		//alert over socket
			nextVal = thisVal + 1
			if (nextVal == auth1.purchases[0].globalPurchaseNumber) io.sockets.emit('broadcast',{ description: true});
			thisVal = auth1.purchases[0].globalPurchaseNumber
			
	});
});

}, 5000)
max = 0;
basicAuth({
  users: { 'admin': 'supersecret' },
  
})
//server
	myAuth = basicAuth({
	  users: { 'admin': 'espresso',
	           'staff': 'latte',
	  },
	  unauthorizedResponse: (req) => {
    	return  basicAuthError
	  },
	  challenge: true,
	  realm: 'foo',
	});
	
	adminAuth = basicAuth({
	  users: { 'admin': 'espresso',
	  },
	  unauthorizedResponse: (req) => {
    	return  basicAuthError
	  },
	  challenge: true,
	  realm: 'foo',
  });

	app.use(express.static(path.join(__dirname, 'public')))
	app.set('views', path.join(__dirname, 'views'))
	app.set('view engine', 'ejs')

    app.get('/', myAuth, (req, res) => res.render('pages/table'))
	
	app.get('/allOrders', adminAuth , (req,result) => {
		pool.query('SELECT * FROM public.devorders', (err, res) => {
			result.send(res.rows)
		})
	})
	
	app.get('/qty', (req,result) => {
		result.send("qty")
	})
	
	app.get('/stats',adminAuth, (req,result) => {
		pool.query('SELECT order_id, time as created, closetime as closed, (closetime-time) as timetoclose, to_timestamp(CAST((time) as bigint)/1000) as date from devorders where closetime >1 order BY order_id ASC;', (err, res) => {
				ev = res.rows;
				result.render('pages/graph', {eventData : ev});
		});	
	})
	
	
	
	// app.get('/time', (req,result) => {
	// 	pool.query('SELECT order_id, time as created, closetime as closed, (closetime-time) as timetoclose, to_timestamp(CAST((time) as bigint)/1000) as date from devorders where closetime >1;', (err, res) => {
	// 		result.send(res.rows);
	// 	});
	// });
 	// app.get('/react', (req, res) => res.render('pages/react'))
	
	
	
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
//update db
	app.post('/setStats', (req,res) => {
		const date = req.body.id;
		const avg = req.body.column
		const diff = req.body.value
		
		var thisQuery = "INSERT INTO public.stats (date, avg, diff) VALUES ("+date+", "+avg+", "+diff+");"
		pool.query(thisQuery, (err, res) => {
			console.log(err);
			console.log(res);
		})
		
		res.send('Date:' +date+" has been updated");
	})
	app.get('/getStats', (req,res) => {
		
		var thisQuery = "SELECT * FROM public.stats;"
		pool.query(thisQuery, (err, result) => {
			res.send(result.rows);
		})
		
	})
	
	
	
	
//START SERVER
	server.listen(PORT);