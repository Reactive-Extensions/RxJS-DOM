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
