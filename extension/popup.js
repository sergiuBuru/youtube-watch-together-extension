//If clicked, the user can request to start a new room
var start_button = document.createElement("button");
start_button.id = "start-btn";
start_button.innerText = "START ROOM";

//If clicked, the user can enter the room id of an already existing room
var enter_button = document.createElement("button");
enter_button.id = "enter-btn";
enter_button.innerText = "ENTER ROOM ID";

//If clicked, the user can request to join and already existing room
var join_button = document.createElement("button");
join_button.id = "join-btn";
join_button.innerText = "JOIN ROOM";

//If clicked, the user can go back to the original popup
var back_button = document.createElement("button");
back_button.id = "back-btn";
back_button.innerText = "Go back";

var popup_div = document.querySelector("#popup");
popup_div.appendChild(start_button);
popup_div.appendChild(enter_button);



var script_port = chrome.runtime.connect({name: "script_port"});



//when the start button is clicked, tell background script to request room id from the server
start_button.addEventListener("click", () => {
  console.log("button clicked. sending mesasge to sw");
  script_port.postMessage(
    {
      extension_id: chrome.runtime.id,
      content: "Requesting room id"
    }
  );
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
  div.innerHTML = msg.content + Math.random().toString();
  return true;
});


// https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}