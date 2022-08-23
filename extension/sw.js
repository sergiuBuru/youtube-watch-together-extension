
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //main content script requested the background to open the youtube url in a new tab
    if(request.type === 'open url') {
      //open the url and inject the mini script into the youtube page
      chrome.tabs.create({url: request.url}, (tab) => {
        //Store the tab id of the main script tab and the
        // yt script tab. Will be used in later communications
        chrome.storage.local.set({main_tab_id : sender.tab.id});
        chrome.storage.local.set({yt_tab_id : tab.id})
        setTimeout(injectScript, 1000, tab);//timout needed because of Chrome API bug
      });
    }
    //A user from the room clicked their video. The server echoed it back
    // to the main script which redirected it here. Send it to the yt script
    else if(request.type === 'server video click') {
      chrome.storage.local.get('yt_tab_id', (yt) => {
        chrome.tabs.sendMessage(yt.yt_tab_id, request);
      });
    }
    //Yt content script echoed a user click so send it forward 
    // to the main content script to communicate it to the server
    else if(request.type === 'user video click') {
      chrome.storage.local.get('main_tab_id', (main) => {
        chrome.tabs.sendMessage(main.main_tab_id, request);
      });
    }
    //Yt content script echoed a user changing the time in the video,
    // so send it forward to the main content script to communicate it
    // to the server
    else if(request.type === 'user time change') {
      chrome.storage.local.get('main_tab_id', (main) => {
        console.log(request)
        chrome.tabs.sendMessage(main.main_tab_id, request);
      });
    }
    //Server echoed back that a user changed their current time
    // in their video. Send that to the yt script
    else if(request.type === 'server time change') {
      console.log('server time change');
      console.log(request);
      chrome.storage.local.get('yt_tab_id', (yt) => {
        chrome.tabs.sendMessage(yt.yt_tab_id, request);
      });    
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