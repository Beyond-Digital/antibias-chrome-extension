var colors = {
  off: '#616161',
  on: '#0b8043'
};
var enabled = false;

/**
 * Toggle extension state
 */
function toggleState(state) {
  console.log('background.toggleState', state);
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
  // send message to content
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { method: 'setEnabled', data: state });
  });
}

/**
 * Extension install
 */
chrome.runtime.onInstalled.addListener(function (details) {
  console.info('background.onInstalled', details);
  toggleState(enabled);
});

/**
 * Listen for messages from popup
 */
chrome.runtime.onMessage.addListener(function(message, sender, callback) {
  console.log('background.onMessage', message, sender, callback);
  if (message.method === 'getEnabled') {
    callback({'enabled': enabled});
  } else if (message.method === 'setEnabled') {
    toggleState(message.data);
  }
});

/**
 * Set default state
 */
chrome.storage.local.get('enabled', function (data) {
  console.log('background.get', data);
  toggleState(data.enabled);
});
