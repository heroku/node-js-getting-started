const express = require("express");
var app = require('express')();
var path = require('path');
const bodyParser = require("body-parser")
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs');
var nodemailer = require('nodemailer');
const excelToJson = require('convert-excel-to-json');
var json2xls = require('json2xls');

app.use(bodyParser.json({
  extended:true,
  limit: '50mb'
}));

app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {  
  res.sendFile(__dirname + '/index.html');
});

app.get('/pages/tbros', function(req, res) {   
  const result = excelToJson({
      sourceFile: 'public/Platinum.xlsx'
  }); 
  res.render('pages/tbros', { result: result['TBR OS'] });
});

app.get('/pages/tbbos', function(req, res) {   
  const result = excelToJson({
      sourceFile: 'public/Platinum.xlsx'
  }); 
  res.render('pages/tbbos', { result: result['TBB OS'] });
});

app.get('/pages/pcros', function(req, res) {   
  const result = excelToJson({
      sourceFile: 'public/Platinum.xlsx'
  }); 
  res.render('pages/pcros', { result: result['PCR OS'] });
});

app.get('/pages/ltos', function(req, res) {   
  const result = excelToJson({
      sourceFile: 'public/Platinum.xlsx'
  }); 
  res.render('pages/ltos', { result: result['LT OS'] });
});

app.post('/pages/createData', function(req, res) {    
  var data = req.body.value;  

  let feb = 0;
  let mar = 0;
  let april = 0;
  let may = 0; 
  let totalIndex;

  for (let index = 0; index < data.length; index++) {
    if(data[index].FEB) feb = feb + parseInt(data[index].FEB);
    if(data[index].MAR) mar = mar + parseInt(data[index].MAR);
    if(data[index].APRIL) april = april + parseInt(data[index].APRIL);
    if(data[index].MAY) may = may + parseInt(data[index].MAY);   
    if(data[index].Sizes) {
      if(data[index].Sizes.includes('TOTAL QTY') || data[index].Sizes.includes('TOTAL PCR')) totalIndex = index;
    } else {
      if(data[index].Rim.includes('TOTAL LT')) totalIndex = index;
    }    
  }

  data[totalIndex].FEB = feb;
  data[totalIndex].MAR = mar;
  data[totalIndex].APRIL = april;
  data[totalIndex].MAY = may;

  var filepath = `${req.body.name}.xlsx`;
  var xls = json2xls(data);
  fs.writeFileSync(filepath, xls, 'binary');  

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'cny2021sales@gmail.com',
      pass: 'Apollo@2021'
    }
  });
  
  var mailOptions = {
    from: 'cny2021sales@gmail.com',
    to: ['yogimayi@outlook.com','Anand.Ramasamy@apollotyres.com'],
    subject: `Customer ${req.body.name} - ${req.body.contact} purchase report`,
    text: `Hola! ${req.body.name} has send out his response.`,
    attachments: 
      {   // utf-8 string as an attachment
          filename: filepath,
          content: fs.readFileSync(filepath)
      }    
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      fs.unlinkSync(filepath);
      console.log('Email sent: ' + info.response);
    }
  });

  res.send("success");
})

http.listen(3000, () => {
  console.log('listening on *:3000');
});