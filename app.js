 const express = require("express");
 const path = require("path");


const app = express();
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT , ()=> console.log(`server running on ${PORT}`));

//creates a new server on port 4000
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public' )))

let socketsConnected = new Set()


// when clients connects

io.on('connection' , onConnected);

function onConnected(socket) {
    console.log(socket.id);
    socketsConnected.add(socket.id);
     
    // send message to all clients
    io.emit('clients-total' , socketsConnected.size);


    // when client disconnects
    socket.on("disconnect" , ()=> {
        console.log('Socket disconnected' , socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-total' , socketsConnected.size);

    })

    socket.on('message' , (data)=> {

        socket.broadcast.emit('chat-message' ,data);

    })

    socket.on('feedback' , (data)=>{
        socket.broadcast.emit('feedback' , data);
    })
}