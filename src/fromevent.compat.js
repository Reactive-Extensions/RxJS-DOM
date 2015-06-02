  function isNodeList(el) {
    if (window.StaticNodeList) {
      // IE8 Specific
      // instanceof is slower than Object#toString, but Object#toString will not work as intended in IE8
      return (el instanceof root.StaticNodeList || el instanceof root.NodeList);
    } else {
      return (Object.prototype.toString.call(el) == '[object NodeList]')
    }
  }

  function fixEvent(event) {
    var stopPropagation = function () {
      this.cancelBubble = true;
    };

    var preventDefault = function () {
      this.bubbledKeyCode = this.keyCode;
      if (this.ctrlKey) {
        try {
          this.keyCode = 0;
        } catch (e) { }
      }
      this.defaultPrevented = true;
      this.returnValue = false;
      this.modified = true;
    };

    event || (event = root.event);
    if (!event.target) {
      event.target = event.target || event.srcElement;

      if (event.type == 'mouseover') {
        event.relatedTarget = event.fromElement;
      }
      if (event.type == 'mouseout') {
        event.relatedTarget = event.toElement;
      }
      // Adding stopPropogation and preventDefault to IE
      if (!event.stopPropagation){
        event.stopPropagation = stopPropagation;
        event.preventDefault = preventDefault;
      }
      // Normalize key events
      switch(event.type){
        case 'keypress':
          var c = ('charCode' in event ? event.charCode : event.keyCode);
          if (c == 10) {
            c = 0;
            event.keyCode = 13;
          } else if (c == 13 || c == 27) {
            c = 0;
          } else if (c == 3) {
            c = 99;
          }
          event.charCode = c;
          event.keyChar = event.charCode ? String.fromCharCode(event.charCode) : '';
          break;
      }
    }

    return event;
  }

  function createListener (element, name, handler, useCapture) {
    // Standards compliant
    if (element.addEventListener) {
      element.addEventListener(name, handler, useCapture);
      return disposableCreate(function () {
        element.removeEventListener(name, handler, useCapture);
      });
    }
    if (element.attachEvent) {
      // IE Specific
      var innerHandler = function (event) {
        handler(fixEvent(event));
      };
      element.attachEvent('on' + name, innerHandler);
      return disposableCreate(function () {
        element.detachEvent('on' + name, innerHandler);
      });
    }
    // Level 1 DOM Events
    element['on' + name] = handler;
    return disposableCreate(function () {
      element['on' + name] = null;
    });
  }

  function createEventListener (el, eventName, handler) {
    var disposables = new CompositeDisposable();

    // Asume NodeList or HTMLCollection
    if (isNodeList(el) || Object.prototype.toString.call(el) === '[object HTMLCollection]') {
      for (var i = 0, len = el.length; i < len; i++) {
        disposables.add(createEventListener(el.item(i), eventName, handler));
      }
    } else if (el) {
      disposables.add(createListener(el, eventName, handler));
    }

    return disposables;
  }


  /**
   * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
   * @param {Object} element The DOMElement or NodeList to attach a listener.
   * @param {String} eventName The event name to attach the observable sequence.
   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
   * @param {Boolean} [useCapture] If true, useCapture indicates that the user wishes to initiate capture. After initiating capture, all events of the specified type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree. Events which are bubbling upward through the tree will not trigger a listener designated to use capture
   * @returns {Observable} An observable sequence of events from the specified element and the specified event.
   */
   var fromEvent = dom.fromEvent = function (element, eventName, selector, useCapture) {
     var selectorFn = isFunction(selector) ? selector : null;
     typeof selector === 'boolean' && (useCapture = selector);
     typeof useCapture === 'undefined' && (useCapture = false);
     return new AnonymousObservable(function (observer) {
       return createEventListener(
         element,
         eventName,
         function handler () {
           var results = arguments[0];

           if (selectorFn) {
             var results = tryCatch(selectorFn).apply(null, arguments);
             if (results === errorObj) { return observer.onError(results.e); }
           }

           observer.onNext(results);
         },
         useCapture);
     }).publish().refCount();
   };
