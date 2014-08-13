(function (window, undefined) {

  function initialize() {
    var ul = document.getElementById('results');

    Rx.Observable.range(0, 10, Rx.Scheduler.mutationObserver)
      .subscribe(function (results) {
        var li = document.createElement('li');
        li.innerHTML = results;
        ul.appendChild(li);      
      });
  }

  Rx.DOM.ready().subscribe(initialize);

}(window));