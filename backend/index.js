//to create the server
require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./models/db");
const cors = require("cors");

const socket = require("socket.io");

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;

//require routers
const roleRouter = require("./routes/role");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const reactionRouter = require("./routes/reaction");
const commentRouter = require("./routes/comment");
const messageRouter = require("./routes/message");

//routers endpoint
app.use("/role", roleRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/reaction", reactionRouter);
app.use("/comment", commentRouter);
app.use("/message", messageRouter);

const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

//server for real time chat (messages):
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST", "DELETE"], //! check if DELETE is required here!
  },
});

io.on("CONNECTION", (socket) => {
  console.log({ roomConnectedId: socket.id });

  //first event:
  socket.on("JOIN_ROOM", (data) => {
    //data has the id of the room
    socket.join(data);
  });

  //second event:
  socket.on("SEND_MESSAGE", (data) => {
    console.log({ data });
    //data has received message,(its type is determind from frontend):
    //data={room:id,content:"hi"}
    //to which room the data is going to be sent:
    socket.to(data.roomId).emit("RECEIVE_MESSAGE", data.content);
  });

  //third event (automatic event):
  socket.on("DISCONNET", () => {
    console.log(`user left...`);
  });
});
