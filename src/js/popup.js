var enabled = false;
var toggle = document.getElementById('toggle');

chrome.runtime.sendMessage({ method: 'getEnabled' }, function (data) {
  console.log('sendMessage', data);
  enabled = data.enabled;
  toggle.checked = data.enabled;
});

toggle.addEventListener('change', function(e) {
  console.log('change', e.target.checked);
  enabled = e.target.checked;
  chrome.runtime.sendMessage({ method: 'setEnabled', data: enabled });
});
