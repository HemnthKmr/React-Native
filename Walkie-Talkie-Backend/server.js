const express = require('express');
const http = require('http');
const socketio = require('socket.io');
var cors = require('cors')
// const server = require('http').Server(app)
// const io = require('socket.io')(server)

const {ExpressPeerServer} = require('peer');

const app = express();

const server = http.createServer(app)
const io = socketio(server).sockets;

app.use(express.json())

const customGenerationFunction = () => (Math.random().toString(36) + "0000000000000000000").substr(2, 16);

const peerServer = ExpressPeerServer(server,{
    debug: true,
    path: '/',
    generateClientId: customGenerationFunction,
})

app.use('/mypeer', peerServer)

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions))

app.get('/', (req,res) => {
  res.send({ Welcome :"Welcome to walkie-Talkie"});
})

io.on('connection', (socket) => {
  console.log("connected");
  socket.on('join-room', (roomId, userId) => {
    console.log(roomId, userId)
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId)
    })
  })



})

server.listen(3000, ()=> console.log(`Server running on port 3000`));