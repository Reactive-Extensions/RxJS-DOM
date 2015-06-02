  (function () {
    var events = "blur focus focusin focusout load resize scroll unload click dblclick " +
      "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
      "change select submit keydown keypress keyup error contextmenu";

    if (root.PointerEvent) {
      events += " pointerdown pointerup pointermove pointerover pointerout pointerenter pointerleave";
    }

    if (root.TouchEvent) {
      events += " touchstart touchend touchmove touchcancel";
    }

    events = events.split(' ');

    for(var i = 0, len = events.length; i < len; i++) {
      (function (e) {
        dom[e] = function (element, selector, useCapture) {
          return fromEvent(element, e, selector, useCapture);
        };
      }(events[i]))
    }
  }());
