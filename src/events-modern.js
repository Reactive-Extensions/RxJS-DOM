    /** @private
     * Creates an event listener on a single element with compat back to DOM Level 1.
     */
    function createListener (element, name, handler) {
        element.addEventListener(name, handler, false);
        return disposableCreate(function () {
            element.removeEventListener(name, handler, false);
        });
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
     *   source = Rx.DOM.fromEvent(element, 'mouseup');
     * 
     * @param {Object} element The DOMElement or NodeList to attach a listener.
     * @param {String} eventName The event name to attach the observable sequence.
     * @returns {Observable} An observable sequence of events from the specified element and the specified event.
     */
    dom.fromEvent = function (element, eventName) {
        return observableCreateWithDisposable(function (observer) {
            return createEventListener(element, eventName, observer.onNext.bind(observer));
        }).publish().refCount();
    };