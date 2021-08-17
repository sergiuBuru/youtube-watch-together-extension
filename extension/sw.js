
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.type === 'open url') {
      chrome.tabs.create({url: request.url});
      console.log(request);
    }
    return true;
  }
);


chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab) {
  
  console.log("tab updated");
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "tab updated"});
  });
})