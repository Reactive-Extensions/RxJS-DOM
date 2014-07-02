  if (!!root.WebSocket) {
     /**
     * Creates a WebSocket Subject with a given URL, protocol and an optional observer for the open event.
     * 
     * @example
     *  var socket = Rx.DOM.fromWebSocket('http://localhost:8080', 'stock-protocol', function(e) { ... });
     *  var socket = Rx.DOM.fromWebSocket('http://localhost:8080', 'stock-protocol', observer);
     *
     * @param {String} url The URL of the WebSocket.
     * @param {String} protocol The protocol of the WebSocket.
     * @param {Observer} [openObserver] An optional Observer to capture the open event.
     * @returns {Subject} An observable sequence wrapping a WebSocket.
     */
    dom.fromWebSocket = function (url, protocol, openObserver) {
      var socket = new root.WebSocket(url, protocol);

      var observable = new AnonymousObservable(function (obs) {
          if (observerOrOnNext) {
            socket.onopen = function (openEvent) {
              openObserver.onNext(openEvent);
              openObserver.onCompleted();
            };
          }

          socket.onmessage = function (data) { obs.onNext(data); };
          socket.onerror = function (err) { obs.onError(err); };
          socket.onclose = function () { obs.onCompleted(); };

          return function () {
            socket.close();
          };
      });

      var observer = observerCreate(function (data) {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(data);
        }
      });

      return Subject.create(observer, observable);
    };       
  }

