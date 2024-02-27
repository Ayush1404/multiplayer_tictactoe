import express from 'express';
import { UserManager } from './managers/userManager';
import { Socket } from 'socket.io';

const PORT = process.env.PORT || 3000;

const server = express().use((req, res) => {
  res.send("server is running");
})
.listen(PORT, () => console.log(`Listening on ${PORT}`));;

const io = require("socket.io")(server,{
  cors: {
    origins: "*:*",
    methods: ["GET", "POST"]
  }
});

const userManager = new UserManager();

io.on('connection', (socket:Socket) => {
  console.log(`a user connected`);
  socket.on('connect-user',({name})=>{
    userManager.addUser(name,socket)
  })
  socket.on('disconnect', () => {
    console.log("user disconnected");
    userManager.removeUser(socket.id);
  });
});


export default server;
