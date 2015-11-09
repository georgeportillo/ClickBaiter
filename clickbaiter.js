window.addEventListener('scroll', throttle(function() {
  checkForStupidClickBait();
}, 2000));

var regexes = [
{
  regex: "(what\\shappen\\snext)",
  severity: 0
},
{
  regex: "you.+?believe",
  severity: 0
},
{
  regex: "warning\\ssigns",
  severity: 0
},
{
  regex: "which\\sone.+?friends",
  severity: 0
},
{
  regex: "\\d+\\s(unique|celebrities|childhood|people|times|hilarious|things|photos|amazing|cool|beautiful|incredible)",
  severity: 0
},
{
  regex: 'click\\shere',
  severity: 0
},
{
  regex: "(and\\sIt\\sIs)\\.\\.\\.",
  severity: 0
},
{
  regex: "check\\sout(this)?",
  severity: 0
},
{
  regex: "#\\d.+is",
  severity: 1
},
{
  regex: "(find\\sout).+?(free|how)!?",
  severity: 0
},
{
  regex: "\\?.+?(the\\sanswer)",
  severity: 1
},
{
  regex: "(experts.+?in)",
  severity: 1
},
{
  regex: "(the\\sresult\\s)",
  severity: 1
}
];

var regexLength = regexes.length;

function checkForStupidClickBait() {
  var possibleClickBaitArticles = document.querySelectorAll('.mbs._6m6, ._6m6');
  var clickBaitArticlesLength = possibleClickBaitArticles.length;
  for(var i = 0; i < clickBaitArticlesLength; i++) {
    var currentArticle = possibleClickBaitArticles[i];
    if(currentArticle.childNodes.length <= 1) {
      var articleTextContent = currentArticle.textContent;
      for(var j = 0; j < regexLength; j++) {
        var reg = new RegExp(regexes[j].regex, "gi");
        var severity = regexes[j].severity;
        var isTheArticleSafe = articleTextContent.search(reg);

        if(isTheArticleSafe == 0) {
          addClickBaitWarning(currentArticle);
        } else {
          markArticleAsSafe(currentArticle)
        }
      }
    }
  }
}

function addClickBaitWarning(currentArticle) {
  var warning = document.createElement('div');
  warning.innerHTML = 'This article is a fucking clickbait.';
  warning.className = 'articleClickbait';
  currentArticle.appendChild(warning);
}

function markArticleAsSafe(currentArticle) {
  var safe = document.createElement('div');
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
