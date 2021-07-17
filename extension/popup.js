console.log("start");
//If clicked, the user can request to start a new room
let start_button = document.createElement("button");
start_button.id = "start-btn";
start_button.innerText = "START ROOM";

//If clicked, the user can enter the room id of an already existing room
let enter_button = document.createElement("button");
enter_button.id = "enter-btn";
enter_button.innerText = "ENTER ROOM ID";

//If clicked, the user can request to join and already existing room
let join_button = document.createElement("button");
join_button.id = "join-btn";
join_button.innerText = "JOIN ROOM";

//If clicked, the user can go back to the original popup
let back_button = document.createElement("button");
back_button.id = "back-btn";
back_button.innerText = "Go back";

//If clicked, request a user uuid
let user_uuid_button = document.createElement("button");
user_uuid_button.id = 'uuid-btn';
user_uuid_button.innerText = 'Get user id';

//room id paragraph
let room_id_text = document.createElement("p");

//user uuid paragraph
let user_id_text = document.createElement("p");

//room number parapgraph
let room_number_text = document.createElement("p");

//textbox for entering the room id
let room_id_textbox = document.createElement("textarea");
room_id_textbox.placeholder = "room id"

//textbox for ewntering the room number
let room_nm_textbox = document.createElement("textarea");
room_nm_textbox.placeholder = "room number"

//main div that holds all the elements 
var popup_div = document.querySelector("#popup");

//Connect to the sw
var script_port = chrome.runtime.connect({name: "script_port"});

//The user requests a user uuid which will be stored using chrome.storage
user_uuid_button.addEventListener('click', () => {
  //tell sw to request uuid from sever
  script_port.postMessage({
    type: "user uuid request",
    user_uuid: ''
  });
})


//when the start button is clicked, tell background script to request room id from the server
start_button.addEventListener("click", () => {
  removeAllChildNodes(popup_div);
  popup_div.appendChild(user_id_text);
  popup_div.appendChild(room_id_text);
  popup_div.appendChild(room_number_text);
  
  //Request a room id for this user from the sw
  chrome.storage.local.get('user_uuid', function(result) {
    script_port.postMessage(
      {
        type: "room uuid request",
        user_uuid: result.user_uuid
      }
    );
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

  //Send the room id and numeb to the server so that the client is added to the room
  if(room_id_textbox.value && room_nm_textbox.value) {
    chrome.storage.local.get("user_uuid", function(result) {
      script_port.postMessage({
        type: "room join request",
        user_uuid: result.user_uuid,
        room_uuid: room_id_textbox.value,
        room_number: room_nm_textbox.value
      });
    });
  }
})

//The user can go back from the join room popup to the original popup
back_button.addEventListener("click", () => {
  removeAllChildNodes(popup_div);
  popup_div.appendChild(start_button);
  popup_div.appendChild(enter_button);
});

script_port.onMessage.addListener(function(msg) {
  //The server sends back a uuid for this user which is then stored using chrome.storage.local
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
  return true;
});


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