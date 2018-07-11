function getEmojis() {
  chrome.storage.local.get(function(data) {
    map = data["emojis"]
    autocompleteemojis = Object.keys(map).map(function(value, i) {return {key: value, name: value, liImg: getImage(value), img: getImage(value)}});
  });
}

function writeEmojis(emojis) {
  var map = {emojis: emojis}
  chrome.storage.local.set(map);
}
