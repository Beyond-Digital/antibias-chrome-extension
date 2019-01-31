var toggle = document.getElementById('toggle');

chrome.runtime.sendMessage({ method: 'getEnabled' }, function (data) {
  console.log('popup.sendMessage', data.enabled);
  toggle.checked = data.enabled;
});

toggle.addEventListener('change', function(e) {
  console.log('popup.change', e.target.checked);
  chrome.runtime.sendMessage({ method: 'setEnabled', data: e.target.checked });
});
