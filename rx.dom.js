// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

(function (root, factory) {
    var freeExports = typeof exports == 'object' && exports,
        freeModule = typeof module == 'object' && module && module.exports == freeExports && module,
        freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal) {
        window = freeGlobal;
    }

    // Because of build optimizers
    if (typeof define === 'function' && define.amd) {
        define(['rx', 'exports'], function (Rx, exports) {
            root.Rx = factory(root, exports, Rx);
            return root.Rx;
        });
    } else if (typeof module === 'object' && module && module.exports === freeExports) {
        module.exports = factory(root, module.exports, require('./rx'));
    } else {
        root.Rx = factory(root, {}, root.Rx);
    }
}(this, function (global, exp, Rx, undefined) {
    
    var freeExports = typeof exports == 'object' && exports,
        freeModule = typeof module == 'object' && module && module.exports == freeExports && module,
        freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal) {
        window = freeGlobal;
    }    

    var Rx = window.Rx,
        Observable = Rx.Observable,
        observableProto = Observable.prototype,
        observableCreateWithDisposable = Observable.createWithDisposable,
        disposableCreate = Rx.Disposable.create,
        CompositeDisposable = Rx.CompositeDisposable;

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
    
    /* @private 
     * Gets the proper XMLHttpRequest for support for older IE 
     */
    function getXMLHttpRequest() {
        if (global.XMLHttpRequest) {
            return new global.XMLHttpRequest;
        } else {
            try {
                return new global.ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {
                throw new Error('XMLHttpRequest is not supported by your browser');
            }
        }
    }

    /**
     * Creates a cold observable for an Ajax request with either a settings object with url, headers, etc or a string for a URL.
     *
     * @example 
     *   source = Rx.Observable.ajaxCold('/products');
     *   source = Rx.Observable.ajaxCold( url: 'products', method: 'GET' });
     *     
     * @param {Object} settings Can be one of the following:
     *
     *  A string of the URL to make the Ajax call.
     *  An object with the following properties
     *   - url: URL of the request
     *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
     *   - async: Whether the request is async
     *   - headers: Optional headers
     *
     * @returns {Observable} An observable sequence containing the XMLHttpRequest.
    */
    Observable.ajaxCold = function (settings) {
        return observableCreateWithDisposable( function (observer) {
            if (typeof settings === 'string') {
                settings = { method: 'GET', url: settings, async: true };
            }
            if (settings.async === undefined) {
                settings.async = true;
            }

            var xhr;
            try {
                xhr = getXMLHttpRequest();
            } catch (err) {
                observer.onError(err);
            }

            try {
                if (settings.user) {
                    xhr.open(settings.method, settings.url, settings.async, settings.user, settings.password);
                } else {
                    xhr.open(settings.method, settings.url, settings.async);
                }

                if (settings.headers) {
                    var headers = settings.headers;
                    for (var header in headers) {
                        if (headers.hasOwnProperty(header)) {
                            xhr.setRequestHeader(header, headers[header]);
                        }
                    }
                }

                xhr.onreadystatechange = xhr.onload = function () {
                    if (xhr.readyState === 4) {
                        var status = xhr.status;
                        if ((status >= 200 && status <= 300) || status === 0 || status === '') {
                            observer.onNext(xhr);
                            observer.onCompleted();
                        } else {
                            observer.onError(xhr);
                        }
                    }
                };

                xhr.onerror = function () {
                    observer.onError(xhr);
                };

                xhr.send(settings.body || null);
            } catch (e) {
                observer.onError(e);
            }
        
            return disposableCreate( function () {
                if (xhr.readyState !== 4) {
                    xhr.abort();
                }
            });
        });
    };

    /** @private */
    var ajaxCold = Observable.ajaxCold;

    /**
     * Creates a hot observable for an Ajax request with either a settings object with url, headers, etc or a string for a URL.
     *
     * @example 
     *   source = Rx.Observable.ajax('/products');
     *   source = Rx.Observable.ajax( url: 'products', method: 'GET' });
     *
     * @param {Object} settings Can be one of the following:
     *
     *  A string of the URL to make the Ajax call.
     *  An object with the following properties
     *   - url: URL of the request
     *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
     *   - async: Whether the request is async
     *   - headers: Optional headers
     *
     * @returns {Observable} An observable sequence containing the XMLHttpRequest.
    */
    var observableAjax = Observable.ajax = function (settings) {
        return ajaxCold(settings).publishLast().refCount();
    };

    /**
     * Creates an observable sequence from an Ajax POST Request with the body.
     *
     * @param {String} url The URL to POST
     * @param {Object} body The body to POST
     * @returns {Observable} The observable sequence which contains the response from the Ajax POST.
     */
    Observable.post = function (url, body) {
        return observableAjax({ url: url, body: body, method: 'POST', async: true });
    };
    
    /**
     * Creates an observable sequence from an Ajax GET Request with the body.
     *
     * @param {String} url The URL to GET
     * @returns {Observable} The observable sequence which contains the response from the Ajax GET.
     */   
    var observableGet = Observable.get = function (url) {
        return observableAjax({ url: url, method: 'GET', async: true });
    };
    
    if (JSON && JSON.parse) {
        /**
         * Creates an observable sequence from JSON from an Ajax request
         *
         * @param {String} url The URL to GET
         * @returns {Observable} The observable sequence which contains the parsed JSON.
         */       
        Observable.getJSON = function (url) {
            return observableGet(url).select(function (xhr) {
                return JSON.parse(xhr.responseText);
            });
        };      
    }    

    /** @private
     * Destroys the current element
     */
    var destroy = (function () {
        var trash = document.createElement('div');
        return function (element) {
            trash.appendChild(element);
            trash.innerHTML = '';
        };
    })();

    /**
     * Creates a cold observable JSONP Request with the specified settings.
     *
     * @example 
     *   source = Rx.Observable.getJSONPRequest('http://www.bing.com/?q=foo&JSONPRequest=?');
     *   source = Rx.Observable.getJSONPRequest( url: 'http://bing.com/?q=foo', jsonp: 'JSONPRequest' });
     *
     * @param {Object} settings Can be one of the following:
     *
     *  A string of the URL to make the JSONP call with the JSONPCallback=? in the url.
     *  An object with the following properties
     *   - url: URL of the request
     *   - jsonp: The named callback parameter for the JSONP call
     *
     * @returns {Observable} A cold observable containing the results from the JSONP call.
     */
    Observable.getJSONPRequestCold = (function () {
        var uniqueId = 0;
        return function (settings) {
            return Observable.createWithDisposable(function (observer) {

                if (typeof settings === 'string') {
                    settings = { url: settings }
                }
                if (!!settings.jsonp) {
                    settings.jsonp = 'JSONPCallback';
                }

                var head = document.getElementsByTagName('head')[0] || document.documentElement,
                    tag = document.createElement('script'),
                    handler = 'rxjscallback' + uniqueId++;

                settings.url = settings.url.replace('=' + settings.jsonp, '=' + handler);

                global[handler] = function (data) {
                    observer.onNext(data);
                    observer.onCompleted();  
                };

                tag.src = url;
                tag.async = true;
                tag.onload = tag.onreadystatechange = function (_, abort) {
                    if ( abort || !tag.readyState || /loaded|complete/.test(tag.readyState) ) {
                        tag.onload = tag.onreadystatechange = null;
                        if (head && tag.parentNode) {
                            destroy(tag);
                        }
                        tag = undefined;
                        delete global[handler];
                    }
                    
                };  
                head.insertBefore(tag, head.firstChild);

                return disposableCreate(function () {
                    if (!/loaded|complete/.test(tag.readyState)) {
                        tag.abort();
                        tag.onload = tag.onreadystatechange = null;
                        if (head && tag.parentNode) {
                            destroy(tag);
                        }
                        tag = undefined;
                        delete global[handler];
                    }
                });
            });
        };      

    })();

    /** @private */
    var getJSONPRequestCold = Observable.getJSONPRequestCold;

    /**
     * Creates a hot observable JSONP Request with the specified settings.
     *
     * @example 
     *   source = Rx.Observable.getJSONPRequest('http://www.bing.com/?q=foo&JSONPRequest=?');
     *   source = Rx.Observable.getJSONPRequest( url: 'http://bing.com/?q=foo', jsonp: 'JSONPRequest' });
     * 
     * @param {Object} settings Can be one of the following:
     *
     *  A string of the URL to make the JSONP call with the JSONPCallback=? in the url.
     *  An object with the following properties
     *   - url: URL of the request
     *   - jsonp: The named callback parameter for the JSONP call
     *
     * @returns {Observable} A hot observable containing the results from the JSONP call.
     */
    Observable.getJSONPRequest = function (settings) {
        return getJSONPRequestCold(settings).publishLast().refCount();
    };
    return Rx;
}));