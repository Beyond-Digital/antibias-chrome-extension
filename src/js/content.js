var selectors = [
  '.pv-top-card-section__photo',
  '.pv-top-card-section__edit-photo',
  '.pv-profile-sticky-header__image',
  '.pv-browsemap-section__member-image',
  '.EntityPhoto-circle-4',
  '.top-card-profile-image .image',
  '.profile-image img',
  '.antibias .EntityPhoto-circle-7',
  '.antibias #topcard .module-body img'
];
var scrolling = 0;

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
  if (state === true) {
    document.body.classList.add('antibias');
  } else {
    document.body.classList.remove('antibias');
  }
  selectors.forEach((selector) => {
    var elements = document.querySelectorAll(selector);
    [].forEach.call(elements, function(element) {
      updateElement(element, state);
    });
  });
}

/**
 * Update element state
 */
function updateElement(el, state, hash) {
  if (state === true) {
    var val = getImageVal(el);
    if (val && val !== '') {
      if (!el.hasAttribute('data-bias')) {
        el.setAttribute('data-bias', val);
      }
      var hash = hashCode(val);
      el.style.backgroundPosition = `${hash.substring(0, 3)}px ${hash.substring(1, 4)}px`;
      el.style.filter = `hue-rotate(${hash.substring(2, 5)}deg)`;
    }
  } else if (state === false) {
    el.style.backgroundPosition = '0px 0px';
    el.style.filter = 'hue-rotate(0deg)';
    if (el.hasAttribute('data-bias')) {
      setImageVal(el, el.getAttribute('data-bias'));
    }
  }
}

/**
 * Helper functions
 */
function getImageVal(el) {
  return el.hasAttribute('src') ? el.getAttribute('src') : el.style.backgroundImage.slice(5, -2);
}

function setImageVal(el, val) {
  return el.hasAttribute('src') ? el.setAttribute('src', val) : el.style.backgroundImage = val;
}

/**
 * Update page based on toggle
 */
function updatePage() {
  chrome.storage.local.get('enabled', function (data) {
    console.log('content.get', data);
    toggleState(data.enabled);
  });
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
 * Update page on window events
 */
window.addEventListener('DOMContentLoaded', function() {
  console.log('window.DOMContentLoaded');
  updatePage();
});
window.addEventListener('load', function() {
  console.log('window.load');
  updatePage();
});
window.onpopstate = function() {
  console.log('window.popstate');
  window.setTimeout(function () {
    updatePage();
  }, 200);
};
window.addEventListener('scroll', function(e) {
  scrolling += 1;
  if (scrolling === 10) {
    window.requestAnimationFrame(function() {
      updatePage();
    });
    scrolling = 0;
  }
});
