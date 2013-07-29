    if (window.WebSocket) {
         /**
         * Creates a WebSocket Subject with a given URL, protocol and an optional observer for the open event.
         * 
         * @example
         *  var socket = Rx.DOM.fromWebSocket('http://localhost:8080', 'stock-protocol', function(e) { ... });
         *  var socket = Rx.DOM.fromWebSocket('http://localhost:8080', 'stock-protocol', observer);
         *s
         * @param {String} url The URL of the WebSocket.
         * @param {String} protocol The protocol of the WebSocket.
         * @param {Function|Observer} [observerOrOnNext] An optional Observer or onNext function to capture the open event.
         * @returns {Subject} An observable sequence wrapping a WebSocket.
         */
        dom.fromWebSocket = function (url, protocol, observerOrOnNext) {
            var socket = new window.WebSocket(url, protocol);

            var observable = observableCreate(function (obs) {
                if (observerOrOnNext) {
                    socket.onopen = function (openEvent) {
                        if (typeof observerOrOnNext === 'function') {
                            observerOrOnNext(openEvent);
                        } else if (observerOrOnNext.onNext) {
                            observerOrOnNext.onNext(openEvent);
                        }
                    };
                }

                socket.onmessage = function (data) {
                    obs.onNext(data);
                };

                socket.onerror = function (err) {
                    obs.onError(err);
                };

                socket.onclose = function () {
                    obs.onCompleted();
                };

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

