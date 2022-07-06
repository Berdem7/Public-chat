const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http");

const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const router = express.Router();
app.use(express.json());
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const port = 3010;
const querystring = require("querystring");
// const e = require("express");
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("view options", { layout: false });

app.use("/", router);
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("sendMsg", (data) => {
    socket.broadcast.emit("receiveMsg", data);
  });
});

router.get("/", function (req, res) {
  fs.readFile("data/data.json", (error, data) => {
    // let chat = JSON.parse(data);
    if (error) {
      throw error;
    } else {
      res.send(data);
    }
  });
});

router.post("/", (req, res) => {
  console.log(req.body);
  fs.readFile("data/data.json", (error, data) => {
    if (error) {
      throw error;
    } else {
      let chat = JSON.parse(data);
      chat.messages.push(req.body);
      let newchat = JSON.stringify(chat);
      fs.writeFile("data/data.json", newchat, (error) => {
        if (error) {
          console.log(error);
        } else {
          res.send({ redirect: "/" });
        }
      });
    }
  });
});

server.listen(port);
