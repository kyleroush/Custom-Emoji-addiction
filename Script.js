function oninput() {



  var emoji_config = {
    at: ":",
    data: autocompleteemojis,
    displayTpl: "<li>${img} ${name} </li>",
    insertTpl: '${img}',
    delay: 400
  }
  $(this).atwho(emoji_config);

	var regex = /:([^:]+):/;
  var text = this.value
  this.value.split(' ').forEach(function (word) {
  	var matcher = word.match(regex);
  	if(matcher != null) {
      var image = getImage(matcher[1]);
      if(image != null) {
    		text = text.replace(matcher[0], image);
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
      img.width = 20;
      // toolTip(img, ':' + id + ':')
      return img.outerHTML;
    }
    id = image.replace(alias, "")
    image = map[id];
  }

  return null;
}


function toolTip(element, tip) {

  element.classList.add("tooltipped");
  element.classList.add("tooltipped-nw");
  element.setAttribute("aria-label", tip);
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
		})
	});
	$('body').on('hidden.atwho', function() {
		var emojiSug = document.querySelectorAll('.emoji-suggestions');
		emojiSug.forEach(function (sug) {
			sug.parentElement.style.display = null;
		})
	})
}
