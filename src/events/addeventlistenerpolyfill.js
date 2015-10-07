  root.Element && root.Element.prototype.attachEvent && !root.Element.prototype.addEventListener && (function () {
    function addMethod(name, fn) {
      Window.prototype[name] = HTMLDocument.prototype[name] = Element.prototype[name] = fn;
    }

    addMethod('addEventListener', function (type, listener) {
      var target = this;
      var listeners = target._c1_listeners = target._c1_listeners || {};
      var typeListeners = listeners[type] = listeners[type] || [];

      target.attachEvent('on' + type, typeListeners.event = function (e) {
        e || (e = root.event);

        var documentElement = target.document &&
          target.document.documentElement ||
          target.documentElement ||
          { scrollLeft: 0, scrollTop: 0 };

        e.currentTarget = target;
        e.pageX = e.clientX + documentElement.scrollLeft;
        e.pageY = e.clientY + documentElement.scrollTop;

        e.preventDefault = function () {
          e.bubbledKeyCode = e.keyCode;
          if (e.ctrlKey) {
            try {
              e.keyCode = 0;
            } catch (e) { }
          }
          e.defaultPrevented = true;
          e.returnValue = false;
          e.modified = true;
          e.returnValue = false;
        };

        e.stopImmediatePropagation = function () {
          immediatePropagation = false;
          e.cancelBubble = true;
        };

        e.stopPropagation = function () {
          e.cancelBubble = true;
        };

        e.relatedTarget = e.fromElement || null;
        e.target = e.srcElement || target;
        e.timeStamp = +new Date();

        // Normalize key events
        switch(e.type) {
          case 'keypress':
            var c = ('charCode' in e ? e.charCode : e.keyCode);
            if (c === 10) {
              c = 0;
              e.keyCode = 13;
            } else if (c === 13 || c === 27) {
              c = 0;
            } else if (c === 3) {
              c = 99;
            }
            e.charCode = c;
            e.keyChar = e.charCode ? String.fromCharCode(e.charCode) : '';
            break;
        }

        var copiedEvent = {};
        for (var prop in e) {
          copiedEvent[prop] = e[prop];
        }

        for (var i = 0, typeListenersCache = [].concat(typeListeners), typeListenerCache, immediatePropagation = true; immediatePropagation && (typeListenerCache = typeListenersCache[i]); ++i) {
          for (var ii = 0, typeListener; typeListener = typeListeners[ii]; ++ii) {
            if (typeListener === typeListenerCache) { typeListener.call(target, copiedEvent); break; }
          }
        }
      });

      typeListeners.push(listener);
    });

    addMethod('removeEventListener', function (type, listener) {
      var target = this;
      var listeners = target._c1_listeners = target._c1_listeners || {};
      var typeListeners = listeners[type] = listeners[type] || [];

      for (var i = typeListeners.length - 1, typeListener; typeListener = typeListeners[i]; --i) {
        if (typeListener === listener) { typeListeners.splice(i, 1); break; }
      }

      !typeListeners.length &&
        typeListeners.event &&
        target.detachEvent('on' + type, typeListeners.event);
    });

    addMethod('dispatchEvent', function (e) {
      var target = this;
      var type = e.type;
      var listeners = target._c1_listeners = target._c1_listeners || {};
      var typeListeners = listeners[type] = listeners[type] || [];

      try {
        return target.fireEvent('on' + type, e);
      } catch (err) {
        return typeListeners.event && typeListeners.event(e);
      }
    });

    function ready() {
      if (ready.interval && document.body) {
        ready.interval = clearInterval(ready.interval);

        document.dispatchEvent(new CustomEvent('DOMContentLoaded'));
      }
    }

    ready.interval = setInterval(ready, 1);

    root.addEventListener('load', ready);
  }());

  (!root.CustomEvent || typeof root.CustomEvent === 'object') && (function() {
  	function CustomEvent (type, params) {
  		var event;
  		params = params || { bubbles: false, cancelable: false, detail: undefined };

  		try {
  			event = document.createEvent('CustomEvent');
  			event.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  		} catch (error) {
  			event = document.createEvent('Event');
  			event.initEvent(type, params.bubbles, params.cancelable);
  			event.detail = params.detail;
  		}

  		return event;
  	}

    root.CustomEvent && (CustomEvent.prototype = root.CustomEvent.prototype);
    root.CustomEvent = CustomEvent;
  }());
