(function (window, undefined) {

  // Calcualte offset either layerX/Y or offsetX/Y
  function getOffset(event) {
    return { 
      offsetX: event.offsetX === undefined ? event.layerX : event.offsetX,
      offsetY: event.offsetY === undefined ? event.layerY : event.offsetY
    };
  }

  function main() {
    var canvas = document.getElementById('canvas');

    var ctx = canvas.getContext('2d');
    ctx.beginPath();

    // Get mouse events
    var mouseMoves = Rx.Observable.fromEvent(canvas, 'mousemove'),
        mouseDowns = Rx.Observable.fromEvent(canvas, 'mousedown'),
        mouseUps = Rx.Observable.fromEvent(canvas, 'mouseup');

    // Calculate difference between two mouse moves
    var mouseDiffs = mouseMoves.zip(mouseMoves.skip(1), function (x, y) {
      return { first: getOffset(x), second: getOffset(y) };
    });
    
    // Get merge together both mouse up and mouse down
    var mouseButton = mouseDowns.map(function () { return true; })
      .merge(mouseUps.map(function () { return false; }));

    // Paint if the mouse is down
    var paint = mouseButton.map(function (down) { return down ? mouseDiffs : mouseDiffs.take(0) }).switchLatest();

    // Update the canvas
    var subscription = paint.subscribe(function (x) {
      ctx.moveTo(x.first.offsetX, x.first.offsetY);
      ctx.lineTo(x.second.offsetX, x.second.offsetY);
      ctx.stroke();
    });
  }

  window.onload = main;
}(window));