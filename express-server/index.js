const express = require('express');
const ws = require('ws');
const app = express();

const wss = new ws.Server({port: 3000});
wss.on('connection', socket => {
  console.log('connection established');
  socket.on('message', (message) => {
    console.log(message);
    // socket.send('hello there');
    // if(message === "Requesting room id") {
    //   socket.send("75");
    // }
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