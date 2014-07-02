(function () {

  function main () {

    var codes = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
      konami = Rx.Observable.fromArray(codes),
      result = document.getElementById('result');

    Rx.Observable.fromEvent(document, 'keyup')
      .pluck('keyCode')
      .bufferWithCount(10, 10)
      .filter(function (data) { return data.toString() === codes.toString(); })
      .subscribe(function () {
          result.innerHTML = 'KONAMI!';
          setTimeout(function () {
              result.style.opacity = 0;
          }, 2000);
      });
  }

  window.onload = main;
})();