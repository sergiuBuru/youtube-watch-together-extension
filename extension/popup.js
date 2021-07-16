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
let uuid_button = document.createElement("button");
uuid_button.id = 'uuid-btn';
uuid_button.innerText = 'Get user id';

//room id paragraph
let room_id_text = document.createElement("p");

//user uuid paragraph
let user_id_text = document.createElement("p");

//room number parapgraph
let room_number_text = document.createElement("p");


var popup_div = document.querySelector("#popup");
// popup_div.appendChild(start_button);
// popup_div.appendChild(enter_button);

//Connect to the sw
var script_port = chrome.runtime.connect({name: "script_port"});

//The user requests a user uuid which will be stored using chrome.storage
uuid_button.addEventListener('click', () => {
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

//Allow the user to introduce a room id
enter_button.addEventListener("click", () => {
  popup_div.removeChild(start_button);
  popup_div.removeChild(enter_button);
  let textbox = document.createElement("textarea");
  textbox.placeholder = "room id"
  popup_div.appendChild(textbox);
  popup_div.appendChild(join_button);
  popup_div.appendChild(back_button);
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
document.body.onload = function checkUserUUID() {
  chrome.storage.local.get('user_uuid', function(user_result) {
    if(user_result.user_uuid) {
      //If the user hasn't requested a room uuid, prompt them to do so
      chrome.storage.local.get('room_uuid', function(room_result){
        if(room_result.room_uuid && room_result.room_number) {
          console.log(room_result);
          console.log(user_result);
          popup_div.appendChild(user_id_text);
          popup_div.appendChild(room_id_text);
          popup_div.appendChild(room_number_text);
          user_id_text.innerText = `user id: ${user_result.user_uuid}`;
          room_id_text.innerText = `room id: ${room_result.room_uuid}`;
          room_number_text.innerText = `room number: ${room_result.room_number}`;
        } else {
            popup_div.appendChild(user_id_text);
            user_id_text.innerText = `user id: ${user_result.user_uuid}`;
            popup_div.appendChild(start_button);
            popup_div.appendChild(enter_button); 
        }
      });
    } 
    else {
      popup_div.appendChild(uuid_button);
    }
  })
}