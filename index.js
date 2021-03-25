var express = require("express");
const cors = require("cors");
var path = require("path");

const PORT = process.env.PORT || 5000;

var app = express();
app.use(cors());

express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"));
// .listen(PORT, () => console.log(`Listening on ${PORT}`));

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: true,
  origins: ["http://b4431df42003.ngrok.io"],
});

// Set custom headers for CORS
// const io = require("socket.io")(server, { cors: true });

// const io = socket.listen(server);

const users = {};

const socketToRoom = {};
console.log("HERKOU ONLINE");

io.on("connection", (socket) => {
  console.log("Socket connected");
  console.log(socket);
  socket.on("join_room", (roomID) => {
    if (users[roomID]) {
      console.log(roomID);
      const length = users[roomID].length;
      if (length === 4) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

    socket.emit("all_users", usersInThisRoom);
  });

  socket.on("add_user", function (fields) {
    socket.username = fields.userId;
    socket.room = fields.roomId;
    socket.join(fields.roomId);

    // io.in(fields.room).clients((err , clients) => {
    //     console.log(clients)
    // });

    // io.in(fields.room).emit("an event", { some: "data" })
  });

  socket.on("chat_message", function (fields) {
    io.emit(fields.roomId, fields);
    socketHandler.add(fields);
  });

  socket.on("sending_signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning_signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
  });
});

app.get("/testingHeroku", (req, res) => {
  res.send("Its working!");
  console.log("Its working");
});

httpServer.listen(3000);

module.exports = app;
