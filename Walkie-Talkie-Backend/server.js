const express = require("express");
const app = express();
const server = require("http").createServer(app);
const PORT = process.env.PORT || 5000;
// var corsOptions = {
//   cors: true,
// };
const io = require("socket.io")(server, { cors: true });
// const cors = require("cors");

// app.use(cors(corsOptions));

io.on("connection", (socket) => {
  console.log("a user connected :D");
  socket.on("chat message", (msg) => {
    console.log(msg);
    io.emit("chat message", msg);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
