  (function () {
    var events = "blur focus focusin focusout load resize scroll unload click dblclick " +
      "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
      "change select submit keydown keypress keyup error contextmenu";

    if (root.PointerEvent) {
      events += " pointerdown pointerup pointermove pointerover pointerout pointerenter pointerleave";
    }

    events = events.split(' ');

    for(var i = 0, len = events.length; i < len; i++) {
      var e = events[i];
      dom[e] = function (element, selector) {
        return fromEvent(element, e, selector);
      };
    }
  }());
