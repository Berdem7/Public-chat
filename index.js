const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const querystring = require("querystring");
// app.engine("html", require("html").renderFile);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/user.html");
});

app.post("/login", (req, res) => {
  const data = req;
  console.log(data);
  // res.send(employee);
  res.send(data);
});

server.listen(3009, () => {
  console.log("listening on *:3009");
});
