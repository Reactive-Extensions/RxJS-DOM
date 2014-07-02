;(function (window, undefined) {

  function searchWikipedia (term) {
    var url = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='
      + term + '&callback=JSONPCallback';
    return Rx.DOM.Request.jsonpRequest(url);
  }

  function clearChildren (e) {
    while (e.firstChild) { e.removeChild(e.firstChild); }                
  }

  function initialize () {
    var input = document.getElementById('textInput'),
      ul = document.getElementById('results')
        
    var keyup = Rx.Observable.fromEvent(input, 'keyup')
      .map(function(ev) {
        return ev.target.value;
      })
      .filter(function(text) {
        return text.length > 2;
      })
      .throttle(500, Rx.Scheduler.requestAnimationFrameScheduler)
      .distinctUntilChanged();

    var searcher = keyup.flatMapLatest(searchWikipedia).map(function(d) { return d[1]; });

    searcher.subscribe(
      function (results) {                    
        clearChildren(ul);

        for (var i = 0, len = results.length; i < len; i++) {
          var li = document.createElement('li');
          li.innerHTML = results[i];
          ul.appendChild(li);
        }
      }, 
      function (error) {
        clearChildren(ul);
        var li = document.createElement('li');
        li.innerHTML = 'Error: ' + error.message;
        ul.appendChild(li);
      }
    );
  }

  window.onload = initialize;
}(window));