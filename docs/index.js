const express  = require('express')
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);
var users = {}

io.on('connection',(socket)=>{
    socket.on("newUserJoined",(username)=>{
        users[socket.id] = username;
        socket.broadcast.emit("newConnection",username);
        io.emit("userList",users);
    });
    socket.on("disconnect",()=>{
        const disconnectedUser = users[socket.id];
        socket.broadcast.emit("userDisconnected", disconnectedUser);
        delete users[socket.id]
        io.emit("userList",users);
    })

    socket.on('message',(data)=>{
        socket.broadcast.emit('message',{user:data.user,msg:data.msg});
    })
})

app.use(express.static(path.join(__dirname,'/docs')));

server.listen(3000);
