  if (!!root.EventSource) {

    /**
     * This method wraps an EventSource as an observable sequence.
     * @param {String} url The url of the server-side script.
     * @param {Observer} [openObserver] An optional observer for the 'open' event for the server side event.
     * @returns {Observable} An observable sequence which represents the data from a server-side event.
     */
    dom.fromEventSource = function (url, openObserver) {
      return new AnonymousObservable(function (observer) {
        var source = new root.EventSource(url);

        function onOpen(e) {
          openObserver.onNext(e);
          openObserver.onCompleted();
          source.removeEventListener('open', onOpen, false);
        }

        function onError(e) {
          if (e.readyState === EventSource.CLOSED) {
            observer.onCompleted();
          } else {
            observer.onError(e);
          }
        }

        function onMessage(e) {
          observer.onNext(e);
        }

        openObserver && source.addEventListener('open', onOpen, false);
        source.addEventListener('error', onError, false);
        source.addEventListener('message', onMessage, false);

        return function () {
          source.removeEventListener('error', onError, false);
          source.removeEventListener('message', onMessage, false);
          source.close();
        };
      });
    };
  }
