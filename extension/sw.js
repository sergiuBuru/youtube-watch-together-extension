var websocket = new WebSocket('ws://localhost:3000');

chrome.runtime.onConnect.addListener(function(port) {
  console.log("connection with script port has been made");
  port.onMessage.addListener(function(msg) {
    if(msg.content === "Requesting room id") {
      websocket.send(JSON.stringify(msg));
    }
    return true;
  });

  websocket.onmessage = function(event) {
    // console.log(event.data)
    port.postMessage({content: event.data});
  };

});

websocket.onopen = function() {
  console.log("connection with server open");
};

//websocket.close();

