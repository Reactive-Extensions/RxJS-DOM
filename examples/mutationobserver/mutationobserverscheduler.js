(function (window, undefined) {

  function clearChildren (e) {
    while (e.firstChild) { e.removeChild(e.firstChild); }                
  }

  function main() {
    var ul = document.getElementById('results');

    Rx.Observable.range(0, 10, Rx.Scheduler.mutationObserver)
      .subscribe(function (results) {
        var li = document.createElement('li');
        li.innerHTML = results;
        ul.appendChild(li);      
      });
  }

  window.onload = main;

}(window));