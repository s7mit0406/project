const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.resolve("C:\\Users\\sg434\\OneDrive\\Desktop\\livecode\\public")));
app.get("/", (req, res) => {
    return res.sendFile(path.resolve("C:\\Users\\sg434\\OneDrive\\Desktop\\livecode\\public\\index.html"));
});


    let rooms = {};

io.on("connection", socket => {

    socket.on("joinRoom", ({username, room}) => {
        socket.join(room);
        socket.username = username;
        socket.room = room;

        if(!rooms[room]) rooms[room] = [];

        rooms[room].push(username);

        io.to(room).emit("userList", rooms[room]);
    });

    socket.on("codeChange", code => {
        socket.to(socket.room).emit("codeChange", code);
    });

    socket.on("chatMessage", msg => {
        io.to(socket.room).emit("chatMessage", {
            user: socket.username,
            text: msg
        });
    });

    socket.on("disconnect", () => {
        if(socket.room && rooms[socket.room]){
            rooms[socket.room] = rooms[socket.room]
                .filter(user => user !== socket.username);

            io.to(socket.room).emit("userList", rooms[socket.room]);
        }
    });

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
