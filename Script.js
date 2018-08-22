/**
 * When a textArea Element has input this function is called it
 *  First: adds the atWho object to the elelment to enable aut complete on that element.
 *          (We add the autocomplete on input into any text area instead of on page load because
 *           There are lazy/late loaded text areas that also need to have autocomplete function added)
 *  Second: goes and check if any of the text in the elemenet matches a regex to replace
 *          (This is done here incase they are copy and paste the text over it should
 *           still be swapped out for the emoji element)
 */
function oninput() {

  var emoji_config = {
    at: ":",
    data: autocompleteemojis.concat(githubAutoComplete),
    displayTpl: "<li>${liImg} ${name} </li>",
    insertTpl: '${img}',
    delay: 400
  }
  $(this).atwho(emoji_config);

  var regex = /:([^:]+):/;
  var text = this.value;
  // for each word
  this.value.split(' ').forEach(function (word) {
    var matcher = word.match(regex);
    // if contains the emoji regex
    if (matcher != null) {
      // and the word it matches is not a github emoji
      if (!githubKeys.includes(matcher[1])) {
        // look to see if the emoji is valid and replace it in the text
        var image = getImage(map, matcher[1]);
        if(image != null) {

          text = text.replace(matcher[0], image);
        }
      }
    }

  });
  this.value = text;
}

/**
 * This create the raw html of the emoji for param id.
 * If the id is an alias to another id it will search though the map for the root image
 * if the emoji is not found returns null;
 * required id: the id or alias of the emoji
 * required map: the map of emojis
 *
 */
function getImage(map, id) {
  var alias = "alias:";
  var image = map[id];
  while(image != null) {
    if(!image.startsWith(alias)) {
      // var img = document.createElement("img");
      // img.src = image;
      // img.alt = id;
      // img.title = id;
      // img.width = 25;
      return `<img src="${image}" alt="${id}" title="${id}" width="25">`
    }
    id = image.replace(alias, "");
    image = map[id];
  }

  return null;
}

// The map of custom emojis from storage
var map = {};

//The list of formated custom emojis for autocompete
var autocompleteemojis = [];

// When the page tha tis loaded is a github page
if(document.location.host.includes("github")) {

  // Either load the github emojis from memory or load them from the api
  chrome.storage.local.get(function (githubData) {
    if (githubData.githubEmojis == undefined) {
      loadGithubEmoji();
    } else {
      buildGithubMap(githubData.githubEmojis);
    }
  });

  //Load the emojis from stoage and initialise map and autocompleteemojis
  chrome.storage.local.get(function(data) {
    map = data["emojis"];
    autocompleteemojis = Object.keys(map).map(
      function(value, i) {
        var img = getImage(map, value);
        return {key: value, name: value, liImg: img, img: img};
      });
  });

  // On input action on any textArea in the body of the page call input
  $('body').on('input', 'textarea', oninput);

  //When the auto complete is shone hide the github autocomplete
  $('body').on('shown.atwho', function() {
    var emojiSug = document.querySelectorAll('.emoji-suggestions');
    emojiSug.forEach(function (sug) {
      sug.parentElement.style.display = 'none';
    });
    var githubAutoComplete = document.querySelector('.js-navigation-item.navigation-focus');
    if (githubAutoComplete != null) {
      githubAutoComplete.className = "js-navigation-item";
      githubAutoComplete.attributes['aria-selected'].value = false;
    }
  });

  // when atwho hidden (the user hit esc or there is no valid text) enable githubs autocomplete
  $('body').on('hidden.atwho', function() {
    var emojiSug = document.querySelectorAll('.emoji-suggestions');
    emojiSug.forEach(function (sug) {
      sug.parentElement.style.display = null;
    });
  });

  // when atwho inserts a text
  $('body').on('inserted.atwho', function() {
    var emojiSug = document.querySelectorAll('.emoji-suggestions');
    emojiSug.forEach(function (sug) {
      sug.parentElement.hidden = true;
      sug.parentElement.parentElement.parentElement.querySelector('textarea').classList.remove('js-navigation-enable');
    });

    var githubAutoComplete = document.querySelector('.js-navigation-item.navigation-focus');
    if (githubAutoComplete != null) {
      githubAutoComplete.className = "js-navigation-item";
      githubAutoComplete.attributes['aria-selected'].value = false;
    }
  });
}
