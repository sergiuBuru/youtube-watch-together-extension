//The user can request to start a new room
let start_button = document.createElement("button");
start_button.id = "start-btn";
start_button.innerText = "START ROOM";

//The user can enter the room id of an already existing room
let enter_button = document.createElement("button");
enter_button.id = "enter-btn";
enter_button.innerText = "ENTER ROOM ID";

//The user can request to join and already existing room
let join_button = document.createElement("button");
join_button.id = "join-btn";
join_button.innerText = "JOIN ROOM";

//The user can go back to the original popup
let back_button = document.createElement("button");
back_button.id = "back-btn";
back_button.innerText = "Go back";

//Request a user uuid
let user_uuid_button = document.createElement("button");
user_uuid_button.id = 'uuid-btn';
user_uuid_button.innerText = 'Get user id';

//Open the youtube video with the input url
let open_video_button = document.createElement("button");
open_video_button.id = 'video-btn';
open_video_button.innerText = 'Open youtube video';

//The user removes themselves from the room and has the option to
// start a new room or join one.
let leave_room_button = document.createElement("button");
leave_room_button.id = 'leave-btn';
leave_room_button.innerText = 'Leave room'; 

//room id paragraph
let room_id_text = document.createElement("p");

//user uuid paragraph
let user_id_text = document.createElement("p");

//room number parapgraph
let room_number_text = document.createElement("p");

//textbox for entering the room id
let room_id_textbox = document.createElement("textarea");
room_id_textbox.placeholder = "room id"

//textbox for entering the room number
let room_nm_textbox = document.createElement("textarea");
room_nm_textbox.placeholder = "room number"

//textbox for entering youtube video url
let youtube_url_textbox = document.createElement("textarea");
youtube_url_textbox.placeholder = "youtube url"

//main div that holds all the elements 
var popup_div = document.querySelector("#popup");

//Request user uuid from the script 
user_uuid_button.addEventListener('click', () => {
  //request user uuid from the content script
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, 
    {
      type: 'user uuid request'
    });
  });
})

//Request room id and number from the server
start_button.addEventListener("click", () => {
  removeAllChildNodes(popup_div);
  popup_div.appendChild(user_id_text);
  popup_div.appendChild(room_id_text);
  popup_div.appendChild(room_number_text);
  popup_div.appendChild(youtube_url_textbox);
  popup_div.appendChild(open_video_button);
  popup_div.appendChild(leave_room_button);
  
  chrome.storage.local.get('user_uuid', function(result) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, 
      {
        type: 'room uuid request',
        user_uuid: result.user_uuid
      });
    });
  })
})

//Promp user to enter the room id and number in order to join
join_button.addEventListener("click", () => {
  removeAllChildNodes(popup_div);
  popup_div.appendChild(room_id_textbox);
  popup_div.appendChild(room_nm_textbox);
  popup_div.appendChild(enter_button);
})

//Allow the user to introduce a room id
enter_button.addEventListener("click", () => {
  removeAllChildNodes(popup_div);
  popup_div.appendChild(user_id_text);
  popup_div.appendChild(room_id_text);
  popup_div.appendChild(room_number_text);
  popup_div.appendChild(youtube_url_textbox);
  popup_div.appendChild(open_video_button);
  popup_div.appendChild(leave_room_button);

  //Send the room id and number to the server so that the client is added to the room
  if(room_id_textbox.value && room_nm_textbox.value) {
    chrome.storage.local.get("user_uuid", function(result) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "room join request",
          user_uuid: result.user_uuid,
          room_uuid: room_id_textbox.value,
          room_number: room_nm_textbox.value
        });
      });
    });
  }
})

//Tell sw that this client wants to leave the room 
leave_room_button.addEventListener('click', () => {
  removeAllChildNodes(popup_div);
  popup_div.appendChild(user_id_text);
  popup_div.appendChild(start_button);
  popup_div.appendChild(join_button);
  chrome.storage.local.get('user_uuid', function(user) {
    user_id_text.innerText = `user id: ${user.user_uuid}`;
    chrome.storage.local.get("room_uuid", function(rid) {
      chrome.storage.local.get("room_number", function(rnb) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "leave room",
            user_uuid: user.user_uuid,
            room_uuid: rid.room_uuid,
            room_number: rnb.room_number
          });
        });
      })
    })
  });
})

//Tell server to echo back to all members in this room to open the youtube url
open_video_button.addEventListener("click", async () => {
  chrome.storage.local.get("room_uuid", function(rid) {
    chrome.storage.local.get("room_number", function(rnb) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "open url",
          url: youtube_url_textbox.value,
          room_uuid: rid.room_uuid,
          room_number: rnb.room_number
        });
      });
    })
  })
});

//The user can go back from the join room popup to the original popup
back_button.addEventListener("click", () => {
  removeAllChildNodes(popup_div);
  popup_div.appendChild(start_button);
  popup_div.appendChild(enter_button);
});

chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    console.log(msg);
    if(msg.type === 'serve user uuid') {
      chrome.storage.local.set({user_uuid: msg.user_uuid});
      //load the start page of the popup
      removeAllChildNodes(popup_div);
      user_id_text.innerText = `user id: ${msg.user_uuid}`;
      popup_div.appendChild(user_id_text);
      popup_div.appendChild(start_button);
      popup_div.appendChild(join_button);
    }
    else if(msg.type === 'serve room uuid') {
      //Display the user id, room id, and room number
      chrome.storage.local.set({room_uuid: msg.room_uuid});
      chrome.storage.local.set({room_number: msg.room_number});
      room_id_text.innerHTML = `room id: ${msg.room_uuid}`;
      room_number_text.innerText = `room number: ${msg.room_number}`;
    }
    else if(msg.type === 'added to room') {
      chrome.storage.local.set({room_uuid: msg.room_uuid});
      chrome.storage.local.set({room_number: msg.room_number});
      user_id_text.innerText = `user id: ${msg.user_uuid}`;
      room_id_text.innerText = `room id: ${msg.room_uuid}`;
      room_number_text.innerText = `room number: ${msg.room_number}`;
    }
    else if(msg.type === 'removed from room') {
      chrome.storage.local.remove("room_uuid");
      chrome.storage.local.remove("room_number");
    }
    return true;
  }
);

// websocket.onmessage = function(event) {
//
//   else if(msg.type === "open url") {
//     chrome.runtime.sendMessage(msg);
//   }
// }



// https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}


//Check whether the user has a uuid. If they do, prompt them to start or join a room.
// else, prompt them to get a uuid
window.onload = function checkUserUUID() {
  chrome.storage.local.get('user_uuid', function(user_result) {
    if(user_result.user_uuid) {
      //If the user hasn't requested a room uuid, prompt them to do so
      chrome.storage.local.get('room_uuid', function(rid){
        if(rid.room_uuid) {
          chrome.storage.local.get('room_number', function(rnm){
            popup_div.appendChild(user_id_text);
            popup_div.appendChild(room_id_text);
            popup_div.appendChild(room_number_text);
            popup_div.appendChild(youtube_url_textbox);
            popup_div.appendChild(open_video_button);
            popup_div.appendChild(leave_room_button);
            user_id_text.innerText = `user id: ${user_result.user_uuid}`;
            room_id_text.innerText = `room id: ${rid.room_uuid}`;
            room_number_text.innerText = `room number: ${rnm.room_number}`;
          })
        } else {
            popup_div.appendChild(user_id_text);
            user_id_text.innerText = `user id: ${user_result.user_uuid}`;
            popup_div.appendChild(start_button);
            popup_div.appendChild(join_button); 
        }
      });
    }
    else {
      popup_div.appendChild(user_uuid_button);
    }
  })
}

