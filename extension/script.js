let websocket = new WebSocket('ws://localhost:3002');
let video_element;
let v_opened = false;
let server_click = false;
let user_uuid;
let room_uuid;
let room_number;

websocket.onopen = function() {
  // chrome.runtime.sendMessage({type: 'user & room info'}, function(response) {
  //   user_uuid = response.user_uuid;
  //   room_uuid = response.room_uuid;
  //   room_number = response.room_number;
  //   console.log('receiving info from sw', user_uuid, room_uuid, room_number);
  //   if(user_uuid != null && room_uuid != null && room_number != null) {
  //     console.log('sending request to server');
  //     websocket.send(JSON.stringify({
  //       type: 'room join request',
  //       room_number: room_number,
  //       room_uuid: room_uuid,
  //       user_uuid: user_uuid
  //     }));
  //   }
  // });
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
  else if(msg.type === 'video clicked') {
    // server_click = true;
    document.querySelector('.ytp-player-content, .ytp-iv-player-content').click();
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
  else if(message.type === 'video opened') {
    // if(!v_opened){
    //   console.log("video opened");
    //   v_opened = true;
    //   video_element = document.querySelector('video');
    //   console.log(video_element);
    //   video_element.addEventListener('click', (event) => {
    //     console.log('click event: ', event);
    //     //User click not programmatic click. Only send this info to server to prevent click loops
    //     if(event.clientX != 0 && event.clientY != 0) {
    //       websocket.send(JSON.stringify({
    //         type: 'video clicked',
    //         room_number: room_number,
    //         room_uuid: room_uuid,
    //         exclude: user_uuid
    //       }));
    //     }
    //   });
    // }
    // else {
    //   console.log('in storage already');
    // }
    console.log("video opened");
    var youtube_video_elem = document.querySelector('.ytp-player-content, .ytp-iv-player-content');
    youtube_video_elem.addEventListener('click', (event) => {
      console.log('outside of if');
      // Condition is true when the click was made by the user, not prorammatic(when the server announced it)
      if(event.clientX != 0 && event.clientY != 0) {
        console.log(event.clientX, event.clientY);
        chrome.storage.local.get('user_uuid', function(user) {
          chrome.storage.local.get("room_uuid", function(rid) {
            chrome.storage.local.get("room_number", function(rnb) {
              websocket.send(JSON.stringify({
                type: 'video clicked',
                room_number: room_number,
                room_uuid: room_uuid,
                exclude: user_uuid
              }));
            });
          })
        });
      }
    });
  }
  else if(message.type === "tab updated") {
    // console.log("tab updated: script") 
    // chrome.runtime.sendMessage({type: "tab updated"})
  }
  return true;
});
