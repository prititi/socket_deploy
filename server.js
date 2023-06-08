
const express = require("express");
const app = express();
const socketio = require("socket.io");
const http = require("http");
const { userJoin, getRoomUsers, getCurrentUser, userLeave } = require("./userdata/users");
const formateMessage = require("./userdata/messages");
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {

   console.log("One person join the Room🧑");

   socket.on("joinRoom", ({ username, room }) => {

      const user = userJoin(socket.id, username, room);

      socket.join(user.room);


      socket.emit("message", formateMessage("chat Server", "Welcome to chating Server😊"));
      socket.broadcast.to(user.room).emit("message", formateMessage("Chating Server", `${username} has joined the chat👩‍🦰`));
      io.to(room).emit("roomUsers", {
         room: user.room,
         users: getRoomUsers(user.room)
      })
   });

   
   socket.on("chatMessage", (msg) => {



      const user = getCurrentUser(socket.id);

      io.to(user.room).emit("message", formateMessage(user.username, msg));

   });


   socket.on("disconnect", () => {

      const user = userLeave(socket.id);
      console.log("one user left");


      io.to(user.room).emit("message", formateMessage("chat Server", `${user.username} has left the chat`));

      io.to(user.room).emit("roomUsers", {
         room: user.room,
         users: getRoomUsers(user.room)
      })

   })
})


const PORT = 8080;

server.listen(PORT, () => {
   console.log("server is running on port" + PORT)
});