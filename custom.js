(function() {
  var invocationRegex = /[^\\]'(.*?)[^\\]'/g;
  var parser = new DOMParser();
  var currentClue = null;

  window.Jeopardy = {
    addClue: function(clueEl) {
      var headerEl = clueEl.querySelector('div[onmouseover]');
      var textEl = clueEl.querySelector('.clue_text');

      if (headerEl == undefined) { return; }

      var mouseOverText = headerEl.attributes['onmouseover'].textContent;
      var mouseOutText = headerEl.attributes['onmouseout'].textContent;

      var clue = {
        clueEl: clueEl,
        answer: parseAnswer(mouseOutText),
        question: parseQuestion(mouseOverText),
        textEl: textEl,
        state: 'hidden'
      };

      ['onmouseover', 'onmouseout', 'onclick'].forEach(function(attr) {
        headerEl.removeAttribute(attr);
      });

      resetClue(clue);

      headerEl.onclick = function() { cycleClue(clue); };
    }
  }

  var cycleClue = function(clue) {
    console.log(clue.state);
    if (clue.state == 'hidden')    { showAnswer(clue);          return; }
    if (clue.state == 'answer')    { showQuestion(clue);        return; }
    if (clue.state == 'question' ) { deactivateClue(clue);      return; }

    resetClue(clue);
  };

  var showAnswer = function(clue) {
    clue.textEl.innerHTML = clue.answer;
    clue.state = 'answer';
  };

  var showQuestion = function(clue) {
    clue.textEl.innerHTML = clue.question;
    clue.state = 'question';
  };

  var deactivateClue = function(clue) {
    clue.textEl.innerHTML = 'donzo';
    clue.state = 'inactive';
  };

  var resetClue = function(clue) {
    clue.textEl.innerHTML = '';
    clue.state = 'hidden';
  };

  var parseAnswer = function(txt) {
    return txt.match(invocationRegex)[2].slice(1,-1).replace(/\\/g, '');
  };

  var parseQuestion = function(txt) {
    var parsed = txt.match(invocationRegex)[2].slice(1,-1);
    parsed = parser.parseFromString('<div>' + parsed + '</div>', 'application/xml');
    parsed = parsed.getElementsByClassName('correct_response')
    return parsed[0].textContent.replace(/\\/g, '');
  };

})();

document.addEventListener('DOMContentLoaded', function() {
  var clues = document.querySelectorAll('td.clue');

  for (var i=0; i < clues.length; i++) {
    Jeopardy.addClue(clues[i]);
  }
});
