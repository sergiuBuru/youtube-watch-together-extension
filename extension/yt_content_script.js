
chrome.runtime.onMessage.addListener( message => {
  let msg = JSON.stringify(message);

  console.log("here in yt script");
  if(message.type === 'yt content script injected') {
    //Wait for the video element that the user will be clicking to pause/play
    // the video to be loaded on the screen
    waitForElm('.video-stream, .html5-main-video').then((yt_video_elem) => {
      //Get the video element
      let video = document.querySelector('.video-stream, .html5-main-video');
      //Let the background know when the user clicks the video(pause/play) 
      // so it can communicate that to the server
      video.addEventListener('click', (event) => {
        //Condition is true only when the click was done manually(be user)
        // and not programatically (asked by server)
        if(event.clientX != 0 && event.clientY != 0) {
          //Get the user and room info and send it to the background page
          // alongside the click message
          chrome.storage.local.get('user_uuid', function(user) {
            chrome.storage.local.get("room_uuid", function(rid) {
              chrome.storage.local.get("room_number", function(rnb) {
                chrome.runtime.sendMessage({
                  type: 'user video click',
                  room_number: rnb.room_number,
                  room_uuid: rid.room_uuid,
                  exclude: user.user_uuid
                });
              });
            })
          });
        }
        console.log(event.clientX, event.clientY);
      });
      //Get the progress bar element
      let bar = document.querySelector('.ytp-progress-bar');
      //If the user moves the bar pin to a different time in the video, announce
      // it to the other users in the room
      bar.addEventListener('click', (event) => {
        //Get the current time of the video in seconds
        let time = bar.ariaValueNow;
        console.log("bar clicked", time);
        //Send the info to the background script
        chrome.storage.local.get('user_uuid', function(user) {
          chrome.storage.local.get("room_uuid", function(rid) {
            chrome.storage.local.get("room_number", function(rnb) {
              chrome.runtime.sendMessage({
                type: 'user time change',
                room_number: rnb.room_number,
                room_uuid: rid.room_uuid,
                exclude: user.user_uuid,
                time : time
              });
            });
          })
        });
      })
    });
  }
  else if(message.type === 'server video click') {
    console.log('a user clicked their video');
    let video = document.querySelector('.video-stream, .html5-main-video');
    video.click();
  }
  else if(message.type === 'server time change') {
    //Change the time to reflect the other users' video time
    console.log('other user time change: ', message);
    document.getElementsByTagName('video')[0].currentTime = message.time;
  }

  return true;
});

//from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
//Waits for an html element to appear on the page
function waitForElm(selector) {
  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              resolve(document.querySelector(selector));
              observer.disconnect();
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}