(function (global, undefined) {
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
        var mouseMoves = Rx.DOM.fromEvent(canvas, 'mousemove').publish().refCount(),
            mouseDowns = Rx.DOM.fromEvent(canvas, 'mousedown').publish().refCount(),
            mouseUps = Rx.DOM.fromEvent(canvas, 'mouseup').publish().refCount();

        // Calculate difference between two mouse moves
        var mouseDiffs = mouseMoves.bufferWithCount(2, 1).map(function (x) {
            return { first: getOffset(x[0]), second: getOffset(x[1]) };
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

    global.onload = main;
}(window));