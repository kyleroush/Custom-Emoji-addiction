/**
 * When a textArea Element has input this function is called it
 *  First: adds the atWho object to the elelment to enable aut complete on that element.
 *          (We add the autocomplete on input into any text area instead of on page load because
 *           There are lazy/late loaded text areas that also need to have autocomplete function added)
 *  Second: goes and check if any of the text in the elemenet matches a regex to replace
 *          (This is done here incase they are copy and paste the text over it should
 *           still be swapped out for the emoji element)
 */
function oninput(atWhoData, mappedData, element) {

  var emoji_config = {
    at: ":",
    data: atWhoData,
    displayTpl: "<li>${img} ${name}</li>",
    insertTpl: '${img}',
    delay: 400
  }
  $(element).atwho(emoji_config);

  var regex = /:([^:]+):/;
  var text = element.value;
  // for each word
  text.split(' ').forEach(function (word) {
    var matcher = word.match(regex);
    // if contains the emoji regex
    if (matcher != null) {
      // look to see if the emoji is valid and replace it in the text
      var image = lookUpImage(mappedData, matcher[1]);
      if(image != null) {

        text = text.replace(matcher[0], image);
        
      }
    }

  });
  element.value = text;
}

/**
 * This create the raw html of the emoji for param id.
 * If the id is an alias to another id it will search though the map for the root image
 * if the emoji is not found returns null;
 * required id: the id or alias of the emoji
 * required map: the map of emojis
 *
 */
function getImgTag(map, id) {
  const img = lookUpImage(map, id);
  if(img === null) return null
  return `<img src="${img}" alt="${id}" title="${id}" width="25">`
}

// look up the img from the map with consideration for alias
function lookUpImage(map, id) {
  var alias = "alias:";
  var image = map[id];
  while(image != null) {
    if(!image.startsWith(alias)) {
      return image
    }
    id = image.replace(alias, "");
    image = map[id];
  }

  return null;
}

// The map of custom emojis from storage
var emojiLookUpMap = {};
var unicodeEmojiLookUpMap = {};

//The list of formated custom emojis for autocompete
var autocompleteUniodeEmojis = [];
var autocompleteemojis = [];

// When the page tha tis loaded is a github page
if(document.location.host.includes("github")) {

  //Load the emojis from stoage and initialise map and autocompleteemojis
  chrome.storage.local.get(function(data) {

    // process unicode emojis
    autocompleteUniodeEmojis = Object.keys(unicode_emojis).map(function(name) {
      emojiLookUpMap[name] = unicode_emojis[name]['char'];
      unicodeEmojiLookUpMap[name] = unicode_emojis[name]['char'];
      return {key: name, name: name, img: unicode_emojis[name]['char']};
    });

    // process the custom emojis
    var map = data["emojis"];
    autocompleteemojis = autocompleteUniodeEmojis.concat(Object.keys(map).map(function(name, i) {

        var img = getImgTag(map, name);
        emojiLookUpMap[name] = img;
        return {key: name, name: name, img: img};
    }));
  });

  // On input action on any textArea in the body of the page call input
  $('body').on('input', 'textarea', function() { oninput(autocompleteemojis, emojiLookUpMap, this) });
  $('body').on('input', 'input',    function() { oninput(autocompleteUniodeEmojis, unicodeEmojiLookUpMap, this) });

  // when atwho inserts a text
  $('body').on('inserted.atwho', function() {
    var emojiSug = document.querySelector('.emoji-suggestions');

    // Make sure the github autocomplete is unselecteds
    var selected = document.querySelector('.emoji-suggestions > [aria-selected=true]');
    if(!!selected) {
      selected.attributes['aria-selected'].value = false;
    }
  });
}
