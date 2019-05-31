var app = require("express")();
var http = require ("http").Server(app);
var io = require ("socket.io")(http);
    
app.get("/",function(req,res){

    res.sendFile(__dirname + "/" + "client1.html");

});    
////////////////////////////////////////////////////////    
var users = [];   
io.on("connection",function(socket){
     
    console.log("one User Connected... ");


///////////////////////////////////////////set user event
socket.on("setusername",function(data){
 if(users.indexOf(data) <= -1)
  { 
    users.push(data);
    socket.emit("userset",{username : data});
   }else
   {
    socket.emit("userExist", data + " is exist . select an othter...");
   }
});

socket.on("newmsg", function(data){
    socket.broadcast.emit("servermsg",data);
})

socket.on("disconnect" ,function(){
    console.log("one User Disconnected..");
});

});
////////////////////////////////////////////////////////////
http.listen("3000" ,function(){
    console.log("Socket server is Running...");
});




