const express = require('express');
const app = express();
var cors = require('cors')
const server = require('http').Server(app)

const {ExpressPeerServer} = require('peer');

const customGenerationFunction = () => (Math.random().toString(36) + "0000000000000000000").substr(2, 16);

const peerServer = ExpressPeerServer(server)

const io = require('socket.io')(server,{
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
  socket.on('join-room', (roomId, userId) => {
    console.log(roomId, userId)
    socket.join(roomId);
    socket.to(roomId)
    socket.broadcast.emit('user-connected', userId)
  })
})

server.listen(3000, ()=> console.log(`Server running on port 3000`));