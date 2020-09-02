var autoSuggest = document.querySelector("#auto-suggest");

var variables = ["variable1", "variable2", "foo", "bar"];

function handleItemClick(node, editorNode, currentWord) {
    var value = node.innerText,
        editorValue = editorNode.innerText,
        wordIndex = currentWord.index;

    // replace current word with new value
    var start = wordIndex,
        end = wordIndex + currentWord[0].length;

    editorNode.innerText = editorValue.substring(0, start) + value + editorValue.substring(end);

    // reset cursor position
    setCaretPosition(editorNode, wordIndex + value.length)

}

autoSuggest.addEventListener("input", function (event) {
  // todo(pinussilvestrus): handle if not typing expression
  var editorNode = event.target,
      currentCursorPositon = getCaretPosition(editorNode);

  var currentWord = (getCurrentlyTypedWord(editorNode, currentCursorPositon) || []);

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

  if(!results.length) {
    return list.classList.remove('visible');
  } else {
    list.classList.add('visible');

    results.forEach(function(variable) {
        var node = document.createElement('div');
        node.innerText = variable;
        node.className = 'auto-suggest-list-item';

        list.appendChild(node);

        node.addEventListener('click', function(e) {
            handleItemClick(e.target, editorNode, currentWord, currentCursorPositon);
        })
    })
  }
  
});

// helpers ////////////////

function getCurrentlyTypedWord(node, currentCursorPositon) {
  var value = node.innerText,
    allWords = findWords(value);

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

function setCaretPosition(contentEditable, position) {
    // Creates range object 
    var range = document.createRange(); 
              
    // Creates object for selection 
    var selection = window.getSelection(); 
      
    // Set start position of range 
    range.setStart(contentEditable.childNodes[0], position); 
      
    // Collapse range within its boundary points 
    // Returns boolean 
    range.collapse(true); 
      
    // Remove all ranges set 
    selection.removeAllRanges(); 
      
    // Add range with respect to range object. 
    selection.addRange(range); 
}
