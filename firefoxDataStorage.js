function getEmojis() {
  browser.storage.sync.get(function(data) {
    map = data["emojis"]
  });
}

function writeEmojis(emojis) {
  var map = {emojis: emojis}
  browser.storage.sync.set(map);
}
