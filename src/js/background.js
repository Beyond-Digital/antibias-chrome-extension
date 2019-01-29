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
    updateContent('hide()');
  } else {
    icon.setBadgeText({text: 'off'});
    icon.setBadgeBackgroundColor({color: colors.off});
    updateContent('show()');
  }
  enabled = state;
  chrome.storage.local.set({'enabled': state});
}

/**
 * Update the page content
 */
function updateContent(method) {
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id}, function(activeTabs) {
      // chrome.tabs.executeScript(activeTabs[0].id, { code: method });
      // chrome.tabs.executeScript(activeTabs[0].id, {file: 'content.js', allFrames: true});
    });
  });
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
});

/**
 * Set default state
 */
chrome.storage.local.get('enabled', function (data) {
  toggleState(data.enabled);
});
