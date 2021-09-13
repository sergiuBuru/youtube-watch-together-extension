let websocket = new WebSocket('ws://localhost:3002');
let video_element;
let v_opened = false;
let server_click = false;
let user_uuid;
let room_uuid;
let room_number;

websocket.onopen = function() {
  // websocket.send(JSON.stringify({
  //   type: 'ping'
  // }));

  chrome.runtime.sendMessage({type: 'user & room info'}, function(message) {
    user_uuid = message.user_uuid;
    room_uuid = message.room_uuid;
    room_number = message.room_number;
    console.log('receiving info from sw', user_uuid, room_uuid, room_number);
    if(user_uuid && room_uuid && room_number) {
      console.log('sending request to server');
      websocket.send(JSON.stringify({
        type: 'room join request',
        room_number: room_number,
        room_uuid: room_uuid,
        user_uuid: user_uuid
      }));
    }
  });
}

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
  else if(msg.type === 'video clicked') {
    server_click = true;
    document.querySelector('video').click();
  }
  else if(msg.type === 'test') {
    console.log('its a test');
  }
}

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
  else if(message.type === 'video opened') {
    if(!v_opened){
      console.log("video opened");
      v_opened = true;
      video_element = document.querySelector('video');
      console.log(video_element);
      video_element.addEventListener('click', (event) => {
        console.log('click event: ', event);
        //User click not programmatic click. Only send this info to server to prevent click loops
        if(event.clientX != 0 && event.clientY != 0) {
          websocket.send(JSON.stringify({
            type: 'video clicked',
            room_number: room_number,
            room_uuid: room_uuid,
            exclude: user_uuid
          }));
        }
      });
    }
    else {
      console.log('in storage already');
    }
  }
  else if(message.type === "tab updated") {
    // console.log("tab updated: script") 
    // chrome.runtime.sendMessage({type: "tab updated"})
  }
  return true;
});
