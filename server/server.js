const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require('dotenv');

const Message = require("./models/Message");
const messageRoutes = require("./routes/messageRoutes")
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();
app.use(express.json());

dotenv.config();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("user_online", (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit("online_users", Object.keys(onlineUsers));
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log("Joined room:", roomId);
  });

  socket.on("send_message", async (data) => {
    try {
      console.log("Incoming message:", data);

      const { sender, receiver, text } = data;

      const newMessage = new Message({
        sender,
        receiver,
        text,
        isRead: false,
      });

      await newMessage.save();

      const roomId = [sender, receiver].sort().join("_");

      io.to(roomId).emit("receive_message", newMessage);

    } catch (err) {
      console.log("Error saving message:", err);
    }
  });


  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }

    io.emit("online_users", Object.keys(onlineUsers));
    console.log("User disconnected:", socket.id);
  });
});


server.listen(5000, () => {
  console.log("Server running on port 5000");
});