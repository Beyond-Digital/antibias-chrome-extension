var colors = {
  off: '#616161',
  on: '#0b8043'
};
var enabled = false;

/**
 * Toggle extension state
 */
function toggleState(state) {
  var icon = chrome.browserAction;
  if (state === true) {
    icon.setBadgeText({text: 'on'});
    icon.setBadgeBackgroundColor({color: colors.on});
  } else {
    icon.setBadgeText({text: 'off'});
    icon.setBadgeBackgroundColor({color: colors.off});
  }
  enabled = state;
  chrome.storage.local.set({'enabled': state});
}

/**
 * Extension install
 */
chrome.runtime.onInstalled.addListener(function (details) {
  console.info('onInstalled', details);
  toggleState(enabled);
});

/**
 * Listen for messages from popup
 */
chrome.runtime.onMessage.addListener(function(message, sender, callback) {
  console.log('onMessage', message, sender, callback);
  if (message.method === 'getEnabled') {
    callback({'enabled': enabled});
  } else if (message.method === 'setEnabled') {
    toggleState(message.data);
  }
  // send message to content.js
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
});

/**
 * Set default state
 */
chrome.storage.local.get('enabled', function (data) {
  // chrome.tabs.executeScript(null, {file: 'js/content.js', allFrames: true});
  toggleState(data.enabled);
});
