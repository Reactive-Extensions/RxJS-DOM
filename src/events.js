    /** @private
     * Creates an event listener on a single element with compat back to DOM Level 1.
     */
    function createListener (element, name, handler) {
        if (element.addEventListener) {
            element.addEventListener(name, handler, false);
            return disposableCreate(function () {
                element.removeEventListener(name, handler, false);
            });
        } else if (element.attachEvent) {
            element.attachEvent('on' + name, handler);
            return disposableCreate(function () {
                element.detachEvent('on' + name, handler);
            });         
        } else {
            element['on' + name] = handler;
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

        if ( el && el.nodeName || el === global ) {
            disposables.add(createListener(el, eventName, handler));
        } else if ( el && el.length ) {
            for (var i = 0, len = el.length; i < len; i++) {
                disposables.add(createEventListener(el[i], eventName, handler));
            }
        }

        return disposables;
    }

    Observable.fromEvent = function (element, eventName) {
        return observableCreateWithDisposable(function (observer) {
            function handler (e) { observer.onNext(e); }
            return createEventListener(element, eventName, handler);
        });
    };