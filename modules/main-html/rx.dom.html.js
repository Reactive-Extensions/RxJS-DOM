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
    define(['rx'], function (Rx, exports) {
      return factory(root, exports, Rx);
    });
  } else if (typeof module === 'object' && module && module.exports === freeExports) {
    module.exports = factory(root, module.exports, require('rx'));
  } else {
    root.Rx = factory(root, {}, root.Rx);
  }
}.call(this, function (root, exp, Rx, undefined) {

  var Observable = Rx.Observable,
    ObservableBase = Rx.ObservableBase,
    AbstractObserver = Rx.internals.AbstractObserver,
    observerCreate = Rx.Observer.create,
    observableCreate = Rx.Observable.create,
    disposableCreate = Rx.Disposable.create,
    Disposable = Rx.Disposable,
    CompositeDisposable = Rx.CompositeDisposable,
    BinaryDisposable = Rx.BinaryDisposable,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
    Subject = Rx.Subject,
    Scheduler = Rx.Scheduler,
    dom = Rx.DOM = {},
    hasOwnProperty = {}.hasOwnProperty,
    noop = Rx.helpers.noop,
    isFunction = Rx.helpers.isFunction,
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
  }

  function thrower(e) {
    throw e;
  }

  function socketClose(socket, closingObserver, code, reason) {
    if (socket) {
      if (closingObserver) {
        closingObserver.onNext();
        closingObserver.onCompleted();
      }
      if (!code) {
        socket.close();
      } else {
        socket.close(code, reason);
      }
    }
  }

  var SocketObservable = (function (__super__) {
    inherits(SocketObservable, __super__);
    function SocketObservable(state, url, protocol, open, close) {
      this._state = state;
      this._url = url;
      this._protocol = protocol;
      this._open = open;
      this._close = close;
      __super__.call(this);
    }

    function createOpenHandler(open, socket) {
      return function openHandler(e) {
        open.onNext(e);
        open.onCompleted();
        socket.removeEventListener('open', openHandler, false);
      };
    }
    function createMsgHandler(o) { return function msgHandler(e) { o.onNext(e); }; }
    function createErrHandler(o) { return function errHandler(e) { o.onError(e); }; }
    function createCloseHandler(o) {
      return function closeHandler(e) {
        if (e.code !== 1000 || !e.wasClean) { return o.onError(e); }
        o.onCompleted();
      };
    }

    function SocketDisposable(socket, msgFn, errFn, closeFn, close) {
      this._socket = socket;
      this._msgFn = msgFn;
      this._errFn = errFn;
      this._closeFn = closeFn;
      this._close = close;
      this.isDisposed = false;
    }

    SocketDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        socketClose(this._socket, this._close);

        this._socket.removeEventListener('message', this._msgFn, false);
        this._socket.removeEventListener('error', this._errFn, false);
        this._socket.removeEventListener('close', this._closeFn, false);
      }
    };

    SocketObservable.prototype.subscribeCore = function (o) {
      this._state.socket = this._protocol ? new WebSocket(this._url, this._protocol) : new WebSocket(this._url);

      var openHandler = createOpenHandler(this._open, this._state.socket);
      var msgHandler = createMsgHandler(o);
      var errHandler = createErrHandler(o);
      var closeHandler = createCloseHandler(o);

      this._open && this._state.socket.addEventListener('open', openHandler, false);
      this._state.socket.addEventListener('message', msgHandler, false);
      this._state.socket.addEventListener('error', errHandler, false);
      this._state.socket.addEventListener('close', closeHandler, false);

      return new SocketDisposable(this._state.socket, msgHandler, errHandler, closeHandler, this._close);
    };

    return SocketObservable;
  }(ObservableBase));

  var SocketObserver = (function (__super__) {
    inherits(SocketObserver, __super__);
    function SocketObserver(state, close) {
      this._state = state;
      this._close = close;
      __super__.call(this);
    }

    SocketObserver.prototype.next = function (x) {
      this._state.socket && this._state.socket.readyState === WebSocket.OPEN && this._state.socket.send(x);
    };

    SocketObserver.prototype.error = function (e) {
      if (!e.code) {
        throw new Error('no code specified. be sure to pass { code: ###, reason: "" } to onError()');
      }
      socketClose(this._state.socket, this._close, e.code, e.reason || '');
    };

    SocketObserver.prototype.completed = function () {
      socketClose(this._state.socket, this._close, 1000, '');
    };

    return SocketObserver;
  }(AbstractObserver));

   /**
   * Creates a WebSocket Subject with a given URL, protocol and an optional observer for the open event.
   *
   * @example
   *  var socket = Rx.DOM.fromWebSocket('http://localhost:8080', 'stock-protocol', openObserver, closingObserver);
   *
   * @param {String} url The URL of the WebSocket.
   * @param {String} protocol The protocol of the WebSocket.
   * @param {Observer} [openObserver] An optional Observer to capture the open event.
   * @param {Observer} [closingObserver] An optional Observer to capture the moment before the underlying socket is closed.
   * @returns {Subject} An observable sequence wrapping a WebSocket.
   */
  dom.fromWebSocket = function (url, protocol, openObserver, closingObserver) {
    if (!WebSocket) { throw new TypeError('WebSocket not implemented in your runtime.'); }
    var state = { socket: null };
    return Subject.create(
      new SocketObserver(state, closingObserver),
      new SocketObservable(state, url, protocol, openObserver, closingObserver)
    );
  };

  var WorkerObserver = (function (__super__) {
    inherits(WorkerObserver, __super__);
    function WorkerObserver(state) {
      this._state = state;
      __super__.call(this);
    }

    WorkerObserver.prototype.next = function (x) { this._state.worker && this._state.worker.postMessage(x); };
    WorkerObserver.prototype.error = function (e) { throw e; };
    WorkerObserver.prototype.completed = function () { };

    return WorkerObserver;
  }(AbstractObserver));

  var WorkerObservable = (function (__super__) {
    inherits(WorkerObservable, __super__);
    function WorkerObservable(state, url) {
      this._state = state;
      this._url = url;
      __super__.call(this);
    }

    function createMessageHandler(o) { return function messageHandler (e) { o.onNext(e); }; }
    function createErrHandler(o) { return function errHandler(e) { o.onError(e); }; }

    function WorkerDisposable(w, msgFn, errFn) {
      this._w = w;
      this._msgFn = msgFn;
      this._errFn = errFn;
      this.isDisposed = false;
    }

    WorkerDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        this._w.terminate();
        this._w.removeEventListener('message', this._msgFn, false);
        this._w.removeEventListener('error', this._errFn, false);
      }
    };

    WorkerObservable.prototype.subscribeCore = function (o) {
      this._state.worker = new root.Worker(this._url);

      var messageHandler = createMessageHandler(o);
      var errHandler = createErrHandler(o);

      this._state.worker.addEventListener('message', messageHandler, false);
      this._state.worker.addEventListener('error', errHandler, false);

      return new WorkerDisposable(this._state.worker, messageHandler, errHandler);
    };

    return WorkerObservable;
  }(ObservableBase));

  /**
   * Creates a Web Worker with a given URL as a Subject.
   *
   * @example
   * var worker = Rx.DOM.fromWebWorker('worker.js');
   *
   * @param {String} url The URL of the Web Worker.
   * @returns {Subject} A Subject wrapping the Web Worker.
   */
  dom.fromWorker = function (url) {
    if (!root.Worker) { throw new TypeError('Worker not implemented in your runtime.'); }
    var state = { worker: null };
    return Subject.create(new WorkerObserver(state), new WorkerObservable(state, url));
  };

  function getMutationObserver(next) {
    var M = root.MutationObserver || root.WebKitMutationObserver;
    return new M(next);
  }

  var MutationObserverObservable = (function (__super__) {
    inherits(MutationObserverObservable, __super__);
    function MutationObserverObservable(target, options) {
      this._target = target;
      this._options = options;
      __super__.call(this);
    }

    function InnerDisposable(mutationObserver) {
      this._m = mutationObserver;
      this.isDisposed = false;
    }

    InnerDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        this._m.disconnect();
      }
    };

    MutationObserverObservable.prototype.subscribeCore = function (o) {
      var mutationObserver = getMutationObserver(function (e) { o.onNext(e); });
      mutationObserver.observe(this._target, this._options);
      return new InnerDisposable(mutationObserver);
    };

    return MutationObserverObservable;
  }(ObservableBase));

  /**
   * Creates an observable sequence from a Mutation Observer.
   * MutationObserver provides developers a way to react to changes in a DOM.
   * @example
   *  Rx.DOM.fromMutationObserver(document.getElementById('foo'), { attributes: true, childList: true, characterData: true });
   *
   * @param {Object} target The Node on which to obserave DOM mutations.
   * @param {Object} options A MutationObserverInit object, specifies which DOM mutations should be reported.
   * @returns {Observable} An observable sequence which contains mutations on the given DOM target.
   */
  dom.fromMutationObserver = function (target, options) {
    if (!(root.MutationObserver || root.WebKitMutationObserver)) { throw new TypeError('MutationObserver not implemented in your runtime.'); }
    return new MutationObserverObservable(target, options);
  };

  var CurrentPositionObservable = (function (__super__) {
    inherits(CurrentPositionObservable, __super__);
    function CurrentPositionObservable(opts) {
      this._opts = opts;
      __super__.call(this);
    }

    CurrentPositionObservable.prototype.subscribeCore = function (o) {
      root.navigator.geolocation.getCurrentPosition(
        function (data) {
          o.onNext(data);
          o.onCompleted();
        },
        function (e) { o.onError(e); },
        this._opts);
    };

    return CurrentPositionObservable;
  }(ObservableBase));

  var WatchPositionObservable = (function (__super__) {
    inherits(WatchPositionObservable, __super__);
    function WatchPositionObservable(opts) {
      this._opts = opts;
      __super__.call(this);
    }

    function WatchPositionDisposable(id) {
      this._id = id;
      this.isDisposed = false;
    }

    WatchPositionDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        root.navigator.geolocation.clearWatch(this._id);
      }
    };

    WatchPositionObservable.prototype.subscribeCore = function (o) {
      var watchId = root.navigator.geolocation.watchPosition(
        function (x) { o.onNext(x); },
        function (e) { o.onError(e); },
        this._opts);

      return new WatchPositionDisposable(watchId);
    };

    return WatchPositionObservable;
  }(ObservableBase));

  Rx.DOM.geolocation = {
    /**
    * Obtains the geographic position, in terms of latitude and longitude coordinates, of the device.
    * @param {Object} [geolocationOptions] An object literal to specify one or more of the following attributes and desired values:
    *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
    *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
    *              If timeout is Infinity, (the default value) the location request will not time out.
    *              If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
    *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
    *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
    *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
    *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
    * @returns {Observable} An observable sequence with the geographical location of the device running the client.
    */
    getCurrentPosition: function (geolocationOptions) {
      if (!root.navigator && !root.navigation.geolocation) { throw new TypeError('geolocation not available'); }
      return new CurrentPositionObservable(geolocationOptions);
    },

    /**
    * Begins listening for updates to the current geographical location of the device running the client.
    * @param {Object} [geolocationOptions] An object literal to specify one or more of the following attributes and desired values:
    *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
    *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
    *              If timeout is Infinity, (the default value) the location request will not time out.
    *              If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
    *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
    *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
    *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
    *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
    * @returns {Observable} An observable sequence with the current geographical location of the device running the client.
    */
    watchPosition: function (geolocationOptions) {
      if (!root.navigator && !root.navigation.geolocation) { throw new TypeError('geolocation not available'); }
      return new WatchPositionObservable(geolocationOptions).publish().refCount();
    }
  };

  var FromReaderObservable = (function (__super__) {
    inherits(FromReaderObservable, __super__);
    function FromReaderObservable(readerFn, file, progressObserver, encoding) {
      this._readerFn  = readerFn;
      this._file = file;
      this._progressObserver = progressObserver;
      this._encoding = encoding;
      __super__.call(this);
    }

    function createLoadHandler(o, p) {
      return function loadHandler(e) {
        p && p.onCompleted();
        o.onNext(e.target.result);
        o.onCompleted();
      };
    }

    function createErrorHandler(o) { return function errorHandler (e) { o.onError(e.target.error); }; }
    function createProgressHandler(o) { return function progressHandler (e) { o.onNext(e); }; }

    function FromReaderDisposable(reader, progressObserver, loadHandler, errorHandler, progressHandler) {
      this._r = reader;
      this._po = progressObserver;
      this._lFn = loadHandler;
      this._eFn = errorHandler;
      this._pFn = progressHandler;
      this.isDisposed = false;
    }

    FromReaderDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        this._r.readyState === root.FileReader.LOADING && this._r.abort();
        this._r.removeEventListener('load', this._lFn, false);
        this._r.removeEventListener('error', this._eFn, false);
        this._po && this._r.removeEventListener('progress', this._pFn, false);
      }
    };

    FromReaderObservable.prototype.subscribeCore = function (o) {
      var reader = new root.FileReader();

      var loadHandler = createLoadHandler(o, this._progressObserver);
      var errorHandler = createErrorHandler(o);
      var progressHandler = createProgressHandler(this._progressObserver);

      reader.addEventListener('load', loadHandler, false);
      reader.addEventListener('error', errorHandler, false);
      this._progressObserver && reader.addEventListener('progress', progressHandler, false);

      reader[this._readerFn](this._file, this._encoding);

      return new FromReaderDisposable(reader, this._progressObserver, loadHandler, errorHandler, progressHandler);
    };

    return FromReaderObservable;
  }(ObservableBase));

  /**
   * The FileReader object lets web applications asynchronously read the contents of
   * files (or raw data buffers) stored on the user's computer, using File or Blob objects
   * to specify the file or data to read as an observable sequence.
   * @param {String} file The file to read.
   * @param {Observer} An observer to watch for progress.
   * @returns {Object} An object which contains methods for reading the data.
   */
  dom.fromReader = function(file, progressObserver) {
    if (!root.FileReader) { throw new TypeError('FileReader not implemented in your runtime.'); }

    return {
      /**
       * This method is used to read the file as an ArrayBuffer as an Observable stream.
       * @returns {Observable} An observable stream of an ArrayBuffer
       */
      asArrayBuffer : function() {
        return new FromReaderObservable('readAsArrayBuffer', file, progressObserver);
      },
      /**
       * This method is used to read the file as a binary data string as an Observable stream.
       * @returns {Observable} An observable stream of a binary data string.
       */
      asBinaryString : function() {
        return new FromReaderObservable('readAsBinaryString', file, progressObserver);
      },
      /**
       * This method is used to read the file as a URL of the file's data as an Observable stream.
       * @returns {Observable} An observable stream of a URL representing the file's data.
       */
      asDataURL : function() {
        return new FromReaderObservable('readAsDataURL', file, progressObserver);
      },
      /**
       * This method is used to read the file as a string as an Observable stream.
       * @returns {Observable} An observable stream of the string contents of the file.
       */
      asText : function(encoding) {
        return new FromReaderObservable('readAsText', file, progressObserver, encoding);
      }
    };
  };

  return Rx;
}));