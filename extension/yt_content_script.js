
chrome.runtime.onMessage.addListener( message => {
  let msg = JSON.stringify(message);

  console.log("here in yt script");
  if(message.type === 'yt content script injected') {
    //get the youtube video element
    waitForElm('.ytp-player-content, .ytp-iv-player-content').then((yt_video_elem) => {
      console.log('Element is ready');
      console.log(yt_video_elem);
    });
  }

  return true;
});

//from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
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