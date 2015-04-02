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

    var socket;

    var socketClose = function(code, reason) {
      if(socket) {
        if(closingObserver) {
          closingObserver.onNext();
          closingObserver.onCompleted();
        }
        if(!code) {
          socket.close();
        } else {
          socket.close(code, reason);
        }
      }
    };

    var observable = new AnonymousObservable(function (obs) {
      socket = protocol ? new WebSocket(url, protocol) : new WebSocket(url);

      var openHandler = function(e) {
        openObserver.onNext(e);
        openObserver.onCompleted();
        socket.removeEventListener('open', openHandler, false);
      };
      var messageHandler = function(e) { obs.onNext(e); };
      var errHandler = function(e) { obs.onError(e); };
      var closeHandler = function(e) {
        if(e.code !== 1000 || !e.wasClean) {
          return obs.onError(e);
        }
        obs.onCompleted();
      };

      openObserver && socket.addEventListener('open', openHandler, false);
      socket.addEventListener('message', messageHandler, false);
      socket.addEventListener('error', errHandler, false);
      socket.addEventListener('close', closeHandler, false);

      return function () {
        socketClose();

        socket.removeEventListener('message', messageHandler, false);
        socket.removeEventListener('error', errHandler, false);
        socket.removeEventListener('close', closeHandler, false);
      };
    });

    var observer = observerCreate(function (data) {
      socket.readyState === WebSocket.OPEN && socket.send(data);
    },
    function(e) {
      if (!e.code) {
        throw new Error('no code specified. be sure to pass { code: ###, reason: "" } to onError()');
      }

      socketClose(e.code, e.reason || '');
    },
    function() {
      socketClose(1000, '');
    });

    return Subject.create(observer, observable);
  };
