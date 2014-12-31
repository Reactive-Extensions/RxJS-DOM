  if (!!root.Worker) {
    /**
     * Creates a Web Worker with a given URL as a Subject.
     *
     * @example
     * var worker = Rx.DOM.fromWebWorker('worker.js');
     *
     * @param {String} url The URL of the Web Worker.
     * @returns {Subject} A Subject wrapping the Web Worker.
     */
    dom.fromWebWorker = function (url) {
      var worker = new root.Worker(url);

      var observable = new AnonymousObservable(function (obs) {

        function messageHandler(data) { obs.onNext(data); }
        function errHandler(err) { obs.onError(err); }

        worker.addEventListener('message', messageHandler, false);
        worker.addEventListener('error', errHandler, false);

        return function () {
          worker.close();
          worker.removeEventListener('message', messageHandler, false);
          worker.removeEventListener('error', errHandler, false);
        };
      });

      var observer = observerCreate(function (data) {
        worker.postMessage(data);
      });

      return Subject.create(observer, observable);
    };
  }
