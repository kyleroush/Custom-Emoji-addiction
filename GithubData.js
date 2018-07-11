var githubAutoComplete = []
var githubKeys = []

function loadGithubEmoji() {
  $.ajax(
    {
      url: 'https://api.github.com/emojis',
      success: function(result) {
        chrome.storage.local.set({githubEmojis: result});
        buildGithubMap(result)
    }});
}

function getGithubImage(githubData, id) {
  var image = githubData[id];
  var img = document.createElement("img");
  img.src = image;
  img.alt = id;
  img.title = id;
  img.width = 25;
  return img.outerHTML;
}
function buildGithubMap(githubData) {
  githubKeys = Object.keys(githubData);
  githubAutoComplete = githubKeys.map(function(value, i) {return {key: value, name: value, liImg: getGithubImage(githubData, value), img: ':'+value+':'}});
}
if(document.location.host.includes("github")) {
  chrome.storage.local.get(function (githubData) {
    if (githubData.githubEmojis == undefined) {
      loadGithubEmoji()
    } else {
      buildGithubMap(githubData.githubEmojis)
    }
  });
}
