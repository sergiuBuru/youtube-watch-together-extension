console.log('yt scrpit injected')

chrome.runtime.onMessage.addListener( message => {
  let msg = JSON.stringify(message);

  console.log("here in yt script");
  if(message.type === 'yt content script injected') {
    console.log('yt script injected successfully');
  }

  return true;
});
