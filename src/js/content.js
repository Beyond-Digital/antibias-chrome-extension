var selectors = [
  'pv-top-card-section__name',
  'pv-top-card-section__photo',
  'actor-name',
  'pv-browsemap-section__member-image',
];

/**
 * Get hash from string
 */
function hashCode(str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString();
};

/**
 * Toggle extension state
 */
function toggleState(state) {
  console.log('content.toggleState', state);
  selectors.forEach((selector) => {
    var elements = document.getElementsByClassName(selector);
    [].forEach.call(elements, function(element) {
      updateElement(element, state,);
    });
  });
}

/**
 * Update element state
 */
function updateElement(el, state, hash) {
  var type = 'html';
  var val = el.innerHTML.trim();
  if (el.hasAttribute('src')) {
    type = 'image';
    val = el.getAttribute('src');
  } else if (el.style.backgroundImage) {
    type = 'background';
    val = el.style.backgroundImage.slice(5, -2);
  }
  if (!el.hasAttribute('data-bias')) {
    el.setAttribute('data-bias', val);
  }
  if (state === true) {
    if (type === 'image' || type === 'background') {
      if (type === 'image') {
        el.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
      }
      var hash = hashCode(el.getAttribute('data-bias'));
      el.style.cssText = `
        background-image: url('${pattern}');
        background-repeat: repeat;
        background-size: 800px;
        background-position: ${hash.substring(0, 3) + "px " + hash.substring(1, 4) + "px"};
        filter: hue-rotate(${hash.substring(2, 5)}deg);`;
    } else {
      el.innerHTML = '--------';
    }
  } else {
    if (type === 'image') {
      el.setAttribute('src', el.getAttribute('data-bias'));
      el.style.cssText = '';
    } else if (type === 'background') {
      el.style.cssText = `background-image: url('${el.getAttribute('data-bias')}');`;
    } else {
      el.innerHTML = el.getAttribute('data-bias');
    }
  }
}

/**
 * Listen for messages from popup
 */
chrome.runtime.onMessage.addListener(function(message, sender, callback) {
  console.log('content.onMessage', message, sender, callback);
  if (message.method === 'setEnabled') {
    toggleState(message.data);
  }
});

/**
 * Set default state
 */
window.addEventListener('load', function() {
  chrome.storage.local.get('enabled', function (data) {
    console.log('content.get', data);
    toggleState(data.enabled);
  });
});
