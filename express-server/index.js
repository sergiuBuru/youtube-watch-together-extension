const express = require('express');
const ws = require('ws');
const app = express();
const { v4: uuidv4 } = require('uuid');

class Rooms {
  constructor() {
    this.rooms = [];
    this.room_index = 0;
    this.saveRoom = this.saveRoom.bind(this);
  }

  saveRoom(room_uuid, client, client_uuid) {
    this.rooms.push({
        room_uuid: room_uuid,
        room_number: this.room_index,
        clients: [
          {
            client: client,
            client_uuid: client_uuid
          }
        ]
    });
    this.room_index += 1;
  }

  getRoomNumber() {
    return this.room_index - 1;
  }

  iterateRooms() {
    this.rooms.forEach(room => {
      console.log(room)
    });
  }

  addUserToRoom(room_uuid, room_number, user_uuid, client) {
    if(this.rooms[room_number].room_uuid === room_uuid) {
      this.rooms[room_number].clients.push({
        client: client,
        client_uuid: user_uuid
      });
      this.sendToClients(room_number,JSON.stringify({
        type: "added to room",
        user_uuid: user_uuid,
        room_uuid: room_uuid,
        room_number: room_number
      }));
    }
  }

  sendToClients(room_number, msg) {
    this.rooms[room_number].clients.forEach(c => {
      c.client.send(msg)
    })
  }
}

const rooms = new Rooms();

const wss = new ws.Server({port: 3001});
wss.on('connection', (client) => {
  console.log('connection established');
  client.on('message', (message) => {
    const msg = JSON.parse(message);
    if(msg.type === "user uuid request") {
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