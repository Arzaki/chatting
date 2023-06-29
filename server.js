const http = require("http");
const express  = require("express");
const { dirname } = require("path");

const app = express();
const server = http.createServer(app);

const port = process.env.port || 3000;  //either use the port assigned or use port 3000
app.use(express.static(__dirname+'/public')); //this function includes the static files like icons and css

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})

// socket io setup

const io = require('socket.io')(server);
var users={};

io.on('connection',(socket)=>{
    socket.on("new-user-joined",(username)=>{
        // users[userName] = username; //the key has a capital N
        // users[socketID] = socket.id;
        users[socket.id] = {
            "userName": username,
            "socketID": socket.id
        };
        socket.broadcast.emit('user-connected',username);
        io.emit("user-list",users);
    })

    socket.on('disconnect',()=>{ 
        socket.broadcast.emit('user-disconnected',users = users[userName])
        delete users[socket.id];
        io.emit('user-list',users);

    })

    socket.on('message',(data)=>{
        // socket.broadcast.emit('message',{user:data.user,msg:data.msg})
        // console.log(data)

        // io.to(data.socketID).emit("messageToBeReceived", data.msg);
        io.sockets.in(data.socketID).emit('receiveMessage', data);
        // io.sockets.sockets[data.socketID].emit('receiveMessage', data);

    })
});

// socket io setup ends
server.listen(port, ()=>{
    console.log("server started at port "+ port)
})