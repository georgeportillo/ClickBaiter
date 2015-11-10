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
  regex: "\\d+\\s(useful|frustrating|of|all|outrageous|facts|real|unique|celebrities|childhood|people|times|hilarious|things|photos|amazing|cool|beautiful|incredible)",
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
  regex: "\\[?(THIS|WOW|INCREDIBLE|AMAZING)\\]?",
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
  var warning = document.createElement('div');
  warning.innerHTML = 'This article is a f*** clickbait.';
  warning.className = 'articleClickbait';
  currentArticle.appendChild(warning);
}

function markArticleAsSafe(currentArticle) {
  var safe = document.createElement('div');
  safe.innerHTML = 'Safe';
  safe.className = 'articleSafe';
  currentArticle.appendChild(safe); 
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
