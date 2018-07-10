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
  var text = this.value
  this.value.split(' ').forEach(function (word) {
  	var matcher = word.match(regex);
  	if(matcher != null) {
      if (!githubKeys.includes(matcher[1])) {

        var image = getImage(matcher[1]);
        if(image != null) {

          text = text.replace(matcher[0], image);
        }
      }
  	}

  });
  this.value = text
}

function getImage(id) {
  var alias = "alias:";
  var image = map[id];
  while(image != null) {
    if(!image.startsWith(alias)) {
      var img = document.createElement("img");
      img.src = image;
      img.alt = id;
      img.title = id;
      img.width = 25;
      return img.outerHTML;
    }
    id = image.replace(alias, "")
    image = map[id];
  }

  return null;
}

var map = {};

var autocompleteemojis = []
getEmojis();

if (map == null) {
  map = {};
}
if(document.location.host.includes("github")) {
  $('body').on('input', 'textarea', oninput);
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
	$('body').on('hidden.atwho', function() {
		var emojiSug = document.querySelectorAll('.emoji-suggestions');
		emojiSug.forEach(function (sug) {
			sug.parentElement.style.display = null;
		});
	});
	$('body').on('inserted.atwho', function() {
		var emojiSug = document.querySelectorAll('.emoji-suggestions');
		emojiSug.forEach(function (sug) {
			sug.parentElement.hidden = true;
		});

    var githubAutoComplete = document.querySelector('.js-navigation-item.navigation-focus');
    if (githubAutoComplete != null) {
      githubAutoComplete.className = "js-navigation-item";
      githubAutoComplete.attributes['aria-selected'].value = false;
    }
	});
}
