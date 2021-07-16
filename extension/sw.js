var websocket = new WebSocket('ws://localhost:3001');

chrome.runtime.onConnect.addListener(function(port) {
  console.log("connection with script port has been made");
  port.onMessage.addListener(function(msg) {
    const script_message = JSON.stringify(msg);
    if(msg.type === "user uuid request") {
      websocket.send(script_message);
    }
    else if(msg.type === "room uuid request") {
      websocket.send(script_message);
    } 
    return true;
  });

  websocket.onmessage = function(event) {
    console.log(event.data)
    const msg = JSON.parse(event.data);
    if(msg.type === "serve user uuid") {
      port.postMessage(msg);
    }
    else if(msg.type === 'serve room uuid') {
      port.postMessage(msg);
    }
  };

});

websocket.onopen = function() {
  console.log("connection with server open");
};

//websocket.close();

