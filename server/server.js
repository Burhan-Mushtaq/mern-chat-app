const { log } = require('console');
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server , {
    cors : {
        origin: "http://localhost:5173",
    },
});

app.use(express.json());

app.get("/" , (req ,res) => {
    res.send("Chat API running");
});


io.on("connection" , (socket) => {
    console.log("User Connected: ", socket.id);

    socket.on("send_message" , (data) => {
        console.log("Message received" , data);

        io.emit("receive_message" , data)
    });

    socket.on("disconnect" , () => {
        console.log("User disconnected: ", socket.id);
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log("Server running");
});