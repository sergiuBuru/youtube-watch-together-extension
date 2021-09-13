
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.type === 'open url') {
      chrome.tabs.create({url: request.url});
    }
    else if(request.type === 'user & room info') {
    console.log("here2");
      chrome.storage.local.get('user_uuid', function(user) {
        chrome.storage.local.get("room_uuid", function(rid) {
          chrome.storage.local.get("room_number", function(rnb) {
            sendResponse({
              type: 'serve user & room info',
              room_number: rnb.room_number,
              room_uuid: rid.room_uuid,
              user_uuid: user.user_uuid
            });
          });
        })
      });
    }
    else if(request.type === 'test') {
      console.log('it works');
    }
    return true;
  }
);


chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab) {
  console.log(tab);
  if(tab.url.includes('www.youtube.com')) {
    chrome.tabs.sendMessage(tabID, {
      type: 'video opened',
      url: tab.url
    });
  }
})
