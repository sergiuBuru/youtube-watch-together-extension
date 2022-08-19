
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //main content script requested the background to open the youtube url in a new tab
    if(request.type === 'open url') {
      //open the url and inject the mini script into the youtube page
      chrome.tabs.create({url: request.url}, (tab) => {
        setTimeout(injectScript, 1000, tab);//timout needed because of Chrome API bug
      });
    }
    else if(request.type === 'user & room info') {
    // console.log("here2");
    //   chrome.storage.local.get('user_uuid', function(user) {
    //     chrome.storage.local.get("room_uuid", function(rid) {
    //       chrome.storage.local.get("room_number", function(rnb) {
    //         sendResponse({
    //           type: 'serve user & room info',
    //           room_number: rnb.room_number,
    //           room_uuid: rid.room_uuid,
    //           user_uuid: user.user_uuid
    //         });
    //       });
    //     })
    //   });
    }
    else if(request.type === 'test') {
      console.log('it works');
    }
    return true;
  }
);


chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab) {
  //
})

//injects a script into a specified tab
function injectScript(tab) {
  chrome.scripting.executeScript({
    target : {tabId : tab.id},
    files : ['yt_content_script.js']
  }, () => {
    console.log('script injected');
    //let the yt_content_script know that it was injected
    chrome.tabs.sendMessage(tab.id, {type : 'yt content script injected'});
  });

}