// the list of values for auto complete
var githubAutoComplete = []
// List of the github keys
var githubKeys = []

// load the emojis for github api
function loadGithubEmoji() {
  $.ajax(
    {
      url: 'https://api.github.com/emojis',
      success: function(result) {
        chrome.storage.local.set({githubEmojis: result});
        buildGithubMap(result)
    }});
}

/**
 * initialize the values for github like githubKeys and githubAutoComplete
 */
function buildGithubMap(githubData) {
  githubKeys = Object.keys(githubData);
  githubAutoComplete = githubKeys.map(
    function(value, i) {
      // When the autocompete has a match for gitub instert the emoji syntax (:name:) into the text area
      return {key: value, name: value, liImg: getImage(githubData, value), img: ':'+value+':'}});
}
