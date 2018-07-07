function getEmojis() {
  chrome.storage.local.get(function(data) {
    console.log(data)
    map = data["emojis"]
  });
}

function writeEmojis(emojis) {
  var map = {emojis: emojis}
  chrome.storage.local.set(map);
}
