(function (window, undefined) {

  function fadeOut(element) {
    var opacity = 1;
    element.style.opacity = opacity;

    var subscription = Rx.Scheduler.timeout.schedulePeriodic(100, function () {
      opacity === 0 && subscription.dispose();
      opacity -= 0.1;
      element.style.opacity = opacity;
    });
  }

  function initialize() {

    var codes = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
      konami = Rx.Observable.fromArray(codes),
      result = document.getElementById('result');

    Rx.DOM.keyup(document)
      .pluck('keyCode')
      .bufferWithCount(10, 10)
      .filter(function (data) { return data.toString() === codes.toString(); })
      .subscribe(function () {
        result.innerHTML = 'KONAMI!';
        fadeOut(result);
      });
  }

  Rx.DOM.ready().subscribe(initialize);
})(window);