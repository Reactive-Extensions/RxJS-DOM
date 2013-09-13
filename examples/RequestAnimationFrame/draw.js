(function (global) {
    var canvas, context, toggle;

    function init() {

        var host = document.body;

        canvas = document.createElement( 'canvas' );

        // ie IE < 9
        if (typeof G_vmlCanvasManager !== 'undefined') { 
            G_vmlCanvasManager.initElement(canvas);
        }

        canvas.width = 512;
        canvas.height = 512;

        context = canvas.getContext( '2d' );

        host.appendChild( canvas );
    }

    function animate() {
        Rx.Scheduler.requestAnimationFrameScheduler.scheduleRecursive(function (self) {
            draw();
            self();
        });
    }

    function draw() {

        var time = new Date().getTime() * 0.002;
        var x = Math.sin( time ) * 192 + 256;
        var y = Math.cos( time * 0.9 ) * 192 + 256;
        toggle = !toggle;

        context.fillStyle = toggle ? 'rgb(200,200,20)' :  'rgb(20,20,200)';
        context.beginPath();
        context.arc( x, y, 10, 0, Math.PI * 2, true );
        context.closePath();
        context.fill();
    }

    function main () {
        init();
        animate();
    }

    window.onload = main;
}(window));
 