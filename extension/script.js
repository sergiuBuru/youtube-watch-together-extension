var websocket = new WebSocket('ws://localhost:3002');

websocket.onopen = function() {
  websocket.send(JSON.stringify({
    type: 'ping'
  }));
}

websocket.onmessage = function(event) {
  const msg = JSON.parse(event.data);
  console.log(msg)
  if(msg.type === 'pong') {
    setTimeout(() => {
      websocket.send(JSON.stringify({
        type: 'ping'
      }))
    }, 10000)
  }
  else if(msg.type === 'serve user uuid') {
    console.log("in script");
    chrome.runtime.sendMessage(msg);
  }
  else if(msg.type === 'serve room uuid') {
    chrome.runtime.sendMessage(msg);
  }
  else if(msg.type === 'added to room') {
    chrome.runtime.sendMessage(msg);
  }
  else if(msg.type === 'removed from room') {
    chrome.runtime.sendMessage(msg);
  }
  else if(msg.type === 'open url') {
    chrome.runtime.sendMessage(msg);
  }
}

chrome.runtime.onMessage.addListener( message => {
  //request a uuid from the server which will be used as the user id
  let msg = JSON.stringify(message);
  if(message.type === 'user uuid request') {
    websocket.send(msg);
  }
  else if(message.type === 'room uuid request') {
    websocket.send(msg);
  }
  else if(message.type === 'room join request') {
    websocket.send(msg);
  }
  else if(message.type === 'leave room') {
    websocket.send(msg);
  }
  else if(message.type === 'open url') {
    websocket.send(msg);
  }
  else if(message.type === "tab updated") {
    console.log("tab updated: script") 
    chrome.runtime.sendMessage({type: "tab updated"})
  }
  return true;
});
