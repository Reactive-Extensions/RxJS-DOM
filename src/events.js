    /** @private
     * Creates an event listener on a single element with compat back to DOM Level 1.
     */
    function createListener (element, name, handler) {
        // Standards compliant
        if (element.addEventListener) {
            element.addEventListener(name, handler, false);
            return disposableCreate(function () {
                element.removeEventListener(name, handler, false);
            });
        } else if (element.attachEvent) {
            // IE Specific
            var innerHandler = function (event) {
                event || (event = window.event);
                event.target = event.target || event.srcElement; 
                handler(event);  
            };
            element.attachEvent('on' + name, innerHandler);
            return disposableCreate(function () {
                element.detachEvent('on' + name, innerHandler);
            });         
        } else {
            // Level 1 DOM Events
            var innerHandler = function (event) {
                event || (event = window.event);
                event.target = event.target || event.srcElement; 
                handler(event);  
            };            
            element['on' + name] = innerHandler;
            return disposableCreate(function () {
                element['on' + name] = null;
            });
        }
    }

    /** @private
     * Creates event listeners on either a single element or NodeList
     */
    function createEventListener (el, eventName, handler) {
        var disposables = new CompositeDisposable();

        if ( el && el.nodeName || el === window ) {
            disposables.add(createListener(el, eventName, handler));
        } else if ( el && el.length ) {
            for (var i = 0, len = el.length; i < len; i++) {
                disposables.add(createEventListener(el[i], eventName, handler));
            }
        }

        return disposables;
    }

    /**
     * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
     *
     * @example
     *   source = Rx.Observable.fromEvent(element, 'mouseup');
     * 
     * @param {Object} element The DOMElement or NodeList to attach a listener.
     * @param {String} eventName The event name to attach the observable sequence.
     * @returns {Observable} An observable sequence of events from the specified element and the specified event.
     */
    Observable.fromEvent = function (element, eventName) {
        return observableCreateWithDisposable(function (observer) {
            return createEventListener(element, eventName, function handler (e) { observer.onNext(e); });
        });
    };