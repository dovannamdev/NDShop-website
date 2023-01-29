const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const corsConfig = require("./configs/cors.config");
const accountApi = require("./apis/account.api");
const adminApi = require("./apis/admin.api");
const productApi = require("./apis/product.api");
const userApi = require("./apis/user.api");
const orderApi = require("./apis/order.api");
const brandApi = require("./apis/brand.api");
const statisticApi = require("./apis/statictis.api");
const commentApi = require("./apis/comment.api");
const chatApi = require("./apis/chat.api");
const roleApi = require("./apis/role.api");
const stockApi = require("./apis/stock.api");
const { getUserChatMessage, createUserChat, createUserChatReply } = require("./models/chat.model");

//==============setup PORT ====================//
const app = express();
const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 5000);
const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// ! ================== setup ================== //
app.use(express.static(path.join(__dirname, "src/build")));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// const dev = app.get("env") !== "production";
const dev = true;
if (!dev) {
  app.disable("x-powered-by");
  app.use(morgan("common"));
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/src/build", "index.html"));
  });
} else {
  app.use(morgan("dev"));
}
// app.use(express.json());

// ! ================== connect socket ... ================== //
socketIo.on("connection", (socket) => {
  console.log("New client connected" + socket.id);
  socket.on("sendDataClient", async function (data) {
    const { userId, message, adminId, type } = data;
    let createRes = false
    if (type === 'user-chat'){
      createRes = await createUserChat(userId, message);
    }else{
      createRes = await createUserChatReply(userId, message, adminId);
    } 

    if (createRes) {
      const chatData = await getUserChatMessage(userId);
      chatData.sort(function (x, y) {
        return x.chatDate - y.chatDate;
      });
      socketIo.emit("sendDataServer", { data: chatData });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use(cors(corsConfig));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
// app.use(bodyParser.json({limit: '50mb', extended: true}));
// app.use(cookieParser());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// ! ================== Routes - Api ================== //
app.use("/apis/accounts", accountApi);
app.use("/apis/products", productApi);
app.use("/apis/user", userApi);
app.use("/apis/orders", orderApi);
app.use("/apis/brands", brandApi);
app.use("/apis/admin", adminApi);
app.use("/apis/statistic", statisticApi);
app.use("/apis/comment", commentApi);
app.use("/apis/chat", chatApi);
app.use("/apis/role", roleApi);
app.use("/apis/stock", stockApi);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} !!`);
});
