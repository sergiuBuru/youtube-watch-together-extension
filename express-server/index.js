const express = require('express');
const ws = require('ws');
const app = express();
const { v4: uuidv4 } = require('uuid');
const Rooms = require('./rooms.js')
const rooms = new Rooms();

const wss = new ws.Server({port: 3002});
wss.on('connection', (client) => {
  console.log('connection established');
  client.on('message', (message) => {
    const msg = JSON.parse(message);
    console.log(msg);
    if(msg.type === 'ping') {
      setTimeout(() => {
        client.send(JSON.stringify({
          type: "pong"
        }))
      }, 10000)
    }
    else if(msg.type === "user uuid request") {
      client.send(JSON.stringify({
        type: "serve user uuid",
        user_uuid: uuidv4()
      }))
    }
    else if(msg.type === 'room uuid request') {
      //Create a room for the client who requested to start a room.
      //Store the room uuid, index(so it can be accessed directly when we need to broadcast a message to all other users in the room)
      const room_uuid = uuidv4();
      rooms.saveRoom(room_uuid, client, msg.user_uuid)
      client.send(JSON.stringify({
        type: "serve room uuid",
        room_uuid: room_uuid,
        room_number: rooms.getRoomNumber()
      }));
    }
    else if(msg.type === 'room join request') {
      //Validate that the room number and id corespond to a valid room
      rooms.addUserToRoom(msg.room_uuid, parseInt(msg.room_number), msg.user_uuid, client);
      rooms.iterateRooms();
    }
    else if(msg.type === 'leave room') {
      rooms.removeClientFromRoom(msg.user_uuid, msg.room_uuid, msg.room_number);
      client.send(JSON.stringify({
        type: "removed from room"
      }));
    }
    else if(msg.type === 'open url') {
      rooms.sendToClients(msg.room_number, msg.room_uuid, JSON.stringify({
        type: "open url",
        url: msg.url
      }));
    }
    else if(msg.type === "hello") {
      console.log("hello to you");
    }
  });

  client.on('close', () => {
    console.log('connection closed');
  })
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