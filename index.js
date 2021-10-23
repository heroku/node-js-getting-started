const PORT = process.env.PORT || 5000
const fs = require('fs');
var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
// const { Console } = require('console'); 

//                                                            get file
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//                                                            room/connection/joinroom
let thisRoom = "main";
io.on("connection", function (socket) {
  socket.on("join room", (data) => {
    console.log(socket.id + ": connected.");
    socket.join(thisRoom);
  });



  socket.on("chat message", (data) => {
    io.to(thisRoom).emit("chat message", { data: data, id: socket.id });
  });
  socket.on("check password", (userdata) => {
    fs.readFile('output.json', userdata,
      // callback function that is called when reading file is done
      function (err, data) {

        // json data
        var jsonData = data;
        // parse json
        var jsonParsed = JSON.parse(jsonData);

        let Index = jsonParsed.username.indexOf(userdata.username)

        if (jsonParsed.password[Index] == userdata.password) {
          io.to(thisRoom).emit("chat", { data: jsonParsed });
        }
        else {
          console.log("wrong password")
        }
      });
  });



  socket.on("sign up", (userdata) => {
    fs.readFile('output.json', userdata,
      // callback function that is called when reading file is done
      function (err, data) {

        // json data
        var jsonData = data;
        // parse json
        var jsonParsed = JSON.parse(jsonData);

        if (jsonParsed.username.includes(userdata.username)) {
          console.log("Username not available")
        }
        else if (userdata.password != userdata.password2) {
          console.log("Password does not match")
        }
        else {
          jsonParsed.username.push(userdata.username);
          jsonParsed.password.push(userdata.password);
          jsonParsed.id.push("id" + jsonParsed.username.length);
          var jsonContent = JSON.stringify(jsonParsed);

          fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
            if (err) {
              console.log("An error occured while writing JSON Object to File.");
              return console.log(err);
            }

            console.log("JSON file has been saved.");
          });
          io.to(thisRoom).emit("chat", { data: jsonParsed });
        }
      });
  });




  socket.on("search username", (userdata) => {
    fs.readFile('output.json', userdata,
      // callback function that is called when reading file is done
      function (err, data) {

        // json data
        var jsonData = data;
        // parse json
        var jsonParsed = JSON.parse(jsonData);


        if (jsonParsed.username.includes(userdata.username)) {
          let Index = jsonParsed.username.indexOf(userdata.username)
          io.to(thisRoom).emit("user-page", { data: jsonParsed });
        }
        else {
          // io.to(thisRoom).emit("user-page", { data: jsonParsed });
          console.log("wrong username")
        }
      });
  });





  socket.on("new user", (data) => {
    io.to(thisRoom).emit("new user", { data: data, id: socket.id });
  });
  socket.on("disconnect", () => {
    socket.disconnect(true);
    console.log(socket.id + ": disconnected.");
  });
});

http.listen(PORT, function () { });
