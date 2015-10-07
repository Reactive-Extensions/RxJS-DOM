// Copyright (c) Microsoft, Inc. All rights reserved. See License.txt in the project root for license information.

;(function (factory) {
  var objectTypes = {
    'function': true,
    'object': true
  };

  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;
  var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;
  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global === 'object' && global);
  var freeSelf = checkGlobal(objectTypes[typeof self] && self);
  var freeWindow = checkGlobal(objectTypes[typeof window] && window);
  var moduleExports = (freeModule && freeModule.exports === freeExports) ? freeExports : null;
  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
  var root = freeGlobal || ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) || freeSelf || thisGlobal || Function('return this')();

  // Because of build optimizers
  if (typeof define === 'function' && define.amd) {
    define(['rx-compat'], function (Rx, exports) {
      return factory(root, exports, Rx);
    });
  } else if (typeof module === 'object' && module && module.exports === freeExports) {
    module.exports = factory(root, module.exports, require('rx-compat'));
  } else {
    root.Rx = factory(root, {}, root.Rx);
  }
}.call(this, function (root, exp, Rx, undefined) {

  var Observable = Rx.Observable,
    ObservableBase = Rx.ObservableBase,
    AnonymousObservable = Rx.AnonymousObservable,
    dom = Rx.DOM || (Rx.DOM = {}),
    hasOwnProperty = {}.hasOwnProperty,
    inherits = Rx.internals.inherits;

  var errorObj = {e: {}};

  function tryCatcherGen(tryCatchTarget) {
    return function tryCatcher() {
      try {
        return tryCatchTarget.apply(this, arguments);
      } catch (e) {
        errorObj.e = e;
        return errorObj;
      }
    };
  }

  function tryCatch(fn) {
    if (!isFunction(fn)) { throw new TypeError('fn must be a function'); }
    return tryCatcherGen(fn);
  };

  function thrower(e) {
    throw e;
  }


  // Gets the proper XMLHttpRequest for support for older IE
  function getXMLHttpRequest() {
    if (root.XMLHttpRequest) {
      return new root.XMLHttpRequest();
    } else {
      var progId;
      try {
        var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
        for(var i = 0; i < 3; i++) {
          try {
            progId = progIds[i];
            if (new root.ActiveXObject(progId)) {
              break;
            }
          } catch(e) { }
        }
        return new root.ActiveXObject(progId);
      } catch (e) {
        throw new Error('XMLHttpRequest is not supported by your browser');
      }
    }
  }

  // Get CORS support even for older IE
  function getCORSRequest() {
    var xhr = new root.XMLHttpRequest();
    if ('withCredentials' in xhr) {
      return xhr;
    } else if (!!root.XDomainRequest) {
      return new XDomainRequest();
    } else {
      throw new Error('CORS is not supported by your browser');
    }
  }

  function normalizeAjaxSuccessEvent(e, xhr, settings) {
    var response = ('response' in xhr) ? xhr.response : xhr.responseText;
    response = settings.responseType === 'json' ? JSON.parse(response) : response;
    return {
      response: response,
      status: xhr.status,
      responseType: xhr.responseType,
      xhr: xhr,
      originalEvent: e
    };
  }

  function normalizeAjaxErrorEvent(e, xhr, type) {
    return {
      type: type,
      status: xhr.status,
      xhr: xhr,
      originalEvent: e
    };
  }

  var AjaxObservable = (function(__super__) {
    inherits(AjaxObservable, __super__);
    function AjaxObservable(settings) {
      this._settings = settings;
      __super__.call(this);
    }

    AjaxObservable.prototype.subscribeCore = function (o) {
      var xhr;
      this._isDone = false;


    };

    function AjaxDisposable(xhr, parent) {
      this._xhr = xhr;
      this._parent = parent;
      this.isDisposed = false;
    }

    AjaxDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        if (!this._parent._isDone && this._xhr.readyState !== 4) { this._xhr.abort(); }
      }
    };

    return AjaxObservable;
  }(ObservableBase));

  /**
   * Creates an observable for an Ajax request with either a settings object with url, headers, etc or a string for a URL.
   *
   * @example
   *   source = Rx.DOM.ajax('/products');
   *   source = Rx.DOM.ajax( url: 'products', method: 'GET' });
   *
   * @param {Object} settings Can be one of the following:
   *
   *  A string of the URL to make the Ajax call.
   *  An object with the following properties
   *   - url: URL of the request
   *   - body: The body of the request
   *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
   *   - async: Whether the request is async
   *   - headers: Optional headers
   *   - crossDomain: true if a cross domain request, else false
   *
   * @returns {Observable} An observable sequence containing the XMLHttpRequest.
  */
  var ajaxRequest = dom.ajax = function (options) {
    var settings = {
      method: 'GET',
      crossDomain: false,
      async: true,
      headers: {},
      responseType: 'text',
      createXHR: function(){
        return this.crossDomain ? getCORSRequest() : getXMLHttpRequest()
      },
      normalizeError: normalizeAjaxErrorEvent,
      normalizeSuccess: normalizeAjaxSuccessEvent
    };

    if(typeof options === 'string') {
      settings.url = options;
    } else {
      for(var prop in options) {
        if(hasOwnProperty.call(options, prop)) {
          settings[prop] = options[prop];
        }
      }
    }

    var normalizeError = settings.normalizeError;
    var normalizeSuccess = settings.normalizeSuccess;

    if (!settings.crossDomain && !settings.headers['X-Requested-With']) {
      settings.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    settings.hasContent = settings.body !== undefined;

    return new AnonymousObservable(function (o) {
      var isDone = false;
      var xhr;

      var processResponse = function(xhr, e){
        var status = xhr.status === 1223 ? 204 : xhr.status;
        if ((status >= 200 && status <= 300) || status === 0 || status === '') {
          o.onNext(normalizeSuccess(e, xhr, settings));
          o.onCompleted();
        } else {
          o.onError(normalizeError(e, xhr, 'error'));
        }
        isDone = true;
      };

      try {
        xhr = settings.createXHR();
      } catch (err) {
        return o.onError(err);
      }

      try {
        if (settings.user) {
          xhr.open(settings.method, settings.url, settings.async, settings.user, settings.password);
        } else {
          xhr.open(settings.method, settings.url, settings.async);
        }

        var headers = settings.headers;
        for (var header in headers) {
          if (hasOwnProperty.call(headers, header)) {
            xhr.setRequestHeader(header, headers[header]);
          }
        }

        if(!!xhr.upload || (!('withCredentials' in xhr) && !!root.XDomainRequest)) {
          xhr.onload = function(e) {
            if(settings.progressObserver) {
              settings.progressObserver.onNext(e);
              settings.progressObserver.onCompleted();
            }
            processResponse(xhr, e);
          };

          if(settings.progressObserver) {
            xhr.onprogress = function(e) {
              settings.progressObserver.onNext(e);
            };
          }

          xhr.onerror = function(e) {
            settings.progressObserver && settings.progressObserver.onError(e);
            o.onError(normalizeError(e, xhr, 'error'));
            isDone = true;
          };

          xhr.onabort = function(e) {
            settings.progressObserver && settings.progressObserver.onError(e);
            o.onError(normalizeError(e, xhr, 'abort'));
            isDone = true;
          };
        } else {
          xhr.onreadystatechange = function (e) {
            xhr.readyState === 4 && processResponse(xhr, e);
          };
        }

        xhr.send(settings.hasContent && settings.body || null);
      } catch (e) {
        o.onError(e);
      }

      return function () {
        if (!isDone && xhr.readyState !== 4) { xhr.abort(); }
      };
    });
  };

  /**
   * Creates an observable sequence from an Ajax POST Request with the body.
   *
   * @param {String} url The URL to POST
   * @param {Object} body The body to POST
   * @returns {Observable} The observable sequence which contains the response from the Ajax POST.
   */
  dom.post = function (url, body) {
    return ajaxRequest({ url: url, body: body, method: 'POST' });
  };

  /**
   * Creates an observable sequence from an Ajax GET Request with the body.
   *
   * @param {String} url The URL to GET
   * @returns {Observable} The observable sequence which contains the response from the Ajax GET.
   */
  dom.get = function (url) {
    return ajaxRequest({ url: url });
  };

  /**
   * Creates an observable sequence from JSON from an Ajax request
   *
   * @param {String} url The URL to GET
   * @returns {Observable} The observable sequence which contains the parsed JSON.
   */
  dom.getJSON = function (url) {
    if (!root.JSON && typeof root.JSON.parse !== 'function') { throw new TypeError('JSON is not supported in your runtime.'); }
    return ajaxRequest({url: url, responseType: 'json'}).map(function (x) {
      return x.response;
    });
  };

  /** @private
   * Destroys the current element
   */
  var destroy = (function () {
    var trash = 'document' in root && root.document.createElement('div');
    return function (element) {
      trash.appendChild(element);
      trash.innerHTML = '';
    };
  })();

  /**
   * Creates an observable JSONP Request with the specified settings.
   * @param {Object} settings Can be one of the following:
   *
   *  A string of the URL to make the JSONP call with the JSONPCallback=? in the url.
   *  An object with the following properties
   *   - url: URL of the request
   *   - jsonp: The named callback parameter for the JSONP call
   *   - jsonpCallback: Callback to execute. For when the JSONP callback can't be changed
   *
   * @returns {Observable} A cold observable containing the results from the JSONP call.
   */
   dom.jsonpRequest = (function() {
     var id = 0;

     return function(options) {
       return new AnonymousObservable(function(observer) {

         var callbackId = 'callback_' + (id++).toString(36);

         var settings = {
           jsonp: 'JSONPCallback',
           async: true,
           jsonpCallback: 'rxjsjsonpCallbacks' + callbackId
         };

         if(typeof options === 'string') {
           settings.url = options;
         } else {
           for(var prop in options) {
             if(hasOwnProperty.call(options, prop)) {
               settings[prop] = options[prop];
             }
           }
         }

         var script = root.document.createElement('script');
         script.type = 'text/javascript';
         script.async = settings.async;
         script.src = settings.url.replace(settings.jsonp, settings.jsonpCallback);

         root[settings.jsonpCallback] = function(data) {
           root[settings.jsonpCallback].called = true;
           root[settings.jsonpCallback].data = data;
         };

         var handler = function(e) {
           if(e.type === 'load' && !root[settings.jsonpCallback].called) {
             e = { type: 'error' };
           }
           var status = e.type === 'error' ? 400 : 200;
           var data = root[settings.jsonpCallback].data;

           if(status === 200) {
             observer.onNext({
               status: status,
               responseType: 'jsonp',
               response: data,
               originalEvent: e
             });

             observer.onCompleted();
           }
           else {
             observer.onError({
               type: 'error',
               status: status,
               originalEvent: e
             });
           }
         };

         script.onload = script.onreadystatechanged = script.onerror = handler;

         var head = root.document.getElementsByTagName('head')[0] || root.document.documentElement;
         head.insertBefore(script, head.firstChild);

         return function() {
           script.onload = script.onreadystatechanged = script.onerror = null;
           destroy(script);
           script = null;
         };
       });
     }
   }());

  return Rx;
}));