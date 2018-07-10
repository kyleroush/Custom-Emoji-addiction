/* initialise variables */

var jsonUrl = document.querySelector('#raw-json-url');
var loadBtn = document.querySelector('#load');

loadBtn.addEventListener('click', load);


var inputBody = document.querySelector('#emoji-json');
var clearBtn = document.querySelector('.clear');
var addBtn = document.querySelector('.add');

/*  add event listeners to buttons */

addBtn.addEventListener('click', save);
clearBtn.addEventListener('click', clear);

/* display previously-saved stored notes on startup */

initialize();

function initialize() {
  chrome.storage.local.get(function (data) {
    inputBody.innerText = JSON.stringify(data["emojis"]);
  });


}

/* save the emojis */

function save() {
  var emojis = inputBody.value;
  var map = JSON.parse(emojis);
  chrome.storage.local.set({emojis: map}, function () {
    alert("saved")

  });

}
/* save the emojis */

function load() {
  $.ajax({url: jsonUrl.value, success: function(result) {
      var map = JSON.parse(result);
      chrome.storage.local.set({emojis: map}, function () {
        alert("loaded")
      });
      inputBody.innerText = JSON.stringify(map);
    }});
}


/* Clear all emojis from the display/storage */

function clear() {

  inputBody.innerText = "";
  chrome.storage.local.clear();
}
