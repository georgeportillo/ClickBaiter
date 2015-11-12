window.addEventListener('scroll', throttle(function() {
  checkForStupidClickBait();
}, 2000));

var regexes = [
{
  regex: "(what\\shappen\\snext)",
  severity: 0,
  sensitive: false
},
{
  regex: "you.+?believe",
  severity: 0,
  sensitive: false
},
{
  regex: "warning\\ssigns",
  severity: 0,
  sensitive: false
},
{
  regex: "which\\sone.+?friends",
  severity: 0,
  sensitive: false
},
{
  regex: "got\\s.+?quiz",
  severity: 0,
  sensitive: false
},
{
  regex: "\\d+\\s(useful|truths|ways|disappointing|beer|lifehacks|historically|signs|easy|fails|frustrating|of|all|outrageous|facts|real|unique|celebrities|childhood|people|times|hilarious|things|struggles|photos|amazing|cool|awesome|beautiful|incredible)",
  severity: 0,
  sensitive: false
},
{
  regex: 'click\\shere',
  severity: 0,
  sensitive: false
},
{
  regex: "(and\\sIt\\sIs)\\.\\.\\.",
  severity: 0,
  sensitive: false
},
{
  regex: "check\\sout(this)?",
  severity: 0,
  sensitive: false
},
{
  regex: "what\\shappens\\swhen",
  severity: 0,
  sensitive: false
},
{
  regex: "#\\d.+is",
  severity: 1,
  sensitive: false
},
{
  regex: "wrong\\s?this\\s?.+?time",
  severity: 1,
  sensitive: false
},
{
  regex: "what\\sthe\\shell.+?this",
  severity: 0,
  sensitive: false
},
{
  regex: 'what\\swould\\syou\\sdo',
  severity: 0,
  sensitive: false
},
{
  regex: "(find\\sout).+?(free|how)!?",
  severity: 0,
  sensitive: false
},
{
  regex: "utterly\\shorrifying",
  severity: 1,
  sensitive: false
},
{
  regex: "\\?.+?(the\\sanswer)",
  severity: 1,
  sensitive: false
},
{
  regex: "(experts.+?in)",
  severity: 1,
  sensitive: false
},
{
  regex: "(the\\sresult\\s)",
  severity: 1,
  sensitive: false
},
{
  regex: "\\[?(THIS|WOW|INCREDIBLE|VIDEO|WATCH|AMAZING)\\]?",
  severity: 1,
  sensitive: true
}
];

var regexLength = regexes.length;

function checkForStupidClickBait() {
  var possibleClickBaitArticles = document.querySelectorAll('.mbs._6m6, ._6m6');
  var clickBaitArticlesLength = possibleClickBaitArticles.length;
  for(var i = 0; i < clickBaitArticlesLength; i++) {
    var currentArticle = possibleClickBaitArticles[i];

    if(currentArticle.children.length <= 1) {
      var articleTextContent = currentArticle.textContent;

      for(var j = 0; j < regexLength; j++) {
        var sensitive = regexes[j].sensitive;
        var modifiers;

        if(sensitive == true) {
          modifiers = "g";
        } else {
          modifiers = "gi";
        }

        var reg = new RegExp(regexes[j].regex, modifiers);
        var severity = regexes[j].severity;
        var isTheArticleSafe = articleTextContent.match(reg);

        if(isTheArticleSafe != null) {
          addClickBaitWarning(currentArticle);
          break;
        }
      }

      if(currentArticle.children.length <= 1) {
        markArticleAsSafe(currentArticle);
      }
    }


  }
}

function addClickBaitWarning(currentArticle) {

  chrome.storage.sync.get("action", function (obj) {
    if(obj.action == "flag") {
      var warning = document.createElement('div');
      warning.className = 'articleClickbait';

      var message = document.createElement('div');

      var title = document.createElement('h1');
      title.className = 'articleTitle';
      title.textContent = "This article is clickbait";

      var subtitle = document.createElement('p');
      subtitle.className = 'articleSubtitle';
      subtitle.textContent = "The sole purpose for these types of articles is to profit off of you. They have a catchy headline to get your attention and to get you to click. It's the fast food of the Internet. If this news site cared about you, they would not do this.";

      message.appendChild(title);
      message.appendChild(subtitle);
      warning.appendChild(message);

      currentArticle.appendChild(warning);

      var articleContainer = closest(currentArticle, '.mtm');
      articleContainer.classList.add('clickBaitArticle');
    } else {
      var articleContainer = closest(currentArticle, '._4-u2');
      articleContainer.remove();
    }
  });



}

function markArticleAsSafe(currentArticle) {
  var safe = document.createElement('div');
  safe.className = 'articleSafe';
  currentArticle.appendChild(safe); 
}

function closest(el, selector) {
  var matchesFn;
  ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
    if (typeof document.body[fn] == 'function') {
      matchesFn = fn;
      return true;
    }
    return false;
  });

  while (el!==null) {
    parent = el.parentElement;
    if (parent!==null && parent[matchesFn](selector)) {
      return parent;
    }
    el = parent;
  }
  return null;
}

// Throttle function grabbed from:
// https://remysharp.com/2010/07/21/throttling-function-calls
function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
  deferTimer;
  return function () {
    var context = scope || this;
    var now = +new Date,
    args = arguments;
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

function saveData() {
  var action = $('input[name="action"]:checked').val();
  var button = document.getElementById('save');

  chrome.storage.sync.set({'action': action}, function() {
    button.textContent = "Saved!";
    button.classList.add("saved");
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById('save');
  button.addEventListener('click', saveData);
});

