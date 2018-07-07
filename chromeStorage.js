function getEmojis() {
  chrome.storage.local.get(function(data) {
    console.log(data)
    map = data["emojis"]
    autocompleteemojis = Object.keys(map).map(function(value, i) {return {key: value, name: value, img: getImage(value)}});
  });
}

function writeEmojis(emojis) {
  var map = {emojis: emojis}
  chrome.storage.local.set(map);
}
