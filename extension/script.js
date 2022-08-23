let websocket = new WebSocket('ws://localhost:3002');
let user_uuid;
let room_uuid;
let room_number;

websocket.onopen = function() {
}

// Forward mesasges from the server to the popup
websocket.onmessage = function(event) {
  const msg = JSON.parse(event.data);
  console.log(msg)
  if(msg.type === 'pong') {
    setTimeout(() => {
      websocket.send(JSON.stringify({
        type: 'ping'
      }))
    }, 20000)
  }
  else if(msg.type === 'serve user uuid') {
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
  else if(msg.type === 'server video click') {
    console.log("server said video clicked");
    //Tell background to communicate the server click to the yt script
    chrome.runtime.sendMessage({type : 'server video click'});
  }
  else if(msg.type === 'server time change') {
    console.log('server time change');
    chrome.runtime.sendMessage(msg);
  }
  else if(msg.type === 'test') {
    console.log('its a test');
  }
}

// Forward messages from the popup to the server
chrome.runtime.onMessage.addListener( message => {
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
  else if(message.type === 'user video click') {
    console.log('VIDEO CLICKED IN YT SCRIPT');
    websocket.send(msg);
  }
  else if(message.type === 'user time change') {
    websocket.send(msg);
  }
  else if(message.type === "tab updated") {
    // console.log("tab updated: script") 
    // chrome.runtime.sendMessage({type: "tab updated"})
  }
  return true;
});
