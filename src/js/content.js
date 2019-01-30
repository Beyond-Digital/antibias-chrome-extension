var selectors = [
  'pv-top-card-section__name',
  'pv-top-card-section__photo',
  'pv-browsemap-section__member-image',
  'actor-name'
];

/**
 * Toggle extension state
 */
function toggleState(state) {
  console.log('toggleState', state, selectors);
  selectors.forEach((selector) => {
    var elements = document.getElementsByClassName(selector);
    [].forEach.call(elements, function(element) {
      updateElement(element, state);
    });
  });
}

/**
 * Update element state
 */
function updateElement(el, state) {
  var type = 'html';
  var val = el.innerHTML;
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
    if (type === 'image') {
      el.setAttribute('src', pattern);
    } else if (type === 'background') {
      el.style.backgroundImage = 'url("' + pattern + '")';
    } else {
      el.innerHTML = '--------';
    }
  } else {
    if (type === 'image') {
      el.setAttribute('src', el.getAttribute('data-bias'));
    } else if (type === 'background') {
      el.style.backgroundImage = 'url("' + el.getAttribute('data-bias') + '")';
    } else {
      el.innerHTML = el.getAttribute('data-bias');
    }
  }
}

/**
 * Listen for messages from popup
 */
chrome.runtime.onMessage.addListener(function(message, sender, callback) {
  if (message.method === 'setEnabled') {
    toggleState(message.data);
  }
});
