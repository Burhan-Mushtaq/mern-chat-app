const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const mongoose = require("mongoose");
const cors = require("cors");

const Message = require('./models/Message');
const messageRoutes = require("./routes/messageRoutes")

const app = express();
const server = http.createServer(app);

const io = new Server(server , {
    cors : {
        origin: "http://localhost:5173",
    },
});

app.use(cors({
    origin:"http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(express.json());
app.use("/api/messages", messageRoutes);

app.get("/" , (req ,res) => {
    res.send("Chat API running");
});

mongoose.connect("mongodb://127.0.0.1:27017/chat-app")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));


io.on("connection" , (socket) => {
    console.log("User Connected: ", socket.id);

    socket.on("join_room" , (room) => {
        socket.join(room);
        console.log("Joined room: " , room);
    });

    socket.on("send_message" , async (data) => {
        const newMessage = new Message(data);
        await newMessage.save();

        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect" , () => {
        console.log("User disconnected: ", socket.id);
    });
});


const PORT = 5000;
server.listen(PORT, () => {
    console.log("Server running");
});