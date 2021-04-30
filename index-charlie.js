// ///////////////
// GET Request endpoint - 
// 
var express = require('express');
var app = express();
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));
var port = process.env.PORT || 8080;
var http = require("https");
var bodyParser = require('body-parser');
var token = "FILL IN";
var options2;
var stringoptions;
var savedbody = ""; 
var fs = require('fs');
var salesforceresponse = "";

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// start the server
app.listen(port);
console.log('Server started!');
// routes will go here
app.get('/nissantosf', function(req1, res1) {
 var actionId = req1.param('actionId');
  var itemId = req1.param('itemId');
  var VIN = req1.param('VIN');
  if (VIN == null) {
    VIN = '12312312312KKLJAS879892'; // Joe's test VIN
  }
  if (actionId == 'carReadLights' || actionId == 'carSetLights') {
    VIN = VIN+'T';
  }
  console.log('actionId: ' + actionId);
  console.log('itemId: ' + itemId);
  console.log('VIN: ' + VIN);
  // GET TOKEN
//
const data = JSON.stringify({"grant_type":"password","client_id":"3MVG9vtcvGoeH2bhwf7xlWyLCGRU88kx78A0L9zVIZQd7QMGCqaqm.W6YWxj5Uw1sl4ef5U.KpqRT6lcxyjV7","client_secret":"E4BEB9ADE7F6AD7E37EB5202143EA924B5B3E7E784842DC6CAAF5CEF118250FF","username":"cisaacs@dfcharlie19sdo.demo","password":"Salesforce1"});
var options = {
  hostname: 'login.salesforce.com',
  port: 443,
  path: '/services/oauth2/token?grant_type=password&client_id=3MVG9JEx.BE6yifOxyoVMOHJWv2imTHbgp3QPkjWsc1ZNimt7IaendyDPpRwfUuEHq8u1KhpZLs6swSFJk4sX&client_secret=2E5B871540D872CA1963C548F8521222781C226577CD10E9DA32DAEC4EBE53EB&username=cisaacs@nissandemo.com&password=Salesforce1', 
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};
/// Get the token /////////////
console.log('');
console.log('REST - getting Token Start');
console.log('');
var req = http.request(options, function(res) {
  console.log('Status: ' + res.statusCode);
  //console.log('Headers: ' + JSON.stringify(res.headers));
  res.on('data', function (body) {
    console.log('***********Body: ' + body);
    var obj = JSON.parse(body);
    var keys = Object.keys(obj);
    console.log(obj[keys[0]]);
    token = obj[keys[0]];
    console.log('here is the token: ' + token);
///// End of Token Request  routes will go here
////////
////// Let's send data to Salesforce Flow
/////
////

  salesforceoptions = { 
    

  };
   
    var bearertoken = 'Bearer '+token;   
    jsonpayload = '{"inputs" : [ {"actionId" : "'+actionId+'","itemId": "'+itemId+'","VIN": "'+VIN+'"} ]}';
    console.log('here is jsonpayload: '+jsonpayload);
      ///////////////////////////////////
      ////// now send API Call to Call the Flow
      options2 = {
        path: '/services/data/v33.0/actions/custom/flow/Nissan_Headunit_Flow_API', 
        method: 'POST',
        hostname: 'ecatron-20200804-demo.my.salesforce.com',
        port: 443,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': bearertoken
        } 
      };
      var stringoptions = JSON.stringify(options2);
      //console.log('stringoptions: '+stringoptions);
      console.log('Using this PE: nissantosf__e');

        console.log('');
        console.log('REST - calling flow - Start');
        console.log('');        
        var req = http.request(options2, function(res) {
        console.log('Status: ' + res.statusCode);
        //console.log('Headers: ' + JSON.stringify(res.headers));
        var body = '';
        res.on('data', function (bodychunk) {
          body += bodychunk;
        ////
        }); 
        res.on('end', function(){
          console.log('SF Response: ' + body);
          console.log('success, calling queryresponse: ');
          queryresponse(token,res1,VIN);
          
        });
        
      });
      console.log('');
      console.log('REST - calling flow - End');
      console.log('');        

      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });

      req.write(jsonpayload);
      req.end();
/// Wait to complete
////
//// Send Response Back
////

var body =  '{"VINNumber__c":"1234567","speech__c":"hello world"}';

  var obj = JSON.parse(body);
  
  });
});
console.log('');
console.log('REST - getting Token End');
console.log('');

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
// write data to request body
req.end();
}); 
function queryresponse(token,res1,VIN) {
  //
  // This is a SOQL query that grabs the output from the Flow
  //
  var bearertoken = 'Bearer '+token;
  var pathstring = 'https://ecatron-20200804-demo.my.salesforce.com.my.salesforce.com/services/data/v20.0/query/?q=SELECT+Response__c+from+NissanCarResponse__c+where+VIN__c=\''+VIN+'\'';
  nissanoptions = {
    hostname: 'ecatron-20200804-demo.my.salesforce.com',
    port: 443,
    path: pathstring,  
    method: 'GET',  
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearertoken
    }
  }; 

  console.log('');
  console.log('REST - calling SOQL - Start');
  console.log('');
  var reqnissan = http.request(nissanoptions, function(resnissan) {
    var body = '';
    console.log('Status: ' + resnissan.statusCode);
    //console.log('Headers: ' + JSON.stringify(resnissan.headers));
    resnissan.on('data', function (nissanchunk) {
      body += nissanchunk;
    ////
    }); 
    resnissan.on('end', function(){
      console.log('###########nissan Body: ' + body);
      var nissanobj = JSON.parse(body);
      for (x in nissanobj) {
        //console.log('nissan: '+x);
        if (x == 'records') {
          console.log('Response[0]: ' + nissanobj.records[0].Response__c);
          salesforceresponse = nissanobj.records[0].Response__c;
          console.log('salesforceresponse' + salesforceresponse);
          res1.send(salesforceresponse);
        } 
      }
    }); // response from nissan 'end'
});
console.log('');
console.log('REST - calling SOQL - End');
console.log('');

reqnissan.on('error', function(e) {
console.log('problem with request: ' + e.message);
});
// write data to request body
reqnissan.end();
////END of queryresponse
}


