const express = require('express');
const ws = require('ws');
const app = express();
const { uuid } = require('uuidv4');

const wss = new ws.Server({port: 3001});
wss.on('connection', socket => {
  console.log('connection established');
  socket.on('message', (message) => {
    const msg = JSON.parse(message);
    if(msg.type === 'room id request') {
      socket.send(JSON.stringify({
        type: "serve room id",
        user_uuid: (msg.user_uuid ? msg.user_uuid : uuid()),
        room_id: uuid()
      }))
    }
    else if(msg.type === "user uuid request") {
      socket.send(JSON.stringify({
        type: "serve user uuid",
        user_uuid: uuid()
      }))
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