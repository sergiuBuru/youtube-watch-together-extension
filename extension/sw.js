// console.log("sw loaded");
// var websocket = new WebSocket('ws://localhost:3001');

// chrome.runtime.onConnect.addListener(function(port) {
//   console.log("connection with script port has been made");
//   port.onMessage.addListener(function(msg) {
//     const script_message = JSON.stringify(msg);
//     if(msg.type === "user uuid request") {
//       websocket.send(script_message);
//     }
//     else if(msg.type === "room uuid request") {
//       websocket.send(script_message);
//     }
//     else if(msg.type === "room join request") {
//       websocket.send(script_message);
//     } 
//     else if(msg.type === "leave room") {
//       websocket.send(script_message)
//     }
//     else if(msg.type === 'open youtube video') {
//       websocket.send(script_message);
//     }
//     // else if(msg.type === 'sw open video') {
//     //   console.log("sw opening url");
//     //   chrome.tabs.create({
//     //     url: msg.url
//     //   });
//     // }
//     return true;
//   });

//   websocket.onmessage = function(event) {
//     console.log(event.data)
//     const msg = JSON.parse(event.data);
//     if(msg.type === "serve user uuid") {
//       port.postMessage(msg);
//     }
//     else if(msg.type === 'serve room uuid') {
//       port.postMessage(msg);
//     }
//     else if(msg.type === 'added to room') {
//       port.postMessage(msg)
//     }
//     else if(msg.type === 'removed from room') {
//       port.postMessage(msg)
//     } 
//     else if(msg.type === 'open youtube video') {
//       console.log(msg)
//       chrome.tabs.create({
//         url: msg.url
//       });
//     }
//   };

//   websocket.onopen = function() {
//     console.log("connection with server open");
//     websocket.send(JSON.stringify({type: "hello"}));
//   };
// });


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === "open_url") {
      chrome.tabs.create({
        url: request.url
      })
    }
    return true;
  }
);

//websocket.close();

