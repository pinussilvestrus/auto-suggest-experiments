var autoSuggest = document.querySelector("#auto-suggest");

var variables = ["variable1", "variable2", "foo", "bar"];

autoSuggest.addEventListener("input", function (event) {
  // todo(pinussilvestrus): handle if not typing expression

  var currentWord = (getCurrentlyTypedWord(event) || []);

  var results = [];

  if (currentWord) {
    variables.forEach(function (variable) {
      if (variable.indexOf(currentWord[0]) !== -1) {
        results.push(variable);
      }
    });
  }

  var list = document.querySelector('.auto-suggest-list');

  while (list.lastElementChild) {
    list.removeChild(list.lastElementChild);
  }

  results.forEach(function(variable) {
      var node = document.createElement('div');
      node.innerText = variable;
      list.appendChild(node)
  })
});

// helpers ////////////////

function getCurrentlyTypedWord(event) {
  var target = event.target,
    value = target.innerText,
    allWords = findWords(value),
    currentCursorPositon = getCaretPosition(target);

  return allWords.find(function (word) {
    var index = word.index,
      matchValue = word[0];

    return (
      index <= currentCursorPositon &&
      index + matchValue.length - 1 >= currentCursorPositon
    );
  });
}

function findWords(value) {
  return [...value.matchAll(/\w+/g)];
}

function findNewLines(value) {
  return [...value.matchAll(/\r?\n/g)];
}

function getCaretPosition(contentEditable) {
  var _range = document.getSelection().getRangeAt(0),
    range = _range.cloneRange();

  range.selectNodeContents(contentEditable);
  range.setEnd(_range.endContainer, _range.endOffset);

  // todo: this don't respect new lines (!!)
  return range.toString().length - 1;
}

// function getCaretPosition() {
//   if (window.getSelection && window.getSelection().getRangeAt) {
//     var range = window.getSelection().getRangeAt(0);
//     var selectedObj = window.getSelection();
//     var rangeCount = 0;
//     var childNodes = selectedObj.anchorNode.parentNode.childNodes;
//     for (var i = 0; i < childNodes.length; i++) {
//       if (childNodes[i] == selectedObj.anchorNode) {
//         break;
//       }
//       if (childNodes[i].outerHTML) rangeCount += childNodes[i].outerHTML.length;
//       else if (childNodes[i].nodeType == 3) {
//         rangeCount += childNodes[i].textContent.length;
//       }
//     }
//     return range.startOffset + rangeCount;
//   }
//   return -1;
// }
