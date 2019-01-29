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
chrome.runtime.onMessage.addListener(function(obj, sender, sendResponse) {
  console.log('onMessage', obj, sender, sendResponse);
  if (obj.method === 'getEnabled') {
    sendResponse({'enabled': enabled});
  } else if (obj.method === 'setEnabled') {
    toggleState(obj.data);
  }
});

/**
 * Set default state
 */
chrome.storage.local.get('enabled', function (data) {
  toggleState(data.enabled);
});
