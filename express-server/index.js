const express = require('express');
const ws = require('ws');
const app = express();
const { v4: uuidv4 } = require('uuid');
const s = require('serialijse');

let rooms = [];
let room_index = 0;

const wss = new ws.Server({port: 3001});
wss.on('connection', (socket,request,client) => {
  console.log('connection established');
  socket.on('message', (message) => {
    const msg = JSON.parse(message);
    if(msg.type === "user uuid request") {
      socket.send(JSON.stringify({
        type: "serve user uuid",
        user_uuid: uuidv4()
      }))
    }
    else if(msg.type === 'room uuid request') {
      //Create a room for the client who requested to start a room.
      //Store the room uuid, index(so it can be accessed directly when we need to broadcast a message to all other users in the room)
      let room = {
        room_uuid: uuidv4(),
        room_number: room_index,
        clients: [
          {
            client: client,
            client_uuid: msg.user_uuid
          }
        ]
      };
      rooms.push(room);
      socket.send(JSON.stringify({
        type: "serve room uuid",
        room_uuid: rooms[room_index].room_uuid,
        room_number: room_index
      }));
      room_index += 1;
    }
  });
});

// app.get('/', function(req,res) {
//   res.send("hello world!");
// });

// app.get('/extensions', function(req,res) {
//   res.send("message to extension");
//   console.log("get request at /extensions");
// });

// const server = app.listen(3000);
// server.on('upgrade', (req, soket, head) => {
//   wss.handleUpgrade(req, socket, head, socket => {
//     wss.emit('connection', socket, req);
//   });
// });